import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ═══════════════════════════════════════
// Existing Interfaces
// ═══════════════════════════════════════

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  weight_kg?: number;
  height_cm?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  goal?: 'lose_weight' | 'maintain' | 'gain_muscle';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  start_date?: string;
  target_weight_kg?: number;
  daily_calorie_target?: number;
  subscription_tier: string;
  subscription_status: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  payhip_sale_id?: string;
  created_at?: string;
  updated_at?: string;
}

// ═══════════════════════════════════════
// New Interfaces
// ═══════════════════════════════════════

export interface UserJourney {
  id: string;
  user_id: string;
  start_date: string;
  current_day: number;
  status: 'active' | 'paused' | 'completed';
  total_xp: number;
  level: number;
  streak_days: number;
  longest_streak: number;
  perfect_days: number;
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  day_number: number;
  task_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'water' | 'weight' | 'reflection';
  task_title: string;
  completed: boolean;
  completed_at?: string;
  xp_earned: number;
  created_at: string;
}

export interface DailyReflection {
  id: string;
  user_id: string;
  day_number: number;
  mood?: 'happy' | 'neutral' | 'tired' | 'energetic' | 'stressed';
  energy_level?: number;
  hunger_level?: number;
  notes?: string;
  photo_url?: string;
  created_at: string;
}

export interface WaterIntake {
  id: string;
  user_id: string;
  day_number: number;
  date: string;
  glasses_count: number;
  target_glasses: number;
  created_at: string;
  updated_at: string;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  action_type: string;
  xp_amount: number;
  description?: string;
  day_number?: number;
  created_at: string;
}

// ═══════════════════════════════════════
// Existing Functions
// ═══════════════════════════════════════

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export function isSubscriptionActive(profile: Profile): boolean {
  if (profile.subscription_status !== 'active') return false;
  if (!profile.subscription_end_date) return false;
  
  const endDate = new Date(profile.subscription_end_date);
  const now = new Date();
  
  return endDate > now;
}

export async function calculateBMI(weight: number, height: number): Promise<number> {
  return weight / Math.pow(height / 100, 2);
}

export async function calculateCalorieTarget(profile: Profile): Promise<number> {
  if (!profile.weight_kg || !profile.height_cm || !profile.age) return 1500;
  
  const bmr = profile.gender === 'male'
    ? 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5
    : 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
  
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  const multiplier = activityMultipliers[profile.activity_level || 'sedentary'];
  let calories = bmr * multiplier;
  
  if (profile.goal === 'lose_weight') calories -= 500;
  if (profile.goal === 'gain_muscle') calories += 300;
  
  return Math.round(calories);
}

export async function getWeightLogs(userId: string, limit = 30) {
  const { data } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);
  
  return data || [];
}

export async function getAchievements(userId: string) {
  const { data } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });
  
  return data || [];
}

export async function getDailyProgress(userId: string, dayNumber: number) {
  const { data } = await supabase
    .from('daily_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .single();
  
  return data;
}

// ═══════════════════════════════════════
// New Journey Functions
// ═══════════════════════════════════════

export async function getUserJourney(userId: string): Promise<UserJourney | null> {
  const { data, error } = await supabase
    .from('user_journey')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching journey:', error);
    return null;
  }

  return data;
}

export async function initializeUserJourney(userId: string): Promise<UserJourney | null> {
  // Check if journey already exists
  const existing = await getUserJourney(userId);
  if (existing) return existing;

  // Create new journey
  const { data, error } = await supabase
    .from('user_journey')
    .insert({
      user_id: userId,
      start_date: new Date().toISOString().split('T')[0],
      current_day: 1,
      status: 'active',
      total_xp: 0,
      level: 1,
      streak_days: 0,
      longest_streak: 0,
      perfect_days: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating journey:', error);
    return null;
  }

  // Initialize first day tasks
  await supabase.rpc('initialize_daily_tasks', {
    user_id_param: userId,
    day_number_param: 1
  });

  return data;
}

export async function getDailyTasks(userId: string, dayNumber: number): Promise<DailyTask[]> {
  const { data } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .order('task_type');

  return data || [];
}

export async function getWaterIntake(userId: string, dayNumber: number): Promise<WaterIntake | null> {
  const { data } = await supabase
    .from('water_intake')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .single();

  return data;
}

export async function updateWaterIntake(userId: string, dayNumber: number, glasses: number) {
  const { data, error } = await supabase
    .from('water_intake')
    .update({
      glasses_count: glasses,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .select()
    .single();

  // Award XP if target reached
  if (data && glasses >= data.target_glasses) {
    await supabase.rpc('award_xp', {
      user_id_param: userId,
      action_type_param: 'water_goal',
      xp_amount_param: 20,
      description_param: 'Reached water goal',
      day_number_param: dayNumber
    });
  }

  return data;
}

export async function completeTask(userId: string, dayNumber: number, taskType: string) {
  const { data, error } = await supabase.rpc('complete_task', {
    user_id_param: userId,
    day_number_param: dayNumber,
    task_type_param: taskType
  });

  if (error) {
    console.error('Error completing task:', error);
    return null;
  }

  return data;
}

export async function getXPTransactions(userId: string, limit = 10) {
  const { data } = await supabase
    .from('xp_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getDayCompletionRate(userId: string, dayNumber: number): Promise<number> {
  const tasks = await getDailyTasks(userId, dayNumber);
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(t => t.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
}

// 🆕 Update current_day based on time passed
export async function updateCurrentDay(userId: string) {
  try {
    const { data, error } = await supabase.rpc('update_current_day', {
      user_id_param: userId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating current day:', error);
    return null;
  }
}