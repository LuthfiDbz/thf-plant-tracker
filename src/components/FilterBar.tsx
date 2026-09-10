import { useState } from 'react'
import { Button, Dialog, Flex, Select, Text, TextField } from '@radix-ui/themes'
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
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<LogFilters>(filters)

  const activeCount =
    (filters.status !== 'all' ? 1 : 0) +
    (filters.plantDateFrom || filters.plantDateTo ? 1 : 0) +
    (filters.harvestDateFrom || filters.harvestDateTo ? 1 : 0)

  function handleOpen() {
    setDraft(filters) // sync draft with current applied filters
    setOpen(true)
  }

  function handleApply() {
    onChange(draft)
    setOpen(false)
  }

  function handleClear() {
    setDraft(emptyFilters)
    onChange(emptyFilters)
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) setOpen(false) }}>
      <Button variant="soft" color="gray" size="2" onClick={handleOpen}>
        <ListFilter size={16} />
        {t('filter.filter')}{activeCount > 0 ? ` (${activeCount})` : ''}
      </Button>

      <Dialog.Content maxWidth="420px">
        <Dialog.Title>{t('filter.filter')}</Dialog.Title>

        <Flex direction="column" gap="3" mt="2">
          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('filter.status')}
            </Text>
            <Select.Root
              value={draft.status}
              onValueChange={(v) => setDraft({ ...draft, status: v as LogStatus | 'all' })}
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
                style={{ flex: 1 }}
                value={draft.plantDateFrom}
                onChange={(e) => setDraft({ ...draft, plantDateFrom: e.target.value })}
              />
              <TextField.Root
                type="date"
                size="2"
                style={{ flex: 1 }}
                value={draft.plantDateTo}
                onChange={(e) => setDraft({ ...draft, plantDateTo: e.target.value })}
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
                style={{ flex: 1 }}
                value={draft.harvestDateFrom}
                onChange={(e) => setDraft({ ...draft, harvestDateFrom: e.target.value })}
              />
              <TextField.Root
                type="date"
                size="2"
                style={{ flex: 1 }}
                value={draft.harvestDateTo}
                onChange={(e) => setDraft({ ...draft, harvestDateTo: e.target.value })}
              />
            </Flex>
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="red" onClick={handleClear}>
            {t('filter.clear')}
          </Button>
          <Button onClick={handleApply}>
            {t('filter.apply')}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
