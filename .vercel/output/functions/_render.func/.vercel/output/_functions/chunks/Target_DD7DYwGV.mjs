import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead } from './astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { $ as $$ } from './Utensils_DbwmzDI-.mjs';

const $$Astro = createAstro();
const $$Target = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Target;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "target", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="12" cy="12" r="10"></circle> <circle cx="12" cy="12" r="6"></circle> <circle cx="12" cy="12" r="2"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Target.astro", void 0);

export { $$Target as $ };
