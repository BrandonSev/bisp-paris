import * as React from 'react'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'BISP Paris'

interface OrderConfirmationProps {
  firstName?: string
  orderNumber?: string
  total?: number
  shippingLabel?: string
  paymentLabel?: string
}

const OrderConfirmationEmail = ({
  firstName,
  orderNumber,
  total,
  shippingLabel,
  paymentLabel,
}: OrderConfirmationProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Votre commande {orderNumber ?? ''} est confirmée</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Merci {firstName ?? ''} !</Heading>
        <Text style={text}>
          Nous avons bien reçu votre commande <strong>{orderNumber ?? '—'}</strong> sur
          {' '}{SITE_NAME}.
        </Text>
        <Section style={card}>
          <Text style={row}><strong>Total :</strong> {total !== undefined ? `${total.toFixed(2)} €` : '—'}</Text>
          {shippingLabel && <Text style={row}><strong>Livraison :</strong> {shippingLabel}</Text>}
          {paymentLabel && <Text style={row}><strong>Paiement :</strong> {paymentLabel}</Text>}
        </Section>
        <Hr style={hr} />
        <Text style={text}>
          Vous pouvez suivre l'état de votre commande depuis votre espace
          <em> Mes commandes</em>.
        </Text>
        <Text style={footer}>L'équipe {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: (d: Record<string, any>) =>
    `Commande ${d?.orderNumber ?? ''} confirmée · ${SITE_NAME}`.trim(),
  displayName: 'Confirmation de commande',
  previewData: {
    firstName: 'Marie',
    orderNumber: 'BISP-2026-0042',
    total: 124.5,
    shippingLabel: "Retrait à l'établissement BISP",
    paymentLabel: 'Carte bancaire',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0c2340', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 16px' }
const card = { backgroundColor: '#f5f7fa', borderRadius: '10px', padding: '16px 20px', margin: '16px 0' }
const row = { fontSize: '14px', color: '#0c2340', margin: '4px 0' }
const hr = { borderColor: '#e6e8ec', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '24px 0 0' }