import { Avatar, Button, Flex, Text } from '@radix-ui/themes'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export function TopBar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { i18n } = useTranslation()

  const initial = (user?.email ?? '?').charAt(0).toUpperCase()
  const currentLang = i18n.language.startsWith('id') ? 'id' : 'en'

  function toggleLanguage() {
    const next = currentLang === 'en' ? 'id' : 'en'
    i18n.changeLanguage(next)
  }

  return (
    <div className="top-bar">
      <Text size="4" weight="bold">
        🌱 Plant Tracker
      </Text>
      <Flex align="center" gap="3">
        <Button
          size="1"
          variant="ghost"
          color="gray"
          onClick={toggleLanguage}
          style={{ cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
        >
          🌐 {currentLang.toUpperCase()}
        </Button>
        <button
          onClick={() => navigate('/profile')}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
        >
          <Avatar
            size="2"
            radius="full"
            fallback={initial}
          />
        </button>
      </Flex>
    </div>
  )
}
