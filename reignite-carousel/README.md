# Reignite Group — "What we do" Instagram carousel

7 slides at 1080×1350 (4:5) for @reignitegroup.eu. The final PNGs are in `out/`.

## Edit
- All copy, layout and visuals live in `slides.html`, one `<section class="slide">` per slide.
- The header (logo + `REIGNITE GROUP`), the `01/07` counter, the progress bar and the `Swipe →` arrow are added to every slide by the script at the bottom of `slides.html`.
- Brand tokens (colours) are CSS variables at the top of the file. The accent `#F85A03` was sampled from the flame in the logo.
- `assets/flame.svg` is a vector trace of the flame from `assets/logo-source.png`, regenerated with `node scripts/vectorize-logo.mjs`.

## Export
```bash
npm install
npm run export   # writes out/slide-01.png … out/slide-07.png
```
Each slide is rendered at 2× device scale and downscaled to 1080×1350 with Lanczos for sharp text. Uses Inter from Google Fonts, falling back to a locally installed Inter. Set `CHROMIUM_PATH` if Playwright can't find a Chromium build.

## Caption
```
What we do at Reignite Group 🔥

We help businesses across Europe look better, get found and win more clients online:

→ Websites that turn visitors into customers
→ Custom web & mobile apps
→ Branding, logos & graphic design
→ Social media & marketing

One team, everything your brand needs to grow.

📩 DM us or visit reignitegroup.agency for a free consultation.

#webdesign #webdevelopment #branding #digitalmarketing #appdevelopment #smallbusinesseurope #marketingagency #europebusiness
```
