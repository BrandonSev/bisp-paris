import { useStore } from "@/lib/store";

type Props = {
  value: string;
  onChange: (id: string) => void;
  className?: string;
};

export function ChildPicker({ value, onChange, className = "" }: Props) {
  const { children } = useStore();
  if (children.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Aucun enfant enregistré. <a href="/enfants" className="underline">Ajouter un enfant</a>
      </p>
    );
  }
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${className}`}
    >
      {children.map((c) => (
        <option key={c.id} value={c.id}>
          {c.prenom} {c.nom} · {c.classe || c.section}
        </option>
      ))}
    </select>
  );
}