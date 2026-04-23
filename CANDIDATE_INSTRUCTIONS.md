# Next.js Skill Test — Candidate Instructions

Welcome! This is a small Employee Hire Management application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

The codebase contains **10 intentional bugs** ranging from easy to hard.  
Your job is to **find, explain, and fix** as many as you can.

---

## Getting Started

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
app/
  page.tsx                    # Dashboard with stats
  employees/
    page.tsx                  # Employee list (search, filter, paginate)
    [id]/page.tsx             # Employee detail
  api/
    employees/route.ts        # GET list + POST create
    employees/[id]/route.ts   # GET one + PATCH + DELETE
    stats/route.ts            # Stats summary
components/
  SearchBar.tsx
  EmployeeCard.tsx
  StatsWidget.tsx
  Pagination.tsx
  EmployeeForm.tsx
hooks/
  useEmployees.ts
lib/
  data.ts                     # In-memory data store
types/
  index.ts
```

---

## Your Task

1. **Explore** the app — open each page, use every feature (search, filter, paginate, add, view detail).
2. **Identify** each bug: note the file, line, and a clear description of the problem.
3. **Fix** each bug with the minimal correct change.
4. **Document** your findings using the Use Case format below (see `USE_CASES.md` for the template and the first worked example).

---

## Evaluation Criteria

| Area | Weight |
|------|--------|
| Number of bugs found | 30% |
| Correctness of each fix | 30% |
| Clarity of explanation in Use Cases | 25% |
| Code quality of the fix | 15% |

---

## Rules

- Do **not** install additional packages.
- Fixes must be minimal — do not refactor unrelated code.
- You may add `console.log` statements to investigate, but remove them before submitting.
- Submit your work as a zip or git repository with your filled-in `USE_CASES.md`.

---

## Hints

- Some bugs crash the page; some produce wrong data silently.
- There is at least one bug in every layer: API routes, data layer, React hooks, components, and server-side rendering.
- Pay attention to browser DevTools console warnings — React prints most hook rule violations there.

Good luck!
