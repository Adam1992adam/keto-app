import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════

export type PlanTier = 'basic_30' | 'pro_6' | 'elite_12';
export type UnitSystem = 'imperial' | 'metric';

// ═══════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  // Stored always in metric (kg/cm) — convert on display
  weight_kg?: number;
  height_cm?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  goal?: 'lose_weight' | 'maintain' | 'gain_muscle';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  start_date?: string;
  target_weight_kg?: number;
  daily_calorie_target?: number;
  // Subscription
  subscription_tier: PlanTier;
  subscription_status: 'active' | 'expired' | 'cancelled' | 'none';
  subscription_start_date?: string;
  subscription_end_date?: string;
  payhip_sale_id?: string;
  // Units preference
  preferred_units: UnitSystem;
  // Admin
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

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
// PLAN SYSTEM
// ═══════════════════════════════════════

export const PLANS = {
  basic_30: {
    id: 'basic_30' as PlanTier,
    name: 'Basic',
    emoji: '🥉',
    tagline: '30-Day Keto Kickstart',
    durationDays: 30,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    features: [
      '30-Day structured meal plan',
      '30 keto recipes included',
      'Daily task tracking',
      'Water intake tracker',
      'XP & streak system',
      'Basic macros tracker',
      '4 free eBooks',
    ],
    freeBooks: [
      {
        id: 'book_basic_1',
        title: 'Keto Beginners Guide',
        description: 'Everything you need to start your keto journey the right way.',
        emoji: '📗',
        pages: 45,
        fileUrl: '/books/keto-beginners-guide.pdf',
      },
      {
        id: 'book_basic_2',
        title: 'Keto Grocery List',
        description: 'The ultimate shopping guide for a perfect keto kitchen.',
        emoji: '🛒',
        pages: 20,
        fileUrl: '/books/keto-grocery-list.pdf',
      },
      {
        id: 'book_basic_3',
        title: 'Beating Keto Flu',
        description: 'Survive the first 10 days with these proven strategies.',
        emoji: '💪',
        pages: 30,
        fileUrl: '/books/beating-keto-flu.pdf',
      },
      {
        id: 'book_basic_4',
        title: '30 Quick Keto Recipes',
        description: 'Fast and delicious meals ready in under 30 minutes.',
        emoji: '⚡',
        pages: 55,
        fileUrl: '/books/quick-keto-recipes.pdf',
      },
    ],
  },

  pro_6: {
    id: 'pro_6' as PlanTier,
    name: 'Pro',
    emoji: '🥈',
    tagline: '6-Month Keto Transformation',
    durationDays: 180,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    features: [
      'Everything in Basic',
      '6-month structured meal plan',
      '87+ keto recipes',
      'Advanced macros & analytics',
      'Weight progress charts',
      'Priority email support',
      '8 free eBooks',
    ],
    freeBooks: [
      {
        id: 'book_pro_1',
        title: 'Keto Meal Prep Mastery',
        description: 'Batch cook for the entire week in just 2 hours.',
        emoji: '🍱',
        pages: 60,
        fileUrl: '/books/meal-prep-mastery.pdf',
      },
      {
        id: 'book_pro_2',
        title: 'Keto on a Budget',
        description: 'Eat clean keto without breaking the bank.',
        emoji: '💰',
        pages: 35,
        fileUrl: '/books/keto-budget.pdf',
      },
      {
        id: 'book_pro_3',
        title: 'Intermittent Fasting + Keto',
        description: 'Combine IF and keto for maximum fat loss results.',
        emoji: '⏱️',
        pages: 50,
        fileUrl: '/books/if-keto.pdf',
      },
      {
        id: 'book_pro_4',
        title: 'Keto Fitness Guide',
        description: 'The best workouts to accelerate your keto fat loss.',
        emoji: '🏋️',
        pages: 70,
        fileUrl: '/books/keto-fitness.pdf',
      },
    ],
  },

  elite_12: {
    id: 'elite_12' as PlanTier,
    name: 'Elite',
    emoji: '🥇',
    tagline: '12-Month Elite Keto Lifestyle',
    durationDays: 365,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    features: [
      'Everything in Pro',
      'Full 12-month meal plan',
      'Unlimited recipe access',
      'Weekly progress reports',
      'Community & forum access',
      'Priority 24/7 support',
      '12 free eBooks',
    ],
    freeBooks: [
      {
        id: 'book_elite_1',
        title: 'Keto Long-Term Success',
        description: 'Maintain your results and make keto a lifestyle forever.',
        emoji: '🏆',
        pages: 80,
        fileUrl: '/books/keto-longterm.pdf',
      },
      {
        id: 'book_elite_2',
        title: 'Keto Social Guide',
        description: 'Stay keto at restaurants, parties, and social events.',
        emoji: '🎉',
        pages: 40,
        fileUrl: '/books/keto-social.pdf',
      },
      {
        id: 'book_elite_3',
        title: 'Advanced Ketosis Science',
        description: 'Deep dive into the science behind ketosis and fat adaptation.',
        emoji: '🔬',
        pages: 95,
        fileUrl: '/books/ketosis-science.pdf',
      },
      {
        id: 'book_elite_4',
        title: 'Keto for the Whole Family',
        description: 'Get your family on board with easy keto-friendly meals.',
        emoji: '👨‍👩‍👧‍👦',
        pages: 65,
        fileUrl: '/books/keto-family.pdf',
      },
    ],
  },
} as const;

