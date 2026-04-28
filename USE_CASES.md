# Resolved Bugs Documentation

### Issue Title: BUG-001 - Stale Closure on Debounce Timer

**Where You Found It:** `components/SearchBar.tsx` (Line 16)
**What the Problem Was:** The search bar has a delay (debounce) before searching. But the `useEffect` that handles this delay was missing `onSearch` in its dependency array. Because of this, it was keeping an old version of the `onSearch` function in its memory, which could cause the search to behave weirdly or not use the latest data.
**How You Fixed It:** I added `onSearch` into the dependency array `[query, onSearch]`. I also removed the ESLint disable comment because fixing the dependencies resolved the warning properly.
**All Steps You Took:**

1. I opened the file and read the `⚠ BUG-001` comment left in the code.
2. I noticed the ESLint warning suppression comment.
3. I wasn't entirely sure how the missing dependency breaks the debounce, so I asked an AI to explain the "stale closure" concept.
4. After understanding it, I added `onSearch` to the array and tested the search bar to ensure it still worked smoothly.
   **Tools & Resources Used:** VS Code, ESLint warnings.
   **AI Usage:** \* **Which AI tool you used:** Google Gemini

- **The exact prompt you typed:** "In React, I have a useEffect for a search debounce timer. It only has `[query]` in the dependencies. There's a comment saying `onSearch` is missing and causes a stale closure. Can you explain what this means in simple terms and how to fix it?"
- **The exact response you received:** The AI explained that without `onSearch` in the array, the `useEffect` remembers the very first version of the function. It advised adding `onSearch` to the array to keep it updated.
- **Whether you used it as-is or modified it, and how:** I modified the code myself based on the AI's explanation by adding `onSearch` to the array and deleting the disable comment.

---

### Issue Title: BUG-002 - Timer Stuck at 1s

**Where You Found It:** `components/StatsWidget.tsx` (Line 23)
**What the Problem Was:** The dashboard has a "Time on page" counter, but it was just stuck at "1s" and never went up. The `setInterval` was always calculating `0 + 1` because the state was trapped at its initial value (`0`) inside the `useEffect`.
**How You Fixed It:** I changed `setSecondsOnPage(secondsOnPage + 1)` to `setSecondsOnPage(prev => prev + 1)`. This tells React to take whatever the _current_ value is and add 1 to it.
**All Steps You Took:**

1. I saw the timer stuck at 1s on the live Dashboard.
2. I opened `StatsWidget.tsx` and found the `setInterval` code.
3. I read the developer's comment about it being a "stale closure".
4. I searched on Google/AI for how to update intervals in React correctly.
5. Implemented the functional state update and watched the UI to confirm it was ticking correctly.
   **Tools & Resources Used:** Chrome Browser, VS Code.
   **AI Usage:**

- **Which AI tool you used:** Google Gemini
- **The exact prompt you typed:** "My React setInterval is stuck at 1. It looks like this: `setSecondsOnPage(secondsOnPage + 1)`. How do I fix it?"
- **The exact response you received:** The AI suggested using the functional updater form `setSecondsOnPage(prev => prev + 1)` so it doesn't rely on the outer scope variable.
- **Whether you used it as-is or modified it, and how:** I used the snippet provided by the AI as-is.

---

### Issue Title: BUG-003 - Using Array Index as React Keys

**Where You Found It:** `components/EmployeeCard.tsx` (Line 42)
**What the Problem Was:** The code was rendering a list of employee skills using `.map()`, and it was using the array `index` as the `key`. I know from basic React tutorials that using indices as keys is a bad practice because if the list changes, React gets confused and might render the wrong items.
**How You Fixed It:** I changed `key={index}` to `key={skill}`. Since the skills (like "React", "Node.js") are unique strings for that employee, they make perfect, stable keys.
**All Steps You Took:**

1. I was reviewing the EmployeeCard component and saw the `⚠ BUG-003` comment.
2. I noticed the `map((skill, index)` part.
3. I simply replaced `index` with `skill` in the `key` prop.
4. Saved and checked the browser console (F12) to ensure there were no React key warnings.
   **Tools & Resources Used:** VS Code, Chrome DevTools (F12 -> Console), React Documentation.
   **AI Usage:** \* **Which AI tool you used:** None

