import { createFileRoute, useRouter } from '@tanstack/react-router'
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react'
import { useEffect } from 'react'
import { Badge } from '~/components/ui'

export const Route = createFileRoute('/connect')({
  component: ConnectPage,
})

function ConnectPage() {
  const router = useRouter()
  const from: string | null = router.state.location.search?.from || null

  const address = useTonAddress()

  useEffect(() => {
    if (address)
      if (from)
        router.commitLocation({
          ...router.state.location,
          href: from,
          searchStr: from.substring(from.indexOf('?')),
        })
      else
        router.commitLocation({
          ...router.state.location,
          href: '/explore',
        })
  }, [address])

  const intent = () => {
    if (!from) return 'continue'
    if (from && from.substring(0, 8) == '/explore') return 'explore'
    if (from && from.substring(0, 13) == '/tasks?create') return 'create'
    return 'continue'
  }

  return (
    <div className="w-full h-full flex flex-col justify-end sm:justify-start">
      <div className="flex flex-col items-center justify-center h-5/6 sm:h-4/6 gap-0">
        <span>
          To <Badge intent="secondary">{intent()}</Badge>
        </span>
        <span>connect your TON wallet</span>
        <TonConnectButton className="mt-4" />
        <div className="mt-12 pt-8 text-primary/50 text-sm text-center">
          Or if you're eager to know, how it works,
          <br />
          <a href="/" className="underline">
            visit our landing page
          </a>
        </div>
      </div>
    </div>
  )
}
