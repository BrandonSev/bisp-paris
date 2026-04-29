import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Child = {
  id: string;
  prenom: string;
  nom: string;
  naissance: string;
  classe: string;
  section: string;
  taille: string;
  hauteur: string;
  tour: string;
  initials: string;
  color: string;
};

export type CartItem = {
  id: string; // unique line id
  productId: string;
  name: string;
  ref: string;
  price: number;
  size: string;
  qty: number;
  image: string;
  childId: string;
};

const COLORS = [
  "from-[var(--teal)]/15 to-[var(--teal)]/5",
  "from-primary/15 to-primary/5",
  "from-[var(--rouge)]/15 to-[var(--rouge)]/5",
  "from-[var(--teal-deep)]/15 to-[var(--teal-deep)]/5",
];

const BADGE_COLORS = [
  "bg-[var(--teal)]/15 text-[var(--teal-deep)]",
  "bg-primary/15 text-primary",
  "bg-[var(--rouge)]/15 text-[var(--rouge)]",
  "bg-[var(--teal-deep)]/15 text-[var(--teal-deep)]",
];

export function badgeColorFor(idx: number) {
  return BADGE_COLORS[idx % BADGE_COLORS.length];
}

export function gradientFor(idx: number) {
  return COLORS[idx % COLORS.length];
}

const defaultChildren: Child[] = [
  {
    id: "emma",
    prenom: "Emma",
    nom: "Dubois",
    naissance: "12/04/2017",
    classe: "CE2 · Year 4",
    section: "Élémentaire",
    taille: "8 ans",
    hauteur: "128 cm",
    tour: "62 cm",
    initials: "ED",
    color: COLORS[0],
  },
  {
    id: "thomas",
    prenom: "Thomas",
    nom: "Dubois",
    naissance: "03/09/2014",
    classe: "6ᵉ B · Year 7",
    section: "Collège",
    taille: "M",
    hauteur: "152 cm",
    tour: "72 cm",
    initials: "TD",
    color: COLORS[1],
  },
  {
    id: "chloe",
    prenom: "Chloé",
    nom: "Dubois",
    naissance: "27/06/2020",
    classe: "Moyenne section · Reception",
    section: "Maternelle",
    taille: "5 ans",
    hauteur: "108 cm",
    tour: "55 cm",
    initials: "CD",
    color: COLORS[2],
  },
];

type StoreCtx = {
  children: Child[];
  cart: CartItem[];
  addChild: (c: Omit<Child, "id" | "initials" | "color">) => void;
  updateChild: (id: string, patch: Partial<Child>) => void;
  removeChild: (id: string) => void;
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
};

const Ctx = createContext<StoreCtx | null>(null);

function useLocal<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setVal(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val, hydrated]);

  return [val, setVal];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [childList, setChildList] = useLocal<Child[]>("bisp.children", defaultChildren);
  const [cart, setCart] = useLocal<CartItem[]>("bisp.cart", []);

  const value = useMemo<StoreCtx>(
    () => ({
      children: childList,
      cart,
      addChild: (c) => {
        const id = `${c.prenom.toLowerCase()}-${Date.now()}`;
        const initials = (c.prenom[0] ?? "") + (c.nom[0] ?? "");
        const color = COLORS[childList.length % COLORS.length];
        setChildList((prev) => [...prev, { ...c, id, initials: initials.toUpperCase(), color }]);
      },
      updateChild: (id, patch) =>
        setChildList((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      removeChild: (id) => {
        setChildList((prev) => prev.filter((c) => c.id !== id));
        setCart((prev) => prev.filter((i) => i.childId !== id));
      },
      addToCart: (item) => {
        setCart((prev) => {
          const existing = prev.find(
            (i) => i.productId === item.productId && i.size === item.size && i.childId === item.childId,
          );
          if (existing) {
            return prev.map((i) => (i.id === existing.id ? { ...i, qty: i.qty + item.qty } : i));
          }
          return [...prev, { ...item, id: `${item.productId}-${item.size}-${item.childId}-${Date.now()}` }];
        });
      },
      updateQty: (id, qty) =>
        setCart((prev) =>
          qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      removeFromCart: (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
      clearCart: () => setCart([]),
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
    }),
    [childList, cart, setChildList, setCart],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}