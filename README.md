POST /analyze
      │
      ▼
┌─────────────────────────────────────────────────┐
│                  Orchestrator                   │
│                                                 │
│  ①  Quality Assessor                           │
│      → Score (1–5) + Attack Intensity          │
│                                                 │
│  ②  Assumption Scanner  ──┐  (concurrent)      │
│  ③  Steelman Generator  ──┘                    │
│                                                 │
│  ④  Formatter                                  │
│      → Verdict + Summary                       │
│                                                 │
│  ⑤  Persist → SQLite                          │
└─────────────────────────────────────────────────┘
      │
      ▼
  JSON Response
