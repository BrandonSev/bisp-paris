import * as React from 'react'
import { Button, Text } from '@react-email/components'
import { EmailLayout, text, button, muted } from './_layout'

interface InviteEmailProps {
  siteName?: string
  siteUrl?: string
  confirmationUrl?: string
}

export const InviteEmail = ({
  siteName = 'France Uniformes',
  confirmationUrl = '#',
}: InviteEmailProps) => (
  <EmailLayout
    preview={`Vous avez été invité à rejoindre ${siteName}`}
    title="Vous avez été invité"
    signatureRole="Boutique"
  >
    <Text style={text}>Bonjour,</Text>
    <Text style={text}>
      Vous avez été invité à rejoindre <strong>{siteName}</strong>. Cliquez sur
      le bouton ci-dessous pour accepter l'invitation et créer votre compte.
    </Text>
    <Button href={confirmationUrl} style={button}>
      Accepter l'invitation
    </Button>
    <Text style={muted}>
      Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.
    </Text>
  </EmailLayout>
)

export default InviteEmail