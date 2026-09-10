export type MethodId = 1 | 2

export type LogStatus = 'Seedling' | 'Planting' | 'Harvested'

export interface Plant {
  id: string
  name: string
  image_url: string | null
  estimated_harvest_days: number
  notes: string | null
  created_at: string
}

export interface PlantLog {
  id: string
  user_id: string
  plant_id: string
  method_id: MethodId
  status: LogStatus
  plant_date: string
  harvest_date: string
  harvest_status?: string | null
  notes: string | null
  created_at: string
  plants?: Plant | null
}

export const STATUS_FLOW: LogStatus[] = ['Seedling', 'Planting', 'Harvested']

export function nextStatus(current: LogStatus): LogStatus | null {
  const idx = STATUS_FLOW.indexOf(current)
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null
  return STATUS_FLOW[idx + 1]
}