- **The exact prompt you typed:** N/A
- **The exact response you received:** N/A
- **Whether you used it as-is or modified it, and how:** Solved manually. I already knew that using indices as keys is an anti-pattern in React.

---

### Issue Title: BUG-004 - Race Condition in Search Requests

**Where You Found It:** `hooks/useEmployees.ts` (Line 28)
**What the Problem Was:** When typing fast in the search bar, the app sends multiple network requests. If a slower request finishes _after_ a faster request, the screen shows the wrong results. It's a race condition.
**How You Fixed It:** I added an `AbortController` using a `useRef`. Whenever a new search starts, I tell the controller to abort the previous ongoing fetch request before starting the new one.
**All Steps You Took:**

1. I opened the custom hook and read the BUG-004 comment.
2. I pressed F12, opened the Chrome DevTools Network tab, typed fast, and saw multiple pending requests completing out of order.
3. I wasn't entirely sure how to implement `AbortController` in a React hook, so I asked AI for a code example.
4. I added the `useRef`, the abort logic, and tested again while watching the Network tab to confirm older requests were showing as "canceled".
   **Tools & Resources Used:** Chrome DevTools (F12 -> Network Tab), VS Code.
   **AI Usage:**

- **Which AI tool you used:** Google Gemini
- **The exact prompt you typed:** "I have a race condition in my React fetch function when typing in a search bar. How do I use AbortController with useRef to cancel previous fetch requests?"
- **The exact response you received:** The AI provided a full code block showing how to initialize `useRef<AbortController | null>(null)`, call `.abort()` before fetching, and pass `signal: controller.signal` to the fetch options.
- **Whether you used it as-is or modified it, and how:** I adapted the AI's logic into my existing `fetchEmployees` function and added my own error handling for the `AbortError`.

---

### Issue Title: BUG-005 - Incorrect Pagination Calculation

**Where You Found It:** `components/Pagination.tsx`
**What the Problem Was:** The app was using `Math.floor(total / pageSize)` to calculate the total number of pages. So if there were 6 employees and 5 per page, `Math.floor(6/5)` gave `1`. The second page was completely hidden.
**How You Fixed It:** I changed `Math.floor` to `Math.ceil`. This forces the math to round up, correctly giving 2 pages.
**All Steps You Took:**

1. I noticed on the UI that the total employee count didn't match the number of employees I could click through on the pagination.
2. I checked the code and spotted the `Math.floor` mistake.
3. I changed it to `Math.ceil` and verified the missing employees appeared on the next page.
   **Tools & Resources Used:** VS Code.
   **AI Usage:**

- **Which AI tool you used:** None
- **The exact prompt you typed:** N/A
- **The exact response you received:** N/A
- **Whether you used it as-is or modified it, and how:** Solved manually using basic JavaScript math logic.

---

### Issue Title: BUG-006 - HTTP Method Mismatch (PATCH vs PUT)

**Where You Found It:** `app/api/employees/[id]/route.ts`
**What the Problem Was:** When trying to update an employee, the frontend was sending a `PUT` request, but the backend API route was written as `export async function PATCH`. This caused the server to reject the request with a 405 error.
**How You Fixed It:** I renamed the backend function from `PATCH` to `PUT` so it matches what the frontend is sending.
**All Steps You Took:**

1. I tried updating an employee on the UI and it failed silently.
2. I pressed F12, checked the DevTools Network tab, and saw a red `405 Method Not Allowed` error for a PUT request.
3. I checked the Next.js API route and saw the function was named `PATCH`.
4. I changed it to `PUT`, saved, and watched the Network tab return a successful 200 response upon the next update.
   **Tools & Resources Used:** Chrome DevTools (F12 -> Network Tab), VS Code.
   **AI Usage:**

- **Which AI tool you used:** None
- **The exact prompt you typed:** N/A
- **The exact response you received:** N/A
- **Whether you used it as-is or modified it, and how:** Solved manually by debugging the 405 network error.

---

### Issue Title: BUG-007 - Incorrect HTTP Status Code

**Where You Found It:** `app/api/employees/route.ts`
**What the Problem Was:** The POST request for adding a new employee was returning a standard `200 OK` status code. The standard REST API practice for creating a new resource is to return `201 Created`.
**How You Fixed It:** I changed the response status from `{ status: 200 }` to `{ status: 201 }`.
**All Steps You Took:**

