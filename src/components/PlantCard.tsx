import { Card, Flex, Text } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import type { Plant } from '../lib/types'

export function PlantCard({ plant, onClick }: { plant: Plant; onClick: () => void }) {
  const { t } = useTranslation()

  return (
    <Card onClick={onClick} style={{ cursor: 'pointer', marginBottom: 12 }}>
      <Flex gap="3" align="center">
        {plant.image_url ? (
          <img
            className="plant-card-image"
            src={plant.image_url}
            alt={plant.name}
          />
        ) : (
          <div className="plant-card-avatar" aria-label={plant.name}>
            THF
          </div>
        )}
        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Text weight="bold" size="3" truncate>
            {plant.name}
          </Text>
          <Text size="1" color="gray">
            {t('card.takes_days', { name: plant.name, days: plant.estimated_harvest_days })}
          </Text>
          {plant.notes && (
            <Text size="1" color="gray" style={{ whiteSpace: 'pre-wrap' }}>
              {plant.notes}
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
