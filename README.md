# Thailanda & Singapore — ianuarie 2027

Personal travel companion for two: itinerary, transport, budget, destinations, luggage checks, checklist, map.
Romanian UI, static site (no backend), works on a phone and keeps visited pages available offline.

## Edit the trip

Everything comes from **`src/data/trip-data.json`**. Types are in `src/lib/trip-types.ts`.

- Bought a ticket or booked a hotel? Change `statusRo` (flights, transfers) or `hotelStatus` (destinations) to `"Rezervat"`.
- Times are destination-local strings (`"2027-01-05T07:00"`) plus a timezone; flight durations are computed with the timezone offset.
- Push to `main` and the site redeploys in ~1 minute.

Checklist ticks, notes, budget edits, expenses and bag measurements are stored in each phone's browser (`localStorage`).
They don't sync automatically — use **Checklist → Exportă / Importă** to copy them between phones.

## Run locally

```bash
npm install
npm run dev        # http://127.0.0.1:3000 (localhost only)
npm run build      # static site in ./out
```

## Deploy (GitHub Pages)

1. Create a GitHub repo and push this folder to `main`.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes to `https://<user>.github.io/<repo>/`.

On the phone, open the link and use "Add to Home screen" for an app-like icon.

## Search engines

- Every page sends `<meta name="robots" content="noindex, nofollow, …">` and `referrer: no-referrer` (so external links don't leak the URL). No Open Graph tags.
- `public/_headers` adds an `X-Robots-Tag: noindex` header on hosts that support it (Cloudflare Pages, Netlify). GitHub Pages ignores it.
- There is deliberately no `robots.txt` `Disallow`: it would stop crawlers from seeing the `noindex` tag, and GitHub Pages project sites can't serve a root `robots.txt` anyway.
- **The repository itself:** a *public* GitHub repo is indexed by search engines (including this JSON). To keep it out, make the repo private and either use GitHub Pro (Pages from private repos) or deploy the `out/` folder to Cloudflare Pages / Netlify from the private repo.
- `noindex` stops indexing, not access: anyone with the link can open the site. Don't put booking codes, passport numbers or full names in the data or notes.

## Structure

```
src/data/trip-data.json   single source of truth
src/lib/                  types, helpers (timezones, formatting), localStorage hook
src/app/<page>/           one folder per page (itinerar, transport, buget, destinatii, bagaje, checklist, harta, de-verificat, print)
public/sw.js              offline cache
```

Map: Leaflet + OpenStreetMap tiles (no API key). Pins are approximate areas, not hotels.
