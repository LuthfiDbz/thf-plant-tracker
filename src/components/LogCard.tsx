import { Card, Flex, Text } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import type { PlantLog } from '../lib/types'
import { StatusBadge } from './StatusBadge'

function formatDate(dateStr: string, locale: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = y && m && d ? new Date(y, m - 1, d) : new Date(dateStr)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function LogCard({ log, onClick }: { log: PlantLog; onClick: () => void }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('id') ? 'id-ID' : 'en-GB'

  return (
    <Card onClick={onClick} style={{ cursor: 'pointer', marginBottom: 12 }}>
      <Flex gap="3" align="center">
        <img
          className="log-card-image"
          src={log.plants?.image_url ?? undefined}
          alt={log.plants?.name ?? t('card.unknown_plant')}
        />
        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Flex>
             <StatusBadge status={log.status} />
          </Flex>   
          <Flex align="center" justify="between">
            <Text weight="bold" size="3" truncate>
              {log.plants?.name ?? t('card.unknown_plant')}
            </Text>
          </Flex>
          <Text size="1" color="gray">
            {t('card.planted')} {formatDate(log.plant_date, locale)}
          </Text>
          <Text size="1" color="gray">
            {t('card.target_harvest')} {formatDate(log.harvest_date, locale)}
          </Text>
          {log.notes && (
            <Text size="1" color="gray" mt="1" style={{ whiteSpace: 'pre-wrap' }}>
              {t('card.notes')}: <br />
              {log.notes}
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
