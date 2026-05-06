// GET /api/og — dynamic OG image generator
// Params:
//   ?title=   custom headline (for blog/recipe pages)
//   ?type=    blog | recipe | page (controls sub-label)
// Default: main brand image (1200×630)
import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';

// h() builds a React-element-shaped object that Satori accepts directly
function h(type: string, props: Record<string, any> | null, ...children: any[]): any {
  const flat = children.flat(10).filter((c: any) => c !== null && c !== undefined && c !== false);
  return {
    type,
    key: null,
    props: { ...(props ?? {}), children: flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat },
  };
}

// Fetch Bricolage Grotesque 800 from Google Fonts (cached by Vercel CDN)
async function loadBricolage(): Promise<ArrayBuffer> {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800',
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } }
  ).then(r => r.text());
  const match = css.match(/src:\s*url\(([^)]+)\)/);
  if (!match) throw new Error('Could not parse Bricolage font URL');
  return fetch(match[1]).then(r => r.arrayBuffer());
}

const BG    = '#FAF6F1';
const INK   = '#16110F';
const SOFT  = '#8A8077';
const LINE  = '#E5DED2';
const ACCENT = '#FF5C7A';
const WHITE  = '#FFFFFF';

// ── Shared elements ────────────────────────────────────────────────────────

function Logo() {
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
    h('div', {
      style: {
        width: 32, height: 32, borderRadius: 16,
        background: ACCENT, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      },
    }, h('span', { style: { color: WHITE, fontSize: 17, fontStyle: 'italic', fontFamily: 'Bricolage', fontWeight: 800 } }, 'k')),
    h('span', { style: { fontSize: 20, fontWeight: 800, color: INK, fontFamily: 'Bricolage', letterSpacing: -0.5 } }, 'keto'),
    h('span', { style: { fontSize: 20, fontWeight: 800, color: ACCENT, fontFamily: 'Bricolage', fontStyle: 'italic', letterSpacing: -0.5 } }, 'journey'),
  );
}

function Badge(text: string) {
  return h('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,92,122,.1)',
      border: `1px solid rgba(255,92,122,.3)`,
      borderRadius: 99, paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16,
      alignSelf: 'flex-start',
    },
  },
    h('div', { style: { width: 7, height: 7, borderRadius: 4, background: ACCENT } }),
    h('span', { style: { fontSize: 15, color: ACCENT, fontFamily: 'Bricolage', fontWeight: 800 } }, text),
  );
}

// ── Brand OG (default) ─────────────────────────────────────────────────────

