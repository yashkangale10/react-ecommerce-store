# React 19 E-Commerce Assignment

## How the React 19 Features Are Used

### 1. `use()` and `<Suspense>`

For fetching products, I used React 19's `use()` hook in `ProductList.jsx`. Instead of the usual `useEffect` + `useState` combo, `use()` lets you pass in a Promise directly and it suspends the component until the data is ready.

The trick is that `use()` on its own would just throw — you need a `<Suspense>` wrapper around it in `App.jsx` to catch that suspension and show a fallback (`Loading products...`). I also wrapped the whole thing in an `<ErrorBoundary>` so if the fetch fails for some reason, it shows an error message instead of crashing.

The product data Promise is created at the module level (outside the component) so it starts fetching as early as possible, before React even begins rendering.

### 2. Form Actions — `useActionState()` and `useFormStatus()`

The registration form in `RegistrationForm.jsx` doesn't use the traditional `onSubmit` + `e.preventDefault()` approach. Instead:

- The form uses `<form action={action}>` where `action` comes from `useActionState()`. This hook takes an async function and gives back the current state (errors, success message, etc.) along with the action to pass to the form.
- For the submit button, I made a separate `SubmitButton` component that calls `useFormStatus()`. This hook has to be in a child of the `<form>` — it reads the pending state from the parent form automatically. So when the form is submitting, the button disables itself and shows "Registering...".

Validation happens server-side (well, in the simulated API) — it checks for empty fields, valid email format, and password length.

### 3. Context (React 19 syntax)

I created a `UserContext` using `createContext()` in `UserContext.jsx`. The key React 19 thing here is how it's used in `App.jsx`:

```jsx
<UserContext value={{ user, setUser }}>
```

In older React you'd write `<UserContext.Provider value={...}>` — React 19 dropped the `.Provider` part, you just use the context object directly.

To show the user info in a separate component, I made `UserProfile.jsx` which reads from the context using `use(UserContext)` (the `use()` hook works with Context too, not just Promises).

### 4. Asset Loading APIs and Document Metadata

I picked two asset loading APIs in `App.jsx`:

- **`preload()`** — I used this to preload the placeholder image URL with `{ as: 'image' }`. The idea is that product images are the first thing users notice, so starting the fetch early means they appear faster.
- **`prefetchDNS()`** — Since all product images come from the same domain, doing a DNS lookup early saves time when the browser actually needs to load them.

Both are called at the module level (not inside the component) so they run once, as early as possible.

For metadata, I just put `<title>` and `<meta name="description">` tags directly inside the component JSX in `App.jsx`. React 19 hoists them to `<head>` automatically — no need for react-helmet or anything like that.

### 5. `useOptimistic()` — Cart Updates

This one's in `AddToCart.jsx`. When you click "Add to Cart", the cart count goes up right away (that's the optimistic part) even though the API call hasn't finished yet. I used `useOptimistic(cartCount, updateFn)` for this.

If the API succeeds, the real state catches up and everything's fine. If it fails, `useOptimistic` rolls back to the actual count automatically. I also show an error message so the user knows what happened.

To make this easy to demo, I set it up so that the Coffee Maker (product ID 3) always fails when you try to add it — that way you can reliably see the rollback in action. The other products add to cart normally.

### 6. Ref as a Prop

In `CustomInput.jsx`, the component takes `ref` as a regular prop:

```jsx
function CustomInput({ label, ref, ...props }) { ... }
```

Before React 19, you'd have to wrap this in `forwardRef()` for the ref to work. Now it's just a normal prop, which is way simpler.

### 7. Ref Cleanup

Also in `CustomInput.jsx` — I'm using a callback ref that attaches focus/blur event listeners to the input element. The callback ref returns a cleanup function that removes those listeners when the component unmounts or the ref changes:

```jsx
return () => {
    element.removeEventListener('focus', handleFocus);
    element.removeEventListener('blur', handleBlur);
};
```

This is new in React 19. Previously, callback refs couldn't return cleanup functions — you'd have to handle cleanup separately with `useEffect`, which was kind of awkward.

### 8. Server vs Client Components

This project runs on Vite, so I can't actually use Server Components (you need Next.js or similar for that). But here's how I'd split things up if I could:

- **`ProductDetails` → Server Component** — It just renders product info (name, price, image, description). There's no interactivity, no state, no event handlers. Rendering it on the server means less JS shipped to the browser and better initial load.
- **`AddToCart` → Client Component** — This one needs `useState`, `useOptimistic`, form actions, event handlers. All of that requires the browser, so it has to stay client-side. You'd mark it with `"use client"` in a Next.js app.
- **Working together** — In practice, the product page would render on the server and the "Add to Cart" button would be a client component island embedded within it. The server handles the static content, the client handles the interactive bits.

### 9. React Compiler

React Compiler is a build-time optimization tool. It analyzes your components and automatically adds memoization where it helps — basically doing `React.memo`, `useMemo`, and `useCallback` for you at compile time.

In this app specifically:
- When `cartCount` changes in `App.jsx`, the header and other unrelated parts of the UI wouldn't re-render because the compiler would figure out they don't depend on that state.
- The `onSelectProduct` callback passed to `ProductList` would get auto-memoized, so the product grid doesn't re-render unnecessarily.
- Same with the `formAction` in `AddToCart` — it'd be memoized instead of getting recreated every render.
