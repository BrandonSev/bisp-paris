import * as React from 'react'
import { Button, Text } from '@react-email/components'
import { EmailLayout, text, button, muted } from './_layout'

interface EmailChangeEmailProps {
  siteName?: string
  oldEmail?: string
  email?: string
  newEmail?: string
  confirmationUrl?: string
}

export const EmailChangeEmail = ({
  siteName = 'France Uniformes',
  oldEmail,
  newEmail,
  confirmationUrl = '#',
}: EmailChangeEmailProps) => (
  <EmailLayout
    preview={`Confirmez votre nouvelle adresse email pour ${siteName}`}
    title="Confirmez votre nouvelle adresse"
    signatureRole="Boutique"
  >
    <Text style={text}>Bonjour,</Text>
    <Text style={text}>
      Vous avez demandé à changer l'adresse email associée à votre compte
      {' '}{siteName}
      {oldEmail && newEmail ? (
        <>
          {' '}de <strong>{oldEmail}</strong> vers <strong>{newEmail}</strong>
        </>
      ) : null}
      .
    </Text>
    <Text style={text}>
      Cliquez sur le bouton ci-dessous pour confirmer ce changement :
    </Text>
    <Button href={confirmationUrl} style={button}>
      Confirmer le changement
    </Button>
    <Text style={muted}>
      Si vous n'êtes pas à l'origine de cette demande, sécurisez votre compte
      immédiatement.
    </Text>
  </EmailLayout>
)

export default EmailChangeEmail