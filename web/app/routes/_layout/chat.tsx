import { createFileRoute } from '@tanstack/react-router'
import ChatComponent from '~/components/Chat'
import ProjectInfo from '~/components/ProjectInfo'
function RouteComponent() {
  const steps = ['Define Goals', 'Build Features', 'Launch']
  const currentStep = 2 // Set to your current step dynamically
  const contributors = {
    count: 15,
    tonCollected: 268,
    daysPassed: 4,
    totalDays: 10,
  }

  return (
    <>
      <div className="h-full flex flex-col justify-between">
        <ProjectInfo
          title="To do"
          description="In this project, I would like to do this, this, and this, to make that and that happen."
          contributors={contributors}
          steps={steps}
          currentStep={currentStep}
        />
        <ChatComponent />
      </div>
    </>
  )
}

export const Route = createFileRoute('/_layout/chat')({
  component: () => <RouteComponent />,
})
