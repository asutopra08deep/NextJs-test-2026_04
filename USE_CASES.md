# Use Case Document — Bug Fix Reports

Fill in one section per bug you find. A completed example (BUG-001) is provided as a reference.

---

## Use Case Format Template

```
### BUG-XXX: [Short Title]

| Field        | Detail |
|--------------|--------|
| Severity     | Critical / High / Medium / Low |
| File         | path/to/file.tsx |
| Line(s)      | L00–L00 |
| Area         | React Hooks / API / Rendering / SSR / TypeScript / Data Layer |

**Problem**
What is wrong and why does it matter? What symptom does the user see?

**Root Cause**
The underlying technical reason the bug exists.

**Fix**
Describe the change in plain English before showing code.

**Before (broken)**
\```tsx
// paste the broken code snippet
\```

**After (fixed)**
\```tsx
// paste the corrected code snippet
\```

**Tools / References Used**
- React docs: https://react.dev/...
- Any DevTools steps, console output, or network tab evidence you used to locate the bug
```

---

## Worked Example

### BUG-001: Stale Closure in SearchBar Debounce

| Field        | Detail |
|--------------|--------|
| Severity     | Medium |
| File         | `components/SearchBar.tsx` |
| Line(s)      | L14–L20 |
| Area         | React Hooks |

**Problem**
The search debounce stops working correctly after the parent component re-renders with a new `onSearch` callback. The component keeps calling the old version of `onSearch` (captured at first render), so search results are filtered against a stale state. Users may notice that filtering appears to stop responding.

**Root Cause**
`useEffect` closes over the `onSearch` prop at the time it runs. Because `onSearch` is not listed in the dependency array, React never re-runs the effect when a new `onSearch` is passed in. The debounce timer always fires the original function reference.

**Fix**
Add `onSearch` to the `useEffect` dependency array. The `// eslint-disable-line` suppression comment that was hiding this warning should be removed at the same time.

**Before (broken)**
```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(query);
  }, 500);
  return () => clearTimeout(timer);
}, [query]); // eslint-disable-line react-hooks/exhaustive-deps
```

**After (fixed)**
```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(query);
  }, 500);
  return () => clearTimeout(timer);
}, [query, onSearch]);
```

**Tools / References Used**
- Observed via React DevTools Profiler: `onSearch` prop changed on re-render but the effect did not re-run.
- React docs — useEffect dependencies: https://react.dev/learn/synchronizing-with-effects#specifying-reactive-dependencies
- ESLint rule: `react-hooks/exhaustive-deps`

---

## Candidate Submissions

> Fill in your bug reports below. Copy the template for each bug you find.

### BUG-002: [Your Title Here]

| Field        | Detail |
|--------------|--------|
| Severity     |  |
| File         |  |
| Line(s)      |  |
| Area         |  |

**Problem**


**Root Cause**


**Fix**


**Before (broken)**
```tsx

```

**After (fixed)**
```tsx

```

**Tools / References Used**
-

---

### BUG-003: [Your Title Here]

| Field        | Detail |
|--------------|--------|
| Severity     |  |
| File         |  |
| Line(s)      |  |
| Area         |  |

**Problem**


**Root Cause**


**Fix**


**Before (broken)**
```tsx

```

**After (fixed)**
```tsx

```

**Tools / References Used**
-

---

### BUG-004: [Your Title Here]

*(continue for each bug you find)*

---

# Answer Key (Interviewer Reference — Do Not Share)

| ID | Title | File | Difficulty |
|----|-------|------|------------|
| BUG-001 | Stale closure in SearchBar debounce | `components/SearchBar.tsx` L14 | Medium |
| BUG-002 | setInterval stale state — counter stuck at 1 | `components/StatsWidget.tsx` L29 | Medium |
| BUG-003 | Array index used as React key in skills list | `components/EmployeeCard.tsx` L40 | Low |
| BUG-004 | Race condition — no AbortController in fetch | `hooks/useEmployees.ts` L38 | Hard |
| BUG-005 | Math.floor instead of Math.ceil in Pagination | `components/Pagination.tsx` L10 | Easy |
| BUG-006 | API handler named PATCH, client sends PUT | `app/api/employees/[id]/route.ts` L26 | Medium |
| BUG-007 | POST returns 200 instead of 201 Created | `app/api/employees/route.ts` L54 | Easy |
| BUG-008 | Case-sensitive search filter | `app/api/employees/route.ts` L17 | Easy |
| BUG-009 | Direct array mutation in addEmployee() | `lib/data.ts` L52 | Medium |
| BUG-010 | Mixed controlled/uncontrolled input in form | `components/EmployeeForm.tsx` L62 | Medium |
| BUG-011 | localStorage access during SSR crashes server | `app/employees/[id]/page.tsx` L16 | High |
| BUG-012 | No null check on employee.department.name | `components/EmployeeCard.tsx` L19 | Easy |

---

## Scoring Guide (Interviewer)

| Score | Meaning |
|-------|---------|
| 10–12 bugs found + correct fixes + clear explanations | Exceptional — strong senior hire |
| 7–9 | Strong — solid mid-level developer |
| 4–6 | Good — junior with React experience |
| 1–3 | Needs mentoring |

**Bonus points:**
- Candidate notes the interaction between BUG-009 (server-side mutation) and BUG-007 (wrong status code) that makes the POST flow doubly broken.
- Candidate proposes adding an AbortController AND moving to React Query / SWR for BUG-004.
- Candidate adds an Error Boundary around the employee list for resilience.
