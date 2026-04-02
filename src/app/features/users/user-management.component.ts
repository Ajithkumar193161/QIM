import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AppUser, SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    ToggleSwitchModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: AppUser[] = [];
  loading = false;
  dialogVisible = false;
  isEditMode = false;
  saving = false;

  selectedUser: AppUser = this.emptyUser();

  roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Analyst', value: 'analyst' },
    { label: 'Viewer', value: 'viewer' }
  ];

  constructor(
    private supabase: SupabaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private emptyUser(): AppUser {
    return {
      username: '',
      full_name: '',
      email: '',
      role: 'viewer',
      is_active: true,
      password_hash: ''
    };
  }

  async loadUsers() {
    this.loading = true;
    const { data, error } = await this.supabase.getUsers();
    this.loading = false;

    if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users.' });
    } else {
      this.users = data;
    }
  }

  openAddDialog() {
    this.isEditMode = false;
    this.selectedUser = this.emptyUser();
    this.dialogVisible = true;
  }

  openEditDialog(user: AppUser) {
    this.isEditMode = true;
    this.selectedUser = { ...user, password_hash: '' };
    this.dialogVisible = true;
  }

  async saveUser() {
    if (!this.selectedUser.username || !this.selectedUser.full_name || !this.selectedUser.email) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Username, full name and email are required.' });
      return;
    }

    if (!this.isEditMode && !this.selectedUser.password_hash) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Password is required for new users.' });
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.selectedUser.id) {
      const updates: Partial<AppUser> = {
        full_name: this.selectedUser.full_name,
        email: this.selectedUser.email,
        role: this.selectedUser.role,
        is_active: this.selectedUser.is_active
      };

      // Only update password if a new one was provided
      if (this.selectedUser.password_hash) {
        updates.password_hash = this.selectedUser.password_hash;
      }

      const { error } = await this.supabase.updateUser(this.selectedUser.id, updates);

      if (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user.' });
      } else {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully.' });
        this.dialogVisible = false;
        this.loadUsers();
      }
    } else {
      const { error } = await this.supabase.addUser({
        username: this.selectedUser.username,
        full_name: this.selectedUser.full_name,
        email: this.selectedUser.email,
        role: this.selectedUser.role,
        is_active: this.selectedUser.is_active,
        password_hash: this.selectedUser.password_hash
      });

      if (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to add user.' });
      } else {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User added successfully.' });
        this.dialogVisible = false;
        this.loadUsers();
      }
    }

    this.saving = false;
  }

  confirmDelete(user: AppUser) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user "${user.username}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      accept: async () => {
        if (!user.id) return;
        const { error } = await this.supabase.deleteUser(user.id);
        if (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user.' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted.' });
          this.loadUsers();
        }
      }
    });
  }

  getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      admin: 'danger',
      manager: 'warn',
      analyst: 'info',
      viewer: 'secondary'
    };
    return map[role] ?? 'secondary';
  }
}
