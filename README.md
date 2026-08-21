# APOGEE / اوج

Live space **range control** — upcoming launches, ISS tracking, pad weather, crew on orbit.

**ساخته شده توسط [مبین.آ](https://t.me/MobinA_programs)** · Made by [Mobin.A](https://t.me/MobinA_programs)

Live: **https://pillow1243.github.io/APOGEE/**

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
| Launches, pads, agencies, expeditions | [Launch Library 2](https://thespacedevs.com) |
| Pad weather | [Open-Meteo](https://open-meteo.com) |
| ISS position | [Where The ISS At](https://wheretheiss.at) |

FA / EN toggle in the header. Language is stored in the browser.

## Channel

https://t.me/MobinA_programs
