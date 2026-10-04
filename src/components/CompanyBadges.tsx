import { COMPANY_STATE_LABELS, type Company, type CompanyState } from '../api/companies'
import { useCompanyCategoryColors } from '../hooks/useCompanyCategoryColors'
import { usePersonPhoto } from '../hooks/usePersonPhoto'
import { stateColorClass } from './companyStyles'
import { UserIcon } from './icons'

const FALLBACK_CATEGORY_COLOR = '#8a9196'

export function CategoryBadge({ category }: { category: Company['category'] }) {
  const { data: colors } = useCompanyCategoryColors()
  if (!category) return null

  const color = colors?.get(category.id) ?? FALLBACK_CATEGORY_COLOR
  return (
    <span
      className="inline-block rounded-full px-2.5 py-px text-[11px] font-medium whitespace-nowrap"
      // světlejší pozadí a tmavší text z barvy kategorie, Raynet to má stejně
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 30%, white)`,
        color: `color-mix(in srgb, ${color} 70%, black)`,
      }}
    >
      {category.value}
    </span>
  )
}

export function StateText({ state }: { state: CompanyState }) {
  return <span className={stateColorClass(state)}>{COMPANY_STATE_LABELS[state] ?? state}</span>
}

export function OwnerName({ owner }: { owner: NonNullable<Company['owner']> }) {
  const photo = usePersonPhoto(owner.id)

  return (
    <span className="flex items-center gap-1.5">
      {/* panáček je schválně pod fotkou, některé fotky z Raynetu jsou úplně průhledné */}
      <span className="relative flex size-5 shrink-0 items-center justify-center rounded-full border border-raynet-border bg-white">
        <UserIcon className="size-3.5 text-raynet-muted" />
        {photo && <img src={photo} alt="" className="absolute inset-0 size-full rounded-full object-cover" />}
      </span>
      {owner.fullName}
    </span>
  )
}
