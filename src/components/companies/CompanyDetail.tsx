import type { ReactNode } from 'react'
import { COMPANY_ROLE_LABELS, COMPANY_STATE_LABELS, type CompanyAddress, type CompanyDetail as CompanyDetailData } from '../../api/companies'
import { useCompany } from '../../hooks/useCompany'
import { useImage } from '../../hooks/useImage'
import { CategoryBadge, OwnerName } from './CompanyBadges'
import { stateColorClass } from './companyStyles'
import { BuildingIcon, MapPinIcon } from '../ui/icons'
import { RichText } from '../ui/RichText'

interface CompanyDetailProps {
  id: number | null
}

export function CompanyDetail({ id }: CompanyDetailProps) {
  const { data, isPending, error } = useCompany(id)

  return (
    <aside aria-label="Detail klienta" className="rounded bg-white p-5 shadow-raynet-card">
      {id === null ? (
        <Placeholder>Vyberte klienta ze seznamu.</Placeholder>
      ) : isPending ? (
        <Placeholder>Načítám detail…</Placeholder>
      ) : error ? (
        <p className="text-sm text-red-700">{error.message}</p>
      ) : (
        <DetailContent company={data.data} />
      )}
    </aside>
  )
}

function DetailContent({ company }: { company: CompanyDetailData }) {
  const address = company.primaryAddress?.address
  const contact = company.primaryAddress?.contactInfo
  const otherAddresses = company.addresses.filter((a) => !a.primary)

  return (
    <article className="flex flex-col gap-5 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <CategoryBadge category={company.category} />
        <span className={`font-medium ${stateColorClass(company.state)}`}>
          {COMPANY_STATE_LABELS[company.state]} {COMPANY_ROLE_LABELS[company.role]?.toLowerCase()}
        </span>
      </div>

      <h2 className="text-[26px] leading-tight font-medium break-words">{company.name}</h2>

      <div className="flex gap-4">
        <Logo logoId={company.logo?.id ?? null} name={company.name} />
        <div className="flex min-w-0 flex-col gap-2">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
            <Field label="IČ">{company.regNumber}</Field>
            <Field label="DIČ">{company.taxNumber}</Field>
            <Field label="Rating">{company.rating}</Field>
          </dl>
          {address && (
            <div>
              <AddressLines address={address} />
              <MapLink address={address} />
            </div>
          )}
        </div>
      </div>

      {company.notice && <RichText html={company.notice} className="text-slate-700" />}

      {contact && (contact.email || contact.tel1 || contact.www) && (
        <Section title="Kontakty">
          <ContactList address={company.primaryAddress!} />
        </Section>
      )}

      {otherAddresses.length > 0 && (
        <Section title="Další adresy">
          {otherAddresses.map((other) => (
            <div key={other.id} className="mb-3 last:mb-0">
              {other.address.name && <p className="font-medium">{other.address.name}</p>}
              <AddressLines address={other.address} />
              <ContactList address={other} />
            </div>
          ))}
        </Section>
      )}

      {company.owner && (
        <p className="flex items-center gap-2">
          <span className="text-raynet-muted">Vlastník:</span>
          <strong>
            <OwnerName owner={company.owner} />
          </strong>
        </p>
      )}
    </article>
  )
}

function Logo({ logoId, name }: { logoId: number | null; name: string }) {
  const { data: src } = useImage(logoId)

  return (
    <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-raynet-border bg-white">
      {src ? (
        <img src={src} alt={`Logo ${name}`} className="size-full object-contain p-2" />
      ) : (
        <BuildingIcon className="size-10 text-slate-300" />
      )}
    </div>
  )
}

function AddressLines({ address }: { address: CompanyAddress['address'] }) {
  const lines = [address.street, [address.zipCode, address.city].filter(Boolean).join(' '), address.country].filter(
    Boolean,
  )
  return (
    <>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </>
  )
}

function MapLink({ address }: { address: CompanyAddress['address'] }) {
  // souřadnice jsou přesnější, když chybí, hledám podle adresy
  const query =
    address.lat !== null && address.lng !== null
      ? `${address.lat},${address.lng}`
      : [address.street, address.zipCode, address.city, address.country].filter(Boolean).join(', ')
  if (!query) return null

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 inline-flex items-center gap-1 text-raynet-blue hover:underline"
    >
      <MapPinIcon className="size-3.5" />
      Zobrazit na mapě
    </a>
  )
}

function ContactList({ address: { contactInfo } }: { address: CompanyAddress }) {
  const website = contactInfo.www && (/^https?:\/\//.test(contactInfo.www) ? contactInfo.www : `https://${contactInfo.www}`)

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
      {contactInfo.email && (
        <Field label="E-mail">
          <a href={`mailto:${contactInfo.email}`} className="text-raynet-blue hover:underline">
            {contactInfo.email}
          </a>
        </Field>
      )}
      {contactInfo.email2 && <Field label="E-mail 2">{contactInfo.email2}</Field>}
      {contactInfo.tel1 && (
        <Field label="Telefon">
          <a href={`tel:${contactInfo.tel1}`} className="hover:underline">
            {contactInfo.tel1}
          </a>
        </Field>
      )}
      {contactInfo.tel2 && <Field label="Telefon 2">{contactInfo.tel2}</Field>}
      {website && (
        <Field label="Web">
          <a href={website} target="_blank" rel="noopener noreferrer" className="text-raynet-blue hover:underline">
            {contactInfo.www}
          </a>
        </Field>
      )}
    </dl>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-raynet-border pt-4">
      <h3 className="mb-2 text-[11px] font-medium tracking-wide text-raynet-muted uppercase">{title}</h3>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-raynet-muted">{label}</dt>
      <dd className="min-w-0 break-words">{children || '—'}</dd>
    </>
  )
}

function Placeholder({ children }: { children: string }) {
  return <p className="py-10 text-center text-sm text-raynet-muted">{children}</p>
}
