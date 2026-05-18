import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type OrderPdfData = {
  order: {
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    shipping_mode?: string | null;
    shipping_label?: string | null;
    shipping_recipient?: string | null;
    shipping_address?: string | null;
    shipping_postal?: string | null;
    shipping_city?: string | null;
    family_civilite?: string | null;
    family_prenom: string;
    family_nom: string;
    family_email: string;
    family_telephone?: string | null;
  };
  items: Array<{
    child_prenom: string;
    child_nom: string;
    child_classe: string | null;
    product_name: string;
    product_ref: string;
    variant: string | null;
    size: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
};

// Couleurs BISP (navy + rouge)
const NAVY: [number, number, number] = [13, 36, 64];
const ROUGE: [number, number, number] = [196, 30, 58];
const MUTED: [number, number, number] = [110, 120, 135];

const PICKUP_ADDRESS = "BISP — Bordeaux International School of Paris\n(Adresse de retrait à confirmer)";

export function generateOrderPdf({ order, items }: OrderPdfData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setFillColor(...ROUGE);
  doc.rect(0, 28, pageW, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("BISP — Bon de commande", 14, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Boutique uniformes & accessoires", 14, 20);

  doc.setFontSize(10);
  doc.text(order.order_number, pageW - 14, 13, { align: "right" });
  doc.setFontSize(9);
  doc.text(
    new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
    pageW - 14,
    20,
    { align: "right" },
  );

  // Famille
  let y = 40;
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Famille", 14, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  y += 6;
  doc.text(
    `${order.family_civilite ?? ""} ${order.family_prenom} ${order.family_nom}`.trim(),
    14,
    y,
  );
  y += 5;
  doc.text(order.family_email, 14, y);
  if (order.family_telephone) {
    y += 5;
    doc.text(order.family_telephone, 14, y);
  }

  // Livraison
  let yR = 40;
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Livraison", pageW / 2 + 5, yR);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  yR += 6;
  doc.text(order.shipping_label ?? "Retrait à l'établissement BISP", pageW / 2 + 5, yR);
  yR += 5;
  if (order.shipping_mode === "home") {
    if (order.shipping_recipient) {
      doc.text(order.shipping_recipient, pageW / 2 + 5, yR);
      yR += 5;
    }
    if (order.shipping_address) {
      doc.text(order.shipping_address, pageW / 2 + 5, yR);
      yR += 5;
    }
    doc.text(
      `${order.shipping_postal ?? ""} ${order.shipping_city ?? ""}`.trim(),
      pageW / 2 + 5,
      yR,
    );
  } else {
    doc.setTextColor(...MUTED);
    doc.setFontSize(9);
    const lines = PICKUP_ADDRESS.split("\n");
    for (const l of lines) {
      doc.text(l, pageW / 2 + 5, yR);
      yR += 4.5;
    }
  }

  const tableY = Math.max(y, yR) + 10;

  autoTable(doc, {
    startY: tableY,
    head: [["Enfant", "Produit", "Réf.", "Taille", "Qté", "PU", "Total"]],
    body: items.map((it) => [
      `${it.child_prenom} ${it.child_nom}${it.child_classe ? `\n${it.child_classe}` : ""}`,
      `${it.product_name}${it.variant ? `\n${it.variant}` : ""}`,
      it.product_ref,
      it.size,
      String(it.quantity),
      `${Number(it.unit_price).toFixed(2)} €`,
      `${Number(it.line_total).toFixed(2)} €`,
    ]),
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      4: { halign: "center" },
      5: { halign: "right" },
      6: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.3);
  doc.line(pageW - 80, finalY, pageW - 14, finalY);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.setFontSize(12);
  doc.text("Total", pageW - 80, finalY + 7);
  doc.text(`${Number(order.total_amount).toFixed(2)} €`, pageW - 14, finalY + 7, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Statut : ${order.status}`, 14, finalY + 7);

  // Footer
  const footY = doc.internal.pageSize.getHeight() - 12;
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "BISP — Document à conserver. Pour toute question : voir /aide/contact sur le portail famille.",
    pageW / 2,
    footY,
    { align: "center" },
  );

  return doc;
}

export function downloadOrderPdf(data: OrderPdfData) {
  const doc = generateOrderPdf(data);
  doc.save(`${data.order.order_number}.pdf`);
}