import type { CompanyState } from '../api/companies'

const STATE_COLORS: Record<CompanyState, string> = {
  A_POTENTIAL: 'text-raynet-amber',
  B_ACTUAL: 'text-raynet-green',
  C_DEFERRED: 'text-raynet-heading',
  D_UNATTRACTIVE: 'text-raynet-red',
}

export function stateColorClass(state: CompanyState) {
  return STATE_COLORS[state] ?? 'text-raynet-muted'
}
