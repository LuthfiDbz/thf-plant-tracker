import { useTranslation } from 'react-i18next'
import LogListPage from './LogListPage'

export default function Hydroponic() {
  const { t } = useTranslation()
  return <LogListPage methodId={2} title={t('nav.hydroponic')} accentColor="blue" />
}
