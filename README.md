# APOGEE / اوج

Live space **range control** — upcoming launches, ISS tracking, pad weather, crew on orbit.

**ساخته شده توسط [مبین.آ](https://t.me/MobinA_programs)** · Made by [Mobin.A](https://t.me/MobinA_programs)

Live: **https://pillow1243.github.io/APOGEE/**

## What's new (v2 upgrade)

- **Command palette** — `Ctrl/⌘ K` jumps to any launch, satellite, or action (theme, language, fly-to, share, …) with fuzzy search.
- **Keyboard shortcuts** — press `?` for the full sheet: `/` search, `↑↓/J K` move, `S` share, `F` save, `G` spin, `P` fly to pad, `I` fly to satellite, `R` reminder, `T` theme, `1–4` tabs, `W` webcast.
- **Launch reminders** — arm a reminder on any launch (bell button or `R`); the browser notifies you at T−1h, T−10min, and liftoff.
- **Orbit telemetry** — live altitude, velocity, lat/lng, orbital period, and footprint radius for the tracked satellite.
- **Fixed: live satellites actually move now** — the catalog loader and SGP4 propagation were broken (wrong library API check and `Date` handling); positions are again computed every second in the browser.
- **Connection banner** — clear offline/online status instead of silent failures.
- **Refreshed design** — starfield backdrop, glass panels, accent glows, custom scrollbars, focus rings, `prefers-reduced-motion` support, and theme-aware colors.

## Run locally

```bash
python3 server.py
```

Then open `http://localhost:4173`.

The Python server is an optional cache/proxy. GitHub Pages uses the public APIs directly.

## Live satellites

Positions are computed **every second in the browser** from NORAD TLEs (Celestrak).

The **repo catalog** (`data/satellites.json`) refreshes automatically every 30 minutes via GitHub Actions — space stations (ISS, Tiangong, …) plus Celestrak `tle-new` (recently launched objects). Committing every second would burn GitHub; NORAD elements only change a few times a day. The globe still moves in real time.

## Data

| Feed | Source |
|---|---|
| Launches, pads, agencies, expeditions, events | [Launch Library 2](https://thespacedevs.com) |
| Pad weather | [Open-Meteo](https://open-meteo.com) |
| ISS position | [Where The ISS At](https://wheretheiss.at) |
| Space weather | [NOAA SWPC](https://www.swpc.noaa.gov) |
| Space news | [Spaceflight News API](https://spaceflightnewsapi.net) |
| Astronomy picture | [NASA APOD](https://apod.nasa.gov) |
| ISS pass / moon | computed in-browser from NORAD TLEs |

FA / EN toggle in the header. Language is stored in the browser.

## Channel

https://t.me/MobinA_programs
