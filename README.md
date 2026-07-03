# Ethical Ticket System 🎟️

A small web app that predicts a **fair discount %** for a ticket, using a machine learning model — and then double-checks that prediction with plain-English "ethical" rules so no one gets an unfair or exploitable discount.

You type in 4 numbers on a webpage, click a button, and get back a discount percentage plus an explanation of how it was decided.

---

## What's actually happening here (plain English)

There are **two small programs** that need to run at the same time:

1. **The brain** (Python) — loads the trained ML model and does the math. Lives on your computer at `http://localhost:8000`.
2. **The face** (Next.js/React) — the webpage you actually click around in. Lives at `http://localhost:3000`.

The webpage never talks to the brain directly — it politely asks its own server to relay the message. You don't need to understand why yet, just know: **both need to be running, in two separate terminals, at the same time.**

---

## ⚙️ Setup (do this once)

This assumes:
- You're on a **Mac**.
- You already have **VS Code** installed and this project folder opened in it.
- You have **Python 3** and **Node.js** installed. (If you're not sure, run `python3 --version` and `node --version` in a terminal — if you see version numbers, you're good. If you get "command not found", install them from [python.org](https://www.python.org/downloads/) and [nodejs.org](https://nodejs.org/) first.)

### Step 1 — Open a terminal inside VS Code

In VS Code, go to the top menu: **Terminal → New Terminal**. A terminal panel opens at the bottom, already pointed at this project folder. You'll use this same trick to open a **second** terminal later.

### Step 2 — Set up the Python side ("the brain")

In your first terminal, paste these commands **one at a time** (press Enter after each):

```bash
python3 -m venv .venv
```
This creates a private, self-contained Python environment just for this project, so it doesn't mess with anything else on your Mac.

```bash
source .venv/bin/activate
```
This "switches on" that environment. You'll know it worked because you'll see `(.venv)` appear at the start of your terminal line.

```bash
pip install fastapi uvicorn pydantic pandas scikit-learn joblib
```
This installs everything the Python brain needs to run.

> ⚠️ **Note:** There's a `requirements.txt` file in this folder, but it's a messy leftover from development (it's missing some required packages and is in the wrong text format). **Ignore it** — the command above is the correct, minimal install.

### Step 3 — Set up the frontend ("the face")

You need a **second terminal** for this, because the brain and the face run separately.

In VS Code, open a new terminal: **Terminal → New Terminal** (or click the `+` icon in the terminal panel). In this new terminal, move into the `frontend` folder and install its dependencies:

```bash
cd frontend
npm install
```

This downloads everything the webpage needs (React, Next.js, etc). It may take a minute — that's normal.

✅ **Setup is done!** You now have two terminals: one for the brain (project root, `.venv` activated), one for the face (`frontend/` folder).

---

## ▶️ Running the app (do this every time)

**Terminal 1** (the one where you ran `source .venv/bin/activate` — should still be in the **project root folder**, not `frontend`):

```bash
uvicorn api.main:app --reload
```

**Terminal 2** (the one inside the `frontend` folder):

```bash
npm run dev
```

Now open your browser and go to:

```
http://localhost:3000
```

Fill in the form and click the button — you'll get back a discount percentage.

To stop either server, click into its terminal and press `Control + C`.

---

## 🩹 Troubleshooting

- **"command not found: python3" or "command not found: node"** → You need to install Python and/or Node.js first (see links above), then restart your terminal.
- **"command not found: uvicorn"** → You forgot to run `source .venv/bin/activate` in that terminal first, or you're not in the project root folder.
- **Nothing happens when you click the button on the webpage** → Check Terminal 1 — is the Python server still running without errors? Both servers must be running at the same time.
- **"Port already in use"** → Something is already using port 8000 or 3000. Close old terminal windows running this project and try again, or restart your Mac if it persists.
- **Every time you open a new terminal for the Python side**, you need to run `source .venv/bin/activate` again before `uvicorn` will work. It only stays "on" for that terminal session.

---

## 📁 Project structure

```
Ethical_ticket_system/
├── api/
│   └── main.py                        ← Python/FastAPI server — loads the ML model, applies fairness rules
├── ethical_discount_model_v1.joblib   ← the pre-trained ML model file
├── script.py                          ← the code that originally trained the model
├── frontend/
│   ├── package.json
│   └── app/
│       ├── page.tsx                   ← the webpage/form you interact with
│       └── api/predict/route.ts       ← relays your form data to the Python server
└── README.md                          ← you are here
```

---

## 🧠 How it works, step by step

1. You fill out a form on the webpage (distance, loyalty index, attendance rate, scarcity) and click **Get Discount**.
2. The webpage sends that data to its own Next.js server (`/api/predict`) — never straight to Python. This avoids browser security errors and keeps the Python server private.
3. The Next.js server forwards the data to the Python server at `http://localhost:8000/predict`.
4. The Python server checks the data is valid, then feeds it into the trained ML model, which spits out a raw discount score.
5. That raw score is passed through a few **fairness/"ethical" rules** before it's allowed to reach you:
   - If attendance rate is below 40%, the discount is forced to **0%** — no exceptions.
   - If attendance rate is below 60% **and** loyalty index is high, that looks like a scalper pattern, so discount is forced to **0%**.
   - No discount is ever allowed above **50%**, even if the model suggests more.
   - Negative discounts are floored to **0%**.
   - Every one of these decisions is recorded as a plain-English note, so nothing is a "black box."
6. The final discount % and the explanation travel back through Next.js to your browser, and the page updates with the result.

That's the whole system: **a model makes a guess, and a set of simple human-readable rules keep that guess honest.**
