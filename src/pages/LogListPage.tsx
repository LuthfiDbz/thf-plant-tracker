import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Flex, Heading, Spinner, Text, Theme } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { MethodId, Plant, PlantLog } from '../lib/types'
import { LogCard } from '../components/LogCard'
import { FilterBar, emptyFilters, type LogFilters } from '../components/FilterBar'
import { LogFormDialog } from '../components/LogFormDialog'

const PAGE_SIZE = 10

interface Props {
  methodId: MethodId
  title: string
  accentColor: 'brown' | 'blue'
}

export default function LogListPage({ methodId, title, accentColor }: Props) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [logs, setLogs] = useState<PlantLog[]>([])
  const [plants, setPlants] = useState<Plant[]>([])
  const [filters, setFilters] = useState<LogFilters>(emptyFilters)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<PlantLog | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)

  // load master plant list once (for form dropdown)
  useEffect(() => {
    supabase
      .from('plants')
      .select('*')
      .order('name')
      .then(({ data }) => setPlants((data as Plant[]) ?? []))
  }, [])

  const fetchPage = useCallback(
    async (pageIndex: number, activeFilters: LogFilters) => {
      if (!user || isFetchingRef.current) return
      isFetchingRef.current = true
      setLoading(true)

      let query = supabase
        .from('plant_logs')
        .select('*, plants(*)')
        .eq('method_id', methodId)
        .eq('user_id', user.id)
        .order('plant_date', { ascending: false })
        .range(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE - 1)

      if (activeFilters.status !== 'all') query = query.eq('status', activeFilters.status)
      if (activeFilters.plantDateFrom) query = query.gte('plant_date', activeFilters.plantDateFrom)
      if (activeFilters.plantDateTo) query = query.lte('plant_date', activeFilters.plantDateTo)
      if (activeFilters.harvestDateFrom) query = query.gte('harvest_date', activeFilters.harvestDateFrom)
      if (activeFilters.harvestDateTo) query = query.lte('harvest_date', activeFilters.harvestDateTo)

      const { data, error } = await query
      setLoading(false)
      isFetchingRef.current = false

      if (error) return
      const newLogs = (data as PlantLog[]) ?? []

      setLogs((prev) => (pageIndex === 0 ? newLogs : [...prev, ...newLogs]))
      setHasMore(newLogs.length === PAGE_SIZE)
    },
    [methodId, user]
  )

  // reset & refetch when filters change
  useEffect(() => {
    setPage(0)
    setHasMore(true)
    fetchPage(0, filters)
  }, [filters, fetchPage])

  // infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading && !isFetchingRef.current) {
        const nextPage = page + 1
        setPage(nextPage)
        fetchPage(nextPage, filters)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchPage, filters])


  function handleLogSaved(saved: PlantLog) {
    // setLogs((prev) => {
    //   const exists = prev.some((l) => l.id === saved.id)
    //   if (exists) return prev.map((l) => (l.id === saved.id ? saved : l))
    //   return [saved, ...prev]
    // })
    setPage(0)
    setHasMore(true)
    fetchPage(0, filters)
  }

  function openCreate() {
    setEditingLog(null)
    setFormOpen(true)
  }

  function openEdit(log: PlantLog) {
    setEditingLog(log)
    setFormOpen(true)
  }

  return (
    <Theme accentColor={accentColor}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Heading size="5">{title}</Heading>
          <FilterBar filters={filters} onChange={setFilters} />
        </Flex>

        {logs.length === 0 && !loading && (
          <Text size="2" color="gray" align="center" mt="6">
            {t('logs.no_logs', { title: title.toLowerCase() })}
          </Text>
        )}

        {logs.map((log) => (
          <LogCard key={log.id} log={log} onClick={() => openEdit(log)} />
        ))}

        {loading && (
          <Flex justify="center" py="3">
            <Spinner />
          </Flex>
        )}

        <div ref={sentinelRef} className="scroll-sentinel" />
      </Flex>

      <div className="fab">
        <Button size="3" radius="full" onClick={openCreate} style={{ boxShadow: 'var(--shadow-4)', cursor: "pointer" }}>
          <Plus size={18} />
          {t('logs.add')}
        </Button>
      </div>


      <LogFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        defaultMethodId={methodId}
        plants={plants}
        editingLog={editingLog}
        onSaved={handleLogSaved}
      />
    </Theme>
  )
}
