import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

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
  tour_taille: string;
  tour_bassin: string;
  genre: "" | "Fille" | "Garçon";
  initials: string;
  color: string;
};

export type Profile = {
  id: string;
  civilite: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
};

export type CartItem = {
  id: string;
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

function decorate(
  c: {
    id: string;
    prenom: string;
    nom: string;
    naissance: string | null;
    classe: string | null;
    section: string | null;
    taille: string | null;
    hauteur: string | null;
    tour: string | null;
    tour_taille?: string | null;
    tour_bassin?: string | null;
    genre?: string | null;
  },
  idx: number,
): Child {
  const initials = ((c.prenom[0] ?? "") + (c.nom[0] ?? "")).toUpperCase();
  return {
    id: c.id,
    prenom: c.prenom,
    nom: c.nom,
    naissance: c.naissance ?? "",
    classe: c.classe ?? "",
    section: c.section ?? "",
    taille: c.taille ?? "",
    hauteur: c.hauteur ?? "",
    tour: c.tour ?? "",
    tour_taille: c.tour_taille ?? "",
    tour_bassin: c.tour_bassin ?? "",
    genre: (c.genre as Child["genre"]) ?? "",
    initials,
    color: COLORS[idx % COLORS.length],
  };
}

type StoreCtx = {
  // auth
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  authLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Omit<Profile, "id" | "email">>) => Promise<void>;

  // children
  children: Child[];
  addChild: (c: Omit<Child, "id" | "initials" | "color">) => Promise<void>;
  updateChild: (id: string, patch: Partial<Omit<Child, "id" | "initials" | "color">>) => Promise<void>;
  removeChild: (id: string) => Promise<void>;

  // cart (local)
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => Promise<void> | void;
  updateQty: (id: string, qty: number) => Promise<void> | void;
  removeFromCart: (id: string) => Promise<void> | void;
  clearCart: () => Promise<void> | void;
  cartCount: number;
  checkout: (input?: CheckoutInput) => Promise<{ orderId: string; orderNumber: string }>;
};

export type CheckoutInput = {
  shipping_mode: string;
  shipping_label: string;
  shipping_recipient?: string;
  shipping_address?: string;
  shipping_postal?: string;
  shipping_city?: string;
};

const Ctx = createContext<StoreCtx | null>(null);

const CART_LOCAL_KEY = "bisp.cart";

function dbRowToItem(r: any): CartItem {
  return {
    id: r.id,
    productId: r.product_id,
    name: r.name,
    ref: r.ref,
    price: Number(r.price),
    size: r.size,
    qty: r.qty,
    image: r.image ?? "",
    childId: r.child_id ?? "",
  };
}