1. I was looking through the API routes and saw the BUG-007 comment.
2. I simply updated the number in the `NextResponse.json` options.
3. Tested adding an employee and checked the Network tab (F12) to verify it returned a 201 status.
   **Tools & Resources Used:** VS Code, Chrome DevTools (Network Tab).
   **AI Usage:**

- **Which AI tool you used:** None
- **The exact prompt you typed:** N/A
- **The exact response you received:** N/A
- **Whether you used it as-is or modified it, and how:** Solved manually based on general knowledge of REST API status codes.

---

### Issue Title: BUG-008 - Case-Sensitive Search

**Where You Found It:** Employee filtering logic inside the list component/hook.
**What the Problem Was:** The search was strictly case-sensitive. Searching for "alice" using `.includes()` wouldn't match "Alice", which is bad for user experience.
**How You Fixed It:** I added `.toLowerCase()` to both the search query and the target text before running the `.includes()` check.
**All Steps You Took:**

1. I tested the search bar with lowercase letters and noticed it didn't find names with capital letters.
2. I found the filtering logic and the BUG-008 comment.
3. I updated the JavaScript to normalize the casing using `.toLowerCase()`.
4. Tested again with "alice", "ALICE", and "Alice" to ensure they all returned the correct employee.
   **Tools & Resources Used:** VS Code.
   **AI Usage:**

- **Which AI tool you used:** None
- **The exact prompt you typed:** N/A
- **The exact response you received:** N/A
- **Whether you used it as-is or modified it, and how:** Solved manually. Converting to lowercase is the standard JavaScript way to handle simple case-insensitive searches.

---

### Issue Title: BUG-009 - Client-Side Cache & State Mutation

**Where You Found It:** `hooks/useEmployees.ts` & `lib/data.ts`
**What the Problem Was:** Two things were wrong: First, when adding an employee, the `addEmployee` function was modifying the array directly (mutating), so React didn't know the state changed. Second, when the hook called `refetch()`, the browser just returned a cached response instead of fetching the new data from the server.
**How You Fixed It:** I added `{ cache: "no-store" }` to the `fetch` options to disable browser caching for this request. Then, I updated the state using the spread operator `setEmployees([...json.data])` to create a fresh array reference so React forces a re-render.
**All Steps You Took:**

1. I added an employee via the form, but the list didn't update visually.
2. I opened the Network tab (F12) and noticed that calling refetch either didn't trigger a network request or loaded from the `(disk cache)`.
3. I looked at `useEmployees.ts` and the BUG-009 comment.
4. I used AI to understand how to bypass fetch caching in Next.js/React.
5. I applied `cache: "no-store"` and updated the React state immutably.
   **Tools & Resources Used:** Chrome DevTools (F12 -> Network Tab), VS Code.
   **AI Usage:**

- **Which AI tool you used:** Google Gemini
- **The exact prompt you typed:** "I have a bug in my Next.js React app. After I add an employee and call my fetch function again, the list doesn't update on the screen. It only updates if I refresh the page. How do I fix the cache and React state?"
- **The exact response you received:** The AI explained that browsers cache GET requests, and suggested adding `{ cache: "no-store" }`. It also reminded me to make sure I am setting the state with a new array reference `[...data]`.
- **Whether you used it as-is or modified it, and how:** Modified. I took the concept and applied it specifically to my `fetch` setup and state setter.

---

### Issue Title: BUG-010 - Mixing Controlled and Uncontrolled Inputs

**Where You Found It:** `components/EmployeeForm.tsx` (Line 48)
**What the Problem Was:** Most of the form inputs were tied to a React state object (controlled), but the "Skills" input was just using an ID to grab the value from the DOM directly (uncontrolled). Because of this, when the form submitted and reset the state, the Skills text box didn't clear out.
**How You Fixed It:** I added `skills: ""` to the `form` state object. I then added the `value` and `onChange` props to the Skills `<input>` to make it fully controlled by React, just like the other fields.
**All Steps You Took:**

1. I submitted the form and noticed the Skills input still had my old text in it.
2. I found the BUG-010 comment explaining the mixed input warning.
3. I removed `document.getElementById` and linked the input to the React state.
4. Tested the form submission to ensure all fields clear properly.
   **Tools & Resources Used:** VS Code.
   **AI Usage:**

