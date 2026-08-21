#!/usr/bin/env python3
"""APOGEE — ساخته شده توسط مبین.آ. Cached proxy for live space APIs."""
from __future__ import annotations

import json
import time
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
CACHE: dict[str, tuple[float, bytes]] = {}
PORT = 4173

UA = {"User-Agent": "APOGEE-Range-Control/1.0 (educational dashboard; Mobin.A)"}


def fetch(url: str, timeout: int = 25) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def cached_fetch(key: str, urls: list[str], ttl: int) -> bytes:
    now = time.time()
    hit = CACHE.get(key)
    if hit and now - hit[0] < ttl:
        return hit[1]
    last_err: Exception | None = None
    for url in urls:
        try:
            body = fetch(url)
            CACHE[key] = (now, body)
            return body
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            continue
    if hit:
        return hit[1]
    raise last_err or RuntimeError("fetch failed")


ROUTES: dict[str, tuple[list[str], int]] = {
    "/api/upcoming": (
        [
            "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=20&mode=detailed",
            "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=20",
            "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=20&mode=detailed",
        ],
        180,
    ),
    "/api/previous": (
        [
            "https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=12",
            "https://lldev.thespacedevs.com/2.2.0/launch/previous/?limit=12",
        ],
        180,
    ),
}


def fetch_stations() -> bytes:
    now = time.time()
    hit = CACHE.get("/api/stations")
    if hit and now - hit[0] < 600:
        return hit[1]
    stations = []
    for sid in (4, 18):  # ISS, Tiangong
        raw = cached_fetch(
            f"/api/station/{sid}",
            [
                f"https://ll.thespacedevs.com/2.2.0/spacestation/{sid}/",
                f"https://lldev.thespacedevs.com/2.2.0/spacestation/{sid}/",
            ],
            600,
        )
        stations.append(json.loads(raw))
    body = json.dumps({"stations": stations, "fetched_at": int(now)}).encode()
    CACHE["/api/stations"] = (now, body)
    return body


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def _json(self, code: int, body: bytes):
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/stations":
            try:
                self._json(200, fetch_stations())
            except Exception as exc:  # noqa: BLE001
                self._json(502, json.dumps({"error": str(exc)}).encode())
            return
        if path in ROUTES:
            urls, ttl = ROUTES[path]
            try:
                self._json(200, cached_fetch(path, urls, ttl))
            except Exception as exc:  # noqa: BLE001
                self._json(502, json.dumps({"error": str(exc)}).encode())
            return
        return super().do_GET()

    def log_message(self, fmt, *args):
        print("[apogee]", fmt % args, flush=True)


if __name__ == "__main__":
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"APOGEE range control → http://0.0.0.0:{PORT}", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nrange closed")
