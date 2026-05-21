import * as React from "react";
import { Button, Text } from "@react-email/components";
import { EmailLayout, text, muted, button } from "./_layout";
import type { TemplateEntry } from "./registry";

interface Props {
  prenom?: string;
  familyName?: string;
  deadline?: string;
  appUrl?: string;
  customMessage?: string;
}

const APP_URL = "https://bisp.franceuniformes.fr";

function RentreeReminder({ prenom, familyName, deadline = "30 juin 2026", appUrl = APP_URL, customMessage }: Props) {
  return (
    <EmailLayout
      preview="Pensez à commander les uniformes BISP pour la rentrée 2026"
      title="Rappel — Commande pour la rentrée 2026"
      familyName={familyName}
      signatureRole="Boutique"
    >
      <Text style={text}>Bonjour {prenom || ""},</Text>
      <Text style={text}>
        La <strong>Bilingual International School of Paris</strong> vous rappelle que vous n'avez pas encore
        passé commande des uniformes pour la rentrée 2026.
      </Text>
      {customMessage && <Text style={text}>{customMessage}</Text>}
      <Text style={text}>
        Pour garantir la fabrication et la livraison à temps, merci de passer votre commande avant le{" "}
        <strong>{deadline}</strong>. Au-delà de cette date, nous ne pourrons plus garantir la disponibilité des
        uniformes pour la rentrée.
      </Text>
      <Button href={`${appUrl}/boutique`} style={button}>
        Commander maintenant
      </Button>
      <Text style={muted}>
        Cet email vous est envoyé par la boutique BISP.
        <br />
        Si vous avez déjà commandé, merci d'ignorer ce message.
      </Text>
    </EmailLayout>
  );
}

export const template = {
  component: RentreeReminder,
  subject: "Rappel BISP — Commande des uniformes pour la rentrée 2026",
  displayName: "Relance rentrée",
  previewData: { prenom: "Marie", familyName: "Dupont", deadline: "30 juin 2026", appUrl: APP_URL },
} satisfies TemplateEntry;