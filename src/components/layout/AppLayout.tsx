import { useState, type ComponentType, type ReactNode, type SVGProps } from 'react'
import {
  AtIcon,
  CalendarIcon,
  ChartIcon,
  ChevronLeftIcon,
  ClockIcon,
  CloseIcon,
  CloudIcon,
  DocumentIcon,
  DollarIcon,
  HomeIcon,
  PlusCircleIcon,
  SearchIcon,
  UsersIcon,
} from '../ui/icons'
import { Tooltip, TooltipProvider } from '../ui/Tooltip'

// loga beru z CDN Raynetu, sbalené menu má jen symbol
const LOGO_URL = 'https://cdn.raynetcrm.com/resources_app/resources/03ca3e6a1962cbc2.svg'
const LOGO_WITH_NAME_URL = 'https://cdn.raynetcrm.com/resources_app/resources/4763370b260e736d.svg'

interface NavItem {
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  active?: boolean
}

// menu je jen na oko, funguje jen Adresář
const NAV_ITEMS: NavItem[] = [
  { label: 'Nástěnka', icon: CloudIcon },
  { label: 'Pošta', icon: AtIcon },
  { label: 'Kalendář', icon: CalendarIcon },
  { label: 'Adresář', icon: UsersIcon, active: true },
  { label: 'Obchod', icon: DollarIcon },
  { label: 'Aktivity', icon: ClockIcon },
  { label: 'Dokumenty', icon: DocumentIcon },
  { label: 'Analýzy', icon: ChartIcon },
]

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TabBar />
          <main className="flex-1 px-4 pt-4 md:px-10">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  )
}

// rozměry a barvy jsem měřil přímo v Raynetu
function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const toggle = () => setExpanded(!expanded)
  const toggleLabel = expanded ? 'Sbalit menu' : 'Rozbalit menu'

  return (
    <nav
      aria-label="Hlavní navigace"
      className={`sticky top-0 z-10 flex h-screen shrink-0 flex-col bg-linear-to-b/srgb from-raynet-sidebar-from to-raynet-sidebar-to text-raynet-sidebar-icon transition-[width] duration-300 ${
        expanded ? 'w-45' : 'w-20'
      }`}
    >
      <Tooltip content={toggleLabel} side="bottom">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label={toggleLabel}
          className="absolute top-7 -right-3.5 grid size-6 place-items-center rounded-full border border-raynet-border bg-white text-raynet-text shadow-[0_0_4px_rgb(0_0_0/0.1)] transition-colors hover:border-raynet-sidebar-search hover:bg-raynet-sidebar-search hover:text-white"
        >
          <ChevronLeftIcon className={`size-3.5 transition-transform ${expanded ? '' : 'rotate-180'}`} strokeWidth={2.4} />
        </button>
      </Tooltip>

      {/* klik na logo menu taky přepíná, stejně jako v Raynetu */}
      <button
        type="button"
        onClick={toggle}
        aria-label={toggleLabel}
        className="h-15.25 shrink-0 cursor-pointer overflow-hidden pt-3.25 text-left"
      >
        {expanded ? (
          <img src={LOGO_WITH_NAME_URL} alt="" className="ml-5.5 h-7 w-28.25" />
        ) : (
          <img src={LOGO_URL} alt="" className="mx-auto size-7" />
        )}
      </button>

      <Tooltip content="Hledat" disabled={expanded}>
        <button
          type="button"
          aria-label="Hledat"
          className="mx-4 flex h-8 shrink-0 cursor-text items-center rounded-[15px] bg-raynet-sidebar-search pl-4.5 text-raynet-sidebar-search-icon"
        >
          <SearchIcon className="size-3.5 shrink-0" strokeWidth={2.4} />
        </button>
      </Tooltip>

      <ul className="mt-4 flex flex-col overflow-hidden">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <NavRow {...item} expanded={expanded} />
          </li>
        ))}
      </ul>

      <div className="mt-auto overflow-hidden">
        <NavRow label="Vytvořit" icon={PlusCircleIcon} expanded={expanded} />
      </div>
    </nav>
  )
}

// Ikona není na středu schválně. Raynet ji má zarovnanou doleva, aby se při rozbalení neposouvala.
// Ve sbaleném menu je zvětšená na 125 %.
function NavRow({ label, icon: Icon, active, expanded }: NavItem & { expanded: boolean }) {
  return (
    <Tooltip content={label} disabled={expanded}>
      <button
        type="button"
        aria-current={active ? 'page' : undefined}
        className="flex h-11 w-full cursor-pointer items-center gap-3 px-6 whitespace-nowrap transition-colors outline-none hover:bg-white/10 hover:text-[#f1fbff] focus-visible:bg-white/10"
      >
        <Icon
          className={`size-5 shrink-0 origin-left transition-all duration-150 ${expanded ? '' : 'ml-0.5 scale-125'}`}
        />
        <span className={`text-sm font-medium transition-opacity ${expanded ? 'opacity-100' : 'opacity-0'}`}>
          {label}
        </span>
      </button>
    </Tooltip>
  )
}

function TabBar() {
  return (
    <div className="flex h-11 shrink-0 border-b border-raynet-border bg-white">
      <Tab icon={HomeIcon} label="Klienti" active />
    </div>
  )
}

function Tab({ icon: Icon, label, active }: NavItem) {
  return (
    <div
      aria-current={active ? 'page' : undefined}
      // pl-10 u první záložky kvůli šipce menu, aktivní má proužek nahoře (before:), ostatní oddělovač (after:)
      className={`relative grid h-11 w-45 min-w-30 grid-cols-[20px_1fr_auto] items-center gap-2 border-x py-3 pr-2 pl-4 text-[13px] first:pl-10 ${
        active
          ? 'border-raynet-tab-border bg-raynet-page text-raynet-teal before:absolute before:inset-x-0 before:top-0 before:h-0.75 before:bg-raynet-sidebar-from'
          : 'border-transparent text-raynet-muted after:absolute after:top-3 after:right-0 after:h-5 after:w-px after:bg-raynet-tab-divider'
      }`}
    >
      <Icon className="size-5" />
      <span className="truncate">{label}</span>
      {active && <CloseIcon className="size-4" />}
    </div>
  )
}
