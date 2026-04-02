import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead } from './astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { $ as $$ } from './Utensils_DbwmzDI-.mjs';

const $$Astro = createAstro();
const $$BarChart3 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BarChart3;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "chart-column", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M3 3v16a2 2 0 0 0 2 2h16"></path> <path d="M18 17V9"></path> <path d="M13 17V5"></path> <path d="M8 17v-3"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/BarChart3.astro", void 0);

export { $$BarChart3 as $ };
