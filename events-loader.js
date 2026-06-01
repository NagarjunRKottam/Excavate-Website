/**
 * Excavate — Events Loader
 * Fetches event data from Google Sheets (gviz endpoint, no API key needed).
 * Falls back to localStorage cache, then to hardcoded defaults.
 *
 * Config key in localStorage: 'excavate-sheet-id'
 * Data cache key in localStorage: 'excavate-events'
 */

(function (global) {
  'use strict';

  const CACHE_KEY   = 'excavate-events';
  const SHEET_KEY   = 'excavate-sheet-id';
  const CACHE_TTL   = 5 * 60 * 1000; // 5 minutes
  const CACHE_TS_KEY = 'excavate-events-ts';

  const DEFAULTS = {
    sports_games: [
      { league: 'NFL',    time: 'Sunday 1 PM',   home: 'Cowboys',   away: 'Eagles',   screen: 'Main wall · All 20 screens', live: true  },
      { league: 'NBA',    time: 'Mon 7:30 PM',   home: 'Mavs',      away: 'Lakers',   screen: 'East wall',                  live: false },
      { league: 'Soccer', time: 'Tue 2:30 PM',   home: 'Club A',    away: 'Club B',   screen: 'Booths 4–6',                 live: false },
      { league: 'UFC',    time: 'Sat 10 PM',      home: 'Main Card', away: 'PPV',      screen: 'Reserve VIP',                live: false },
    ],
    sports_parties: [
      { title: 'Sunday Funday Watch Party',    badge: 'Every Sunday',    desc: 'Every Sunday · 11 AM to close · All NFL games on every screen · Game-Day Menu specials.' },
      { title: 'Monday Night Football',        badge: 'Every Monday',    desc: 'Every Monday · 7 PM · Main wall takeover · Wing specials · Bucket of 6 for $25.' },
      { title: 'Fight Night (UFC PPV)',        badge: 'Select Saturdays',desc: 'Select Saturdays · $15 cover or FREE with VIP reservation.' },
      { title: 'Championship Viewing Parties', badge: 'Special Events',  desc: 'Super Bowl, NBA Finals, World Series, World Cup · Private events · Book your crew.' },
    ],
    lounge_events: [
      { night: 'Every Wednesday', title: 'Ladies Night',   desc: 'Complimentary hookah for the first hour. Curated cocktail menu. Your night, your rules.', detail: 'Starts 9 PM',                   featured: false },
      { night: 'Sun – Thu',       title: 'Happy Hour',     desc: 'Hookahs at $21.99. The perfect weeknight escape.',                                        detail: '4 PM – 6 PM · $21.99 Hookahs', featured: true  },
      { night: 'Every Weekend',   title: 'Weekend Vibes',  desc: "Live DJ sets, elevated cocktail menu, and the city's best hookah experience.",             detail: 'Fri & Sat from 10 PM',         featured: false },
    ],
    dj_nights: [
      { day: 'Thursday', title: 'R&B & Afrobeats',       desc: '10 PM – 2 AM · Live DJ · Lounge takes over after halftime ends.' },
      { day: 'Friday',   title: 'Deep House & Amapiano', desc: '11 PM – 2 AM · Rotating residents · No cover before 10 PM.' },
      { day: 'Saturday', title: 'Hip-Hop & Throwbacks',  desc: '11 PM – 2 AM · Guest DJs · Bottle specials till midnight.' },
      { day: 'Sunday',   title: 'Slow Burn',             desc: '9 PM – close · Ambient / chill playlist · Extended hookah menu.' },
    ],
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const DEFAULT_SHEET_ID = '1ETlWFexN7OTMfEpoOtaWvasQfgFh_jVvPbp1f4ijjTw';

  function getSheetId() {
    try { return localStorage.getItem(SHEET_KEY) || DEFAULT_SHEET_ID; } catch { return DEFAULT_SHEET_ID; }
  }

  function readCache() {
    try {
      const ts   = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
      const data = localStorage.getItem(CACHE_KEY);
      if (data && Date.now() - ts < CACHE_TTL) return JSON.parse(data);
    } catch {}
    return null;
  }

  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
    } catch {}
  }

  // ── Google Sheets gviz parser ──────────────────────────────────────────────
  // URL: https://docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:json&sheet={TAB}

  async function fetchTab(sheetId, tabName) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    // Strip Google's JS wrapper: /*O_o*/\ngoogle.visualization.Query.setResponse(...);
    const json = JSON.parse(text.replace(/^[^{]*/, '').replace(/\);?\s*$/, ''));
    const cols  = json.table.cols.map(c => c.label.trim());
    return (json.table.rows || [])
      .filter(row => row && row.c && row.c.some(c => c && c.v != null))
      .map(row => {
        const obj = {};
        row.c.forEach((cell, i) => {
          if (cols[i]) obj[cols[i]] = cell ? (cell.v != null ? cell.v : (cell.f || '')) : '';
        });
        return obj;
      });
  }

  function parseBool(v) {
    if (typeof v === 'boolean') return v;
    return String(v).toLowerCase() === 'true' || v === 1 || v === '1';
  }

  async function fetchAllSheets(sheetId) {
    const [games, parties, lounge, dj] = await Promise.all([
      fetchTab(sheetId, 'sports_games'),
      fetchTab(sheetId, 'sports_parties'),
      fetchTab(sheetId, 'lounge_events'),
      fetchTab(sheetId, 'dj_nights'),
    ]);

    return {
      sports_games:   games.map(r => ({ league: r.league, time: r.time, home: r.home, away: r.away, screen: r.screen, live: parseBool(r.live) })),
      sports_parties: parties.map(r => ({ title: r.title, badge: r.badge, desc: r.desc })),
      lounge_events:  lounge.map(r => ({ night: r.night, title: r.title, desc: r.desc, detail: r.detail, featured: parseBool(r.featured) })),
      dj_nights:      dj.map(r => ({ day: r.day, title: r.title, desc: r.desc })),
    };
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * loadEvents()
   * Returns a Promise<data> — tries Sheets → cache → defaults in that order.
   * Callers should handle the data in .then() or await.
   */
  async function loadEvents() {
    const sheetId = getSheetId();

    if (sheetId) {
      // Try cache first (avoids hammering Sheets on every page load)
      const cached = readCache();
      if (cached) return cached;

      try {
        const data = await fetchAllSheets(sheetId);
        writeCache(data);
        return data;
      } catch (err) {
        console.warn('[Excavate] Sheets fetch failed, using cached/defaults:', err.message);
      }
    }

    // Fall back to localStorage cache (possibly from admin saves)
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}

    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  /**
   * forceFetch(sheetId)
   * Bypasses cache — used by admin to test connection.
   */
  async function forceFetch(sheetId) {
    const data = await fetchAllSheets(sheetId);
    writeCache(data);
    return data;
  }

  global.ExcavateEvents = { loadEvents, forceFetch, getSheetId, DEFAULTS };

})(window);
