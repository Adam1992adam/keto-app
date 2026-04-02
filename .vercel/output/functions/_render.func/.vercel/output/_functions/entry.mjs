import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_D4c83dIN.mjs';
import { manifest } from './manifest_CYfuSAGg.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/admin login.astro.mjs');
const _page3 = () => import('./pages/admin-login.astro.mjs');
const _page4 = () => import('./pages/api/achievements/check.astro.mjs');
const _page5 = () => import('./pages/api/admin/activate-pending.astro.mjs');
const _page6 = () => import('./pages/api/admin/delete-pending.astro.mjs');
const _page7 = () => import('./pages/api/admin/update-user.astro.mjs');
const _page8 = () => import('./pages/api/admin/verify.astro.mjs');
const _page9 = () => import('./pages/api/auth/login.astro.mjs');
const _page10 = () => import('./pages/api/auth/logout.astro.mjs');
const _page11 = () => import('./pages/api/auth/refresh.astro.mjs');
const _page12 = () => import('./pages/api/auth/signup.astro.mjs');
const _page13 = () => import('./pages/api/auth/signup-purchase.astro.mjs');
const _page14 = () => import('./pages/api/chat/gemini.astro.mjs');
const _page15 = () => import('./pages/api/chat/history.astro.mjs');
const _page16 = () => import('./pages/api/checkin/save.astro.mjs');
const _page17 = () => import('./pages/api/community/posts/_id_/comments.astro.mjs');
const _page18 = () => import('./pages/api/community/posts/_id_/delete.astro.mjs');
const _page19 = () => import('./pages/api/community/posts/_id_/react.astro.mjs');
const _page20 = () => import('./pages/api/community/posts.astro.mjs');
const _page21 = () => import('./pages/api/cron/daily-push.astro.mjs');
const _page22 = () => import('./pages/api/cron/expire-subscriptions.astro.mjs');
const _page23 = () => import('./pages/api/cron/weekly-email.astro.mjs');
const _page24 = () => import('./pages/api/cron/winback-email.astro.mjs');
const _page25 = () => import('./pages/api/export/_type_.astro.mjs');
const _page26 = () => import('./pages/api/fasting/end.astro.mjs');
const _page27 = () => import('./pages/api/fasting/start.astro.mjs');
const _page28 = () => import('./pages/api/food-log/add.astro.mjs');
const _page29 = () => import('./pages/api/food-log/delete.astro.mjs');
const _page30 = () => import('./pages/api/habits/delete.astro.mjs');
const _page31 = () => import('./pages/api/habits/toggle.astro.mjs');
const _page32 = () => import('./pages/api/habits.astro.mjs');
const _page33 = () => import('./pages/api/ketones/delete.astro.mjs');
const _page34 = () => import('./pages/api/ketones/log.astro.mjs');
const _page35 = () => import('./pages/api/lemonsqueezy/verify-purchase.astro.mjs');
const _page36 = () => import('./pages/api/lemonsqueezy/webhook.astro.mjs');
const _page37 = () => import('./pages/api/macro-goals/save.astro.mjs');
const _page38 = () => import('./pages/api/meal-prep/save.astro.mjs');
const _page39 = () => import('./pages/api/meals/complete.astro.mjs');
const _page40 = () => import('./pages/api/meals/swap.astro.mjs');
const _page41 = () => import('./pages/api/meals/today.astro.mjs');
const _page42 = () => import('./pages/api/measurements/delete.astro.mjs');
const _page43 = () => import('./pages/api/measurements/save.astro.mjs');
const _page44 = () => import('./pages/api/notifications/generate.astro.mjs');
const _page45 = () => import('./pages/api/notifications/preferences.astro.mjs');
const _page46 = () => import('./pages/api/notifications/push-send.astro.mjs');
const _page47 = () => import('./pages/api/notifications/push-subscribe.astro.mjs');
const _page48 = () => import('./pages/api/notifications/push-unsubscribe.astro.mjs');
const _page49 = () => import('./pages/api/notifications/save.astro.mjs');
const _page50 = () => import('./pages/api/notifications.astro.mjs');
const _page51 = () => import('./pages/api/onboarding/save.astro.mjs');
const _page52 = () => import('./pages/api/photos/delete.astro.mjs');
const _page53 = () => import('./pages/api/photos/list.astro.mjs');
const _page54 = () => import('./pages/api/photos/upload.astro.mjs');
const _page55 = () => import('./pages/api/profile/add-weight.astro.mjs');
const _page56 = () => import('./pages/api/profile/update.astro.mjs');
const _page57 = () => import('./pages/api/profile/update-avatar.astro.mjs');
const _page58 = () => import('./pages/api/profile/update-units.astro.mjs');
const _page59 = () => import('./pages/api/recipes/favorite.astro.mjs');
const _page60 = () => import('./pages/api/recipes/rate.astro.mjs');
const _page61 = () => import('./pages/api/reflection/save.astro.mjs');
const _page62 = () => import('./pages/api/shopping/custom.astro.mjs');
const _page63 = () => import('./pages/api/shopping/toggle.astro.mjs');
const _page64 = () => import('./pages/api/tasks/complete.astro.mjs');
const _page65 = () => import('./pages/api/water/log.astro.mjs');
const _page66 = () => import('./pages/api/water/update.astro.mjs');
const _page67 = () => import('./pages/api/weekly/save.astro.mjs');
const _page68 = () => import('./pages/dashboard/admin.astro.mjs');
const _page69 = () => import('./pages/dashboard/ai-coach.astro.mjs');
const _page70 = () => import('./pages/dashboard/checkin.astro.mjs');
const _page71 = () => import('./pages/dashboard/community.astro.mjs');
const _page72 = () => import('./pages/dashboard/expired.astro.mjs');
const _page73 = () => import('./pages/dashboard/export.astro.mjs');
const _page74 = () => import('./pages/dashboard/fasting.astro.mjs');
const _page75 = () => import('./pages/dashboard/favorites.astro.mjs');
const _page76 = () => import('./pages/dashboard/food-log.astro.mjs');
const _page77 = () => import('./pages/dashboard/habits.astro.mjs');
const _page78 = () => import('./pages/dashboard/ketones.astro.mjs');
const _page79 = () => import('./pages/dashboard/learn.astro.mjs');
const _page80 = () => import('./pages/dashboard/meal-prep.astro.mjs');
const _page81 = () => import('./pages/dashboard/notification-preferences.astro.mjs');
const _page82 = () => import('./pages/dashboard/notifications.astro.mjs');
const _page83 = () => import('./pages/dashboard/onboarding.astro.mjs');
const _page84 = () => import('./pages/dashboard/photos.astro.mjs');
const _page85 = () => import('./pages/dashboard/profile.astro.mjs');
const _page86 = () => import('./pages/dashboard/progress.astro.mjs');
const _page87 = () => import('./pages/dashboard/recipe/_id_.astro.mjs');
const _page88 = () => import('./pages/dashboard/recipes.astro.mjs');
const _page89 = () => import('./pages/dashboard/reflections.astro.mjs');
const _page90 = () => import('./pages/dashboard/shopping.astro.mjs');
const _page91 = () => import('./pages/dashboard/upgrade.astro.mjs');
const _page92 = () => import('./pages/dashboard/weekly.astro.mjs');
const _page93 = () => import('./pages/dashboard.astro.mjs');
const _page94 = () => import('./pages/login.astro.mjs');
const _page95 = () => import('./pages/signup.astro.mjs');
const _page96 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/index.astro", _page1],
    ["src/pages/admin login.astro", _page2],
    ["src/pages/admin-login.astro", _page3],
    ["src/pages/api/achievements/check.ts", _page4],
    ["src/pages/api/admin/activate-pending.ts", _page5],
    ["src/pages/api/admin/delete-pending.ts", _page6],
    ["src/pages/api/admin/update-user.ts", _page7],
    ["src/pages/api/admin/verify.ts", _page8],
    ["src/pages/api/auth/login.ts", _page9],
    ["src/pages/api/auth/logout.ts", _page10],
    ["src/pages/api/auth/refresh.ts", _page11],
    ["src/pages/api/auth/signup.ts", _page12],
    ["src/pages/api/auth/signup-purchase.ts", _page13],
    ["src/pages/api/chat/gemini.ts", _page14],
    ["src/pages/api/chat/history.ts", _page15],
    ["src/pages/api/checkin/save.ts", _page16],
    ["src/pages/api/community/posts/[id]/comments.ts", _page17],
    ["src/pages/api/community/posts/[id]/delete.ts", _page18],
    ["src/pages/api/community/posts/[id]/react.ts", _page19],
    ["src/pages/api/community/posts.ts", _page20],
    ["src/pages/api/cron/daily-push.ts", _page21],
    ["src/pages/api/cron/expire-subscriptions.ts", _page22],
    ["src/pages/api/cron/weekly-email.ts", _page23],
    ["src/pages/api/cron/winback-email.ts", _page24],
    ["src/pages/api/export/[type].ts", _page25],
    ["src/pages/api/fasting/end.ts", _page26],
    ["src/pages/api/fasting/start.ts", _page27],
    ["src/pages/api/food-log/add.ts", _page28],
    ["src/pages/api/food-log/delete.ts", _page29],
    ["src/pages/api/habits/delete.ts", _page30],
    ["src/pages/api/habits/toggle.ts", _page31],
    ["src/pages/api/habits/index.ts", _page32],
    ["src/pages/api/ketones/delete.ts", _page33],
    ["src/pages/api/ketones/log.ts", _page34],
    ["src/pages/api/lemonsqueezy/verify-purchase.ts", _page35],
    ["src/pages/api/lemonsqueezy/webhook.ts", _page36],
    ["src/pages/api/macro-goals/save.ts", _page37],
    ["src/pages/api/meal-prep/save.ts", _page38],
    ["src/pages/api/meals/complete.ts", _page39],
    ["src/pages/api/meals/swap.ts", _page40],
    ["src/pages/api/meals/today.ts", _page41],
    ["src/pages/api/measurements/delete.ts", _page42],
    ["src/pages/api/measurements/save.ts", _page43],
    ["src/pages/api/notifications/generate.ts", _page44],
    ["src/pages/api/notifications/preferences.ts", _page45],
    ["src/pages/api/notifications/push-send.ts", _page46],
    ["src/pages/api/notifications/push-subscribe.ts", _page47],
    ["src/pages/api/notifications/push-unsubscribe.ts", _page48],
    ["src/pages/api/notifications/save.ts", _page49],
    ["src/pages/api/notifications/index.ts", _page50],
    ["src/pages/api/onboarding/save.ts", _page51],
    ["src/pages/api/photos/delete.ts", _page52],
    ["src/pages/api/photos/list.ts", _page53],
    ["src/pages/api/photos/upload.ts", _page54],
    ["src/pages/api/profile/add-weight.ts", _page55],
    ["src/pages/api/profile/update.ts", _page56],
    ["src/pages/api/profile/update-avatar.ts", _page57],
    ["src/pages/api/profile/update-units.ts", _page58],
    ["src/pages/api/recipes/favorite.ts", _page59],
    ["src/pages/api/recipes/rate.ts", _page60],
    ["src/pages/api/reflection/save.ts", _page61],
    ["src/pages/api/shopping/custom.ts", _page62],
    ["src/pages/api/shopping/toggle.ts", _page63],
    ["src/pages/api/tasks/complete.ts", _page64],
    ["src/pages/api/water/log.ts", _page65],
    ["src/pages/api/water/update.ts", _page66],
    ["src/pages/api/weekly/save.ts", _page67],
    ["src/pages/dashboard/admin.astro", _page68],
    ["src/pages/dashboard/ai-coach.astro", _page69],
    ["src/pages/dashboard/checkin.astro", _page70],
    ["src/pages/dashboard/community.astro", _page71],
    ["src/pages/dashboard/expired.astro", _page72],
    ["src/pages/dashboard/export.astro", _page73],
    ["src/pages/dashboard/fasting.astro", _page74],
    ["src/pages/dashboard/favorites.astro", _page75],
    ["src/pages/dashboard/food-log.astro", _page76],
    ["src/pages/dashboard/habits.astro", _page77],
    ["src/pages/dashboard/ketones.astro", _page78],
    ["src/pages/dashboard/learn.astro", _page79],
    ["src/pages/dashboard/meal-prep.astro", _page80],
    ["src/pages/dashboard/notification-preferences.astro", _page81],
    ["src/pages/dashboard/notifications.astro", _page82],
    ["src/pages/dashboard/onboarding.astro", _page83],
    ["src/pages/dashboard/photos.astro", _page84],
    ["src/pages/dashboard/profile.astro", _page85],
    ["src/pages/dashboard/progress.astro", _page86],
    ["src/pages/dashboard/recipe/[id].astro", _page87],
    ["src/pages/dashboard/recipes.astro", _page88],
    ["src/pages/dashboard/reflections.astro", _page89],
    ["src/pages/dashboard/shopping.astro", _page90],
    ["src/pages/dashboard/upgrade.astro", _page91],
    ["src/pages/dashboard/weekly.astro", _page92],
    ["src/pages/dashboard/index.astro", _page93],
    ["src/pages/login.astro", _page94],
    ["src/pages/signup.astro", _page95],
    ["src/pages/index.astro", _page96]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "152d8f76-5327-43e0-a5f5-fefedca3803c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
