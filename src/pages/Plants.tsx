import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Flex, Heading, Spinner, Text } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Plant } from '../lib/types'
import { PlantCard } from '../components/PlantCard'
import { PlantFormDialog } from '../components/PlantFormDialog'

const PAGE_SIZE = 10

export default function Plants() {
  const { t } = useTranslation()
  const [plants, setPlants] = useState<Plant[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchPage = useCallback(async (pageIndex: number) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false })
      .range(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE - 1)

    setLoading(false)
    if (error) return
    const newPlants = (data as Plant[]) ?? []
    setPlants((prev) => (pageIndex === 0 ? newPlants : [...prev, ...newPlants]))
    setHasMore(newPlants.length === PAGE_SIZE)
  }, [])

  useEffect(() => {
    fetchPage(0)
  }, [fetchPage])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((p) => {
          const next = p + 1
          fetchPage(next)
          return next
        })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchPage])

  function handleSaved(saved: Plant) {
    setPlants((prev) => {
      const exists = prev.some((p) => p.id === saved.id)
      if (exists) return prev.map((p) => (p.id === saved.id ? saved : p))
      return [saved, ...prev]
    })
  }

  function openCreate() {
    setEditingPlant(null)
    setFormOpen(true)
  }

  function openEdit(plant: Plant) {
    setEditingPlant(plant)
    setFormOpen(true)
  }

  return (
    <>
      <Flex direction="column" gap="3">
        <Heading size="5">{t('plants.title')}</Heading>

        {plants.length === 0 && !loading && (
          <Text size="2" color="gray" align="center" mt="6">
            {t('plants.no_plants')}
          </Text>
        )}

        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} onClick={() => openEdit(plant)} />
        ))}

        {loading && (
          <Flex justify="center" py="3">
            <Spinner />
          </Flex>
        )}

        <div ref={sentinelRef} className="scroll-sentinel" />
      </Flex>

      <div className="fab">
        <Button size="3" radius="full" onClick={openCreate} style={{ boxShadow: 'var(--shadow-4)' }}>
          <Plus size={18} />
          {t('plants.add')}
        </Button>
      </div>

      <PlantFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editingPlant={editingPlant}
        onSaved={handleSaved}
      />
    </>
  )
}
