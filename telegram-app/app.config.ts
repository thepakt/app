import { defineConfig } from "@tanstack/start/config"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import tsConfigPaths from "vite-tsconfig-paths"
import { nodePolyfills } from "vite-plugin-node-polyfills"

const local = process.env.LOCAL === "true"

export default defineConfig({
  routers: {
    client: {
      vite: {
        plugins: () => [
          nodePolyfills({
            globals: {
              Buffer: true,
            },
          }),
        ],
      },
    },
  },
  vite: {
    plugins: () => [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
  server: {
    devServer: {
      // @ts-ignore
      host: "tma.internal",
      https: local
        ? {
            cert: readFileSync(
              resolve("certificates/tma.internal.pem"),
              "utf8",
            ),
            key: readFileSync(
              resolve("certificates/tma.internal-key.pem"),
              "utf8",
            ),
          }
        : undefined,
    },
  },
})
