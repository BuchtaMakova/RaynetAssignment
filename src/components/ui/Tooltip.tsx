import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  // v rozbaleném menu jsou popisky vidět, tam bublinu nechci
  disabled?: boolean
  children: ReactElement
}

// Radix používá i Raynet. Hlavně kvůli portalu: bublina se vykreslí mimo menu,
// takže ji neořízne overflow-hidden.
export function Tooltip({ content, side = 'right', disabled = false, children }: TooltipProps) {
  if (disabled) return children

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          className="z-50 origin-(--radix-tooltip-content-transform-origin) rounded-lg bg-raynet-tooltip px-3 py-2 text-xs leading-[1.2] font-medium text-white shadow-[0_16px_32px_rgb(0_0_0/0.08)] data-[state=closed]:animate-tooltip-out data-[state=delayed-open]:animate-tooltip-in data-[state=instant-open]:animate-tooltip-in"
        >
          {content}
          <RadixTooltip.Arrow width={12} height={6} className="fill-raynet-tooltip" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

const TOOLTIP_DELAY = 500

// když už je jedna bublina otevřená, další se ukáže hned (default Radixu)
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <RadixTooltip.Provider delayDuration={TOOLTIP_DELAY}>{children}</RadixTooltip.Provider>
}
