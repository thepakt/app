import type { QueryClient } from "@tanstack/react-query"
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { Meta, Scripts } from "@tanstack/start"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import * as React from "react"
import { Toaster } from "react-hot-toast"
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary"
import { NotFound } from "~/components/NotFound"
import { ThemeProvider } from "~/components/theme-provider"
import appCss from "~/styles/app.css?url"
import justgetdCss from "~/styles/justgetd-index.css?url"
import { seo } from "~/utils/seo"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "PAKT app",
        description: `Work and invest in confidence`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: justgetdCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Serif:ital@0;1&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/futura-font@1.0.0/styles.min.css",
      },
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
  }),
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
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </TonConnectUIProvider>
      <Toaster />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
