import { useTranslation } from 'react-i18next'
import LogListPage from './LogListPage'

export default function Soil() {
  const { t } = useTranslation()
  return <LogListPage methodId={1} title={t('nav.soil')} accentColor="brown" />
}
