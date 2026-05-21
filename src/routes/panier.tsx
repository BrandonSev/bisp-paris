import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import { useStore, type CartItem, type Child } from "@/lib/store";
import { toast } from "sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { SizeBadge } from "@/components/SizeBadge";
import { recommendSize } from "@/lib/sizeRecommendation";
import { CheckoutConfirmModal } from "@/components/CheckoutConfirmModal";
import type { CheckoutInput } from "@/lib/store";
import { createPayplugPayment } from "@/lib/payplug.functions";
import { useServerFn } from "@tanstack/react-start";
import { sendTransactionalEmail } from "@/lib/email/send";
import { establishment } from "@/config/featureFlags";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [{ title: "Mon panier · My cart — BISP" }],
  }),
  component: () => (
    <RequireAuth>
      <PanierPage />
    </RequireAuth>
  ),
});

function PanierPage() {
  const { cart, children: kids, updateQty, removeFromCart, checkout, profile } = useStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const startPayplug = useServerFn(createPayplugPayment);

  const groups = kids
    .map((child) => ({
      child,
      items: cart.filter((i) => i.childId === child.id),
    }))
    .filter((g) => g.items.length > 0);

  const orphans = cart.filter((i) => !kids.find((k) => k.id === i.childId));

  const totalArticles = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const delivery = 0;
  const total = subtotal + delivery;

  const openConfirm = () => {
    if (cart.length === 0) return;
    setConfirmOpen(true);
  };

  const handleConfirm = (input: CheckoutInput) => {
    setSubmitting(true);
    checkout(input)
      .then(async ({ orderId, orderNumber }) => {
        // Fire-and-forget confirmation email
        if (profile?.email) {
          const paymentLabels: Record<string, string> = {
            cb_payplug: 'Carte bancaire',
            cheque: 'Chèque',
            virement: 'Virement',
            especes: 'Espèces',
          };
          void sendTransactionalEmail({
            templateName: 'order-confirmation',
            recipientEmail: profile.email,
            idempotencyKey: `order-confirm-${orderId}`,
            templateData: {
              firstName: profile.prenom,
              orderNumber,
              total,
              shippingLabel: input.shipping_label,
              paymentLabel: paymentLabels[input.payment_method ?? 'cb_payplug'] ?? input.payment_method,
            },
          });
        }
        // Notification admin (fire-and-forget)
        void sendTransactionalEmail({
          templateName: 'admin-order',
          recipientEmail: establishment.contactEmail,
          idempotencyKey: `admin-order-${orderId}`,
          templateData: {
            orderNumber,
            familyName: `${profile?.prenom ?? ''} ${profile?.nom ?? ''}`.trim() || (profile?.email ?? ''),
            total,
            itemsCount: totalArticles,
          },
        });
        if (input.payment_method === 'cb_payplug') {
          const { paymentUrl } = await startPayplug({ data: { orderId } });
          if (paymentUrl) {
            window.location.href = paymentUrl;
            return;
          }
        }
        toast.success(`Commande ${orderNumber} confirmée`, {
          description: `Total ${total.toFixed(2)} € · ${input.shipping_label}`,
        });
        setConfirmOpen(false);
        navigate({ to: "/commandes" });
      })
      .catch((err) => toast.error(err.message ?? "Erreur lors de la commande"))
      .finally(() => setSubmitting(false));
  };

  const familyName = profile?.nom || "votre famille";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-10 left-0 -z-0 h-80 w-80 text-primary">
          <ShellMotif className="h-full w-full" opacity={0.035} />
        </div>
        <div className="relative flex items-baseline justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal-deep)]">
              <span className="h-px w-6 bg-[var(--rouge)]" /> Famille {familyName}
            </span>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Mon panier</h1>
            <p className="mt-1 text-sm italic text-muted-foreground">My cart</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {totalArticles} article{totalArticles > 1 ? "s" : ""} · {groups.length} enfant{groups.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/boutique" className="hidden text-sm text-[var(--teal-deep)] hover:underline sm:inline">
            ← Continuer · Continue
          </Link>
        </div>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {groups.map((group) => (
              <ChildGroup
                key={group.child.id}
                child={group.child}
                items={group.items}
                onQty={updateQty}
                onRemove={removeFromCart}
              />
            ))}
            {orphans.length > 0 && (
              <UnassignedGroup items={orphans} onQty={updateQty} onRemove={removeFromCart} />
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Récapitulatif · Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label={`Sous-total (${totalArticles} articles)`} value={`${subtotal.toFixed(2)} €`} />
                <Row label="Livraison à l'école" value="Offerte · Free" valueClass="text-[var(--teal-deep)]" />
                <Row label="TVA incluse · VAT incl." value={`${(subtotal * 0.2).toFixed(2)} €`} muted />
              </dl>
              <div className="my-5 h-px bg-border" />
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-foreground">Total</span>
                <span className="text-2xl font-semibold text-foreground">{total.toFixed(2)} €</span>
              </div>
              <button
                type="button"
                onClick={openConfirm}
                disabled={submitting}
                className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:bg-primary/90 disabled:opacity-60"
              >
                <Lock className="h-4 w-4" />
                Valider la commande · Confirm
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Paiement sécurisé · Secure · CB · 3× sans frais
              </p>

              <div className="mt-6 rounded-xl bg-[var(--teal)]/10 p-4 text-xs leading-relaxed text-foreground/80">
                <p className="font-semibold text-foreground">Livraison à l'établissement</p>
                <p className="mt-1">Vos commandes seront remises directement à votre enfant au secrétariat BISP, sous 5 à 7 jours ouvrés.</p>
                <p className="mt-2 italic text-muted-foreground">Delivered to BISP reception within 5–7 working days.</p>
              </div>
            </div>
          </aside>
        </div>
        )}
      </section>

      <CheckoutConfirmModal
        open={confirmOpen}
        total={total}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        submitting={submitting}
      />

      <SiteFooter />
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">Votre panier est vide</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your cart is empty</p>
      <Link
        to="/boutique"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Aller à la boutique · Go to shop
      </Link>
    </div>
  );
}

