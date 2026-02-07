# Flood-LeedsHack2026

Reboots crisis info from top-down announcements to bottom-up, real-time community signals.


Title & tagline

“FloodSafe – Community incident map and AI‑guided safe routing.”

Overview

3–5 lines: what it does, who it’s for, high‑level architecture.

Features

Bullet list: incident pins, need help/can help pins, safe route button, dangerScore, Gemini explanation.

Architecture

Short diagram or text explaining:

React client → Express API → MongoDB Atlas → Google Directions + Gemini + flood data.

Setup instructions

Server:

bash
cd server
cp .env.example .env    # fill keys
npm install
npm run dev
Client:

bash
cd client
npm install
npm run dev
Default URLs (e.g. client on http://localhost:5173, server http://localhost:3000).

Tech stack

React, React‑Leaflet, Express, MongoDB Atlas, Google Directions API, Gemini.

Team

Names + roles:

Person A – Backend Core.

Person B – Frontend + Maps.

Person C – Routing Logic + AI.

Demo

How to trigger a quick scenario:

“1. Start server & client. 2. Open app, post a couple of incidents. 3. Click ‘Safe route to shelter’ to see routing and explanation.”



/docs folder:

Simple architecture diagram (PNG or draw.io file).

Notes on dangerScore formula and flood‑risk data source.

/scripts folder:

Seed scripts for shelters and sample incidents.