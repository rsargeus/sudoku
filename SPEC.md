# Sudoku MVP — Tech Spec

## Stack

| Layer | Val | Motivering |
|---|---|---|
| UI | Vanilla TypeScript + HTML/CSS | Inga onödiga beroenden, snabb laddningstid |
| Build | Vite | Enkel setup, snabb HMR, bra Cloudflare-integration |
| Hosting | Cloudflare Pages | Gratis, global CDN, enkel deploy från git |
| Framtida backend | Cloudflare Workers + D1 | Naturlig migration när login/DB behövs |

---

## Projektstruktur

```
sudoku/
├── src/
│   ├── engine/
│   │   ├── generator.ts     # Generera löst bräde (backtracking)
│   │   ├── solver.ts        # Validera & lösa pussel
│   │   └── difficulty.ts    # Ta bort celler baserat på svårighet
│   ├── ui/
│   │   ├── board.ts         # Rendera & hantera 9x9-grid
│   │   ├── controls.ts      # Knappar, sifferpanel, anteckningar
│   │   └── timer.ts         # Stoppur
│   ├── state.ts             # Spelstatus (localStorage för sparad progress)
│   ├── main.ts              # Entry point
│   └── style.css
├── index.html
├── vite.config.ts
└── wrangler.toml            # Cloudflare Pages config
```

---

## Svårighetsgrader

| Nivå | Antal givna celler | Unika lösningar |
|---|---|---|
| Nybörjare | 50–55 | Ja |
| Lätt | 40–49 | Ja |
| Medel | 32–39 | Ja |
| Svår | 26–31 | Ja |
| Expert | 22–25 | Ja |

Algoritm: Generera ett komplett bräde → ta bort celler symmetriskt → verifiera att exakt en lösning finns kvar (backtracking solver).

---

## Features MVP

- [x] Spelbart 9x9 Sudoku-bräde
- [x] 5 svårighetsgrader
- [x] Markering av fel (valfritt: kan stängas av)
- [x] Anteckningsläge (pencil marks)
- [x] Stoppur
- [x] "Nytt spel" och "Ge upp" (visa lösning)
- [x] Sparad progress i `localStorage` (överlever omladdning)
- [x] Mobilanpassad (touch-input)

---

## Framtida expansion (utanför MVP)

- Cloudflare D1 (SQLite) för highscores/statistik
- Cloudflare Workers för auth (eller Cloudflare Access)
- Dagliga pussel (seeded generator)
