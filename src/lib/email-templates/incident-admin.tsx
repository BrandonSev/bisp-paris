import * as React from 'react'
import { Button, Text } from '@react-email/components'
import { EmailLayout, text, button, list, muted } from './_layout'
import type { TemplateEntry } from './registry'

const APP_URL = 'https://bisp.franceuniformes.fr'
const INCIDENT_LABELS: Record<string, string> = {
  malfacon: 'Malfaçon / défaut', erreur_envoi: "Erreur d'envoi", article_manquant: 'Article manquant',
  taille_inadaptee: 'Taille inadaptée', usure_normale: 'Usure normale', autre: 'Autre',
}

interface Props { orderNumber?: string; family?: string; productName?: string; type?: string; description?: string; appUrl?: string }

function IncidentAdminEmail({ orderNumber = '', family = '', productName = '', type = '', description = '', appUrl = APP_URL }: Props) {
  return (
    <EmailLayout preview={`Incident commande ${orderNumber}`} title="Nouvel incident déclaré" signatureRole="Service après-vente">
      <Text style={text}>Une famille vient de déclarer un incident sur la boutique BISP :</Text>
      <ul style={list}>
        <li><strong>Commande :</strong> {orderNumber}</li>
        <li><strong>Famille :</strong> {family}</li>
        <li><strong>Article :</strong> {productName}</li>
        <li><strong>Motif :</strong> {INCIDENT_LABELS[type] ?? type}</li>
      </ul>
      <Text style={muted}>{description}</Text>
      <Button href={`${appUrl}/admin`} style={button}>Traiter l'incident</Button>
    </EmailLayout>
  )
}

export const template = {
  component: IncidentAdminEmail,
  subject: (d: Record<string, any>) => `Incident — Commande ${d.orderNumber ?? ''}`,
  displayName: 'Incident — notification admin',
  previewData: { orderNumber: 'BISP-2026-0042', family: 'Marie Dupont', productName: 'Polo BISP marine', type: 'malfacon', description: 'Couture défaite au col.' },
} satisfies TemplateEntry