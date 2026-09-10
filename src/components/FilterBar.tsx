import { Button, Flex, Popover, Select, Text, TextField } from '@radix-ui/themes'
import { ListFilter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { LogStatus } from '../lib/types'
import { STATUS_FLOW } from '../lib/types'

export interface LogFilters {
  status: LogStatus | 'all'
  plantDateFrom: string
  plantDateTo: string
  harvestDateFrom: string
  harvestDateTo: string
}

export const emptyFilters: LogFilters = {
  status: 'all',
  plantDateFrom: '',
  plantDateTo: '',
  harvestDateFrom: '',
  harvestDateTo: '',
}

interface Props {
  filters: LogFilters
  onChange: (filters: LogFilters) => void
}

export function FilterBar({ filters, onChange }: Props) {
  const { t } = useTranslation()

  const activeCount =
    (filters.status !== 'all' ? 1 : 0) +
    (filters.plantDateFrom || filters.plantDateTo ? 1 : 0) +
    (filters.harvestDateFrom || filters.harvestDateTo ? 1 : 0)

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft" color="gray" size="2">
          <ListFilter size={16} />
          {t('filter.filter')}{activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: 280 }}>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('filter.status')}
            </Text>
            <Select.Root
              value={filters.status}
              onValueChange={(v) => onChange({ ...filters, status: v as LogStatus | 'all' })}
            >
              <Select.Trigger style={{ width: '100%' }} />
              <Select.Content>
                <Select.Item value="all">{t('status.all')}</Select.Item>
                {STATUS_FLOW.map((s) => (
                  <Select.Item key={s} value={s}>
                    {t(`status.${s.toLowerCase()}`)}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('filter.plant_date')}
            </Text>
            <Flex gap="2">
              <TextField.Root
                type="date"
                size="2"
                value={filters.plantDateFrom}
                onChange={(e) => onChange({ ...filters, plantDateFrom: e.target.value })}
              />
              <TextField.Root
                type="date"
                size="2"
                value={filters.plantDateTo}
                onChange={(e) => onChange({ ...filters, plantDateTo: e.target.value })}
              />
            </Flex>
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('filter.harvest_date')}
            </Text>
            <Flex gap="2">
              <TextField.Root
                type="date"
                size="2"
                value={filters.harvestDateFrom}
                onChange={(e) => onChange({ ...filters, harvestDateFrom: e.target.value })}
              />
              <TextField.Root
                type="date"
                size="2"
                value={filters.harvestDateTo}
                onChange={(e) => onChange({ ...filters, harvestDateTo: e.target.value })}
              />
            </Flex>
          </label>

          <Button variant="soft" color="gray" size="1" onClick={() => onChange(emptyFilters)}>
            {t('filter.clear')}
          </Button>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  )
}
