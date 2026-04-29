import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Minus, Plus, Trash2 } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import polo from "@/assets/polo-bisp.jpg";
import pull from "@/assets/pull-bisp.jpg";
import tshirt from "@/assets/tshirt-bisp.jpg";
import trousses from "@/assets/trousses-bisp.png";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [{ title: "Mon panier · My cart — BISP" }],
  }),
  component: PanierPage,
});

const cart = [
  {
    enfant: "Emma Dubois",
    classe: "CE2 · Élémentaire",
    initials: "ED",
    color: "bg-[var(--teal)]/15 text-[var(--teal-deep)]",
    items: [
      { name: "Polo blanc officiel", ref: "BISP-POLO-001", size: "8 ans", qty: 3, price: 28.0, image: polo },
      { name: "Trousse écussonnée bleu marine", ref: "BISP-TROUSSE-01", size: "Unique", qty: 1, price: 18.0, image: trousses },
    ],
  },
  {
    enfant: "Thomas Dubois",
    classe: "6ᵉ B · Collège",
    initials: "TD",
    color: "bg-primary/15 text-primary",
    items: [
      { name: "Polo blanc officiel", ref: "BISP-POLO-001", size: "M", qty: 3, price: 28.0, image: polo },
      { name: "Pull col V bleu marine", ref: "BISP-PULL-002", size: "M", qty: 1, price: 48.0, image: pull },
      { name: "T-shirt sport BISP", ref: "BISP-TSHIRT-EPS", size: "M", qty: 2, price: 22.0, image: tshirt },
    ],
  },
];

function PanierPage() {
  const totalArticles = cart.reduce((s, e) => s + e.items.reduce((a, i) => a + i.qty, 0), 0);
  const subtotal = cart.reduce(
    (s, e) => s + e.items.reduce((a, i) => a + i.qty * i.price, 0),
    0,
  );
  const delivery = 0;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" cartCount={totalArticles} />

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-10 left-0 -z-0 h-80 w-80 text-primary">
          <ShellMotif className="h-full w-full" opacity={0.035} />
        </div>
        <div className="relative flex items-baseline justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal-deep)]">
              <span className="h-px w-6 bg-[var(--rouge)]" /> Famille Dubois
            </span>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Mon panier</h1>
            <p className="mt-1 text-sm italic text-muted-foreground">My cart</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {totalArticles} articles · répartis pour {cart.length} enfants
            </p>
          </div>
          <Link to="/niveau" className="hidden text-sm text-[var(--teal-deep)] hover:underline sm:inline">
            ← Continuer · Continue
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {cart.map((group) => (
              <ChildGroup key={group.enfant} group={group} />
            ))}
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
              <button className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:bg-primary/90">
                <Lock className="h-4 w-4" />
                Passer au paiement · Checkout
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
      </section>

      <SiteFooter />
    </div>
  );
}

function ChildGroup({ group }: { group: (typeof cart)[number] }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border bg-secondary/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${group.color}`}>
            {group.initials}
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Pour {group.enfant}</h3>
            <p className="text-xs text-muted-foreground">{group.classe}</p>
          </div>
        </div>
        <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          {group.items.reduce((a, i) => a + i.qty, 0)} articles
        </span>
      </header>

      <ul className="divide-y divide-border">
        {group.items.map((item, idx) => (
          <li key={`${item.ref}-${idx}`} className="flex items-center gap-4 px-6 py-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
              <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-foreground">{item.name}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">Réf. {item.ref}</p>
                  <p className="mt-2 text-xs text-foreground/80">
                    Taille <span className="font-semibold">{item.size}</span>
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
                  <button className="px-3 text-muted-foreground hover:text-foreground"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                  <button className="px-3 text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
                </div>
                <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[var(--rouge)]">
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

function Row({ label, value, valueClass = "", muted = false }: { label: string; value: string; valueClass?: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? "text-muted-foreground" : "text-foreground/80"}>{label}</dt>
      <dd className={`font-medium ${valueClass || (muted ? "text-muted-foreground" : "text-foreground")}`}>{value}</dd>
    </div>
  );
}