export function StoreProvider({ children: kids }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [childList, setChildList] = useState<Child[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (!s) {
        setProfile(null);
        setChildList([]);
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = useCallback(async (uid: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
    if (data) setProfile(data as Profile);
  }, []);

  const loadChildren = useCallback(async (uid: string) => {
    const { data } = await supabase.from("children").select("*").eq("user_id", uid).order("created_at", { ascending: true });
    if (data) setChildList(data.map((c, i) => decorate(c as any, i)));
  }, []);

  const loadAdmin = useCallback(async (uid: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data);
  }, []);

  const loadCart = useCallback(async (uid: string) => {
    const { data: dbRows } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: true });
    const dbItems: CartItem[] = (dbRows ?? []).map(dbRowToItem);

    // Fusion : si un panier local existait avant connexion, on le pousse en DB.
    let localItems: CartItem[] = [];
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(CART_LOCAL_KEY) : null;
      if (raw) localItems = JSON.parse(raw) as CartItem[];
    } catch {}

    if (localItems.length > 0) {
      for (const li of localItems) {
        const existing = dbItems.find(
          (d) => d.productId === li.productId && d.size === li.size && d.childId === li.childId,
        );
        if (existing) {
          const newQty = existing.qty + li.qty;
          await supabase.from("cart_items").update({ qty: newQty }).eq("id", existing.id);
          existing.qty = newQty;
        } else {
          const { data: inserted } = await supabase
            .from("cart_items")
            .insert({
              user_id: uid,
              product_id: li.productId,
              name: li.name,
              ref: li.ref,
              price: li.price,
              size: li.size,
              qty: li.qty,
              image: li.image ?? "",
              child_id: li.childId || null,
            })
            .select()
            .single();
          if (inserted) dbItems.push(dbRowToItem(inserted));
        }
      }
      try { localStorage.removeItem(CART_LOCAL_KEY); } catch {}
    }

    setCart(dbItems);
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadChildren(user.id);
      loadAdmin(user.id);
      loadCart(user.id);
    } else {
      // Utilisateur déconnecté : on charge le panier local s'il existe.
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem(CART_LOCAL_KEY) : null;
        setCart(raw ? (JSON.parse(raw) as CartItem[]) : []);
      } catch {
        setCart([]);
      }
      setCartLoaded(true);
    }
  }, [user, loadProfile, loadChildren, loadAdmin, loadCart]);

  // Persistance localStorage uniquement quand l'utilisateur n'est pas connecté.
  useEffect(() => {
    if (!cartLoaded || user) return;
    try { localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(cart)); } catch {}
  }, [cart, cartLoaded, user]);

  // Purge des items orphelins (enfant supprimé ailleurs, ou items legacy sans enfant).
  useEffect(() => {
    if (!user) return;
    const validIds = new Set(childList.map((c) => c.id));
    setCart((prev) => {
      const stale = prev.filter((i) => !i.childId || !validIds.has(i.childId));
      if (stale.length === 0) return prev;
      supabase
        .from("cart_items")
        .delete()
        .in("id", stale.map((s) => s.id))
        .then(() => {});
      return prev.filter((i) => i.childId && validIds.has(i.childId));
    });
  }, [user, childList]);

  const value = useMemo<StoreCtx>(() => ({
    user, session, profile, authLoading, isAdmin,
    signOut: async () => { await supabase.auth.signOut(); },
    refreshProfile: async () => { if (user) await loadProfile(user.id); },
    updateProfile: async (patch) => {
      if (!user) return;
      const { data, error } = await supabase.from("profiles").update(patch).eq("id", user.id).select().single();
      if (error) throw error;
      if (data) setProfile(data as Profile);
    },

    children: childList,
    addChild: async (c) => {
      if (!user) return;
      const { data, error } = await supabase.from("children").insert({
        user_id: user.id,
        prenom: c.prenom, nom: c.nom,
        naissance: c.naissance || null,
        classe: c.classe || null, section: c.section || null,
        taille: c.taille || null, hauteur: c.hauteur || null, tour: c.tour || null,
        tour_taille: c.tour_taille || null,
        tour_bassin: c.tour_bassin || null,
        genre: c.genre || null,
      }).select().single();
      if (error) throw error;
      if (data) setChildList((p) => [...p, decorate(data as any, p.length)]);
    },
    updateChild: async (id, patch) => {
      const dbPatch: any = { ...patch };
      if ("naissance" in dbPatch && !dbPatch.naissance) dbPatch.naissance = null;
      if ("genre" in dbPatch && !dbPatch.genre) dbPatch.genre = null;
      const { data, error } = await supabase.from("children").update(dbPatch).eq("id", id).select().single();
      if (error) throw error;
      if (data) setChildList((p) => p.map((c, i) => (c.id === id ? decorate(data as any, i) : c)));
    },
    removeChild: async (id) => {
      const { error } = await supabase.from("children").delete().eq("id", id);
      if (error) throw error;
      setChildList((p) => p.filter((c) => c.id !== id));
      setCart((p) => p.filter((i) => i.childId !== id));
      if (user) {
        await supabase.from("cart_items").delete().eq("user_id", user.id).eq("child_id", id);
      }
    },

    cart,
    addToCart: async (item) => {
      // Cas non connecté : on travaille en local (persistance via useEffect).
      if (!user) {
        setCart((prev) => {
          const existing = prev.find((i) => i.productId === item.productId && i.size === item.size && i.childId === item.childId);
          if (existing) return prev.map((i) => (i.id === existing.id ? { ...i, qty: i.qty + item.qty } : i));
          return [...prev, { ...item, id: `${item.productId}-${item.size}-${item.childId}-${Date.now()}` }];
        });
        return;
      }
      const existing = cart.find((i) => i.productId === item.productId && i.size === item.size && i.childId === item.childId);
      if (existing) {
        const newQty = existing.qty + item.qty;
        const { data, error } = await supabase.from("cart_items").update({ qty: newQty }).eq("id", existing.id).select().single();
        if (error) throw error;
        if (data) setCart((prev) => prev.map((i) => (i.id === existing.id ? dbRowToItem(data) : i)));
      } else {
        const { data, error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: item.productId,
          name: item.name,
          ref: item.ref,
          price: item.price,
          size: item.size,
          qty: item.qty,
          image: item.image ?? "",
          child_id: item.childId || null,
        }).select().single();
        if (error) throw error;
        if (data) setCart((prev) => [...prev, dbRowToItem(data)]);
      }
    },
    updateQty: async (id, qty) => {
      if (qty <= 0) {
        if (user) await supabase.from("cart_items").delete().eq("id", id);
        setCart((prev) => prev.filter((i) => i.id !== id));
        return;
      }
      if (user) await supabase.from("cart_items").update({ qty }).eq("id", id);
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    },
    removeFromCart: async (id) => {
      if (user) await supabase.from("cart_items").delete().eq("id", id);
      setCart((prev) => prev.filter((i) => i.id !== id));
    },
    clearCart: async () => {
      if (user) await supabase.from("cart_items").delete().eq("user_id", user.id);
      setCart([]);
    },
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    checkout: async (input?: CheckoutInput) => {
      if (!user || !profile) throw new Error("Non connecté");
      if (cart.length === 0) throw new Error("Panier vide");
      const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
      const shipping = input ?? {
        shipping_mode: "pickup",
        shipping_label: "Retrait à l'établissement BISP",
      };
      const { data: order, error: oErr } = await supabase.from("orders").insert({
        user_id: user.id,
        status: "En attente",
        total_amount: total,
        family_civilite: profile.civilite,
        family_nom: profile.nom,
        family_prenom: profile.prenom,
        family_email: profile.email,
        family_telephone: profile.telephone,
        shipping_mode: shipping.shipping_mode,
        shipping_label: shipping.shipping_label,
        shipping_recipient: shipping.shipping_recipient ?? null,
        shipping_address: shipping.shipping_address ?? null,
        shipping_postal: shipping.shipping_postal ?? null,
        shipping_city: shipping.shipping_city ?? null,
      }).select().single();
      if (oErr) throw oErr;
      const items = cart.map((i) => {
        const child = childList.find((c) => c.id === i.childId);
        const [productId, ...variantParts] = i.productId.split("::");
        return {
          order_id: order.id,
          child_id: i.childId || null,
          child_prenom: child?.prenom ?? "—",
          child_nom: child?.nom ?? "—",
          child_classe: child?.classe ?? null,
          child_section: child?.section ?? null,
          product_id: productId,
          product_name: i.name,
          product_ref: i.ref,
          variant: variantParts.join("::") || null,
          size: i.size,
          quantity: i.qty,
          unit_price: i.price,
          line_total: i.qty * i.price,
        };
      });
      const { error: iErr } = await supabase.from("order_items").insert(items);
      if (iErr) throw iErr;
      await supabase.from("cart_items").delete().eq("user_id", user.id);
      setCart([]);
      return { orderId: order.id, orderNumber: order.order_number };
    },
  }), [user, session, profile, authLoading, isAdmin, childList, cart, loadProfile]);

  return <Ctx.Provider value={value}>{kids}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
