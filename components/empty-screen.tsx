import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">¡Bienvenido a Ebauer!</h1>
        <p className="leading-normal text-muted-foreground">
          Estudia, genera apuntes, ejercicios de cualquier asignatura de tu
          comunidad autónoma. Esta herramienta está desarrollada en colaboración
          con <ExternalLink href="https://thoneai.com">Thone AI.</ExternalLink>
        </p>
        <p className="leading-normal text-muted-foreground">
          Ebauer utiliza los criterios de todas las comunidades autonómas de
          cada año para determinar que ejercicios y apuntes generar en base a tu
          comunidad autónoma.{' '}
        </p>
      </div>
    </div>
  )
}
