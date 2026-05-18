import * as React from 'react'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'BISP Paris'

interface OrderPaidProps {
  firstName?: string
  orderNumber?: string
  total?: number
}

const OrderPaidEmail = ({ firstName, orderNumber, total }: OrderPaidProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Paiement reçu pour la commande {orderNumber ?? ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Paiement confirmé</Heading>
        <Text style={text}>
          Bonjour {firstName ?? ''}, nous avons bien reçu votre paiement de
          {' '}<strong>{total !== undefined ? `${total.toFixed(2)} €` : '—'}</strong>
          {' '}pour la commande <strong>{orderNumber ?? '—'}</strong>.
        </Text>
        <Text style={text}>
          Votre commande est maintenant en préparation. Vous serez prévenu(e)
          dès qu'elle sera disponible.
        </Text>
        <Text style={footer}>L'équipe {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderPaidEmail,
  subject: (d: Record<string, any>) =>
    `Paiement reçu · Commande ${d?.orderNumber ?? ''}`.trim(),
  displayName: 'Paiement reçu',
  previewData: { firstName: 'Marie', orderNumber: 'BISP-2026-0042', total: 124.5 },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0c2340', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#999999', margin: '24px 0 0' }