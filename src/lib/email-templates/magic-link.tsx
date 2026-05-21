import * as React from 'react'
import { Button, Text } from '@react-email/components'
import { EmailLayout, text, button, muted } from './_layout'

interface MagicLinkEmailProps {
  siteName?: string
  confirmationUrl?: string
}

export const MagicLinkEmail = ({
  siteName = 'France Uniformes',
  confirmationUrl = '#',
}: MagicLinkEmailProps) => (
  <EmailLayout
    preview={`Votre lien de connexion pour ${siteName}`}
    title="Votre lien de connexion"
    signatureRole="Boutique"
  >
    <Text style={text}>Bonjour,</Text>
    <Text style={text}>
      Cliquez sur le bouton ci-dessous pour vous connecter à {siteName}. Ce
      lien expirera prochainement.
    </Text>
    <Button href={confirmationUrl} style={button}>
      Se connecter
    </Button>
    <Text style={muted}>
      Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet
      email.
    </Text>
  </EmailLayout>
)

export default MagicLinkEmail