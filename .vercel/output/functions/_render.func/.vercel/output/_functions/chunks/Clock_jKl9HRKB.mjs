import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead } from './astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { $ as $$ } from './Utensils_DbwmzDI-.mjs';

const $$Astro = createAstro();
const $$Clock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Clock;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "clock", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M12 6v6l4 2"></path> <circle cx="12" cy="12" r="10"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Clock.astro", void 0);

export { $$Clock as $ };
