# Excavate — Sports Bar | Hookah Lounge

**Tagline:** *Where the Game Meets the Smoke.*

This is a multi-page static website for Excavate Sports Bar & Hookah Lounge. It's built with plain HTML, CSS, and JavaScript — no build step, no frameworks. Drop it on any host and it runs.

---

## Quick Preview (Locally)

Open `index.html` in your browser. Double-click it from your Desktop → the site opens. That's it.

For a more realistic local preview (so fonts and relative paths behave perfectly):

```bash
cd ~/Desktop/Excavate-Website
python3 -m http.server 8080
# then open http://localhost:8080 in your browser
```

---

## File Structure

```
Excavate-Website/
├── index.html        Home — dual-mode hero ("Enter Sports Mode" / "Enter Lounge Mode")
├── sports.html       Sports Mode landing — live games, screen zones, game-day menu teaser
├── lounge.html       Lounge Mode landing — hookah flavors, pods, music vibe
├── menu.html         Tabbed menu — Game-Day / Lounge / Drinks / Hookah / Combos
├── events.html       Tabs — Live Games / Watch Parties / DJ Nights
├── gallery.html      Photo grid (placeholders — swap in your photos)
├── reserve.html      Reservation form (client-side stub — see below to go live)
├── about.html        Story + brand code
├── contact.html      Hours, address, map placeholder, socials
├── styles.css        Full design system, dual-mode theming
├── app.js            Mode switching, tabs, reveal-on-scroll, mobile swipe, form handling
├── assets/
│   ├── logo.svg      Placeholder wordmark (rugged-industrial style, approximates your logo)
│   └── favicon.svg   Browser tab icon
└── README.md         This file
```

---

## Design System

**Theme:** Industrial Nightlife Dual Experience

**Colors:**
- Primary: `#E4572E` (burnt orange, from your logo)
- Hot accent: `#FF6B2B`
- Lounge neon glow: `#C084FC` (used only in Lounge Mode)
- Ink / black: `#0A0A0A`, `#141414`, `#1F1F1F`
- Off-white text: `#F5F1E8`

**Typography:**
- Display: **Oswald** (condensed, bold) — loaded from Google Fonts
- Body: **Inter**

**Dual-Mode Theming:**
Colors switch via `<body data-mode="sports">` vs `<body data-mode="lounge">`. See `styles.css` top section. The mode selection persists across pages via `sessionStorage` (no cookies, no tracking).

---

## What You Still Need to Replace (Placeholder Content)

This site was built before you sent your real content. Search-and-replace the following:

1. **Real logo file** — drop your PNG/SVG at `assets/logo.png` (or `.svg`), then in every `.html` replace `assets/logo.svg` → `assets/logo.png`. Or just overwrite `assets/logo.svg` with your real file.
2. **Address / Phone / Hours** — search for `[Your street address]`, `[Your phone]`, and the hours listed in each footer.
3. **Menu items & prices** — `menu.html` has a full sample menu. Replace items and prices with your real offerings.
4. **Combo pricing** — confirm combos and prices on `menu.html` and the home page.
5. **Hookah flavors** — rotate the list on `lounge.html` and `menu.html` to match your actual selection.
6. **Social links** — replace `href="#"` in every footer with your real Instagram / Facebook / TikTok / X URLs.
7. **Photos** — drop images in `assets/gallery/` and replace the placeholder tiles in `gallery.html` with real `<img>` tags.
8. **Google Map** — paste your Google Maps embed iframe into `contact.html` where it says `Map Embed — paste Google Maps iframe here`.
9. **Reservation backend** — `app.js` handles the form client-side only (shows confirmation). To actually receive reservations, wire up to:
   - **OpenTable / Resy / Tock** — paste their widget in place of the `<form>`
   - A form-to-email service like Formspree, Basin, or Getform
   - Your own backend (Node/PHP/etc.) via `fetch('/api/reserve', ...)`
10. **Email addresses** — `reservations@excavate.com` and `events@excavate.com` in `contact.html` are placeholders.

---

## Signature Feature: Mode Switch

The dual-mode toggle is the brand's signature online moment. Two ways to trigger it:

1. **From the home hero** — tap a mode card, the orange glow flashes, the page transitions into that mode.
2. **From the nav (top-right)** — toggle Sports/Lounge any time. Colors, accents, and ambience shift instantly.

On mobile, **swipe left** on the home hero for Lounge, **swipe right** for Sports.

---

## Hosting Options

| Host | Cost | Notes |
|------|------|-------|
| Netlify | Free | Drag-and-drop the folder at netlify.com/drop → live in 30 seconds. |
| Vercel | Free | Connect a GitHub repo or drag-and-drop. |
| GitHub Pages | Free | Push the folder to a repo, enable Pages in settings. |
| Squarespace / Wix | Paid | Import HTML or copy sections. Usually better to rebuild in their builder. |
| Traditional shared host (GoDaddy, Bluehost) | Paid | FTP the whole folder to `public_html/`. Done. |

A custom domain (like `excavateloungenc.com`) costs ~$12/year at Namecheap, Google Domains, etc. — you point DNS to your host.

---

## Next Upgrades (Optional)

- **Real photos** throughout (biggest visual upgrade by a mile).
- **Live game feed** — auto-populate `sports.html` and `events.html` from a sports API (ESPN / TheSportsDB).
- **Online ordering** — integrate Toast, ChowNow, or Square Online for takeout.
- **Loyalty / VIP signup** — newsletter capture for event announcements.
- **SEO boost** — add a `sitemap.xml`, submit to Google Search Console.
- **Analytics** — add Plausible or Google Analytics (paste one script tag in every `.html`).
- **Custom font for the logo area** — right now we use Oswald; swap in a grittier display face to match the logo even more closely.

---

## Questions / Changes

Ping me (via this chat) with any of:
- "Replace the menu with this text…"
- "Here's the real address / hours / phone"
- "Swap these colors"
- "Wire up the reservation form to Formspree"
- "Add a private events page"

And I'll update the files in place.
