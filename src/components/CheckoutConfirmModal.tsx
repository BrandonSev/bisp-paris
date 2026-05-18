import { useEffect, useState } from "react";
import { X, Truck, Store, Loader2, CreditCard, FileText, Banknote, Wallet } from "lucide-react";
import { fetchDeliveryOptions, type DeliveryOption } from "@/lib/deliveryOptions";
import type { CheckoutInput } from "@/lib/store";
import { useStore } from "@/lib/store";

type Props = {
  open: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (input: CheckoutInput) => Promise<void> | void;
  submitting?: boolean;
};

export function CheckoutConfirmModal({ open, total, onClose, onConfirm, submitting }: Props) {
  const { profile } = useStore();
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [selected, setSelected] = useState<string>("pickup");
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState<'cb_payplug' | 'cheque' | 'virement' | 'especes'>('cb_payplug');

  useEffect(() => {
    if (!open) return;
    fetchDeliveryOptions().then((opts) => {
      setOptions(opts);
      if (opts.length > 0) setSelected(opts[0].code);
    });
    if (profile) {
      setRecipient(`${profile.prenom} ${profile.nom}`.trim());
      setAddress(profile.adresse ?? "");
      setPostal(profile.code_postal ?? "");
      setCity(profile.ville ?? "");
    }
  }, [open, profile]);

  if (!open) return null;

  const selectedOpt = options.find((o) => o.code === selected);
  const needsAddress = selected === "home";
  const canConfirm =
    !!selectedOpt &&
    (!needsAddress || (recipient.trim() && address.trim() && postal.trim() && city.trim()));

  const handleConfirm = () => {
    if (!selectedOpt) return;
    const payload: CheckoutInput = {
      shipping_mode: selectedOpt.code,
      shipping_label: selectedOpt.label,
      payment_method: payment,
    };
    if (needsAddress) {
      payload.shipping_recipient = recipient.trim();
      payload.shipping_address = address.trim();
      payload.shipping_postal = postal.trim();
      payload.shipping_city = city.trim();
    }
    onConfirm(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]">
        <header className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Confirmer la commande</h2>
            <p className="mt-0.5 text-xs italic text-muted-foreground">Choose delivery method</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            {options.map((opt) => {
              const isOn = opt.code === selected;
              const Icon = opt.code === "home" ? Truck : Store;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.code)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                    isOn
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${isOn ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                      <span className={`h-4 w-4 shrink-0 rounded-full border-2 ${isOn ? "border-primary bg-primary" : "border-border"}`} />
                    </div>
                    {opt.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {needsAddress && (
            <div className="space-y-3 rounded-xl bg-secondary/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Adresse de livraison
              </p>
              <Field label="Destinataire" value={recipient} onChange={setRecipient} />
              <Field label="Adresse" value={address} onChange={setAddress} />
              <div className="grid grid-cols-[110px_1fr] gap-3">
                <Field label="Code postal" value={postal} onChange={setPostal} />
                <Field label="Ville" value={city} onChange={setCity} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mode de paiement · Payment method
            </p>
            {PAYMENT_METHODS.map((m) => {
              const isOn = m.code === payment;
              const Icon = m.icon;
              return (
                <button
                  key={m.code}
                  type="button"
                  onClick={() => setPayment(m.code)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                    isOn
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${isOn ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{m.label}</span>
                      <span className={`h-4 w-4 shrink-0 rounded-full border-2 ${isOn ? "border-primary bg-primary" : "border-border"}`} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border bg-secondary/40 px-6 py-4">
          <div>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-xl font-semibold text-foreground">{total.toFixed(2)} €</div>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || submitting}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Validation…" : "Confirmer · Confirm"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}