function ChildGroup({
  child,
  items,
  onQty,
  onRemove,
}: {
  child: Child;
  items: CartItem[];
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const reco = recommendSize({
    hauteur: child.hauteur,
    tour: child.tour,
    tour_taille: child.tour_taille,
    tour_bassin: child.tour_bassin,
  });
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border bg-secondary/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            {child.initials}
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Pour {child.prenom} {child.nom}</h3>
            <p className="text-xs text-muted-foreground">{child.classe} · {child.section}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {reco && <SizeBadge size={reco.row.age} />}
          <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {items.reduce((a, i) => a + i.qty, 0)} article{items.reduce((a, i) => a + i.qty, 0) > 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 px-6 py-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
              <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-foreground">{item.name}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">Réf. {item.ref}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-foreground/80">
                    Taille <span className="font-semibold">{item.size}</span>
                    {reco && item.size !== "Unique" && reco.row.age !== item.size && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                        Recommandé : {reco.row.age}
                      </span>
                    )}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-base font-semibold text-foreground">
                    {(item.qty * item.price).toFixed(2)} €
                  </div>
                  <div className="text-xs text-muted-foreground">{item.price.toFixed(2)} € l'unité</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex h-9 items-center rounded-lg border border-border bg-background">
                  <button onClick={() => onQty(item.id, item.qty - 1)} className="px-3 text-muted-foreground hover:text-foreground"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                  <button onClick={() => onQty(item.id, item.qty + 1)} className="px-3 text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
                </div>
                <button onClick={() => onRemove(item.id)} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[var(--rouge)]">
                  <Trash2 className="h-3.5 w-3.5" /> Retirer · Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UnassignedGroup({
  items,
  onQty,
  onRemove,
}: {
  items: CartItem[];
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-dashed border-border bg-card">
      <header className="border-b border-border bg-secondary/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">Articles sans enfant assigné</h3>
        <p className="text-xs text-muted-foreground">Réassignez ou retirez ces articles.</p>
      </header>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 px-6 py-5">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
              <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold text-foreground">{item.name}</h4>
              <p className="text-xs text-muted-foreground">Taille {item.size} · {item.qty} × {item.price.toFixed(2)} €</p>
            </div>
            <div className="inline-flex h-9 items-center rounded-lg border border-border bg-background">
              <button onClick={() => onQty(item.id, item.qty - 1)} className="px-3 text-muted-foreground hover:text-foreground"><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
              <button onClick={() => onQty(item.id, item.qty + 1)} className="px-3 text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <button onClick={() => onRemove(item.id)} className="text-muted-foreground hover:text-[var(--rouge)]">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Row({ label, value, valueClass = "", muted = false }: { label: string; value: string; valueClass?: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? "text-muted-foreground" : "text-foreground/80"}>{label}</dt>
      <dd className={`font-medium ${valueClass || (muted ? "text-muted-foreground" : "text-foreground")}`}>{value}</dd>
    </div>
  );
}
