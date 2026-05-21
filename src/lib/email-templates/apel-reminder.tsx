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

function ApelReminder({ prenom, familyName, deadline = "24 mai 2026", appUrl = APP_URL, customMessage }: Props) {
  return (
    <EmailLayout
      preview="Pensez à commander les uniformes pour la rentrée"
      title="Rappel — Commande pour la rentrée"
      familyName={familyName}
      signatureRole="APEL"
    >
      <Text style={text}>Bonjour {prenom || ""},</Text>
      <Text style={text}>
        L'<strong>Association des Parents d'Élèves</strong> de BISP Paris vous rappelle que vous n'avez pas encore
        passé commande des uniformes pour la rentrée.
      </Text>
      {customMessage ? <Text style={text}>{customMessage}</Text> : null}
      <Text style={text}>
        Pour garantir la fabrication et la livraison à temps, merci de passer votre commande avant le{" "}
        <strong>{deadline}</strong>. Au-delà de cette date, la disponibilité ne pourra plus être garantie.
      </Text>
      <Button href={`${appUrl}/boutique`} style={button}>
        Commander maintenant
      </Button>
      <Text style={muted}>
        Cet email vous est envoyé par l'APEL via la boutique en ligne BISP.
        <br />
        Si vous avez déjà commandé, merci d'ignorer ce message.
      </Text>
    </EmailLayout>
  );
}

export const template = {
  component: ApelReminder,
  subject: "Rappel APEL — Commande des uniformes pour la rentrée",
  displayName: "Relance APEL (rentrée)",
  previewData: { prenom: "Marie", familyName: "Dupont", deadline: "24 mai 2026", appUrl: APP_URL },
} satisfies TemplateEntry;