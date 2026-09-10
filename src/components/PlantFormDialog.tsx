import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Button, Dialog, Flex, Text, TextArea, TextField } from '@radix-ui/themes'
import { Camera, ImagePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Plant } from '../lib/types'
import { supabase, PLANT_IMAGES_BUCKET } from '../lib/supabase'

interface Props {
  open: boolean
  onClose: () => void
  editingPlant: Plant | null
  onSaved: (plant: Plant) => void
}

/** Extract the storage object path from a Supabase public URL.
 *  Public URL format: .../storage/v1/object/public/<bucket>/<path>
 */
function extractStoragePath(publicUrl: string): string | null {
  try {
    const marker = `/object/public/${PLANT_IMAGES_BUCKET}/`
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return null
    return decodeURIComponent(publicUrl.slice(idx + marker.length))
  } catch {
    return null
  }
}

export function PlantFormDialog({ open, onClose, editingPlant, onSaved }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [days, setDays] = useState('')
  const [notes, setNotes] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    if (editingPlant) {
      setName(editingPlant.name)
      setDays(String(editingPlant.estimated_harvest_days))
      setNotes(editingPlant.notes ?? '')
      setImageUrl(editingPlant.image_url)
    } else {
      setName('')
      setDays('')
      setNotes('')
      setImageUrl(null)
    }
    setImageFile(null)
    setPreviewUrl(null)
    setError('')
  }, [open, editingPlant])

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!name || !days) {
      setError(t('plant_form.fill_error'))
      return
    }

    setSaving(true)
    setError('')

    let finalImageUrl = imageUrl

    if (imageFile) {
      // Hapus foto lama dari storage jika ada
      if (imageUrl) {
        const oldPath = extractStoragePath(imageUrl)
        if (oldPath) {
          await supabase.storage.from(PLANT_IMAGES_BUCKET).remove([oldPath])
          // Lanjut meski delete gagal (tidak block upload baru)
        }
      }

      // Upload foto baru
      const ext = imageFile.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(PLANT_IMAGES_BUCKET)
        .upload(path, imageFile)

      if (uploadError) {
        setSaving(false)
        setError(uploadError.message)
        return
      }
      const { data: publicUrl } = supabase.storage.from(PLANT_IMAGES_BUCKET).getPublicUrl(path)
      finalImageUrl = publicUrl.publicUrl
    }

    const payload = {
      name,
      estimated_harvest_days: Number(days),
      notes: notes || null,
      image_url: finalImageUrl,
    }

    const query = editingPlant
      ? supabase.from('plants').update(payload).eq('id', editingPlant.id).select().single()
      : supabase.from('plants').insert(payload).select().single()

    const { data, error: dbError } = await query
    setSaving(false)

    if (dbError) {
      setError(dbError.message)
      return
    }
    if (data) {
      onSaved(data as Plant)
      onClose()
    }
  }

  const displayImage = previewUrl ?? imageUrl

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Content maxWidth="420px">
        <Dialog.Title>{editingPlant ? t('plant_form.edit_title') : t('plant_form.new_title')}</Dialog.Title>

        <Flex direction="column" gap="3" mt="2">
          <div className="image-upload-box" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {displayImage ? (
              <>
                <img src={displayImage} alt="Plant preview" className="image-upload-preview" />
                <div className="image-upload-overlay">
                  <Camera size={22} />
                  <Text size="1" weight="medium">
                    {t('plant_form.change_photo')}
                  </Text>
                </div>
              </>
            ) : (
              <>
                <ImagePlus size={28} color="var(--gray-9)" />
                <Text size="2" color="gray" weight="medium">
                  {t('plant_form.upload_photo')}
                </Text>
              </>
            )}
          </div>

          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('plant_form.name')}
            </Text>
            <TextField.Root value={name} onChange={(e) => setName(e.target.value)} placeholder={t('plant_form.name_placeholder')} />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('plant_form.days')}
            </Text>
            <TextField.Root
              type="number"
              min="0"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder={t('plant_form.days_placeholder')}
            />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              {t('plant_form.notes')}
            </Text>
            <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
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
              {t('plant_form.cancel')}
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit} loading={saving}>
            {t('plant_form.save')}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
