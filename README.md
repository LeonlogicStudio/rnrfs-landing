# Rock N' Roll Freak Show — Lovable landing page

Short, ad-optimized one-scroll page. Design matches the official assets
(pink grunge, sticker type, laser tiger). Preview: open
`PREVIEW - open me.html` in the parent folder in any browser.

## How to put it into Lovable

1. **Upload the 3 assets** from `lovable-page/assets/` into your Lovable
   project at `src/assets/`:
   - `freakshow-logo.png`
   - `tiger.png`
   - `wallpaper.jpg`

   (In Lovable chat you can drag-drop the images and tell it:
   *"save these to src/assets as freakshow-logo.png, tiger.png, wallpaper.jpg"*)

2. **Replace the page.** Open `src/pages/Index.tsx` in Lovable (Dev Mode /
   code editor) and paste in the full contents of `lovable-page/Index.tsx`.

   Everything is self-contained in that one file (styles + countdown + layout),
   so nothing else needs changing.

3. **Edit the config constants** at the top of `Index.tsx`:
   - `TICKET_URL` — your Ticket Lounge event link (currently the homepage)
   - `WHATSAPP_URL` — your WhatsApp community invite link (currently `#`)
   - `SALE_DATE` — Early Bird drop, set to 24 July 2026 10:00 London
     (change the time if the drop is at a different hour)
   - `VIDEO_URL` — leave `""` for the placeholder; paste Rex's trailer when
     it arrives (YouTube *embed* URL or a direct .mp4 link both work)

## Content notes (per Rex's brief, 22-7-26)

- Layout: official banner on top → Early Bird drop strip with
  countdown → centered video placement → Need-to-know FAQ → footer.
- Font: Anton (loaded from Google Fonts). Colours from the supplied assets.
- Event: **November 6, 2026, Electric Brixton** (banner is source of truth).
- Tickets: **EARLY BIRD — ON SALE 24-7-26.** The countdown counts to
  the drop and flips to "ON SALE NOW" automatically after it passes.
- Sticky bottom ticket bar shows on mobile only (ads traffic).
- 18+ / ID / booking-fee small print is in the FAQ section.

## Ad tips

- Point ads straight at the page; the first screen already has date, venue,
  lineup, countdown and CTA — no scrolling needed to convert.
- For Meta ads add a pixel + a `Purchase`/`InitiateCheckout` event on the
  ticket link clicks (ask Lovable: "fire fbq('track','InitiateCheckout')
  on all ticket link clicks").
