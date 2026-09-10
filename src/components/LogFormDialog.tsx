import { useEffect, useState } from 'react'
import { Button, Dialog, Flex, Select, Text, TextArea, TextField } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import type { MethodId, LogStatus, Plant, PlantLog } from '../lib/types'
import { STATUS_FLOW } from '../lib/types'
import { addDays, todayStr } from '../lib/harvestStatus'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface Props {
  open: boolean
  onClose: () => void
  defaultMethodId: MethodId
  plants: Plant[]
  editingLog: PlantLog | null
  onSaved: (log: PlantLog) => void
}

function formatDisplayDate(dateStr: string, locale: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return dateStr
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function LogFormDialog({ open, onClose, defaultMethodId, plants, editingLog, onSaved }: Props) {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('id') ? 'id-ID' : 'en-GB'
  const [plantId, setPlantId] = useState('')
  const [methodId, setMethodId] = useState<MethodId>(defaultMethodId)
  const [status, setStatus] = useState<LogStatus>('Seedling')
  const [plantDate, setPlantDate] = useState(todayStr())
  const [harvestDate, setHarvestDate] = useState(todayStr())
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (editingLog) {
      setPlantId(editingLog.plant_id)
      setMethodId(editingLog.method_id)
      setStatus(editingLog.status)
      setPlantDate(editingLog.plant_date)
      setHarvestDate(editingLog.harvest_date)
      setNotes(editingLog.notes ?? '')
    } else {
      setPlantId('')
      setMethodId(defaultMethodId)
      setStatus('Seedling')
      setPlantDate(todayStr())
      setHarvestDate(todayStr())
      setNotes('')
    }
    setError('')
  }, [open, editingLog, defaultMethodId])

  const selectedPlant = plants.find((p) => p.id === plantId)

  function handlePlantChange(id: string) {
    setPlantId(id)
    const plant = plants.find((p) => p.id === id)
    if (plant && !editingLog) {
      setHarvestDate(addDays(plantDate, plant.estimated_harvest_days))
    }
  }

  async function handleSubmit() {
    if (!plantId || !plantDate || !harvestDate) {
      setError(t('log_form.fill_error'))
      return
    }
    if (!user) return

    setSaving(true)
    setError('')

    const payload = {
      plant_id: plantId,
      method_id: methodId,
      status,
      plant_date: plantDate,
      harvest_date: harvestDate,
      notes: notes || null,
      user_id: user.id,
    }

    const query = editingLog
      ? supabase.from('plant_logs').update(payload).eq('id', editingLog.id).select('*, plants(*)').single()
      : supabase.from('plant_logs').insert(payload).select('*, plants(*)').single()

    const { data, error: dbError } = await query
    setSaving(false)

    if (dbError) {
      setError(dbError.message)
      return
    }
    if (data) {
      onSaved(data as PlantLog)
      onClose()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Content maxWidth="420px">
        <Dialog.Title>{editingLog ? t('log_form.edit_title') : t('log_form.new_title')}</Dialog.Title>

        <Flex direction="column" gap="3" mt="2">
          <label>
            <img
              src={selectedPlant?.image_url || ''}
              alt={selectedPlant?.name || ''}
              width={100}
            />
            <Text as="div" size="2" mb="1" weight="medium">
              {t('log_form.plant')}
            </Text>
            <Select.Root value={plantId} onValueChange={handlePlantChange}>
              <Select.Trigger placeholder={t('log_form.select_plant')} style={{ width: '100%' }} />
              <Select.Content>
                {plants.map((p) => (
                  <Select.Item key={p.id} value={p.id}>
                    {p.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            {selectedPlant && (
              <Text as="div" size="1" color="gray" mt="1">
                {t('card.takes_days', { name: selectedPlant.name, days: selectedPlant.estimated_harvest_days })}
              </Text>
            )}
          </label>

          <label style={{ display: 'block' }}>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('log_form.plant_date')}
            </Text>
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={(e) => {
                const el = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement
                el?.showPicker?.()
              }}
            >
              <TextField.Root
                type="text"
                // readOnly
                value={formatDisplayDate(plantDate, locale)}
                placeholder="dd mmm yyyy"
                style={{ pointerEvents: 'none' }}
              />
              <input
                type="date"
                value={plantDate}
                onChange={(e) => setPlantDate(e.target.value)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  zIndex: 2,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          </label>

          <label style={{ display: 'block' }}>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('log_form.target_harvest_date')}
            </Text>
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={(e) => {
                const el = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement
                el?.showPicker?.()
              }}
            >
              <TextField.Root
                type="text"
                // readOnly
                value={formatDisplayDate(harvestDate, locale)}
                placeholder="dd mmm yyyy"
                style={{ pointerEvents: 'none' }}
              />
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  zIndex: 2,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('log_form.notes')}
            </Text>
            <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('log_form.status')}
            </Text>
            <Select.Root value={status} onValueChange={(v) => setStatus(v as LogStatus)}>
              <Select.Trigger style={{ width: '100%' }} />
              <Select.Content>
                {STATUS_FLOW.map((s) => (
                  <Select.Item key={s} value={s}>
                    {t(`status.${s.toLowerCase()}`)}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </label>

          {error && (
            <Text color="red" size="2">
              {error}
            </Text>
          )}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              {t('log_form.cancel')}
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit} loading={saving}>
            {t('log_form.save')}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
