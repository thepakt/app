import { createJazzReactApp, DemoAuthBasicUI, useDemoAuth } from "jazz-react"
import { LaAccount } from "../schema"

const Jazz = createJazzReactApp({
  AccountSchema: LaAccount,
})

export const { useAccount, useAccountOrGuest, useCoState, useAcceptInvite } =
  Jazz

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const [auth, authState] = useDemoAuth()

  return (
    <>
      <Jazz.Provider
        auth={auth}
        peer={"wss://cloud.jazz.tools/?key=todo-escrow@learn-anything.xyz"}
        // peer={"wss://cloud.jazz.tools/?key=todo@learn-anything.xyz"}
      >
        {children}
      </Jazz.Provider>
      <DemoAuthBasicUI appName={"todo-escrow"} state={authState} />
    </>
  )
}
