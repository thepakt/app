import { AirdropToClaim } from "@ronin/ton"
import { createServerFn } from "@tanstack/start"
import { Address } from "@ton/core"
import { create, get, set } from "ronin"
import useBlockchainActions from "./lib/airdrop/useActions"
import { isProduction } from "./lib/utils"

export const createAirdropWalletToClaim = createServerFn(
  "POST",
  async (data: {
    airdropAddress: string
    startDate: number // unix
    endDate: number // unix
    jettonAddress: string
    mainnet: boolean
    airdropWalletsForClaim: {
      walletAddress: string
      tokenAmount: string
      index: number
    }[]
    metadata: {
      decimals: number
      image: string
      title: string
    }
  }) => {
    const {
      airdropAddress,
      startDate,
      endDate,
      airdropWalletsForClaim,
      jettonAddress,
      mainnet,
    } = data
    const airdropToClaim = await create.airdropToClaim.with({
      airdropAddress,
      jettonAddress,
      startDate: new Date(startDate * 1000),
      endDate: new Date(endDate * 1000),
      mainnet,
      fundsDrained: false,
      image: data.metadata.image,
      digits: data.metadata.decimals.toString(),
      jettonName: data.metadata.title,
    })
    if (!airdropToClaim) throw new Error("Failed to create airdrop to claim")
    await Promise.all(
      airdropWalletsForClaim.map(async (entry) => {
        console.log(entry, "adding entry")
        const { walletAddress, tokenAmount, index } = entry
        await create.airdropWalletForClaim.with({
          airdropToClaim: airdropToClaim.id,
          walletAddress,
          tokenAmount,
          indexNumber: index,
          claimed: false,
        })
      }),
    )
    console.log(airdropToClaim)
  },
)

export const getAirdropsAvailableForClaim = createServerFn(
  "POST",
  async (data: { address: string }) => {
    const { address } = data
    const currentDate = new Date()
    const properAddress = Address.parse(address).toString()
    const airdropWalletsForClaim = await get.airdropWalletsForClaim.with({
      walletAddress: properAddress,
      claimed: false,
    })
    let airdropsForClaim: AirdropToClaim[] = []
    await Promise.all(
      airdropWalletsForClaim.map(async (airdrop) => {
        const airdropToClaim = await get.airdropToClaim.with({
          id: airdrop.airdropToClaim,
        })
        if (!airdropToClaim) return
        airdropsForClaim.push(airdropToClaim)
      }),
    )
    return airdropsForClaim.filter(
      (airdrop) =>
        airdrop.mainnet === isProduction &&
        new Date(airdrop.endDate) > currentDate,
    )
  },
)

export const setAirdropWalletForClaimAsClaimed = createServerFn(
  "POST",
  async (data: {
    airdropAddress: string
    walletAddress: string
    entries: {
      address: string
      amount: string
    }[]
  }) => {
    try {
      const { airdropAddress, walletAddress, entries } = data
      const { isUserClaimedAirdrop } = useBlockchainActions()
      await new Promise((resolve) => setTimeout(resolve, 50000))
      if (
        await isUserClaimedAirdrop(
          Address.parse(airdropAddress),
          entries.map((entry) => ({
            address: Address.parse(entry.address),
            amount: BigInt(entry.amount),
          })),
        )
      ) {
        await set.airdropWalletsForClaim({
          with: {
            airdropToClaim: airdropAddress,
            walletAddress,
          },
          to: {
            claimed: true,
          },
        })
      }
    } catch (err) {
      console.log(err, "err")
    }
  },
)

export const getEntriesForAirdrop = createServerFn(
  "POST",
  async (data: { airdropAddress: string }) => {
    const { airdropAddress } = data
    const entries = await get.airdropWalletsForClaim.with({
      airdropToClaim: {
        airdropAddress,
      },
    })
    // Sort entries by indexNumber in ascending order
    return entries.sort((a, b) => a.indexNumber - b.indexNumber)
  },
)
