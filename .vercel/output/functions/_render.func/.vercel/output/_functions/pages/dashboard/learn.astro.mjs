/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, g as addAttribute, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { f as $$HelpCircle, a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$, c as $$Sparkles, b as $$Utensils } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$CheckCircle } from '../../chunks/CheckCircle_QKR1qvhr.mjs';
import { $ as $$ClipboardCheck } from '../../chunks/ClipboardCheck_Cbv7JTJ_.mjs';
import { $ as $$BarChart3 } from '../../chunks/BarChart3_BX3FTjqm.mjs';
import { $ as $$Timer } from '../../chunks/Timer_ceHoeydv.mjs';
import { $ as $$Trophy } from '../../chunks/Trophy_B5AXSz5D.mjs';
import { $ as $$ShoppingCart } from '../../chunks/ShoppingCart_CxlP89GQ.mjs';
import { $ as $$Target } from '../../chunks/Target_DD7DYwGV.mjs';
import { $ as $$Lock } from '../../chunks/Lock_qAq--S7c.mjs';
import { $ as $$ChevronRight } from '../../chunks/ChevronRight_CcdluzLT.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro$3 = createAstro();
const $$Map = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Map;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "map", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path> <path d="M15 5.764v15"></path> <path d="M9 3.236v15"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Map.astro", void 0);

const $$Astro$2 = createAstro();
const $$Repeat = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Repeat;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "repeat", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="m17 2 4 4-4 4"></path> <path d="M3 11v-1a4 4 0 0 1 4-4h14"></path> <path d="m7 22-4-4 4-4"></path> <path d="M21 13v1a4 4 0 0 1-4 4H3"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Repeat.astro", void 0);