// Feature access control
export const PLAN_FEATURES = {
  recipes_extended:  ['pro_6', 'elite_12'] as PlanTier[],
  analytics_advanced:['pro_6', 'elite_12'] as PlanTier[],
  books_pro:         ['pro_6', 'elite_12'] as PlanTier[],
  books_elite:       ['elite_12']          as PlanTier[],
  support_priority:  ['elite_12']          as PlanTier[],
  community:         ['elite_12']          as PlanTier[],
};

/**
 * Check if a plan tier has access to a specific feature
 */
export function hasFeature(
  tier: PlanTier | null | undefined,
  feature: keyof typeof PLAN_FEATURES
): boolean {
  if (!tier) return false;
  return PLAN_FEATURES[feature].includes(tier);
}

/**
 * Get all books for a tier (cumulative — higher tiers include lower tier books)
 */
export function getBooksForTier(tier: PlanTier | null | undefined) {
  const books = [...PLANS.basic_30.freeBooks];
  if (tier === 'pro_6' || tier === 'elite_12') books.push(...PLANS.pro_6.freeBooks);
  if (tier === 'elite_12') books.push(...PLANS.elite_12.freeBooks);
  return books;
}

/**
 * Get plan details (safe — defaults to basic_30)
 */
export function getPlan(tier: PlanTier | null | undefined) {
  if (!tier || !PLANS[tier]) return PLANS.basic_30;
  return PLANS[tier];
}

// ═══════════════════════════════════════
// UNIT CONVERSION
// ═══════════════════════════════════════

/** kg → lbs */
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

/** lbs → kg */
export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}

/** cm → "5'11"" */
export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

/** feet + inches → cm */
export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

/** Format weight for display */
export function formatWeight(kg: number | undefined, units: UnitSystem): string {
  if (!kg) return '—';
  if (units === 'imperial') return `${kgToLbs(kg)} lbs`;
  return `${kg} kg`;
}

/** Format height for display */
export function formatHeight(cm: number | undefined, units: UnitSystem): string {
  if (!cm) return '—';
  if (units === 'imperial') return cmToFeetInches(cm);
  return `${cm} cm`;
}

/** Get weight unit label */
export function weightLabel(units: UnitSystem): string {
  return units === 'imperial' ? 'lbs' : 'kg';
}

