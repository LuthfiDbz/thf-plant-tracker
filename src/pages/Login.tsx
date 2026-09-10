import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Button, Callout, Card, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { t } = useTranslation()
  const { session, loading } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) {
    return <Navigate to="/soil" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    if (mode === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) setError(signInError.message)
    } else {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) setError(signUpError.message)
      else setInfo(t('login.check_email'))
    }
    setSubmitting(false)
  }

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh', padding: 16 }}>
      <Card size="4" style={{ width: '100%', maxWidth: 360 }}>
        <Flex direction="column" gap="4">
          <Flex direction="column" align="center" gap="1">
            <Heading size="6">{t('app.title')}</Heading>
            <Text size="2" color="gray">
              {mode === 'signin' ? t('login.signin_title') : t('login.signup_title')}
            </Text>
          </Flex>

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  {t('login.email')}
                </Text>
                <TextField.Root
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  {t('login.password')}
                </Text>
                <TextField.Root
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </label>

              {error && (
                <Callout.Root color="red" size="1">
                  <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
              )}
              {info && (
                <Callout.Root color="green" size="1">
                  <Callout.Text>{info}</Callout.Text>
                </Callout.Root>
              )}

              <Button type="submit" loading={submitting}>
                {mode === 'signin' ? t('login.signin_btn') : t('login.signup_btn')}
              </Button>
            </Flex>
          </form>

          <Text size="2" align="center" color="gray">
            {mode === 'signin' ? t('login.no_account') : t('login.has_account')}
            <Text
              as="span"
              color="green"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError('')
                setInfo('')
              }}
            >
              {mode === 'signin' ? t('login.signup_btn') : t('login.signin_btn')}
            </Text>
          </Text>
        </Flex>
      </Card>
    </Flex>
  )
}
