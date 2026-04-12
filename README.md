# MzansiBuilds 🇿🇦

> Build in public. Grow together.

MzansiBuilds is a platform for South African developers to share what they're building, track progress, collaborate with others, and celebrate shipping.

Built for the **Derivco Code Skills Challenge 2026**.

---

## Live Demo

https://Moyantha.github.io/mzansibuilds

---

## Features

- **Account Management** — Register, sign in, manage your developer profile with bio and skills
- **Project Feed** — Post projects with stage and support needed, visible to all developers
- **Live Feed** — See what other developers are building, comment and raise your hand for collaboration
- **Milestones** — Log progress updates on your projects with a visual progress tracker
- **Celebration Wall** — Completed projects and their builders are featured publicly

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | No build tools needed, runs in any browser |
| Storage | localStorage | Client-side persistence without a server |
| Hosting | GitHub Pages | Free static hosting directly from the repo |

---

## Design Theme

Green · White · Black

---

## How To Run

No installation needed. Either:

1. Visit the live site: `https://Moyantha.github.io/mzansibuilds`

Or run locally:

```bash
git clone https://github.com/Moyantha/mzansibuilds.git
cd mzansibuilds
open index.html
```

---

## Project Structure
mzansibuilds/
├── index.html      — Main HTML structure and layout
├── style.css       — All styling and theme variables
├── app.js          — Application logic and functionality
├── README.md       — Project documentation
└── .gitignore      — Files excluded from version control

---

## Known Limitations

- localStorage means each browser has its own data — users cannot see each other's projects across different devices
- Planned backend: Node.js + Express + PostgreSQL for true multi-user support

---

## My Approach

I built this application feature by feature, committing to GitHub after each piece of functionality was working. I used Claude AI as a coding companion to understand concepts and get guidance, but typed all the code myself and made my own decisions about structure and design. Each feature was manually tested before moving to the next one.

---

## Author

Moyantha Ayair — Derivco Code Skills Quest 2026