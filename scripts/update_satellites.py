#!/usr/bin/env python3
"""Refresh Celestrak TLE catalog into data/satellites.json — APOGEE / Mobin.A."""
from __future__ import annotations

import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "satellites.json"
UA = {"User-Agent": "APOGEE-catalog/1.0 (https://github.com/Pillow1243/APOGEE)"}

GROUPS = {
    "stations": "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle",
    "new": "https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle",
}


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=40) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception as exc:  # noqa: BLE001
        print(f"skip {url}: {exc}")
        return ""


def parse_tle(text: str, group: str) -> list[dict]:
    lines = [ln.rstrip() for ln in text.splitlines() if ln.strip()]
    out: list[dict] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("1 ") and i + 1 < len(lines) and lines[i + 1].startswith("2 "):
            name = f"OBJECT {line[2:7].strip()}"
            l1, l2 = line, lines[i + 1]
            i += 2
        elif (
            i + 2 < len(lines)
            and lines[i + 1].startswith("1 ")
            and lines[i + 2].startswith("2 ")
        ):
            name = line[1:].strip() if line.startswith("0 ") else line.strip()
            l1, l2 = lines[i + 1], lines[i + 2]
            i += 3
        else:
            i += 1
            continue
        try:
            norad = int(l1[2:7])
        except ValueError:
            continue
        out.append({"id": norad, "name": name, "group": group, "l1": l1.strip(), "l2": l2.strip()})
    return out


def main() -> None:
    by_id: dict[int, dict] = {}
    for group, url in GROUPS.items():
        text = fetch_text(url)
        if not text or "<html" in text[:80].lower():
            print(f"{group}: empty")
            continue
        rows = parse_tle(text, group)
        print(f"{group}: {len(rows)}")
        for row in rows:
            nid = row["id"]
            if nid in by_id and by_id[nid]["group"] == "stations":
                continue
            by_id[nid] = row
    sats = list(by_id.values())
    if not sats:
        print("kept previous catalog — fetch empty")
        return
    sats.sort(key=lambda s: (0 if s["group"] == "stations" else 1, s["name"]))
    payload = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "Celestrak TLE",
        "count": len(sats),
        "sats": sats,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":"), ensure_ascii=True), encoding="utf-8")
    print(f"wrote {OUT} ({len(sats)} objects)")


if __name__ == "__main__":
    main()