const $$Astro$1 = createAstro();
const $$Play = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Play;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "play", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Play.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Learn = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Learn;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "Elite" : planType === "pro_6" ? "Pro" : "Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const { data: weightLogCheck } = await supabase.from("weight_logs").select("id").eq("user_id", user.id).limit(1);
  const { data: checkinCheck } = await supabase.from("daily_checkins").select("id").eq("user_id", user.id).limit(1);
  const { data: taskCheck } = await supabase.from("daily_tasks").select("id").eq("user_id", user.id).eq("completed", true).limit(1);
  const { data: onboardingCheck } = await supabase.from("onboarding_data").select("fasting_protocol").eq("user_id", user.id).maybeSingle();
  const hasWeight = (weightLogCheck?.length || 0) > 0;
  const hasCheckin = (checkinCheck?.length || 0) > 0;
  const hasTask = (taskCheck?.length || 0) > 0;
  const hasOnboarding = !!onboardingCheck;
  const hasFasting = !!onboardingCheck?.fasting_protocol;
  const quickStart = [
    { id: "qs1", label: "Complete your profile setup", done: hasOnboarding, href: "/dashboard/onboarding", desc: "Set your goals, dietary preferences, and starting stats" },
    { id: "qs2", label: "Log your starting weight", done: hasWeight, href: "/dashboard/progress", desc: "Track fat-loss progress from day one in the Progress page" },
    { id: "qs3", label: "Submit your first daily check-in", done: hasCheckin, href: "/dashboard/checkin", desc: "Earn 30 XP, log how you feel, and protect your streak" },
    { id: "qs4", label: "Complete at least one daily task", done: hasTask, href: "/dashboard", desc: "Check off tasks on the home dashboard to earn XP" },
    { id: "qs5", label: "Set up your fasting protocol", done: hasFasting, href: "/dashboard/fasting", desc: "Choose 12:12, 16:8, or 18:6 intermittent fasting" },
    { id: "qs6", label: "View a recipe from your meal plan", done: false, href: "/dashboard/recipes", desc: "Browse your personalized recipe library", clientId: "qs6" },
    { id: "qs7", label: "Take the guided app tour", done: false, href: "/dashboard?tour=1", desc: "Get a step-by-step walkthrough of the whole dashboard", clientId: "qs7", isTour: true }
  ];
  const doneCount = quickStart.filter((i) => i.done).length;
  const tabs = [
    { key: "guide", label: "App Guide", color: "#10b981" },
    { key: "basics", label: "Basics", color: "#10b981" },
    { key: "science", label: "Science", color: "#3b82f6" },
    { key: "faq", label: "FAQ", color: "#f59e0b" },
    { key: "tips", label: "\u{1F4A1} Tips", color: "#8b5cf6" }
  ];
  const articles = [
    // ── BASICS ──────────────────────────────────────────────
    {
      id: "b1",
      tab: "basics",
      icon: "\u{1F525}",
      color: "#10b981",
      title: "What is Ketosis?",
      summary: "How your body switches from glucose to fat as its primary fuel source.",
      body: [
        "Ketosis is a natural metabolic state in which your body burns fat for fuel instead of carbohydrates. When you drastically reduce carb intake \u2014 typically below 20\u201350g of net carbs per day \u2014 your liver begins converting fatty acids into molecules called ketones: beta-hydroxybutyrate (BHB), acetoacetate, and acetone.",
        "These ketones become the primary energy source for your brain, muscles, and organs. Most people enter nutritional ketosis within 2\u20137 days of strict carb restriction, though this varies based on activity level, metabolism, and prior diet.",
        "Signs you may be in ketosis: reduced appetite, increased mental clarity, a slight fruity smell on your breath (from acetone), and steady energy without blood-sugar crashes. Blood ketone levels of 0.5\u20133.0 mmol/L are considered nutritional ketosis."
      ]
    },
    {
      id: "b2",
      tab: "basics",
      icon: "\u2696\uFE0F",
      color: "#10b981",
      title: "Macros on Keto",
      summary: "The ideal fat, protein, and carb ratios to stay in ketosis and feel great.",
      body: [
        "The ketogenic diet follows a specific macronutrient ratio that keeps carbohydrates low enough to maintain ketosis while providing adequate protein and plenty of healthy fats.",
        "Standard keto macro split: Fat 70\u201375% of daily calories \xB7 Protein 20\u201325% \xB7 Carbohydrates 5\u201310% (net carbs typically 20\u201350g/day).",
        "Net carbs = Total Carbs \u2212 Fiber \u2212 Sugar Alcohols. Fiber is subtracted because it passes through the gut without raising blood sugar.",
        "Protein matters: too little causes muscle loss; too much triggers gluconeogenesis, which can kick you out of ketosis. A good target is 0.7\u20131.0g per pound of lean body mass.",
        "Track your macros with a food app for the first few weeks until you develop an intuitive sense of what you are eating."
      ]
    },
    {
      id: "b3",
      tab: "basics",
      icon: "\u2705",
      color: "#10b981",
      title: "Foods to Eat",
      summary: "Your go-to keto staples \u2014 fats, proteins, and low-carb vegetables.",
      body: [
        "FATS & OILS \u2014 Avocados, avocado oil, olive oil, coconut oil, butter, ghee, MCT oil, heavy cream, full-fat cheese.",
        "PROTEINS \u2014 Beef, pork, chicken, turkey, lamb, fatty fish (salmon, mackerel, sardines), eggs, shellfish.",
        "LOW-CARB VEGETABLES \u2014 Leafy greens, broccoli, cauliflower, zucchini, asparagus, bell peppers, cucumber, celery, mushrooms.",
        "DAIRY \u2014 Full-fat Greek yogurt (in moderation), hard cheeses, cream cheese, sour cream.",
        "NUTS & SEEDS \u2014 Macadamia nuts, pecans, walnuts, almonds, flaxseeds, chia seeds. Avoid cashews and most peanuts.",
        "BEVERAGES \u2014 Water, sparkling water, black coffee, unsweetened tea, bone broth."
      ]
    },
    {
      id: "b4",
      tab: "basics",
      icon: "\u274C",
      color: "#10b981",
      title: "Foods to Avoid",
      summary: "What to cut out completely to enter and stay in ketosis.",
      body: [
        "GRAINS & STARCHES \u2014 Bread, pasta, rice, oats, cereal, crackers, tortillas, quinoa, corn.",
        "SUGARY FOODS \u2014 Candy, chocolate (unless 85%+ dark), ice cream, cakes, pastries, cookies, honey, maple syrup, agave.",
        "MOST FRUIT \u2014 Bananas, apples, oranges, grapes, mangoes, pineapple. Berries in small amounts are the exception.",
        "LEGUMES \u2014 Beans, lentils, chickpeas, peas \u2014 surprisingly high in net carbs.",
        "ROOT VEGETABLES \u2014 Potatoes, sweet potatoes, parsnips, yams, beets.",
        "SUGARY DRINKS \u2014 Soda, juice, sports drinks, sweetened coffee, most alcohol (beer, sweet cocktails, dessert wines).",
        'PROCESSED "LOW-FAT" FOODS \u2014 Often loaded with sugar to compensate for flavor. Always read the label.'
      ]
    },
    {
      id: "b5",
      tab: "basics",
      icon: "\u26A1",
      color: "#10b981",
      title: "Electrolytes",
      summary: "Why sodium, potassium, and magnesium are critical \u2014 and how to get enough.",
      body: [
        "When carb intake drops, insulin levels fall. Lower insulin signals the kidneys to excrete more sodium \u2014 and other electrolytes follow. This is why electrolyte management is essential on keto.",
        "SODIUM (2,000\u20134,000mg/day) \u2014 Your most important electrolyte. Salt your food generously. Drink bouillon or bone broth. Do not fear salt on keto.",
        "POTASSIUM (3,500\u20134,700mg/day) \u2014 Found in avocados, leafy greens, salmon, and nuts. Deficiency causes muscle cramps and heart palpitations.",
        "MAGNESIUM (300\u2013500mg/day) \u2014 Often depleted on keto. Supports sleep, muscle relaxation, and hundreds of enzymes. Magnesium glycinate is well-tolerated.",
        "Signs of imbalance: fatigue, headaches, muscle cramps, brain fog, heart palpitations. Many people mistake keto flu for carb withdrawal when it is actually electrolyte depletion."
      ]
    },
    {
      id: "b6",
      tab: "basics",
      icon: "\u{1F912}",
      color: "#10b981",
      title: "Keto Flu",
      summary: "The temporary symptoms that hit in week one \u2014 and how to power through them.",
      body: [
        "Keto flu refers to a cluster of symptoms many people experience during the first 1\u20132 weeks of starting keto. It happens as your body transitions from burning glucose to fat, and is almost entirely caused by electrolyte depletion.",
        "Common symptoms: headaches, fatigue, brain fog, irritability, nausea, muscle cramps, dizziness, sugar cravings. Usually peaks days 2\u20134 and resolves by day 7\u201310.",
        "Beat it step 1: Aggressively replenish electrolytes \u2014 salt food heavily, drink bouillon, supplement magnesium and potassium.",
        "Beat it step 2: Stay hydrated \u2014 aim for 2\u20133+ litres of water daily. Eat enough fat \u2014 do not restrict calories in week one.",
        "Beat it step 3: Avoid intense exercise for the first week. Rest \u2014 your body is adapting to a major metabolic shift. The discomfort is temporary and worth it."
      ]
    },
    // ── SCIENCE ─────────────────────────────────────────────
    {
      id: "s1",
      tab: "science",
      icon: "\u{1F9EC}",
      color: "#3b82f6",
      title: "How Fat Burning Works",
      summary: "The biochemistry of lipolysis and beta-oxidation explained simply.",
      body: [
        "When your body needs energy and glucose is scarce, it turns to stored fat through lipolysis. Triglycerides are broken down into glycerol and fatty acid chains by lipase, triggered by low insulin and high glucagon.",
        "Free fatty acids travel through the bloodstream to cells that need energy. Inside the mitochondria, they are broken down via beta-oxidation into two-carbon units called acetyl-CoA.",
        "In the liver, excess acetyl-CoA is converted into ketone bodies (BHB, acetoacetate) when more is produced than the Krebs cycle can handle. Ketones then travel to the brain and muscles as fuel.",
        "Fat contains 9 calories per gram versus 4 for carbs \u2014 making it an incredibly energy-dense fuel. When fully adapted, you have access to tens of thousands of stored calories without ever hitting an energy wall."
      ]
    },
    {
      id: "s2",
      tab: "science",
      icon: "\u{1F489}",
      color: "#3b82f6",
      title: "Insulin & Fat Storage",
      summary: "Why insulin is the master switch between fat storage and fat burning.",
      body: [
        "Insulin is a hormone produced by the pancreas in response to rising blood sugar. It acts as a key that lets glucose enter cells \u2014 but it is also the primary fat-storage signal in the body.",
        "When insulin is elevated: lipolysis is suppressed (your body cannot access stored fat), the liver prioritises glucose metabolism, and excess glucose is converted to fat.",
        "When insulin is low (as on keto): lipolysis proceeds freely, the liver produces ketones, and fat burning is unlocked.",
        "The carb-insulin cycle: Eating carbs raises blood sugar, which spikes insulin, which stops fat burning, which causes blood sugar to drop, which triggers hunger. Keto breaks this cycle by keeping insulin chronically low."
      ]
    },
    {
      id: "s3",
      tab: "science",
      icon: "\u{1F9E0}",
      color: "#3b82f6",
      title: "Ketones as Brain Fuel",
      summary: "Why your brain actually prefers ketones \u2014 and the cognitive benefits this brings.",
      body: [
        "It was long thought that the brain could only run on glucose. We now know that is not true. The brain is very efficient at using ketones \u2014 particularly beta-hydroxybutyrate (BHB) \u2014 and may actually prefer them under certain conditions.",
        "BHB produces more ATP per unit than glucose, meaning the brain can do more with less oxygen. Ketone metabolism also produces fewer reactive oxygen species compared to glucose metabolism.",
        "BHB enhances GABA \u2014 an inhibitory neurotransmitter linked to calm and focus \u2014 and may increase BDNF (Brain-Derived Neurotrophic Factor), which supports neuron growth and plasticity.",
        "Many keto veterans describe a keto clarity \u2014 a state of sharp, calm mental focus without the afternoon energy crashes. This typically emerges around week 2\u20133 once the brain has fully adapted."
      ]
    },
    {
      id: "s4",
      tab: "science",
      icon: "\u{1F504}",
      color: "#3b82f6",
      title: "Metabolic Adaptation",
      summary: "What happens to your metabolism over weeks and months on keto.",
      body: [
        "Days 1\u20133: Glycogen depletion. Liver and muscle glycogen are exhausted. You lose water weight rapidly (glycogen binds water 3:1). This is not fat loss.",
        "Days 3\u20137: Ketosis onset. The liver ramps up ketone production. Brain and organs begin switching to ketone use. This is the keto flu window.",
        "Weeks 2\u20134: Fat adaptation begins. Mitochondrial density increases. Muscles become better at directly burning fatty acids.",
        "Months 2\u20136: Full fat adaptation. Exercise performance returns to or exceeds baseline. Appetite is regulated. Energy is stable throughout the day.",
        "Long-term adaptations include increased mitochondrial biogenesis, enhanced lipolytic enzyme activity, and greater capacity to oxidise fat at high exercise intensities. The magic happens for those who push through week three."
      ]
    },
    {
      id: "s5",
      tab: "science",
      icon: "\u23F0",
      color: "#3b82f6",
      title: "Intermittent Fasting Synergy",
      summary: "Why keto and fasting are a powerful combination for fat loss and metabolic health.",
      body: [
        "Keto and intermittent fasting (IF) both lower insulin and increase ketone production \u2014 which is why they work so powerfully together.",
        "Faster ketosis entry: Fasting depletes glycogen quickly. Combining an 18-hour fast with keto means you can enter deep ketosis within hours instead of days.",
        "Appetite suppression: Ketones blunt ghrelin (the hunger hormone). Keto-adapted people find fasting dramatically easier because they simply are not hungry.",
        "Autophagy: Extended fasting (16+ hours) triggers autophagy, a cellular self-cleaning process that removes damaged proteins and organelles.",
        "Common IF protocols on keto: 16:8 (fast 16 hours, eat in 8-hour window), 18:6 (more aggressive, preferred by advanced practitioners), OMAD (one meal a day \u2014 powerful for fat loss but requires careful nutrition attention)."
      ]
    },
    // ── FAQ ──────────────────────────────────────────────────
    {
      id: "f1",
      tab: "faq",
      icon: "\u23F1\uFE0F",
      color: "#f59e0b",
      title: "How Long to Ketosis?",
      summary: "How quickly can you get into ketosis, and what affects the timeline?",
      body: [
        "Most people enter nutritional ketosis within 2\u20137 days of strict carbohydrate restriction. However, the exact timeline varies significantly between individuals.",
        "Factors that speed it up: starting with exercise (depletes glycogen faster), intermittent fasting alongside keto, keeping net carbs under 20g.",
        "Factors that slow it down: higher body weight (more glycogen storage capacity), hidden carbs in sauces or processed foods, stress and poor sleep (cortisol raises blood sugar).",
        "How to measure: Blood ketone meter (0.5\u20133.0 mmol/L = nutritional ketosis) is most accurate. Urine strips are cheap but less accurate long-term. Breath meters measure acetone non-invasively.",
        "Best approach: keep net carbs under 20g for the first two weeks and trust the process. Add daily exercise to accelerate glycogen depletion."
      ]
    },
    {
      id: "f2",
      tab: "faq",
      icon: "\u{1F353}",
      color: "#f59e0b",
      title: "Can I Eat Fruit?",
      summary: "The truth about fruit on keto \u2014 what to avoid and what is allowed.",
      body: [
        "Most fruit is off-limits on strict keto due to high fructose content. High-carb fruits to avoid: bananas (23g net carbs), grapes (26g per cup), mangoes (22g per cup), apples (21g), oranges (15g).",
        "Fruits you can eat in moderation: raspberries (5g per 100g), blackberries (5g per 100g), strawberries (6g per 100g) \u2014 all excellent antioxidant sources with low carb impact.",
        "Blueberries at 12g per 100g are moderate \u2014 small servings only.",
        "Always-fine options: avocado (2g net carbs, high in healthy fat), lemon or lime juice (trace carbs, use freely for flavor), olives (near zero net carbs).",
        "Pro tip: A small handful of berries (50\u201380g) satisfies sweet cravings without derailing ketosis. Pair with whipped cream or full-fat Greek yogurt for a satisfying keto dessert."
      ]
    },
    {
      id: "f3",
      tab: "faq",
      icon: "\u{1F6E1}\uFE0F",
      color: "#f59e0b",
      title: "Is Keto Safe Long Term?",
      summary: "What the research says about years of ketogenic eating.",
      body: [
        "For most healthy adults, well-formulated keto appears safe for years. Research supports sustained improvements in blood sugar, insulin sensitivity, reduced triglycerides, increased HDL cholesterol, and reduced blood pressure.",
        "Keto has decades of clinical use in epilepsy patients with a good safety profile, and emerging evidence supports its role in type 2 diabetes remission.",
        "LDL cholesterol rises in some people \u2014 often as large, fluffy particles associated with lower cardiovascular risk rather than small, dense particles. Individual response varies and is worth monitoring.",
        "Common concerns addressed: kidney damage \u2014 no evidence in healthy people; heart disease \u2014 emerging evidence suggests keto is beneficial for most cardiovascular markers; nutrient deficiencies \u2014 a varied whole-food keto diet is nutritionally complete with attention to electrolytes.",
        "Consult your doctor, especially with existing conditions. For healthy people there is growing evidence supporting long-term keto as a viable and beneficial lifestyle."
      ]
    },
    {
      id: "f4",
      tab: "faq",
      icon: "\u{1F6AB}",
      color: "#f59e0b",
      title: "What Breaks a Fast?",
      summary: "Which foods and drinks end your fast \u2014 and which are safe to consume.",
      body: [
        "Definitely breaks a fast: any food with calories, carbs, or protein; fruit juice, smoothies, or milk in coffee; sugar or sweeteners (debated but many raise insulin); BCAAs and most protein supplements.",
        "Generally safe during a fast: black coffee (may actually enhance fat burning), plain herbal tea, still or sparkling water, calorie-free electrolytes (pure sodium, potassium, magnesium without sweeteners).",
        'MCT oil in very small amounts has minimal insulin response but technically has calories \u2014 this is called a "dirty fast," acceptable for weight loss but not for maximum autophagy.',
        "Keto + fasting note: Black coffee with under 1 tbsp of heavy cream has negligible effect on most people's fast \u2014 acceptable for weight loss, but not for maximum autophagy benefit."
      ]
    },
    {
      id: "f5",
      tab: "faq",
      icon: "\u{1F3C3}",
      color: "#f59e0b",
      title: "Keto and Exercise",
      summary: "How to train effectively on keto and what to expect during the adaptation period.",
      body: [
        "The adaptation window (weeks 1\u20134): Expect reduced performance, especially in high-intensity exercise. Your body is still learning to mobilise fat efficiently. Be patient \u2014 do not judge keto by week-one gym performance.",
        "After adaptation (month 2+): Many keto athletes return to or exceed pre-keto performance. Endurance sports especially benefit \u2014 you have access to far more stored fat energy than glycogen can ever provide.",
        "Low intensity exercise (walking, yoga, light cycling): Works great from day one. Fat is the primary fuel for these activities anyway.",
        "Moderate intensity (strength training, recreational sports): Works well after adaptation. Performance returns to baseline.",
        "High intensity (sprinting, CrossFit, HIIT): These rely on glycogen. A targeted keto diet \u2014 a small carb serving pre-workout only \u2014 works well for athletes who need explosive power.",
        "Pro tips: Train fasted in the morning to maximise fat oxidation. Salt your pre-workout water to prevent cramps. Do not chase performance metrics in the first four weeks."
      ]
    },
    {
      id: "f6",
      tab: "faq",
      icon: "\u{1F62E}",
      color: "#f59e0b",
      title: "Keto Breath",
      summary: "Why keto causes a distinctive breath odour and what you can do about it.",
      body: [
        "Keto breath is caused by acetone \u2014 one of the three ketone bodies \u2014 which is expelled through the lungs as a metabolic by-product. It is distinct from regular bad breath (halitosis).",
        "What it smells like: Most describe it as fruity, slightly sweet, or similar to nail polish remover or overripe fruit.",
        "Does it go away? Yes, for most people. As your body becomes more efficient at using ketones, less acetone is produced and exhaled. Keto breath typically fades by weeks 4\u20138.",
        "What to do in the meantime: stay well hydrated (helps clear acetone via urine), maintain good oral hygiene, use sugar-free gum or mints, or slightly increase protein intake to reduce acetone production.",
        "Know this: keto breath is a sign that ketosis is actively working. It is your body exhaling evidence of fat metabolism in progress."
      ]
    },
    // ── TIPS ────────────────────────────────────────────────
    {
      id: "t1",
      tab: "tips",
      icon: "\u{1F961}",
      color: "#8b5cf6",
      title: "Meal Prep Tips",
      summary: "How to set yourself up for a successful week in just a few hours on Sunday.",
      body: [
        "Meal prep is the single most effective strategy for staying consistent on keto. Without it, you are one busy day away from a bad food decision.",
        "Sunday prep session (2\u20133 hours): Bake 8\u201310 chicken thighs (400F, 35 min, olive oil + salt + spices); hard boil a dozen eggs; cook a large batch of ground beef with onion and garlic.",
        "Roast two sheet pans of vegetables (broccoli, zucchini, bell peppers, asparagus) at 425F for 20 minutes. Make a large batch of cauliflower rice.",
        "Storage tips: Use glass containers so you can see what you have and microwave directly. Label with the prep date. Always stock 2\u20133 emergency keto snacks: cheese, nuts, deli meat, hard-boiled eggs.",
        "Weekly template: Mon\u2013Wed = protein A + roasted veg; Thu\u2013Fri = protein B + cauliflower rice; Saturday = wild card; Sunday = prep again."
      ]
    },
    {
      id: "t2",
      tab: "tips",
      icon: "\u{1F50D}",
      color: "#8b5cf6",
      title: "Reading Food Labels",
      summary: "How to spot hidden carbs, sugars, and keto-unfriendly ingredients on any package.",
      body: [
        '"Low carb," "sugar-free," and "keto-friendly" on the front of a package mean nothing. Always flip it and read the nutrition facts panel.',
        "Net carbs formula: Total Carbs minus Dietary Fiber minus (Sugar Alcohols x 0.5). Erythritol is fully subtracted; other sugar alcohols get a 50% discount.",
        "What to check first: serving size (many are unrealistically small), total carbohydrates, dietary fiber, sugar (target 0\u20132g), added sugars (target zero).",
        "Hidden carb culprits: maltodextrin (higher glycemic index than sugar \u2014 common in protein powders and sauces), dextrose, modified food starch, fruit juice concentrate.",
        'Sugar alcohol reality check: erythritol is safe with no blood sugar impact; xylitol has low impact; maltitol has significant glycemic impact and is common in "sugar-free" chocolates \u2014 do not count it as zero.'
      ]
    },
    {
      id: "t3",
      tab: "tips",
      icon: "\u{1F37D}\uFE0F",
      color: "#8b5cf6",
      title: "Eating Out on Keto",
      summary: "How to navigate restaurants, fast food, and social dining without derailing your progress.",
      body: [
        "The universal keto order: protein + salad or non-starchy vegetable + healthy fat. Any restaurant works with this formula.",
        "Burger joints: order protein style (lettuce wrap instead of bun) or as a bowl. Skip fries, add avocado or a side salad.",
        "Steakhouses: your easiest option. Steak or salmon with a side salad (olive oil + vinegar dressing) and buttered vegetables.",
        "Mexican: fajitas without tortillas, rice, or beans \u2014 just the meat and peppers with guacamole, cheese, and sour cream.",
        "Fast food: bunless burgers, grilled chicken, side salads, egg-based breakfast items. Avoid anything breaded or with sweet sauces.",
        'Questions to ask your server: "What is in this sauce?", "Can I substitute the starchy side for extra vegetables?", "Is the protein grilled or breaded?"'
      ]
    },
    {
      id: "t4",
      tab: "tips",
      icon: "\u{1F465}",
      color: "#8b5cf6",
      title: "Social Situations",
      summary: "How to handle parties, family dinners, and peer pressure while staying on track.",
      body: [
        "At parties: Eat before you go \u2014 arriving hungry sets you up to fail. Scan the food spread first and fill your plate with protein, cheese, vegetables, and dips.",
        "Drink sparkling water with lime and hold it \u2014 people assume it is a cocktail. You do not owe anyone an explanation.",
        "At family dinners: Bring a keto dish to share. Load up on meat and vegetables; skip bread, pasta, and dessert. Do not announce you are keto unless asked.",
        'Handling comments \u2014 "Just have a little": say "I am good, thanks" and repeat as needed. "Is that even healthy?": say "It is working great for me, actually."',
        "If you choose to drink at social events: dry wines (under 2g carbs per 5oz) are the best option; spirits (vodka, whiskey, tequila, gin) are carb-free \u2014 use soda water as a mixer. Beer is almost always off-limits."
      ]
    },
    {
      id: "t5",
      tab: "tips",
      icon: "\u{1F4C9}",
      color: "#8b5cf6",
      title: "Breaking a Stall",
      summary: "Why fat loss stalls happen and exactly what to do when the scale stops moving.",
      body: [
        "A stall is when the scale does not move for 2\u20134+ weeks despite following keto. It is completely normal. Common causes: caloric adaptation, water retention masking fat loss, hidden carbs, or too much dietary fat preventing stored fat mobilisation.",
        "Track everything for one week: hidden carbs are the number-one cause. You may discover you are eating 60g net carbs thinking it is 20g.",
        "Try intermittent fasting: add an 18:6 or 20:4 window to create additional caloric deficit without conscious restriction.",
        "Counterintuitively, reduce dietary fat: eating less added fat (butter, oil, cream) forces your body to burn more stored body fat for fuel.",
        "Other strategies: increase protein (boosts metabolism through the thermic effect of food), add strength training, or take a 1\u20132 week diet break at maintenance calories to reset leptin and thyroid hormones."
      ]
    },
    {
      id: "t6",
      tab: "tips",
      icon: "\u{1F4AA}",
      color: "#8b5cf6",
      title: "Staying Motivated",
      summary: "Evidence-based strategies to stay consistent when willpower and motivation fade.",
      body: [
        "Motivation is unreliable. Systems, habits, and identity are what actually carry you through a 30, 180, or 365-day journey.",
        'Reframe your identity: Do not say "I am trying keto." Say "I am someone who eats keto." Identity-based goals are stickier than outcome-based goals. Act as the person you want to become.',
        "Track what matters beyond the scale: energy levels, mental clarity, sleep quality, mood stability, clothes fitting differently, blood work improvements. The scale is a lagging, noisy indicator.",
        "Build a streak: Each day you stay keto, your streak grows. Missing one day breaks momentum. Use the app streak tracker as a game \u2014 it works.",
        "Find your why and revisit it daily: Write down why you started. Read it every morning. When willpower fades, your why carries you.",
        "Handle slips without shame: If you eat off-plan, the meal is over. One meal does not undo weeks of progress. Get back to it at your next meal \u2014 not tomorrow, not Monday. Now."
      ]
    }
  ];
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-4o576pru> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Learn | Keto Journey</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){var t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, "</head> <body data-astro-cid-4o576pru> ", ' <!-- Page Hero --> <div class="learn-hero" data-astro-cid-4o576pru> <div class="learn-hero-inner" data-astro-cid-4o576pru> <div class="lh-row" data-astro-cid-4o576pru> <div data-astro-cid-4o576pru> <div class="lh-eyebrow" data-astro-cid-4o576pru>', ' Help &amp; Learn</div> <h1 class="learn-title" data-astro-cid-4o576pru>Your Keto Journey<br data-astro-cid-4o576pru><em data-astro-cid-4o576pru>Guide &amp; Hub</em></h1> <p class="learn-sub" data-astro-cid-4o576pru>\nMaster the app, understand the science, and get answers \u2014 all in one place.\n</p> </div> <a href="/dashboard?tour=1" class="tour-launch-btn" data-astro-cid-4o576pru> ', '\nTake the Tour\n</a> </div> </div> </div> <!-- Sticky Tab Bar --> <div class="tab-bar-wrap" data-astro-cid-4o576pru> <div class="tab-bar" data-astro-cid-4o576pru> ', ' </div> </div> <!-- Tab Panels --> <div class="learn-content" data-astro-cid-4o576pru> <!-- \u2550\u2550 APP GUIDE PANEL \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 --> <div class="tab-panel active" data-panel="guide" data-astro-cid-4o576pru> <!-- Quick Start Checklist --> <div class="guide-section" data-astro-cid-4o576pru> <h2 class="guide-section-title" data-astro-cid-4o576pru> ', '\nQuick Start Checklist\n</h2> <!-- Progress bar --> <div class="qs-progress" data-astro-cid-4o576pru> <div class="qs-prog-bar" data-astro-cid-4o576pru> <div class="qs-prog-fill" id="qsProgFill"', ' data-astro-cid-4o576pru></div> </div> <span class="qs-prog-count" id="qsDoneCount" data-astro-cid-4o576pru>', '</span> <span class="qs-prog-label" data-astro-cid-4o576pru>/ ', ' completed</span> </div> <div class="qs-list" data-astro-cid-4o576pru> ', ' </div> </div> <!-- Feature Guide Cards --> <div class="guide-section" data-astro-cid-4o576pru> <h2 class="guide-section-title" data-astro-cid-4o576pru> ', `
Feature Guide
</h2> <div class="feat-grid" data-astro-cid-4o576pru> <!-- Daily Check-In --> <div class="feat-card" style="--fc:#10b981;--fi-bg:rgba(16,185,129,.1)" onclick="toggleFeat('fc-checkin')" data-astro-cid-4o576pru> <div class="fc-top" data-astro-cid-4o576pru> <div class="fc-icon" data-astro-cid-4o576pru>`, '</div> <div class="fc-info" data-astro-cid-4o576pru> <div class="fc-title" data-astro-cid-4o576pru>Daily Check-In</div> <div class="fc-desc" data-astro-cid-4o576pru>Log your vitals, mood, energy, and water intake every morning.</div> </div> ', ' </div> <div class="fc-body" id="fc-checkin" data-astro-cid-4o576pru> <div class="fc-steps" data-astro-cid-4o576pru> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>1</span>Open Check-In every morning before breakfast</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>2</span>Rate energy (1\u20135), mood, hunger, brain fog, and sleep</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>3</span>Log water glasses and whether you followed your meal plan</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>4</span>Submit to earn 30 XP and keep your streak alive</div> </div> <a href="/dashboard/checkin" class="fc-goto" data-astro-cid-4o576pru>Open Check-In ', `</a> </div> </div> <!-- Meal Planning --> <div class="feat-card" style="--fc:#f59e0b;--fi-bg:rgba(245,158,11,.1)" onclick="toggleFeat('fc-meals')" data-astro-cid-4o576pru> <div class="fc-top" data-astro-cid-4o576pru> <div class="fc-icon" data-astro-cid-4o576pru>`, '</div> <div class="fc-info" data-astro-cid-4o576pru> <div class="fc-title" data-astro-cid-4o576pru>Meal Planning</div> <div class="fc-desc" data-astro-cid-4o576pru>Personalized keto meals and a full recipe library at your fingertips.</div> </div> ', ` </div> <div class="fc-body" id="fc-meals" data-astro-cid-4o576pru> <div class="fc-steps" data-astro-cid-4o576pru> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>1</span>Today's meals appear automatically on your dashboard</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>2</span>Tap any meal card to see the full recipe and nutrition</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>3</span>Use the Swap button if a meal doesn't suit you today</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>4</span>Browse the full recipe library for `, ' keto recipes</div> </div> <a href="/dashboard/recipes" class="fc-goto" data-astro-cid-4o576pru>Browse Recipes ', `</a> </div> </div> <!-- Progress Tracking --> <div class="feat-card" style="--fc:#3b82f6;--fi-bg:rgba(59,130,246,.1)" onclick="toggleFeat('fc-progress')" data-astro-cid-4o576pru> <div class="fc-top" data-astro-cid-4o576pru> <div class="fc-icon" data-astro-cid-4o576pru>`, '</div> <div class="fc-info" data-astro-cid-4o576pru> <div class="fc-title" data-astro-cid-4o576pru>Progress Tracking</div> <div class="fc-desc" data-astro-cid-4o576pru>Charts, weight log, body measurements, and achievement tracking.</div> </div> ', ` </div> <div class="fc-body" id="fc-progress" data-astro-cid-4o576pru> <div class="fc-steps" data-astro-cid-4o576pru> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>1</span>Log your weight regularly \u2014 aim for every 3\u20134 days</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>2</span>Add body measurements (waist, hips, arms) monthly</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>3</span>Review energy and compliance trends in the charts</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>4</span>Check achievements to see badges you've unlocked</div> </div> <a href="/dashboard/progress" class="fc-goto" data-astro-cid-4o576pru>View Progress `, `</a> </div> </div> <!-- Fasting Timer --> <div class="feat-card" style="--fc:#8b5cf6;--fi-bg:rgba(139,92,246,.1)" onclick="toggleFeat('fc-fasting')" data-astro-cid-4o576pru> <div class="fc-top" data-astro-cid-4o576pru> <div class="fc-icon" data-astro-cid-4o576pru>`, '</div> <div class="fc-info" data-astro-cid-4o576pru> <div class="fc-title" data-astro-cid-4o576pru>Fasting Timer</div> <div class="fc-desc" data-astro-cid-4o576pru>Track intermittent fasting windows with a live countdown timer.</div> </div> ', ' </div> <div class="fc-body" id="fc-fasting" data-astro-cid-4o576pru> <div class="fc-steps" data-astro-cid-4o576pru> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>1</span>Choose your protocol: 12:12, 16:8, 18:6, or 20:4</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>2</span>Tap "Start Fast" when your eating window closes</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>3</span>The timer counts down \u2014 the app tracks your progress</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>4</span>End the fast when your window opens to earn XP</div> </div> <a href="/dashboard/fasting" class="fc-goto" data-astro-cid-4o576pru>Open Fasting ', `</a> </div> </div> <!-- Habits & Streaks --> <div class="feat-card" style="--fc:#10b981;--fi-bg:rgba(16,185,129,.1)" onclick="toggleFeat('fc-habits')" data-astro-cid-4o576pru> <div class="fc-top" data-astro-cid-4o576pru> <div class="fc-icon" data-astro-cid-4o576pru>`, '</div> <div class="fc-info" data-astro-cid-4o576pru> <div class="fc-title" data-astro-cid-4o576pru>Habits &amp; Streaks</div> <div class="fc-desc" data-astro-cid-4o576pru>Build powerful keto habits with daily tracking and streak rewards.</div> </div> ', ' </div> <div class="fc-body" id="fc-habits" data-astro-cid-4o576pru> <div class="fc-steps" data-astro-cid-4o576pru> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>1</span>Visit Habits to see your active daily habit list</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>2</span>Check off habits each day to earn XP and build streaks</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>3</span>Your overall streak is protected by daily check-ins</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>4</span>Milestone streaks (7, 14, 30 days) unlock achievements</div> </div> <a href="/dashboard/habits" class="fc-goto" data-astro-cid-4o576pru>Open Habits ', `</a> </div> </div> <!-- XP & Leveling --> <div class="feat-card" style="--fc:#f59e0b;--fi-bg:rgba(245,158,11,.1)" onclick="toggleFeat('fc-xp')" data-astro-cid-4o576pru> <div class="fc-top" data-astro-cid-4o576pru> <div class="fc-icon" data-astro-cid-4o576pru>`, '</div> <div class="fc-info" data-astro-cid-4o576pru> <div class="fc-title" data-astro-cid-4o576pru>XP &amp; Leveling System</div> <div class="fc-desc" data-astro-cid-4o576pru>Earn XP for every healthy action \u2014 level up and unlock achievements.</div> </div> ', ' </div> <div class="fc-body" id="fc-xp" data-astro-cid-4o576pru> <div class="fc-steps" data-astro-cid-4o576pru> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>1</span>Check-in = 30 XP \xB7 Task = 10\u201325 XP \xB7 Fasting = 50 XP</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>2</span>Every 500 XP = 1 level up (shown on your dashboard)</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>3</span>Streak bonuses multiply XP \u2014 never break the chain</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>4</span>View all earned achievements on your Profile page</div> </div> <a href="/dashboard/profile" class="fc-goto" data-astro-cid-4o576pru>View Profile ', `</a> </div> </div> <!-- Shopping List --> <div class="feat-card" style="--fc:#3b82f6;--fi-bg:rgba(59,130,246,.1)" onclick="toggleFeat('fc-shopping')" data-astro-cid-4o576pru> <div class="fc-top" data-astro-cid-4o576pru> <div class="fc-icon" data-astro-cid-4o576pru>`, '</div> <div class="fc-info" data-astro-cid-4o576pru> <div class="fc-title" data-astro-cid-4o576pru>Shopping List</div> <div class="fc-desc" data-astro-cid-4o576pru>Week-by-week keto shopping lists tailored to your meal plan.</div> </div> ', ` </div> <div class="fc-body" id="fc-shopping" data-astro-cid-4o576pru> <div class="fc-steps" data-astro-cid-4o576pru> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>1</span>Open Shopping to see this week's ingredient list</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>2</span>Switch between weeks using the week tabs at the top</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>3</span>Check off items as you shop \u2014 the list updates instantly</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>4</span>Items are grouped by category for easy navigation</div> </div> <a href="/dashboard/shopping" class="fc-goto" data-astro-cid-4o576pru>View Shopping List `, "</a> </div> </div> <!-- AI Coach --> <div", ' style="--fc:#f59e0b;--fi-bg:rgba(245,158,11,.1)"', ' data-astro-cid-4o576pru> <div class="fc-top" data-astro-cid-4o576pru> <div class="fc-icon" data-astro-cid-4o576pru>', '</div> <div class="fc-info" data-astro-cid-4o576pru> <div class="fc-title" data-astro-cid-4o576pru>\nAI Coach\n', ' </div> <div class="fc-desc" data-astro-cid-4o576pru>Your personal keto AI coach \u2014 ask anything, get personalized advice.</div> </div> ', " </div> ", " ", " </div> </div> </div> </div> <!-- \u2550\u2550 END APP GUIDE PANEL \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 --> <!-- \u2550\u2550 KETO SCIENCE PANELS \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 --> ", ` </div> <script>
  /* \u2500\u2500 Tab switching \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  window.showLearnTab = function(tabKey) {
    var panels = document.querySelectorAll('.tab-panel');
    var buttons = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < panels.length; i++) {
      panels[i].classList.remove('active');
    }
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove('active');
    }
    var panel = document.querySelector('[data-panel="' + tabKey + '"]');
    var btn   = document.querySelector('[data-tab="' + tabKey + '"]');
    if (panel) panel.classList.add('active');
    if (btn)   btn.classList.add('active');
  };

  /* \u2500\u2500 Article accordion \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  window.toggleLearn = function(id) {
    var card = document.querySelector('[data-id="' + id + '"]');
    if (!card) return;
    var isOpen = card.classList.contains('open');
    var grid = card.closest('.article-grid');
    if (grid) {
      var siblings = grid.querySelectorAll('.article-card.open');
      for (var k = 0; k < siblings.length; k++) {
        siblings[k].classList.remove('open');
      }
    }
    if (!isOpen) {
      card.classList.add('open');
      setTimeout(function() {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  };

  /* \u2500\u2500 Feature card accordion \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  function toggleFeat(bodyId) {
    var body = document.getElementById(bodyId);
    if (!body) return;
    var card = body.closest('.feat-card');
    if (!card) return;
    // Close all others in the same grid
    var grid = card.closest('.feat-grid');
    if (grid) {
      var others = grid.querySelectorAll('.feat-card.open');
      for (var i = 0; i < others.length; i++) {
        if (others[i] !== card) others[i].classList.remove('open');
      }
    }
    card.classList.toggle('open');
  }

  /* \u2500\u2500 Client-side quickstart checklist updates \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  (function() {
    // qs6: recipe viewed
    var qs6Done = !!localStorage.getItem('keto-recipe-viewed');
    if (qs6Done) {
      var el = document.getElementById('qs-item-qs6');
      if (el) el.classList.add('done');
    }

    // qs7: tour completed
    var qs7Done = !!localStorage.getItem('keto-tour-v1');
    var qs7El = document.getElementById('qs-item-qs7');
    if (qs7Done && qs7El) qs7El.classList.add('done');

    // Recount and update progress bar
    var totalDone = document.querySelectorAll('.qs-item.done').length;
    var total = document.querySelectorAll('.qs-item').length;
    var fill = document.getElementById('qsProgFill');
    var count = document.getElementById('qsDoneCount');
    if (fill) fill.style.width = Math.round((totalDone / total) * 100) + '%';
    if (count) count.textContent = String(totalDone);
  })();
<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "learn", "data-astro-cid-4o576pru": true }), renderComponent($$result, "Map", $$Map, { "size": 13, "data-astro-cid-4o576pru": true }), renderComponent($$result, "Play", $$Play, { "size": 14, "data-astro-cid-4o576pru": true }), tabs.map((tab, i) => renderTemplate`<button${addAttribute(i === 0 ? "tab-btn active" : "tab-btn", "class")}${addAttribute(tab.key, "data-tab")}${addAttribute(`--tc: ${tab.color}`, "style")}${addAttribute(`window.showLearnTab('${tab.key}')`, "onclick")} data-astro-cid-4o576pru> ${tab.label} </button>`), renderComponent($$result, "Target", $$Target, { "size": 18, "style": "color:var(--green)", "data-astro-cid-4o576pru": true }), addAttribute(`width:${Math.round(doneCount / quickStart.length * 100)}%`, "style"), doneCount, quickStart.length, quickStart.map((item, idx) => renderTemplate`<div${addAttribute(item.done ? "qs-item done" : "qs-item", "class")}${addAttribute(item.clientId ? `qs-item-${item.clientId}` : void 0, "id")}${addAttribute(`animation-delay:${idx * 0.06}s`, "style")} data-astro-cid-4o576pru> <div class="qs-check" data-astro-cid-4o576pru> ${item.done && renderTemplate`${renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 14, "color": "#fff", "data-astro-cid-4o576pru": true })}`} </div> <div class="qs-body" data-astro-cid-4o576pru> <div class="qs-label" data-astro-cid-4o576pru>${item.label}</div> <div class="qs-desc" data-astro-cid-4o576pru>${item.desc}</div> </div> ${!item.done && renderTemplate`<a${addAttribute(item.href, "href")} class="qs-cta" data-astro-cid-4o576pru>
Go ${renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true })} </a>`} </div>`), renderComponent($$result, "HelpCircle", $$HelpCircle, { "size": 18, "style": "color:var(--blue)", "data-astro-cid-4o576pru": true }), renderComponent($$result, "ClipboardCheck", $$ClipboardCheck, { "size": 18, "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 15, "class": "fc-caret", "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true }), renderComponent($$result, "Utensils", $$Utensils, { "size": 18, "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 15, "class": "fc-caret", "data-astro-cid-4o576pru": true }), planType === "basic_30" ? "30+" : planType === "pro_6" ? "87+" : "150+", renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true }), renderComponent($$result, "BarChart3", $$BarChart3, { "size": 18, "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 15, "class": "fc-caret", "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true }), renderComponent($$result, "Timer", $$Timer, { "size": 18, "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 15, "class": "fc-caret", "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true }), renderComponent($$result, "Repeat", $$Repeat, { "size": 18, "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 15, "class": "fc-caret", "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true }), renderComponent($$result, "Trophy", $$Trophy, { "size": 18, "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 15, "class": "fc-caret", "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true }), renderComponent($$result, "ShoppingCart", $$ShoppingCart, { "size": 18, "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 15, "class": "fc-caret", "data-astro-cid-4o576pru": true }), renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true }), addAttribute(`feat-card${planType !== "elite_12" ? " fc-locked" : ""}`, "class"), addAttribute(planType === "elite_12" ? "toggleFeat('fc-ai')" : "", "onclick"), renderComponent($$result, "Sparkles", $$Sparkles, { "size": 18, "data-astro-cid-4o576pru": true }), planType === "elite_12" ? renderTemplate`<span class="fc-badge elite" data-astro-cid-4o576pru>ELITE</span>` : renderTemplate`<span class="fc-badge pro" data-astro-cid-4o576pru>${renderComponent($$result, "Lock", $$Lock, { "size": 10, "data-astro-cid-4o576pru": true })} Upgrade</span>`, renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 15, "class": "fc-caret", "data-astro-cid-4o576pru": true }), planType === "elite_12" && renderTemplate`<div class="fc-body" id="fc-ai" data-astro-cid-4o576pru> <div class="fc-steps" data-astro-cid-4o576pru> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>1</span>Type any question about keto, your plan, or symptoms</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>2</span>The AI uses your personal data: weight, streak, checkins</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>3</span>Use quick suggestions for common topics</div> <div class="fc-step" data-astro-cid-4o576pru><span class="fc-step-num" data-astro-cid-4o576pru>4</span>Chat history is saved so you can review past advice</div> </div> <a href="/dashboard/ai-coach" class="fc-goto" data-astro-cid-4o576pru>Open AI Coach ${renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 12, "data-astro-cid-4o576pru": true })}</a> </div>`, planType !== "elite_12" && renderTemplate`<div style="padding:.6rem 0 .2rem;font-size:.77rem;color:var(--soft);" data-astro-cid-4o576pru> <a href="/dashboard/upgrade" style="color:var(--gold,#f59e0b);font-weight:700;text-decoration:none;" data-astro-cid-4o576pru>Upgrade to Elite</a> to unlock your personal AI keto coach.
</div>`, tabs.filter((tab) => tab.key !== "guide").map((tab) => renderTemplate`<div class="tab-panel"${addAttribute(tab.key, "data-panel")} data-astro-cid-4o576pru> <div class="article-grid" data-astro-cid-4o576pru> ${articles.filter((a) => a.tab === tab.key).map((article) => renderTemplate`<div class="article-card"${addAttribute(article.id, "data-id")}${addAttribute(`--ac: ${article.color}`, "style")}${addAttribute(`window.toggleLearn('${article.id}')`, "onclick")} data-astro-cid-4o576pru> <div class="ac-top" data-astro-cid-4o576pru> <span class="ac-icon" data-astro-cid-4o576pru>${article.icon}</span> <div class="ac-head" data-astro-cid-4o576pru> <h3 class="ac-title" data-astro-cid-4o576pru>${article.title}</h3> <p class="ac-summary" data-astro-cid-4o576pru>${article.summary}</p> </div> <span class="ac-chevron" data-astro-cid-4o576pru>&#x203A;</span> </div> <div class="ac-body"${addAttribute(`body-${article.id}`, "id")} data-astro-cid-4o576pru> <div class="ac-content" data-astro-cid-4o576pru> ${article.body.map((line) => renderTemplate`<p data-astro-cid-4o576pru>${line}</p>`)} </div> </div> </div>`)} </div> </div>`));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/learn.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/learn.astro";
const $$url = "/dashboard/learn";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Learn,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
