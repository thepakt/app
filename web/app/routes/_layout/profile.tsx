import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import { ChevronRight, StarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { FaGithub, FaTelegram, FaTwitter } from "react-icons/fa"
import { TodoItem } from "~/components/profile/TodoItem"
import { UserData } from "~/components/profile/userData"

interface NFTPreview {
  resolution: string
  url: string
}

interface NFT {
  address: string
  is_scam: boolean
  is_wallet: boolean
  previews: NFTPreview[]
}

export default function RouteComponent() {
  const address = useTonAddress()
  const [nfts, setNfts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return
    async function load() {
      try {
        setIsLoading(true)
        const response = await fetch(
          `https://testnet.tonapi.io/v2/accounts/${address}/nfts?collection=kQDwLgmW_t9nJJyAhc1qm1lBSa9zp-YZyyN7da60P8hMPsaT&limit=1000&offset=0&indirect_ownership=false`,
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const nftItems = await response.json()
        setNfts(nftItems.nft_items)
      } catch (err) {
        setError("Failed to load NFTs")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [address])

  console.log(nfts, "nfts")

  return (
    <main className="w-full flex items-center justify-center">
      <section className="w-full p-[1em] pt-[2em] min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-2">
              <p className="flex items-center text-[20px] gap-1">
                <StarIcon />
                4.9
              </p>
              <p className="text-[12px] text-gray-400 rounded-full inline-block">
                {UserData.tasksCompleted} tasks completed
              </p>
            </div>
            <div className="flex gap-3">
              {UserData.socialLinks.twitter && (
                <a
                  href={UserData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaTwitter className="text-xl text-gray-300 hover:text-blue-400 transition-all" />
                </a>
              )}
              {UserData.socialLinks.github && (
                <a
                  href={UserData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaGithub className="text-xl text-gray-300 hover:text-white transition-all" />
                </a>
              )}
              {UserData.socialLinks.telegram && (
                <a
                  href={UserData.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaTelegram className="text-xl text-gray-300 hover:text-blue-300 transition-all" />
                </a>
              )}
            </div>
          </div>
          {/* <button className=" hover:bg-neutral-700 w-full text-center bg-neutral-700/40 text-white py-3 rounded-full mb-6 flex items-center justify-center gap-2 transition-all">
            Invested in 7 projects <ChevronRight className="" />
          </button> */}

          <ul className="flex flex-col gap-3">
            <p className="text-[20px] font-semibold mb-4">Your SBTs:</p>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : nfts.length === 0 ? (
              <p>No SBTs found.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {nfts.map((nft, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={
                        nft.previews.find(
                          (p: { resolution: string }) =>
                            p.resolution === "100x100",
                        )?.url
                      }
                      alt={`SBT ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg p-2">
                      <p className="text-white text-xs truncate w-full text-center">
                        {nft.address.slice(0, 10)}...
                      </p>
                      {nft.is_scam && (
                        <p className="text-red-500 text-xs">Scam</p>
                      )}
                      {nft.is_wallet && (
                        <p className="text-green-500 text-xs">Wallet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ul>

          {/* <ul className="flex flex-col gap-3">
            <div className="text-[20px] font-semibold">Your SBTs:</div>
            {UserData.todos.map((todo, index) => (
              <TodoItem key={index} todo={todo} />
            ))}
          </ul> */}
        </div>

        <div></div>
      </section>
    </main>
  )
}

export const Route = createFileRoute("/_layout/profile")({
  component: () => <RouteComponent />,
})
