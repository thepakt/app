import { Address, beginCell, Cell, Sender, toNano } from "@ton/core"
import { TonClient } from "@ton/ton"
import { useMemo } from "react"
import { JettonDefaultWallet } from "../ton-child"
import { SampleJetton } from "../ton-master"
import { tonClient, useProviderSender } from "../ton-sender"
import {
  Airdrop,
  AirdropEntry,
  generateEntriesDictionary,
} from "./wrappers/Airdrop"
import { AirdropHelper } from "./wrappers/AirdropHelper"
import { hex as hexAirdrop } from "./wrappers/build/Airdrop.compiled.json"
import { hex as hexAirdropHelper } from "./wrappers/build/AirdropHelper.compiled.json"

const helperCode = Cell.fromBoc(Buffer.from(hexAirdropHelper, "hex"))[0]!
const Code = Cell.fromBoc(Buffer.from(hexAirdrop, "hex"))[0]!
type CreateAirdropParams = {
  jettonAddress: Address
  entries: AirdropEntry[]
  /**
   * Unix timestamp, when airdrop would start
   */
  startTime: number
  /**
   * Unix timestamp, when airdrop would end
   */
  endTime: number
}
type ClaimAirdropParams = {
  entries: AirdropEntry[]
  airdropAddress: Address
}
type AirdropData = {
  startTime: number
  endTime: number
  isExpired: boolean
  isStarted: boolean
  admin: Address
  jetton: Address
}
export default function useBlockchainActions() {
  const sender = useProviderSender()
  return useMemo(
    () => ({
      createAirdrop: createAirdrop.bind(null, sender, tonClient),
      waitForDeploy: waitForDeploy.bind(null, tonClient),
      sendJettonsToAirdrop: sendJettonsToAirdrop.bind(null, tonClient, sender),
      claimAirdrop: claimAirdrop.bind(null, tonClient, sender),
      getAirdropData: getAirdropData.bind(null, tonClient),
      isUserClaimedAirdrop: isUserClaimedAirdrop.bind(null, tonClient, sender),
      withdrawFundsFromAirdrop: withdrawFundsFromAirdrop.bind(
        null,
        tonClient,
        sender,
      ),
    }),
    [sender],
  )
}

/**
 * Creates a new airdrop contract, returning its address. <br/>
 * Important! Save list of entries, because you will need it to claim airdrop.
 * @param sender
 * @param provider
 * @param jettonAddress
 * @param entries
 * @param startTime
 * @param endTime
 */
async function createAirdrop(
  sender: Sender,
  provider: TonClient,
  { jettonAddress, entries, startTime, endTime }: CreateAirdropParams,
) {
  const jettonMinter = provider.open(SampleJetton.fromAddress(jettonAddress))

  const dictionary = generateEntriesDictionary(entries)

  const dictCell = beginCell().storeDictDirect(dictionary).endCell()
  const merkleRoot = BigInt("0x" + dictCell.hash().toString("hex"))
  const airdrop = provider.open(
    Airdrop.createFromConfig(
      {
        merkleRoot,
        helperCode,
        admin: sender.address!,
      },
      Code,
    ),
  )
  if (!(await provider.isContractDeployed(airdrop.address))) {
    const walletAddressForAirdrop = await jettonMinter.getGetWalletAddress(
      airdrop.address,
    )

    const ownerWallet = provider.open(
      JettonDefaultWallet.fromAddress(
        await jettonMinter.getGetWalletAddress(sender.address!),
      ),
    )
    const amount = entries
      .map((e) => e.amount)
      .reduce((a, b) => a + b, BigInt(0))
    console.log("Amount: ", amount.toString())
    console.log("entries: ", entries)

    await Promise.all([
      airdrop.sendDeploy(
        sender,
        toNano("0.05"),
        walletAddressForAirdrop,
        startTime,
        endTime,
      ),
      ownerWallet.send(
        sender,
        {
          value: toNano("0.15"),
          bounce: true,
        },
        {
          $$type: "TokenTransfer",
          destination: airdrop.address,
          queryId: BigInt(123),
          response_destination: sender.address!,
          forward_ton_amount: toNano("0.01"),
          forward_payload: beginCell().storeBit(1).endCell(),
          custom_payload: beginCell().endCell(),
          amount,
        },
      ),
    ])
  } else {
    console.log("Airdrop already deployed")
  }

  return airdrop.address
}