/** Get height unit label */
export function heightLabel(units: UnitSystem): string {
  return units === 'imperial' ? 'ft / in' : 'cm';
}

/** Convert weight input to kg for storage */
export function toStorageWeight(value: number, units: UnitSystem): number {
  return units === 'imperial' ? lbsToKg(value) : value;
}

/** Convert height input to cm for storage */
export function toStorageHeight(value: number, units: UnitSystem, inches = 0): number {
  return units === 'imperial' ? feetInchesToCm(value, inches) : value;
}

// ═══════════════════════════════════════
// SUBSCRIPTION HELPERS
// ═══════════════════════════════════════

export function isSubscriptionActive(profile: Profile): boolean {
  if (!profile) return false;
  if (profile.subscription_status !== 'active') return false;
  if (!profile.subscription_end_date) return false;
  return new Date(profile.subscription_end_date) > new Date();
}

export function getDaysRemaining(profile: Profile): number {
  if (!isSubscriptionActive(profile)) return 0;
  const end = new Date(profile.subscription_end_date!);
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
}

export function getMaxJourneyDays(tier: PlanTier | null | undefined): number {
  if (!tier || !PLANS[tier]) return 30;
  return PLANS[tier].durationDays;
}

// ═══════════════════════════════════════
// PROFILE FUNCTIONS
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

  // Default preferred_units to 'imperial' if not set
  if (data && !data.preferred_units) {
    data.preferred_units = 'imperial';
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

export async function updatePreferredUnits(userId: string, units: UnitSystem) {
  return updateProfile(userId, { preferred_units: units });
}

// ═══════════════════════════════════════
// CALCULATION HELPERS
// ═══════════════════════════════════════

export async function calculateBMI(weight: number, height: number): Promise<number> {
  return weight / Math.pow(height / 100, 2);
}

export async function calculateCalorieTarget(profile: Profile): Promise<number> {
  if (!profile.weight_kg || !profile.height_cm || !profile.age) return 1500;

  const bmr = profile.gender === 'male'
    ? 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5
    : 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;

  const multipliers: Record<string, number> = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
  };

  let calories = bmr * (multipliers[profile.activity_level || 'sedentary'] || 1.2);
  if (profile.goal === 'lose_weight') calories -= 500;
  if (profile.goal === 'gain_muscle') calories += 300;

  return Math.round(calories);
}

// ═══════════════════════════════════════
// WEIGHT & ACHIEVEMENTS
// ═══════════════════════════════════════

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
// JOURNEY FUNCTIONS
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
  const existing = await getUserJourney(userId);
  if (existing) return existing;

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
      perfect_days: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating journey:', error);
    return null;
  }

  await supabase.rpc('initialize_daily_tasks', {
    user_id_param: userId,
    day_number_param: 1,
  });

  return data;
}

// ═══════════════════════════════════════
// DAILY TASKS & WATER
// ═══════════════════════════════════════

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
  const { data } = await supabase
    .from('water_intake')
    .update({ glasses_count: glasses, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .select()
    .single();

  if (data && glasses >= data.target_glasses) {
    await supabase.rpc('award_xp', {
      user_id_param: userId,
      action_type_param: 'water_goal',
      xp_amount_param: 20,
      description_param: 'Reached water goal',
      day_number_param: dayNumber,
    });
  }

  return data;
}

export async function completeTask(userId: string, dayNumber: number, taskType: string) {
  const { data, error } = await supabase.rpc('complete_task', {
    user_id_param: userId,
    day_number_param: dayNumber,
    task_type_param: taskType,
  });

  if (error) {
    console.error('Error completing task:', error);
    return null;
  }

  return data;
}

// ═══════════════════════════════════════
// XP & STATS
// ═══════════════════════════════════════

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
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export async function updateCurrentDay(userId: string) {
  try {
    const { data, error } = await supabase.rpc('update_current_day', {
      user_id_param: userId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating current day:', error);
    return null;
  }
}