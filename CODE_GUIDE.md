# TT Online Konbini - Code Guide

This guide explains the project in simple terms. Start with the files in the order below.

## 1. Main folders

- `app/` contains website pages. In Next.js, a `page.tsx` file becomes a URL.
- `src/components/` contains reusable UI parts.
- `src/context/` contains data shared between pages.
- `src/data/` contains the demo product list.
- `public/` contains images.

## 2. Important files

### `src/data/products.ts`

This is the product database for the demo. Each product has an ID, name, price,
category, image, stock amount, and optional sale information.

### `src/context/StoreContext.tsx`

This is the main store logic. It manages:

- cart items
- favorites
- orders
- coupon
- demo login
- profile and address
- localStorage saving

Pages use the `useStore()` custom hook to read or change this data.

### `src/components/layout.tsx`

Contains the shared Header, Footer, Logo, search form, and page Shell.

### `src/components/product.tsx`

Contains reusable product components:

- `ProductImage()`
- `ProductPrice()`
- `ProductCard()`
- `Quantity()`

### `app/products/ProductsClient.tsx`

Reads search options from the URL, filters products, sorts them, and creates
pagination.

### `app/cart/page.tsx`

Displays cart products and calculates subtotal, shipping, coupon discount, and
final total.

### `app/checkout/page.tsx`

Collects delivery and payment choices, then calls `placeOrder()`.

## 3. React methods used

### `useState()`

Stores a value that can change on the screen.

```tsx
const [search, setSearch] = useState("");
```

### `useEffect()`

Runs code after the component loads or after a selected value changes.

```tsx
useEffect(() => {
  setMenuOpen(false);
}, [pathname]);
```

### `useMemo()`

Calculates and remembers a result. This project uses it for filtered products,
related products, delivery dates, and the shared store object.

### `useCallback()`

Keeps a function stable between renders. StoreContext uses it for actions such
as `add()`, `change()`, and `placeOrder()`.

### `map()`

Changes an array into UI elements.

```tsx
products.map((product) => <ProductCard p={product} key={product.id} />);
```

### `filter()`

Creates a new array containing only matching items.

```tsx
products.filter((product) => product.isPopular);
```

### `reduce()`

Combines an array into one value. It is used to calculate cart totals.

```tsx
items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
```

## 4. Shopping flow

1. Header search opens `/products?search=keyword`.
2. The product page filters the product array.
3. `ProductCard` calls `add()`.
4. StoreContext saves the cart in localStorage.
5. The cart calculates subtotal, shipping, and discount.
6. Checkout calls `placeOrder()`.
7. The finished order appears on `/orders`.

## 5. Important note

Login, payment, orders, points, and profile information are demo functions.
They use localStorage and do not connect to a real server or database.
