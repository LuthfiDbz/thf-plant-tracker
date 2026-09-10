import { Avatar, Button, Card, Flex, Heading, Select, Text } from '@radix-ui/themes'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const displayName = (user?.user_metadata?.name as string | undefined) ?? user?.email ?? 'User'
  const initial = displayName.charAt(0).toUpperCase()
  const currentLang = i18n.language.startsWith('id') ? 'id' : 'en'

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  function handleLanguageChange(lang: string) {
    i18n.changeLanguage(lang)
  }

  return (
    <Flex direction="column" align="center" gap="4" style={{ paddingTop: 24, maxWidth: 360, margin: '0 auto' }}>
      <Avatar size="6" radius="full" fallback={initial} />
      <Flex direction="column" align="center" gap="1">
        <Heading size="5">Admin</Heading>
        <Text size="2" color="gray">
          {user?.email}
        </Text>
      </Flex>

      <Card size="2" style={{ width: '100%' }}>
        <Flex justify="between" align="center" gap="3">
          <Text size="2" weight="medium">
            🌐 {t('profile.language')}
          </Text>
          <Select.Root value={currentLang} onValueChange={handleLanguageChange}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="en">{t('profile.english')}</Select.Item>
              <Select.Item value="id">{t('profile.indonesian')}</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Card>

      <Button color="red" variant="soft" onClick={handleLogout} style={{ width: '100%', marginTop: 8 }}>
        {t('profile.logout')}
      </Button>
    </Flex>
  )
}
