import * as React from 'react'
import { Text } from '@react-email/components'
import { EmailLayout, text, muted } from './_layout'

interface ReauthenticationEmailProps {
  token?: string
}

export const ReauthenticationEmail = ({ token = '------' }: ReauthenticationEmailProps) => (
  <EmailLayout
    preview="Votre code de vérification"
    title="Code de vérification"
    signatureRole="Boutique"
  >
    <Text style={text}>Bonjour,</Text>
    <Text style={text}>Utilisez le code ci-dessous pour confirmer votre identité :</Text>
    <Text style={codeStyle}>{token}</Text>
    <Text style={muted}>
      Ce code expirera prochainement. Si vous n'êtes pas à l'origine de cette
      demande, vous pouvez ignorer cet email.
    </Text>
  </EmailLayout>
)

export default ReauthenticationEmail

const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#0a2540',
  letterSpacing: '6px',
  margin: '8px 0 20px',
}