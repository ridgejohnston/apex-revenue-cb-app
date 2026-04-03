# Apex Revenue — Chaturbate App

Full source code for the **Apex Revenue** CB Developer Portal app (App V2).

## Structure

```
src/
├── common.js              # Shared Code (runs before every event handler)
├── settings.json          # App settings manifest ($settings schema)
└── handlers/
    ├── appstart.js        # App Start handler
    ├── appstop.js         # App Stop handler
    ├── broadcaststart.js  # Broadcast Start handler
    ├── broadcaststop.js   # Broadcast Stop handler
    ├── callback.js        # Callback handler (timers)
    ├── enter.js           # User Enter handler
    ├── fanclubjoin.js     # Fanclub Join handler
    ├── follow.js          # User Follow handler
    ├── leave.js           # User Leave handler
    ├── message.js         # Chat Message handler (/apex commands)
    ├── paneltemplate.js   # Broadcast Panel Update handler
    ├── tip.js             # Tip Received handler
    └── transformmessage.js # Chat Message Transform handler (moderation + styling)
```

## Features

- **Extension Promotion** — onboarding, install guides, and periodic announcements for the Apex Revenue Chrome Extension
- **Tip Tracking** — session stats, top tippers, leaderboards, tip goals with progress bars
- **Chat Moderation** — blocked keywords, spam detection, link filtering, data masking
- **Message Styling** — role-based badges and highlights for owner, mods, fanclub, and tippers
- **Custom Announcements** — themed banners with 7 color themes and recurring banner support
- **Broadcast Panel** — real-time session stats with goal progress display
- **Chat Commands** — `/apex help`, `/apex stats`, `/apex top`, `/apex announce`, and more

## CB Developer Portal

This app is deployed via the [Chaturbate Developer Portal](https://devportal.cb.dev).

- **App ID:** `d24e5989-0000-0000-0000-000000000000`
- **Version:** 1.1.0
