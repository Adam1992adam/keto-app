import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead } from './astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { $ as $$ } from './Utensils_DbwmzDI-.mjs';

const $$Astro = createAstro();
const $$TrendingUp = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TrendingUp;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "trending-up", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M16 7h6v6"></path> <path d="m22 7-8.5 8.5-5-5L2 17"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/TrendingUp.astro", void 0);

export { $$TrendingUp as $ };
