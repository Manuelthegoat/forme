import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { CartContext } from "./cartContext";

const KEY = "forme-cart";
const MAX_QTY = 10;

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "add": {
      const { product, size } = action;
      const key = `${product.id}-${size}`;
      const existing = state.find((i) => i.key === key);

      if (existing) {
        return state.map((i) =>
          i.key === key ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i
        );
      }

      return [
        ...state,
        {
          key,
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          colors: product.colors,
          image: product.images?.[0] ?? null,
          size,
          qty: 1,
        },
      ];
    }

    case "qty":
      return state
        .map((i) =>
          i.key === action.key
            ? { ...i, qty: Math.min(action.qty, MAX_QTY) }
            : i
        )
        .filter((i) => i.qty > 0);

    case "remove":
      return state.filter((i) => i.key !== action.key);

    case "clear":
      return [];

    default:
      return state;
  }
}

export default function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], load);
  const [isOpen, setIsOpen] = useState(false);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable, fine */
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product, size = "M") => {
    dispatch({ type: "add", product, size });
    setIsOpen(true);
  }, []);

  const setQty = useCallback(
    (key, qty) => dispatch({ type: "qty", key, qty }),
    []
  );
  const removeItem = useCallback(
    (key) => dispatch({ type: "remove", key }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      setQty,
      removeItem,
      clearCart,
    };
  }, [items, isOpen, openCart, closeCart, addItem, setQty, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}