import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface AppUser {
  id?: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  password_hash?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  async login(username: string, password: string): Promise<{ success: boolean; user?: AppUser; error?: string }> {
    // Look up user in the `users` table by username
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid username or password.' };
    }

    // Simple password check — replace with bcrypt comparison if you store hashed passwords
    if (data.password_hash !== password) {
      return { success: false, error: 'Invalid username or password.' };
    }

    const user: AppUser = {
      id: data.id,
      username: data.username,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      is_active: data.is_active,
      created_at: data.created_at
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): AppUser | null {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // ── User Management ─────────────────────────────────────────────────────────

  async getUsers(): Promise<{ data: AppUser[]; error: any }> {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, username, full_name, email, role, is_active, created_at')
      .order('created_at', { ascending: false });

    return { data: data ?? [], error };
  }

  async addUser(user: Omit<AppUser, 'id' | 'created_at'>): Promise<{ data: AppUser | null; error: any }> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    return { data, error };
  }

  async updateUser(id: string, updates: Partial<AppUser>): Promise<{ data: AppUser | null; error: any }> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deleteUser(id: string): Promise<{ error: any }> {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id);

    return { error };
  }
}
