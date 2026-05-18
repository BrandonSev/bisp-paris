import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import { Ruler, Sparkles } from "lucide-react";
import { SizeBadge } from "@/components/SizeBadge";
import { useMemo, useState, useEffect } from "react";
import { ChildPicker } from "@/components/ChildPicker";
import { useStore } from "@/lib/store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RequireAuth } from "@/components/RequireAuth";
import { sizeRows, recommendSize } from "@/lib/sizeRecommendation";

export const Route = createFileRoute("/aide/guide-tailles")({
  head: () => ({
    meta: [
      { title: "Guide des tailles · Size guide — BISP" },
      { name: "description", content: "Tableau des tailles et conseils de mesure pour les uniformes BISP." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <GuideTaillesPage />
    </RequireAuth>
  ),
});

const measurePoints = [
  { n: 1, label: "Stature · Height", desc: "Hauteur totale, du sommet de la tête aux pieds." },
  { n: 2, label: "Tour de poitrine · Chest", desc: "Mesuré au niveau le plus fort de la poitrine." },
  { n: 3, label: "Tour de taille · Waist", desc: "Mesuré au creux naturel de la taille." },
  { n: 4, label: "Tour de bassin · Hips", desc: "Mesuré au niveau le plus fort des hanches." },
];

function GuideTaillesPage() {
  const { children, user } = useStore();
  const [childId, setChildId] = useState<string>("");

  useEffect(() => {
    if (!childId && children.length > 0) setChildId(children[0].id);
  }, [children, childId]);

  const selectedChild = useMemo(
    () => children.find((c) => c.id === childId) ?? null,
    [children, childId],
  );

  const recommendation = useMemo(() => {
    if (!selectedChild) return null;
    return recommendSize({
      hauteur: selectedChild.hauteur,
      tour: selectedChild.tour,
      tour_taille: selectedChild.tour_taille,
      tour_bassin: selectedChild.tour_bassin,
    });
  }, [selectedChild]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-10 right-0 -z-0 h-72 w-72 text-primary">
          <ShellMotif className="h-full w-full" opacity={0.04} />
        </div>
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal-deep)]">
          <span className="h-px w-6 bg-[var(--rouge)]" /> Aide · Help
        </span>
        <h1 className="mt-1 inline-flex items-center gap-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          <Ruler className="h-6 w-6 text-primary" /> Guide des tailles
        </h1>
        <p className="mt-1 text-sm italic text-muted-foreground">Size guide</p>

        <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <b>Ce tableau est un barème "corps à nu"</b> : il indique la taille adaptée à votre enfant
            pour une <b>première couche</b> (t-shirt, polo, chemise), basé sur les normes anthropométriques
            françaises (référentiel NF EN 13402).
          </p>
          <p>
            Pour les couches supérieures (sweat, hoodie, blazer), une recommandation spécifique est
            indiquée sur la fiche produit, intégrant l'aisance nécessaire.
          </p>
          <p>
            En cas d'hésitation entre deux tailles, privilégiez la taille supérieure.
          </p>
        </div>

        {user && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Suggestion personnalisée · Personalised
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Sélectionnez un enfant pour voir sa taille recommandée sur ce tableau.
            </p>
            <div className="mt-3">
              <ChildPicker value={childId} onChange={setChildId} />
            </div>

            {selectedChild && recommendation && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl bg-primary/5 px-3 py-2 text-xs">
                <SizeBadge size={recommendation.row.age} />
                <span className="text-muted-foreground">
                  {recommendation.drivers
                    .map((d) => `${d.key} ${d.value} cm → ${sizeRows[d.idx].age}`)
                    .join(" · ")}
                </span>
                {!recommendation.consistent && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-800">
                    Mesures discordantes : la taille la plus enveloppante est retenue.
                  </span>
                )}
              </div>
            )}

            {selectedChild && !recommendation && (
              <p className="mt-3 text-xs text-muted-foreground">
                Aucune mesure renseignée pour {selectedChild.prenom}. Complétez ses mensurations dans{" "}
                <a className="font-medium text-foreground underline" href="/enfants">Mes enfants</a>.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-secondary text-left text-[10px] uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                    <th scope="col" className="sticky left-0 z-10 bg-secondary px-2 py-2.5 sm:px-4 sm:py-3">Taille</th>
                    <th scope="col" className="px-2 py-2.5 sm:px-4 sm:py-3"><span className="inline-flex items-center gap-1.5"><NumberBadge n={1} /> Stature</span></th>
                    <th scope="col" className="px-2 py-2.5 sm:px-4 sm:py-3"><span className="inline-flex items-center gap-1.5"><NumberBadge n={2} /> Poitrine</span></th>
                    <th scope="col" className="px-2 py-2.5 sm:px-4 sm:py-3"><span className="inline-flex items-center gap-1.5"><NumberBadge n={3} /> Taille</span></th>
                    <th scope="col" className="px-2 py-2.5 sm:px-4 sm:py-3"><span className="inline-flex items-center gap-1.5"><NumberBadge n={4} /> Bassin</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sizeRows.map((r, i) => {
                    const isReco = recommendation?.idx === i;
                    return (
                      <tr key={r.age} className={isReco ? "bg-[var(--teal)]/15 ring-2 ring-inset ring-[var(--teal-deep)]" : i % 2 === 1 ? "bg-secondary/30" : undefined}>
                        <th scope="row" className={`sticky left-0 z-10 px-2 py-2.5 text-left font-semibold text-foreground sm:px-4 sm:py-3 ${isReco ? "bg-[var(--teal)]/25" : i % 2 === 1 ? "bg-secondary/60" : "bg-card"}`}>
                          <span className="inline-flex items-center gap-1.5">
                            {r.age}
                            {isReco && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help inline-flex items-center rounded-md bg-[var(--teal-deep)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                                      Reco
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs text-xs">
                                    Taille recommandée pour la 1ʳᵉ couche (t-shirt, polo, chemise).
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        </th>
                        <td className="whitespace-nowrap px-2 py-2.5 text-foreground/80 sm:px-4 sm:py-3">{r.stature}</td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-foreground/80 sm:px-4 sm:py-3">{r.poitrine}</td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-foreground/80 sm:px-4 sm:py-3">{r.taille}</td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-foreground/80 sm:px-4 sm:py-3">{r.bassin}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="border-t border-border bg-secondary/40 px-3 py-2 text-[11px] font-medium text-muted-foreground sm:px-4">
              Mesures en centimètres · cm. Faites défiler horizontalement si nécessaire.
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Points de mesure · Where to measure</h2>
            <ul className="mt-4 space-y-2.5">
              {measurePoints.map((p) => (
                <li key={p.n} className="flex gap-2.5 text-xs leading-relaxed">
                  <NumberBadge n={p.n} />
                  <div>
                    <div className="font-semibold text-foreground">{p.label}</div>
                    <div className="text-muted-foreground">{p.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function NumberBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {n}
    </span>
  );
}