import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead } from './astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { $ as $$ } from './Utensils_DbwmzDI-.mjs';

const $$Astro = createAstro();
const $$Award = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Award;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "award", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path> <circle cx="12" cy="8" r="6"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Award.astro", void 0);

export { $$Award as $ };
