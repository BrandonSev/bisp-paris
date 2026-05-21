import * as React from 'react'
import { Button, Text } from '@react-email/components'
import { EmailLayout, text, button, muted } from './_layout'

interface SignupEmailProps {
  siteName?: string
  siteUrl?: string
  recipient?: string
  confirmationUrl?: string
}

export const SignupEmail = ({
  siteName = 'France Uniformes',
  recipient,
  confirmationUrl = '#',
}: SignupEmailProps) => (
  <EmailLayout
    preview={`Confirmez votre adresse email pour ${siteName}`}
    title="Confirmez votre adresse email"
    signatureRole="Boutique"
  >
    <Text style={text}>Bonjour,</Text>
    <Text style={text}>
      Merci de votre inscription sur <strong>{siteName}</strong>
      {recipient ? <> avec l'adresse <strong>{recipient}</strong></> : null}.
    </Text>
    <Text style={text}>
      Confirmez votre adresse email en cliquant sur le bouton ci-dessous :
    </Text>
    <Button href={confirmationUrl} style={button}>
      Confirmer mon email
    </Button>
    <Text style={muted}>
      Si vous n'avez pas créé de compte, vous pouvez ignorer cet email en toute
      sécurité.
    </Text>
  </EmailLayout>
)

export default SignupEmail