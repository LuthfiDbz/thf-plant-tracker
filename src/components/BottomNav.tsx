import { NavLink } from 'react-router-dom'
import { Sprout, Droplets, Leaf } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function BottomNav() {
  const { t } = useTranslation()

  const tabs = [
    { to: '/soil', label: t('nav.soil'), icon: Sprout },
    { to: '/hydroponic', label: t('nav.hydroponic'), icon: Droplets },
    { to: '/plants', label: t('nav.plants'), icon: Leaf },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
