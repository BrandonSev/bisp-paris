import * as React from 'react'
import { Button, Text } from '@react-email/components'
import { EmailLayout, text, button, muted } from './_layout'

interface RecoveryEmailProps {
  siteName?: string
  confirmationUrl?: string
}

export const RecoveryEmail = ({ confirmationUrl = '#' }: RecoveryEmailProps) => (
  <EmailLayout
    preview="Réinitialisation de votre mot de passe"
    title="Réinitialisation du mot de passe"
    signatureRole="Boutique"
  >
    <Text style={text}>Bonjour,</Text>
    <Text style={text}>
      Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton
      ci-dessous pour en définir un nouveau :
    </Text>
    <Button href={confirmationUrl} style={button}>
      Réinitialiser mon mot de passe
    </Button>
    <Text style={muted}>
      Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet
      email. Ce lien expire prochainement.
    </Text>
  </EmailLayout>
)

export default RecoveryEmail