/**
 * Send {amount} jettons to the airdrop smart contract.
 * @param provider
 * @param sender
 * @param airdropAddress
 * @param amount - toNano(amount)
 */
async function sendJettonsToAirdrop(
  provider: TonClient,
  sender: Sender,
  airdropAddress: Address,
  amount: bigint,
  tokenMaster: Address,
) {
  const airdrop = provider.open(Airdrop.createFromAddress(airdropAddress))

  const { jettonWallet, admin } = await airdrop.getContractData()
  if (!admin.equals(sender.address!))
    throw new Error("You are not an admin of this airdrop")
  console.log("Jetton wallet: ", jettonWallet.toString())
  // const {master, owner} = await provider.open(JettonDefaultWallet.fromAddress(jettonWallet)).getGetWalletData();
  // if (!owner.equals(airdropAddress)) throw new Error("Invalid airdrop jetton address");
  const masterWallet = provider.open(SampleJetton.fromAddress(tokenMaster))
  if (
    !(await masterWallet.getGetWalletAddress(airdropAddress)).equals(
      jettonWallet,
    )
  ) {
    throw new Error("Invalid jetton wallet address")
  }
  const ownerWallet = provider.open(
    JettonDefaultWallet.fromAddress(
      await masterWallet.getGetWalletAddress(sender.address!),
    ),
  )
  ownerWallet.send(
    sender,
    {
      value: toNano("0.15"),
      bounce: true,
    },
    {
      $$type: "TokenTransfer",
      destination: airdropAddress,
      queryId: BigInt(0),
      response_destination: sender.address!,
      forward_ton_amount: toNano("0.001"),
      forward_payload: beginCell().storeBit(1).endCell(),
      custom_payload: beginCell().storeBit(1).endCell(),
      amount,
    },
  )
}

/**
 * Wait for contract deployment (after sending transaction)
 * @param provider
 * @param address
 */
async function waitForDeploy(provider: TonClient, address: Address) {
  for (let i = 0; i < 100; i++) {
    await new Promise((resolve) => setTimeout(resolve, 10_000))
    try {
      if (await provider.isContractDeployed(address)) {
        return
      }
    } catch (e) {
      console.error(e)
    }
  }
  throw new Error("Contract was not deployed")
}

/**
 * Send claim airdrop to address
 * @param provider
 * @param sender
 * @param airdropAddress
 * @param entries
 */
async function claimAirdrop(
  provider: TonClient,
  sender: Sender,
  { airdropAddress, entries }: ClaimAirdropParams,
) {
  const index = entries.findIndex((e) => e.address.equals(sender.address!))
  if (index === -1) throw new Error("You are not in the airdrop list")
  const dictionary = generateEntriesDictionary(entries)
  const proof = dictionary.generateMerkleProof([BigInt(index)])
  const dictCell = beginCell().storeDictDirect(dictionary).endCell()
  const merkleRootShouldBe = BigInt("0x" + dictCell.hash().toString("hex"))
  const airdrop = provider.open(Airdrop.createFromAddress(airdropAddress))
  const { merkleRoot } = await airdrop.getContractData()
  if (merkleRoot !== merkleRootShouldBe)
    throw new Error("This is not a valid airdrop")

  const helper = provider.open(
    AirdropHelper.createFromConfig(
      {
        airdrop: airdropAddress,
        index: BigInt(index),
        proofHash: proof.hash(),
      },
      helperCode,
    ),
  )

  let balance: bigint
  try {
    balance = await provider.getBalance(helper.address!)
  } catch (e) {
    console.error(e)
    balance = BigInt(0)
  }
  await helper.sendDeploy(
    sender,
    BigInt(123),
    proof,
    balance > toNano("0.09") ? toNano("0.02") : toNano("0.1"),
  )
  // await waitForDeploy(provider, helper.address)

  // await helper.sendClaim(BigInt(123), proof) // 123 -> any query_id
}

