import { createFileRoute } from '@tanstack/react-router'
import Layout from '~/components/Layout'

function RouteComponent() {
  return (
    <Layout>
      <div className="py-[4em] p-[1em]">wtf</div>
    </Layout>
  )
}

export const Route = createFileRoute('/_layout/explore')({
  component: () => <RouteComponent />,
})
