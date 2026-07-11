# Scripts

This folder contains data seeding and initialization scripts used by Szene.

## Available scripts

### `npm run seed:osm-venues`
Fetches venue data from OpenStreetMap for 8 German cities and writes the results to `data/venues.json`.

- Uses Overpass API
- Queries nodes and ways with `amenity` set to `nightclub`, `bar`, `pub`, or `biergarten`
- Includes `out center tags;` so way geometries get a center coordinate
- Builds an address from OSM tags when available
- Sleeps 2 seconds between city requests
- Fails per city without stopping the entire pipeline

### `npm run load:venues`
Loads `data/venues.json` into the `venues` table using Neon serverless.

- Reads `DATABASE_URL` from `.env.local`
- Inserts or updates rows by `osm_id`
- Uses `RETURNING (xmax = 0) AS inserted` to distinguish inserted vs updated rows

## Setup

1. Install dependencies:

```bash
npm install
```

2. Make sure `.env.local` contains:

```env
DATABASE_URL=your_neon_database_url
```

3. Run the OSM seed pipeline:

```bash
npm run seed:osm-venues
```

4. Load the generated venues into Postgres:

```bash
npm run load:venues
```

## Notes

- The scripts do not modify existing scraper logic.
- The `venues` table migration is in `scripts/migrations/001_create_venues.sql`.
- This pipeline is intended as a replacement for inaccurate scraped venue data, not a removal of the old data.