/**
 * Get onchain data about airdrop from its address
 * @param provider
 * @param airdropAddress
 */
async function getAirdropData(
  provider: TonClient,
  airdropAddress: Address,
): Promise<AirdropData> {
  const airdrop = provider.open(Airdrop.createFromAddress(airdropAddress))
  const { admin, end, jettonWallet, begin } = await airdrop.getContractData()
  const { master } = await provider
    .open(JettonDefaultWallet.fromAddress(jettonWallet))
    .getGetWalletData()
  return {
    startTime: begin,
    endTime: end,
    admin,
    get isExpired() {
      return Date.now() / 1000 > end
    },
    get isStarted() {
      return Date.now() / 1000 > begin
    },
    jetton: master,
  }
}

/**
 * Withdraw funds from airdrop
 *
 * @param provider
 * @param sender
 * @param airdropAddress
 * @param amount
 */
async function withdrawFundsFromAirdrop(
  provider: TonClient,
  sender: Sender,
  airdropAddress: Address,
  amount: bigint,
) {
  const airdrop = provider.open(Airdrop.createFromAddress(airdropAddress))

  const { admin, end, begin } = await airdrop.getContractData()
  if (!admin.equals(sender.address!))
    throw new Error("You are not an admin of this airdrop")
  const now = Date.now() / 1000
  if (now < end && now > begin)
    throw new Error(
      "Airdrop is active right now. You can withdraw funds only after it ends",
    )

  await airdrop.sendWithdrawJettons(sender, toNano("0.12"), amount)
}

/**
 * Check if user claimed airdrop
 * @param provider
 * @param sender
 * @param airdropAddress
 * @param airdropWallets
 */
async function isUserClaimedAirdrop(
  provider: TonClient,
  sender: Sender,
  airdropAddress: Address,
  airdropWallets: AirdropEntry[],
): Promise<boolean> {
  const dict = generateEntriesDictionary(airdropWallets)
  const index = airdropWallets.findIndex((e) =>
    e.address.equals(sender.address!),
  )
  if (index === -1) throw new Error("You are not in the airdrop list")
  const airdrop = provider.open(Airdrop.createFromAddress(airdropAddress))
  const { helperCode } = await airdrop.getContractData()
  const proof = dict.generateMerkleProof([BigInt(index)])
  const helper = provider.open(
    AirdropHelper.createFromConfig(
      {
        airdrop: airdropAddress,
        index: BigInt(index),
        proofHash: proof.hash(),
      },
      helperCode,
    ),
  )

  return await helper.getClaimed()
}

export function toNanoDigits(src: string, digits: number): bigint {
  // Check sign
  let neg = false
  while (src.startsWith("-")) {
    neg = !neg
    src = src.slice(1)
  }

  // Split string
  if (src === ".") {
    throw Error("Invalid number")
  }
  let parts = src.split(".")
  if (parts.length > 2) {
    throw Error("Invalid number")
  }

  // Prepare parts
  let whole = parts[0]
  let frac = parts[1]
  if (!whole) {
    whole = "0"
  }
  if (!frac) {
    frac = "0"
  }
  if (frac.length > digits) {
    throw Error("Invalid number")
  }
  while (frac.length < digits) {
    frac += "0"
  }

  // Convert
  let r = BigInt(whole) * 10n ** BigInt(digits) + BigInt(frac)
  if (neg) {
    r = -r
  }
  return r
}

export function fromNanoDigits(v: bigint, digits: number): string {
  let neg = false
  if (v < 0) {
    neg = true
    v = -v
  }

  // Convert fraction
  let frac = v % 10n ** BigInt(digits)
  let facStr = frac.toString()
  while (facStr.length < digits) {
    facStr = "0" + facStr
  }
  facStr = facStr.match(/^([0-9]*[1-9]|0)(0*)/)![1]

  // Convert whole
  let whole = v / 10n ** BigInt(digits)
  let wholeStr = whole.toString()

  // Value
  let value = `${wholeStr}${facStr === "0" ? "" : `.${facStr}`}`
  if (neg) {
    value = "-" + value
  }

  return value
}
