import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ltgxafioalbkjdfkkpxy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o";
const supabase = createClient(supabaseUrl, supabaseKey);
function getUserClient(token) {
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}
const PLANS = {
  basic_30: {
    id: "basic_30",
    name: "Basic",
    emoji: "🥉",
    tagline: "30-Day Keto Kickstart",
    durationDays: 30,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    features: [
      "30-Day structured meal plan",
      "30 keto recipes included",
      "Daily task tracking",
      "Water intake tracker",
      "XP & streak system",
      "Basic macros tracker",
      "4 free eBooks"
    ],
    freeBooks: [
      {
        id: "book_basic_1",
        title: "Keto Beginners Guide",
        description: "Everything you need to start your keto journey the right way.",
        emoji: "📗",
        pages: 45,
        fileUrl: "/books/keto-beginners-guide.pdf"
      },
      {
        id: "book_basic_2",
        title: "Keto Grocery List",
        description: "The ultimate shopping guide for a perfect keto kitchen.",
        emoji: "🛒",
        pages: 20,
        fileUrl: "/books/keto-grocery-list.pdf"
      },
      {
        id: "book_basic_3",
        title: "Beating Keto Flu",
        description: "Survive the first 10 days with these proven strategies.",
        emoji: "💪",
        pages: 30,
        fileUrl: "/books/beating-keto-flu.pdf"
      },
      {
        id: "book_basic_4",
        title: "30 Quick Keto Recipes",
        description: "Fast and delicious meals ready in under 30 minutes.",
        emoji: "⚡",
        pages: 55,
        fileUrl: "/books/quick-keto-recipes.pdf"
      }
    ]
  },
  pro_6: {
    id: "pro_6",
    name: "Pro",
    emoji: "🥈",
    tagline: "6-Month Keto Transformation",
    durationDays: 180,
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    features: [
      "Everything in Basic",
      "6-month structured meal plan",
      "87+ keto recipes",
      "Advanced macros & analytics",
      "Weight progress charts",
      "Priority email support",
      "8 free eBooks"
    ],
    freeBooks: [
      {
        id: "book_pro_1",
        title: "Keto Meal Prep Mastery",
        description: "Batch cook for the entire week in just 2 hours.",
        emoji: "🍱",
        pages: 60,
        fileUrl: "/books/meal-prep-mastery.pdf"
      },
      {
        id: "book_pro_2",
        title: "Keto on a Budget",
        description: "Eat clean keto without breaking the bank.",
        emoji: "💰",
        pages: 35,
        fileUrl: "/books/keto-budget.pdf"
      },
      {
        id: "book_pro_3",
        title: "Intermittent Fasting + Keto",
        description: "Combine IF and keto for maximum fat loss results.",
        emoji: "⏱️",
        pages: 50,
        fileUrl: "/books/if-keto.pdf"
      },
      {
        id: "book_pro_4",
        title: "Keto Fitness Guide",
        description: "The best workouts to accelerate your keto fat loss.",
        emoji: "🏋️",
        pages: 70,
        fileUrl: "/books/keto-fitness.pdf"
      }
    ]
  },
  elite_12: {
    id: "elite_12",
    name: "Elite",
    emoji: "🥇",
    tagline: "12-Month Elite Keto Lifestyle",
    durationDays: 365,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    features: [
      "Everything in Pro",
      "Full 12-month meal plan",
      "Unlimited recipe access",
      "Weekly progress reports",
      "Community & forum access",
      "Priority 24/7 support",
      "12 free eBooks"
    ],
    freeBooks: [
      {
        id: "book_elite_1",
        title: "Keto Long-Term Success",
        description: "Maintain your results and make keto a lifestyle forever.",
        emoji: "🏆",
        pages: 80,
        fileUrl: "/books/keto-longterm.pdf"
      },
      {
        id: "book_elite_2",
        title: "Keto Social Guide",
        description: "Stay keto at restaurants, parties, and social events.",
        emoji: "🎉",
        pages: 40,
        fileUrl: "/books/keto-social.pdf"
      },
      {
        id: "book_elite_3",
        title: "Advanced Ketosis Science",
        description: "Deep dive into the science behind ketosis and fat adaptation.",
        emoji: "🔬",
        pages: 95,
        fileUrl: "/books/ketosis-science.pdf"
      },
      {
        id: "book_elite_4",
        title: "Keto for the Whole Family",
        description: "Get your family on board with easy keto-friendly meals.",
        emoji: "👨‍👩‍👧‍👦",
        pages: 65,
        fileUrl: "/books/keto-family.pdf"
      }
    ]
  }
};
function getPlan(tier) {
  if (!tier || !PLANS[tier]) return PLANS.basic_30;
  return PLANS[tier];
}
function kgToLbs(kg) {
  return Math.round(kg * 2.20462 * 10) / 10;
}
function cmToInches(cm) {
  return Math.round(cm / 2.54 * 10) / 10;
}
function cmToFeetInches(cm) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}
function formatWeight(kg, units) {
  if (!kg) return "—";
  if (units === "imperial") return `${kgToLbs(kg)} lbs`;
  return `${kg} kg`;
}
function formatHeight(cm, units) {
  if (!cm) return "—";
  if (units === "imperial") return cmToFeetInches(cm);
  return `${cm} cm`;
}
function weightLabel(units) {
  return units === "imperial" ? "lbs" : "kg";
}
function isSubscriptionActive(profile) {
  if (!profile) return false;
  if (profile.subscription_status !== "active") return false;
  if (!profile.subscription_end_date) return false;
  return new Date(profile.subscription_end_date) > /* @__PURE__ */ new Date();
}
function getMaxJourneyDays(tier) {
  if (!tier || !PLANS[tier]) return 30;
  return PLANS[tier].durationDays;
}
function getMealCycleDays(tier) {
  if (tier === "pro_6" || tier === "elite_12") return 90;
  return 30;
}
async function getProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  if (data && !data.preferred_units) {
    data.preferred_units = "imperial";
  }
  return data;
}
async function calculateBMI(weight, height) {
  return weight / Math.pow(height / 100, 2);
}
async function calculateCalorieTarget(profile) {
  if (!profile.weight_kg || !profile.height_cm || !profile.age) return 1500;
  const bmr = profile.gender === "male" ? 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5 : 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  let calories = bmr * (multipliers[profile.activity_level || "sedentary"] || 1.2);
  if (profile.goal === "lose_weight") calories -= 500;
  if (profile.goal === "gain_muscle") calories += 300;
  return Math.round(calories);
}
async function getWeightLogs(userId, limit = 30) {
  const { data } = await supabase.from("weight_logs").select("*").eq("user_id", userId).order("logged_date", { ascending: false }).limit(limit);
  return data || [];
}
async function getAchievements(userId) {
  const { data } = await supabase.from("achievements").select("*").eq("user_id", userId).order("earned_at", { ascending: false });
  return data || [];
}
async function getUserJourney(userId) {
  const { data, error } = await supabase.from("user_journey").select("*").eq("user_id", userId).single();
  if (error) {
    console.error("Error fetching journey:", error);
    return null;
  }
  return data;
}
async function initializeUserJourney(userId) {
  const existing = await getUserJourney(userId);
  if (existing) return existing;
  const { data, error } = await supabase.from("user_journey").insert({
    user_id: userId,
    start_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    current_day: 1,
    status: "active",
    total_xp: 0,
    level: 1,
    streak_days: 0,
    longest_streak: 0,
    perfect_days: 0
  }).select().single();
  if (error) {
    console.error("Error creating journey:", error);
    return null;
  }
  await supabase.rpc("initialize_daily_tasks", {
    user_id_param: userId,
    day_number_param: 1
  });
  return data;
}
async function getDailyTasks(userId, dayNumber) {
  const { data } = await supabase.from("daily_tasks").select("*").eq("user_id", userId).eq("day_number", dayNumber).order("task_type");
  return data || [];
}
async function getWaterIntake(userId, dayNumber) {
  const { data } = await supabase.from("water_intake").select("*").eq("user_id", userId).eq("day_number", dayNumber).single();
  return data;
}
async function getXPTransactions(userId, limit = 10) {
  const { data } = await supabase.from("xp_transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(limit);
  return data || [];
}
async function updateCurrentDay(userId) {
  try {
    const { data, error } = await supabase.rpc("update_current_day", {
      user_id_param: userId
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating current day:", error);
    return null;
  }
}

export { getMealCycleDays as a, getUserClient as b, initializeUserJourney as c, getUserJourney as d, getMaxJourneyDays as e, getPlan as f, getProfile as g, formatHeight as h, isSubscriptionActive as i, formatWeight as j, getDailyTasks as k, getAchievements as l, kgToLbs as m, cmToInches as n, getWaterIntake as o, getWeightLogs as p, getXPTransactions as q, calculateBMI as r, supabase as s, calculateCalorieTarget as t, updateCurrentDay as u, weightLabel as w };