- **Which AI tool you used:** Google Gemini
- **The exact prompt you typed:** "My React form has an uncontrolled input for 'skills' mixed with controlled inputs. How do I convert it to a controlled input and clear it on submit?"
- **The exact response you received:** The AI showed me how to add `skills` to my initial state object, bind it to the input's `value` prop, and reset the state to empty strings after successful submission.
- **Whether you used it as-is or modified it, and how:** I followed the AI's logic to integrate it into my specific `form` state object and `handleChange` function.

---

### Issue Title: BUG-011 - SSR Crash via localStorage

**Where You Found It:** Component tracking recent views (`components/Pagination.tsx`)
**What the Problem Was:** The code was trying to read `localStorage` right in the main body of the component. Since Next.js runs on the server first (SSR), it crashed because the server doesn't have a browser `window` or `localStorage`.
**How You Fixed It:** I wrapped the `localStorage.getItem` inside a `useEffect` hook and saved the value to a state variable.
**All Steps You Took:**

1. I checked the VS Code terminal running the Next.js server and saw a "ReferenceError: localStorage is not defined".
2. I also pressed F12 and checked the browser Console, which showed a hydration mismatch warning.
3. I moved the local storage logic inside `useEffect` because `useEffect` only runs on the client-side browser, never on the server.
   **Tools & Resources Used:** Next.js Server Terminal, Chrome DevTools (F12 -> Console), Next.js Documentation.
   **AI Usage:**

- **Which AI tool you used:** None
- **The exact prompt you typed:** N/A
- **The exact response you received:** N/A
- **Whether you used it as-is or modified it, and how:** Solved manually. I recognized the SSR error from past experience with Next.js.

---

### Issue Title: BUG-012 - Null Reference Crash

**Where You Found It:** `components/EmployeeCard.tsx` (Line 18)
**What the Problem Was:** The card was trying to read `employee.department.name`. But some employees (like Grace Wilson) didn't have a department, making it `null`. Trying to read `.name` on `null` crashed the whole React app with a white screen.
**How You Fixed It:** I added optional chaining (`?.`) and a fallback string: `employee.department?.name || "Unassigned"`.
**All Steps You Took:**

1. The app crashed and showed a blank screen.
2. I pressed F12 to open the DevTools Console to read the red stack trace, which pointed directly to "Cannot read properties of null (reading 'name')" in `EmployeeCard.tsx`.
3. I added the `?.` operator so it safely checks if the department exists first.
   **Tools & Resources Used:** Chrome DevTools (F12 -> Console stack traces), React Error Boundary.
   **AI Usage:**

- **Which AI tool you used:** None
- **The exact prompt you typed:** N/A
- **The exact response you received:** N/A
- **Whether you used it as-is or modified it, and how:** Solved manually. Optional chaining is a standard JavaScript feature for dealing with null objects.

---

### Issue Title: Logic Bug - Static Department Count

**Where You Found It:** `lib/data.ts` (Inside `getStats` function)
**What the Problem Was:** The Dashboard showed "5 Departments" constantly. In the code, it was returning the length of a hardcoded array (`departments.length`) instead of calculating how many unique departments the _current_ employees actually belonged to.
**How You Fixed It:** I mapped through the current `employees` array, extracted their department IDs, filtered out the nulls, and used a JavaScript `Set` to count the unique active departments.
**All Steps You Took:**

1. I noticed the department count on the dashboard didn't drop when I deleted the only employee in a specific department.
2. I traced the API route to `lib/data.ts` and saw it was hardcoded.
3. I used an AI to figure out the cleanest way to find unique values in an array of objects.
4. I implemented the `Set` logic and verified the dashboard count updated correctly.
   **Tools & Resources Used:** VS Code.
   **AI Usage:**

- **Which AI tool you used:** Google Gemini
- **The exact prompt you typed:** "I have an array of employee objects, some have a department ID and some are null. What is the best JavaScript way to count the number of unique departments currently active?"
- **The exact response you received:** The AI provided a snippet showing how to `map` the IDs, `filter` out falsy values, and pass the array into `new Set()`, then return `set.size`.
- **Whether you used it as-is or modified it, and how:** I adapted the snippet to fit inside my `getStats` return object perfectly.
