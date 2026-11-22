# Claude Code brief — Private Thailand & Singapore Trip Website

Build a beautiful, responsive, **private** personal travel dashboard using the structured data in `trip-data.json` as the single source of truth. Language: **Romanian**. Currency presentation: EUR primary for budget; show USD where quoted for flights, THB/SGD for local payments. Dates/times are local to the destination.

## Goal and design
A polished travel companion for two travelers, January 1–18, 2027: timeline, day-by-day activities, transfers, booking checklist, budget, accommodation suggestions, luggage constraints. Tropical but restrained visual design, easy to use on a mobile phone during the trip, fast offline-capable where practical. Use polished maps, simple destination photography with properly attributed licensed/remote images or tasteful CSS placeholders; do not fabricate booking details or prices.

## Tech preferences
Use Next.js + TypeScript + Tailwind CSS (or, if starting in an Astro repository, fit the existing framework). Separate typed data from UI and allow updates without editing JSX. Suggestion: `src/data/trip-data.json`, `src/lib/trip-types.ts`. Use local persistence for checklists and notes. Export printable itinerary and a budget summary. Do not require a backend for the first iteration.

## Privacy
The site is **private**. For local use, bind to localhost. If deployed publicly, require proper authentication before exposing itinerary details: e.g. Cloudflare Access or hosting-provider auth; do not use a hard-coded frontend password or client-side-only gate. Keep any tokens/keys in environment variables and do not commit secrets. Avoid publishing travelers' names, passport details or reservation codes. Do not embed private data in open graph/social previews or indexing; `noindex` is defense in depth, not authentication.

## Pages and components
1. Dashboard: trip countdown, destinations/nights, next transfer, summary cost and booking progress.
2. Itinerary: chronological day cards with activity intensity, practical notes, optional alternatives and local times.
3. Transport: flight cards, ground/marine transfer options, estimated door-to-door times, estimated costs; flag unconfirmed bookings.
4. Budget: interactive editable categories for two persons, compare baseline vs ranges; maintain cost in original currency and avoid pretending approximations are actual spend.
5. Destinations: accommodation areas, primary activities, handy logistics and transport.
6. Packing: luggage configurations and carrier restrictions; weigh/measure controls and a warning when dimensions exceed allowance.
7. Checklist/notes: flights, hotels, boats, arrival forms, insurance, early hotel check-in, etc. Local persistence.
8. Map: place pins and chronological route. Use a mapping library only if it adds value and avoids exposing credentials; map links are a simple fallback.

## Essential UX
- Romanian UI, clear `Planificat` / `Rezervat` / `De verificat` status badges.
- All times destination-local, with `Asia/Bangkok` for Thailand and `Asia/Singapore` for Singapore. Do not subtract airport local clock times to infer flight time without accounting for timezone change.
- Mobile-first layout, cards, prominent navigation, accessible contrast and keyboard support.
- On itinerary days, show duration of hikes and a balance of active vs relaxed days; optional activities are not appointments.
- Show transfer total door-to-door separately from flight or boat duration.
- Budget adjustable as planning estimates, not binding price quotes.
- Return flight is early: Jan 18 Phuket at 09:00; recommend being at airport around 06:00.

## Critical facts and caveats
- 2 travelers; trip Jan 1–18, 2027; **16 hotel nights**, Jan 2–17 inclusive; 5 stops.
- Inbound Turkish Airlines from Bucharest, depart Jan 1; Bangkok arrival Jan 2 at 04:30. Outbound Turkish Airlines Phuket Jan 18 at 09:00. Departure time of inbound and arrival time of outbound are not provided.
- Thai AirAsia Bangkok → Singapore on Jan 5, 07:00–10:30, ~USD 125/person (~USD 250/2), **candidate, not confirmed purchased**. Airport presumed DMK but must verify on ticket.
- Scoot Singapore → Krabi Jan 8, 16:50–17:40, ~USD 100/person (~USD 200/2), **candidate, not confirmed purchased**. Time zones differ by one hour; duration ~1h50.
- Boats Ao Nang → Ko Yao Noi on Jan 12 and Ko Yao Noi → Phuket on Jan 15: operators/timetables/availability not confirmed.
- Estimated overall trip budget for two excluding Turkish Airlines tickets: ~EUR 3,500, with broad economic/comfortable scenarios. No costs are booked receipts.
- Luggage planned: one Rab Expedition II Kitbag 50L and one Forclaz Travel 500 Organizer 40L; optional Deuter Trans Alpine 22 SL. AirAsia baseline 7kg combined carry-on per traveler; Scoot Economy baseline 10kg per traveler. Rab/Forclaz dimensions **must be rechecked against the exact physical models**: previous discussions contradicted Rab length (55 vs 65cm); do not represent uncertain measures as confirmed. Airline policies and fees must be verified before travel.
- Thai entry may require TDAC for **both** Bangkok Jan 2 and Krabi Jan 8. Singapore SG Arrival Card for Jan 5. Verify current official requirements before travel.

## Trip route and nights
Bangkok Jan 2–5 (3n) → Singapore Jan 5–8 (3n) → Ao Nang/Krabi Jan 8–12 (4n) → Ko Yao Noi Jan 12–15 (3n) → Phuket Jan 15–18 (3n).

## Setup and acceptance criteria
- Generate working source code and README with install, dev, build, deployment and authentication instructions.
- Render all 17 calendar days Jan 2–18 and airport departure Jan 1 as separate trip events.
- Use values from provided `trip-data.json` without inventing flight numbers, hotels, booking confirmations or exact ferry schedules.
- Make itinerary, flights and budget easy to edit later.
- Budget math must correctly keep estimated USD flight amounts distinct from EUR totals, with a clearly labeled editable exchange-rate assumption if aggregating currencies.
- Provide an `Assumptions / To verify` section.
