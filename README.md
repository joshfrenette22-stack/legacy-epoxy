# Legacy Epoxy — Landing Page

Production-grade, conversion-focused landing page for Legacy Epoxy. Built with Next.js (App Router), TypeScript, Tailwind CSS, and GSAP.

## Features

- **Apple-style scroll-scrub hero** — pinned canvas that scrubs through a frame sequence as the user scrolls (house exterior → camera zooms toward garage/epoxy floor)
- **Feathered gradient mask** — video canvas edges dissolve into the dark background (no hard box)
- **Resend-powered quote form** — POST to `/api/quote` emails the lead to the business inbox
- **Mobile-first** — sticky bottom CTA bar, large tap targets, 18px+ body text
- **Reduced motion** — respects `prefers-reduced-motion` with a static poster fallback
- **WCAG AA** contrast and semantic HTML throughout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local`:

```
RESEND_API_KEY=re_your_api_key_here
```

Get your API key from [resend.com](https://resend.com). On Vercel, set the same variable in **Settings > Environment Variables**.

## Frame Extraction (for the scroll-scrub hero)

The hero scrubs through a numbered image sequence. To regenerate frames from a new source video:

```bash
ffmpeg -i public/video/garage-source.mp4 \
  -vf "fps=15,scale=1600:-1" \
  -q:v 4 \
  public/frames/frame_%03d.jpg
```

This produces ~100-120 JPEG frames at 1600px wide. Update `TOTAL_FRAMES` in `src/components/HeroCanvas.tsx` to match the count.

## Asset Swap Points

Real photos/video haven't landed yet. Swap points are marked in the code:

| Asset | Location | Notes |
|-------|----------|-------|
| Hero video | `public/video/garage-source.mp4` | Re-run ffmpeg step above |
| Hero poster | `public/images/hero-poster.jpg` | Used for reduced-motion fallback |
| Gallery photos (x4) | `src/components/Gallery.tsx` | Replace placeholder divs with `<Image>` |
| Phone number | Search `9705551234` across components | Replace with real number |
| Business email | `src/app/api/quote/route.ts` | Replace `BUSINESS_EMAIL` |

## Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected
3. Set `RESEND_API_KEY` in Settings > Environment Variables
4. Deploy

Or via CLI:

```bash
npx vercel
```

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **GSAP + ScrollTrigger** (scroll-driven canvas animation)
- **Resend** (transactional email for lead capture)
- **Hanken Grotesk** + **Instrument Serif** (Google Fonts via next/font)
