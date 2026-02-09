---

<div align="center">
    <h2>Meet the Team</h2>
    <a href="https://github.com/alimleahat" target="_blank">
        <img src="https://github.com/alimleahat.png" width="100" style="border-radius:50%" alt="alimleahat"/>
        <br><sub><b>alimleahat</b></sub>
    </a>
    &nbsp;&nbsp;&nbsp;
    <a href="https://github.com/Frenchtoastbuns" target="_blank">
        <img src="https://github.com/Frenchtoastbuns.png" width="100" style="border-radius:50%" alt="Frenchtoastbuns"/>
        <br><sub><b>Frenchtoastbuns</b></sub>
    </a>
</div>

---


# Leeds Hack 2026: Project Wrap-Up

<div align="center">
    <img src="https://img.shields.io/badge/LeedsHack-2026-blueviolet?style=for-the-badge" alt="LeedsHack 2026"/>
    <img src="https://img.shields.io/badge/Status-Shelved-inactive?style=for-the-badge&color=lightgrey" alt="Project Status"/>
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome"/>
    <img src="https://img.shields.io/badge/Made%20with-React-blue?style=for-the-badge&logo=react" alt="React"/>
    <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" alt="Node.js"/>
    <img src="https://img.shields.io/badge/AI-Gemini-blueviolet?style=for-the-badge" alt="Gemini AI"/>
    <br><br>
    <img src="https://raw.githubusercontent.com/ahmad/example-assets/main/haven-banner.png" alt="Haven Flood Response Banner" width="80%"/>
    <br><br>
    <img src="https://raw.githubusercontent.com/ahmad/example-assets/main/gemini-usage-pie.png" alt="42% of code written with Gemini AI" width="300"/>
    <br>
    <sub><i>Portions of this project were built with the help of AI tools, including Gemini.</i></sub>
</div>


# Leeds Hack 2026: Project Wrap-Up

## Haven — Community Flood Response

**Built in 21 hours. Shelved with pride.**

---

### What is this?

This repo contains our final hackathon build for Leeds Hack 2026. Haven is a real-time, people-powered flood response platform. It lets anyone report incidents, request or offer help, and find safe routes to shelter — all on a live map, powered by a modern stack and a dash of AI.

---

### Why did we build it?

Floods move fast. Official alerts don’t. We wanted to flip the script: make every phone a sensor and a responder, so communities can help themselves when it matters most.

---

### What’s inside?

- **Live incident map:** See and report floods, blocked roads, and power outages in real time.
- **Mutual aid:** Post “I need help” or “I can help” pins for anything from sandbags to shelter.
- **AI triage:** Gemini tags, summarizes, and redacts reports, keeping info clear and safe.
- **Safe routing:** Combines Google Directions, Environment Agency data, and community reports, then asks Gemini to pick the safest route to shelter — and explain why.

---

### How does it work?

- **Frontend:** React + Vite + Leaflet, with a focus on speed and clarity in emergencies.
- **Backend:** Node.js + Express + MongoDB Atlas, with geospatial queries for fast, location-based results.
- **AI:** Gemini API for tagging, summarizing, and safe routing decisions.

---

### Running locally

1. Clone the repo
2. `cd server && cp .env.example .env` (add your keys)
3. `npm install && npm run dev` (in server)
4. `cd ../client && npm install && npm run dev`
5. Frontend: [localhost:5173](http://localhost:5173), API: [localhost:5000](http://localhost:5000)

---

### Team & Thanks

Three of us built this in a single weekend. One wrangled the backend and database, one crafted the frontend, and one stitched together the AI and routing magic. Thanks to Leeds Hack, the mentors, and everyone who cheered us on!

---

### What’s next?

This project is now shelved, but the code is here for anyone who wants to build on it — add ML-based flood prediction, dashboards, mobile support, or anything else. We hope it sparks ideas for tech that helps real people.

---

**Built at Leeds Hack 2026 — Theme: Systems Rebooted**

<div align="right">
    <sub><i>Acknowledgement to Claude AI for additional debugging support.</i></sub>
</div>