import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead } from './astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { $ as $$ } from './Utensils_DbwmzDI-.mjs';

const $$Astro = createAstro();
const $$Timer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Timer;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "timer", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<line x1="10" x2="14" y1="2" y2="2"></line> <line x1="12" x2="15" y1="14" y2="11"></line> <circle cx="12" cy="14" r="8"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Timer.astro", void 0);

export { $$Timer as $ };
