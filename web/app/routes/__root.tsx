import type { QueryClient } from "@tanstack/react-query"
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import * as React from "react"
import { Toaster } from "react-hot-toast"
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary"
import { NotFound } from "~/components/NotFound"
import appCss from "~/styles/app.css?url"
import { seo } from "~/utils/seo"
import { proxy } from "valtio"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    ...seo({
      title: "TON",
      description: `TON utils and other code`,
    }),
  ],
  links: () => [
    { rel: "stylesheet", href: appCss },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
    { rel: "icon", href: "/favicon.ico" },
  ],
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <TonConnectUIProvider manifestUrl="https://gist.githubusercontent.com/nikitavoloboev/e95b5d8890134a00d8c533ebcca8780b/raw/da5b438ed3cd0d9d58c317b393a4914450e94de9/gistfile1.txt">
        <Outlet />
      </TonConnectUIProvider>
      <Toaster />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        {/* {!isProduction && <TanStackRouterDevtools position="bottom-right" />} */}
        {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
        <Scripts />
      </Body>
    </Html>
  )
}