function BrandCard() {
  return h('div', {
    style: {
      display: 'flex', width: 1200, height: 630,
      background: BG, padding: 64, alignItems: 'center',
    },
  },
    // Left
    h('div', {
      style: {
        display: 'flex', flexDirection: 'column', flex: 1,
        justifyContent: 'center', paddingRight: 60,
      },
    },
      h('div', { style: { display: 'flex', marginBottom: 32 } }, Logo()),
      // Eyebrow
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 } },
        h('div', { style: { width: 5, height: 5, borderRadius: 3, background: ACCENT } }),
        h('span', { style: { fontSize: 12, color: ACCENT, fontFamily: 'Bricolage', fontWeight: 800, letterSpacing: 2 } }, 'KETO COACHING APP'),
      ),
      // Headline
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 20 } },
        h('span', { style: { fontSize: 70, fontWeight: 800, color: INK, fontFamily: 'Bricolage', lineHeight: 1, letterSpacing: -2 } }, 'Your keto'),
        h('span', { style: { fontSize: 70, fontWeight: 800, color: ACCENT, fontFamily: 'Bricolage', lineHeight: 1, letterSpacing: -2, fontStyle: 'italic' } }, 'transformation.'),
      ),
      // Sub
      h('span', { style: { fontSize: 19, color: SOFT, fontFamily: 'Bricolage', marginBottom: 32 } }, '30 · 90 · 360-day structured programs'),
      Badge('7-day free trial — no card required'),
    ),

    // Right card
    h('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 340, flexShrink: 0,
      },
    },
      h('div', {
        style: {
          display: 'flex', flexDirection: 'column',
          background: WHITE, border: `1.5px solid ${LINE}`,
          borderRadius: 28, paddingTop: 28, paddingBottom: 28,
          paddingLeft: 28, paddingRight: 28, width: 300,
        },
      },
        // Card eyebrow
        h('span', {
          style: { fontSize: 10, fontWeight: 800, color: ACCENT, fontFamily: 'Bricolage', letterSpacing: 2, marginBottom: 18 },
        }, 'YOUR PROGRESS'),

        // Big stat
        h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 20 } },
          h('span', { style: { fontSize: 64, fontWeight: 800, color: INK, fontFamily: 'Bricolage', lineHeight: 1, letterSpacing: -2 } }, '14'),
          h('span', { style: { fontSize: 16, color: SOFT, fontFamily: 'Bricolage', marginBottom: 8 } }, 'days in'),
        ),

        // Progress bar
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 } },
          h('div', { style: { display: 'flex', justifyContent: 'space-between' } },
            h('span', { style: { fontSize: 11, color: SOFT, fontFamily: 'Bricolage' } }, 'Journey progress'),
            h('span', { style: { fontSize: 11, color: ACCENT, fontFamily: 'Bricolage', fontWeight: 800 } }, '47%'),
          ),
          h('div', { style: { display: 'flex', height: 6, background: '#F2EDE5', borderRadius: 99 } },
            h('div', { style: { display: 'flex', width: '47%', height: 6, background: ACCENT, borderRadius: 99 } }),
          ),
        ),

        // Divider
        h('div', { style: { display: 'flex', height: 1, background: LINE, marginBottom: 18 } }),

        // Stat rows
        StatRow('Streak', '12 days'),
        StatRow('XP earned', '1,840 pts'),
        StatRow('Level', 'Fat Burner'),

        // Divider
        h('div', { style: { display: 'flex', height: 1, background: LINE, marginTop: 14, marginBottom: 14 } }),

        h('span', { style: { fontSize: 11, color: LINE, fontFamily: 'Bricolage' } }, 'ketojourney.fun'),
      ),
    ),
  );
}

function StatRow(label: string, value: string) {
  return h('div', {
    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  },
    h('span', { style: { fontSize: 13, color: SOFT, fontFamily: 'Bricolage' } }, label),
    h('span', { style: { fontSize: 13, color: INK, fontFamily: 'Bricolage', fontWeight: 800 } }, value),
  );
}

// ── Title card (blog / recipe / page) ──────────────────────────────────────

function TitleCard(title: string, label: string) {
  const truncated = title.length > 55 ? title.slice(0, 52) + '…' : title;
  return h('div', {
    style: {
      display: 'flex', flexDirection: 'column', width: 1200, height: 630,
      background: BG, padding: 80, justifyContent: 'space-between',
    },
  },
    // Top: logo
    h('div', { style: { display: 'flex' } }, Logo()),

    // Middle: title
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 } },
        h('div', { style: { width: 5, height: 5, borderRadius: 3, background: ACCENT } }),
        h('span', { style: { fontSize: 13, color: ACCENT, fontFamily: 'Bricolage', fontWeight: 800, letterSpacing: 2 } }, label),
      ),
      h('span', {
        style: {
          fontSize: truncated.length > 35 ? 52 : 64,
          fontWeight: 800, color: INK, fontFamily: 'Bricolage',
          lineHeight: 1.1, letterSpacing: -2,
        },
      }, truncated),
    ),

    // Bottom: badge + domain
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
      Badge('KetoJourney'),
      h('span', { style: { fontSize: 16, color: SOFT, fontFamily: 'Bricolage' } }, 'ketojourney.fun'),
    ),
  );
}

// ── Handler ────────────────────────────────────────────────────────────────

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get('title') || '';
  const type  = url.searchParams.get('type') || '';

  const labelMap: Record<string, string> = {
    blog:   'BLOG',
    recipe: 'RECIPE',
    page:   'KETO JOURNEY',
  };

  let bricolage: ArrayBuffer;
  try {
    bricolage = await loadBricolage();
  } catch {
    // If font fetch fails, fall back to system sans-serif
    bricolage = new ArrayBuffer(0);
  }

  const element = title
    ? TitleCard(title, labelMap[type] || 'KETO JOURNEY')
    : BrandCard();

  return new ImageResponse(element as any, {
    width:  1200,
    height: 630,
    fonts: bricolage.byteLength > 0 ? [
      { name: 'Bricolage', data: bricolage, weight: 800, style: 'normal' },
    ] : [],
  });
};
