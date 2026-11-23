# cohort-10-java-19228-uqbah
Cohort 10 — JAVA Fullstack (JAVA+ReactJS) assignment for Uqbah

## Project structure

```
/backend    Express + MongoDB API (port 3600)
/frontend   React + Vite client
```

## Running the backend

```bash
pnpm install
cp backend/.env.example backend/.env   # then fill in values
pnpm dev
```

### Auth API

| Method | Route         | Auth   |
|--------|---------------|--------|
| POST   | /api/signup   | —      |
| POST   | /api/login    | —      |
| POST   | /api/logout   | Bearer |
| GET    | /api/me       | Bearer |
