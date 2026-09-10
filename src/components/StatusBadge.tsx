import { Badge } from '@radix-ui/themes'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import type { LogStatus } from '../lib/types'

const statusColor: Record<LogStatus, ComponentProps<typeof Badge>['color']> = {
  Seedling: 'yellow',
  Planting: 'green',
  Harvested: 'gray',
}

export function StatusBadge({ status }: { status: LogStatus }) {
  const { t } = useTranslation()

  return (
    <Badge color={statusColor[status]} variant="soft">
      {t(`status.${status.toLowerCase()}`)}
    </Badge>
  )
}

