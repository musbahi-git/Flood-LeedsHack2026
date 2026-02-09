
# Leeds Hack 2026: Project Wrap-Up

This repository contains our final submission for Leeds Hack 2026. Over an intense 21 hours, our team built a working, deployable platform to help communities respond to flash floods in real time. We’re proud to have delivered a solution that’s not just a prototype, but something that could genuinely make a difference if taken further.

---

## What We Built

- **Live incident reporting:** A Waze-style map for flooding, letting anyone report hazards, ask for help, or offer support. Reports are matched by location and type (e.g., “I need help”/“I can help” for lifts, shelter, food, etc.).
- **Peer-to-peer support:** Direct mutual aid between neighbours, inspired by PwC’s call for community impact and collaboration.
- **AI-powered triage:** Gemini AI tags, summarizes, redacts PII, and flags unsafe content in reports, helping keep information clear and safe.
- **Safe routing:** Combines Google Directions, Environment Agency flood data, and community reports, then asks Gemini to pick and explain the safest route to shelter.

---

## Why It Matters

Official alerts are slow. Floods move fast. Our system flips the script: every phone becomes a sensor and a responder, creating a real-time, people-powered map of what’s happening on the ground. It’s about getting the right help to the right place, fast.

---

## Hackathon Highlights

- **Collaboration:** We designed matching rules, coordinated flows, and focused on user experience.
- **Responsible AI:** PII redaction and explicit hand-off for dangerous content, in line with responsible design principles.
- **Technical depth:** Modern stack, geospatial queries, and meaningful AI integration.

---

## Next Steps

This project is now shelved, but the codebase is ready for anyone who wants to take it further—whether that’s adding ML-based flood prediction, building an authority dashboard, or launching a mobile app. We hope it inspires others to build tech that matters.

---

Incident reporting + live map
(Waze-like wizard to report local issues) “I need help” / “I can help” flows with matching by location and type (lift, dry space, food)

PwC:

“Enable peer‑to‑peer support or collaboration” – direct mutual aid between neighbours.

“Community impact” – concrete support: getting someone to safety or giving them a place to work.

Systems Rebooted: Shows collaboration and “development of new skills” (coordinating, designing matching rules) and strong user‑experience thinking.

AI (Gemini) – tagging, summaries, redaction, safety
Feature:

Auto‑categorise reports, generate area summaries, redact PII, flag unsafe wording.


Routing to shelter        

Matches:

MLH – Best Use of Gemini API:

“Analyze info like a supercomputer and create an app that summarizes complex information” – situation summaries from many reports.​

“Understand language like a human” – tagging and PII‑cleaning of free text.​

PwC:

“AI effectiveness – clear, appropriate use of AI where it adds value” – AI helps triage and summarise, not replace humans.​

“Responsible design – data privacy and responsible AI use” – PII redaction and explicit hand‑off for dangerous content.​

Parallax: AI can help cluster historical data and generate human‑readable explanations of predictions.​

Overall – Systems Rebooted: “Use of relevant tools” + “solid technical implementation” by integrating a modern AI API meaningfully.