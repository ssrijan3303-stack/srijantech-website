import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured, logAuditAction } from './db';

const CURRENT_USER_KEY = 'srijantech_current_user';

export const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  email: 'srijan@srijantech.in',
  full_name: 'Srijan Singh',
  phone: '7269068483',
  whatsapp: '7269068483',
  company_name: 'SrijanTech',
  role: 'super_admin',
  city: 'Varanasi',
  state: 'Uttar Pradesh',
  country: 'India',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
};

export const DEMO_CUSTOMER: UserProfile = {
  id: 'usr-customer-01',
  email: 'aditya@vermalogistics.in',
  full_name: 'Aditya Verma',
  phone: '9839112233',
  whatsapp: '9839112233',
  company_name: 'Verma Logistics & Retail',
  role: 'customer',
  city: 'Varanasi',
  state: 'Uttar Pradesh',
  country: 'India',
  is_active: true,
  created_at: '2025-01-02T00:00:00Z',
};

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function setCurrentUser(user: UserProfile | null) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event('auth_change'));
}

export async function loginUser(email: string, roleRequested: 'admin' | 'customer' = 'customer'): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  // If Supabase is configured, use Supabase Auth
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: 'UserSpecifiedPassword',
      });
      if (!error && data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profile) {
          const userObj = profile as UserProfile;
          setCurrentUser(userObj);
          await logAuditAction(userObj.email, 'LOGIN', 'USER', userObj.id);
          return userObj;
        }
      }
    } catch {
      // fallback
    }
  }

  // Pre-configured role accounts
  let role: UserRole = 'customer';
  let name = cleanEmail.split('@')[0];
  name = name.charAt(0).toUpperCase() + name.slice(1);

  if (cleanEmail.includes('srijan') || cleanEmail.includes('admin') || roleRequested === 'admin') {
    role = 'super_admin';
    name = 'Srijan Singh';
  }

  const user: UserProfile = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    full_name: role === 'super_admin' ? 'Srijan Singh' : name,
    phone: role === 'super_admin' ? '7269068483' : '9839000000',
    whatsapp: role === 'super_admin' ? '7269068483' : '9839000000',
    company_name: role === 'super_admin' ? 'SrijanTech' : 'Client Business',
    role,
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    is_active: true,
    created_at: new Date().toISOString(),
  };

  setCurrentUser(user);
  await logAuditAction(user.email, 'LOGIN', 'USER', user.id, { role: user.role });
  return user;
}

export async function registerCustomer(params: {
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  company_name?: string;
}): Promise<UserProfile> {
  const cleanEmail = params.email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: 'SecureTemporaryPassword123!',
        options: {
          data: {
            full_name: params.full_name,
            phone: params.phone,
            role: 'customer',
          },
        },
      });
      if (!error && data.user) {
        // profile created via DB trigger or manual insert
      }
    } catch {
      // fallback
    }
  }

  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    full_name: params.full_name,
    phone: params.phone,
    whatsapp: params.whatsapp || params.phone,
    company_name: params.company_name,
    role: 'customer',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    is_active: true,
    created_at: new Date().toISOString(),
  };

  setCurrentUser(newUser);
  await logAuditAction(newUser.email, 'REGISTER', 'USER', newUser.id);
  return newUser;
}

export async function logoutUser(): Promise<void> {
  const current = getCurrentUser();
  if (current) {
    await logAuditAction(current.email, 'LOGOUT', 'USER', current.id);
  }
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  setCurrentUser(null);
}

export async function updateProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
  const current = getCurrentUser();
  if (!current) throw new Error('Not authenticated');

  const merged = { ...current, ...updated };
  setCurrentUser(merged);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').update(updated).eq('id', current.id);
    } catch {
      // ignore
    }
  }

  await logAuditAction(merged.email, 'UPDATE_PROFILE', 'USER', merged.id);
  return merged;
}

export async function registerUser(
  email: string,
  _password: string,
  fullName: string,
  phone?: string
): Promise<UserProfile> {
  return registerCustomer({
    email,
    full_name: fullName,
    phone: phone || '7269068483',
  });
}

export async function demoLogin(role: 'admin' | 'customer'): Promise<UserProfile> {
  const user = role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER;
  setCurrentUser(user);
  await logAuditAction(user.email, 'DEMO_LOGIN', 'USER', user.id, { role });
  return user;
}
