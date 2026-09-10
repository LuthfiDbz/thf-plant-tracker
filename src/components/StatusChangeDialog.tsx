import { useState } from 'react'
import { AlertDialog, Button, Flex, Text } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import type { PlantLog } from '../lib/types'
import { nextStatus } from '../lib/types'
import { supabase } from '../lib/supabase'

interface Props {
  log: PlantLog | null
  onClose: () => void
  onUpdated: (log: PlantLog) => void
  onEdit: (log: PlantLog) => void
}

export function StatusChangeDialog({ log, onClose, onUpdated, onEdit }: Props) {
  const { t } = useTranslation()
  const [saving, setSaving] = useState(false)

  if (!log) return null

  const upcoming = nextStatus(log.status)

  async function handleConfirm() {
    if (!log || !upcoming) return
    setSaving(true)

    const { data, error } = await supabase
      .from('plant_logs')
      .update({ status: upcoming })
      .eq('id', log.id)
      .select('*, plants(*)')
      .single()

    setSaving(false)
    if (!error && data) {
      onUpdated(data as PlantLog)
      onClose()
    }
  }

  return (
    <AlertDialog.Root open={!!log} onOpenChange={(open) => !open && onClose()}>
      <AlertDialog.Content maxWidth="360px">
        <AlertDialog.Title>{log.plants?.name ?? t('status_dialog.title')}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {t('status_dialog.current_status')} <Text weight="bold">{t(`status.${log.status.toLowerCase()}`)}</Text>
          {upcoming ? (
            <>
              <br />
              {t('status_dialog.change_to')} <Text weight="bold">{t(`status.${upcoming.toLowerCase()}`)}</Text>?
            </>
          ) : (
            <>
              <br />
              {t('status_dialog.already_harvested')}
            </>
          )}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" onClick={() => onEdit(log)}>
            {t('status_dialog.edit_details')}
          </Button>
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              {t('status_dialog.close')}
            </Button>
          </AlertDialog.Cancel>
          {upcoming && (
            <Button onClick={handleConfirm} loading={saving}>
              {t('status_dialog.confirm')}
            </Button>
          )}
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
