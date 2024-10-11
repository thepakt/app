import {useForm} from "@tanstack/react-form"
import {createFileRoute} from "@tanstack/react-router"
import {Address} from "@ton/core"
import {TonConnectButton} from "@tonconnect/ui-react"
import {Info, Trash2} from "lucide-react"
import {useEffect, useState} from "react"
import toast from "react-hot-toast"
import {createAirdropWalletToClaim} from "~/actions"
import {isProduction} from "~/lib/utils"
import newAirdropForClaimJson from "../../../data/new-airdrop-for-claim.json"
import useBlockchainActions, {toNanoDigits} from "../lib/airdrop/useActions"
import {Api, TonApiClient} from "@ton-api/client"

function RouteComponent() {
    const [inputPairs, setInputPairs] = useState<
        Array<{ id: number; wallet: string; amount: string }>
    >([])
    const {createAirdrop, sendJettonsToAirdrop} = useBlockchainActions()
    const [submittedAirdropWalletEntries, setSubmittedAirdropWalletEntries] =
        useState<{ userWallet: string; tokenAmount: string }[]>([])
    const [parsedEntriesSubmitted, setParsedEntriesSubmitted] = useState<
        { address: Address; amount: bigint }[]
    >([])
    const [airDropAddress, setAirdropAddress] = useState<Address | null>(null)
    const [showInfoPopup, setShowInfoPopup] = useState(false)

    const form = useForm({
        defaultValues: {
            pairs: [{userWallet: "", tokenAmount: ""}],
            startTime: "",
            endDate: "",
            jettonAddress: "",
        },
        onSubmit: async ({value}) => {
            try {
                setSubmittedAirdropWalletEntries(value.pairs)

                const tonapi = new Api(new TonApiClient({
                    baseUrl: "https://testnet.tonapi.io"
                }));
                const data = await tonapi.jettons.getJettonInfo(Address.parse(value.jettonAddress));
                const decimals = data.metadata.decimals;
                const image = data.metadata.image;
                const title = data.metadata.name;


                const parsedEntries = value.pairs
                    .filter((e) => !!e.userWallet)
                    .map((entry) => ({
                        address: Address.parse(entry.userWallet),
                        amount: toNanoDigits(entry.tokenAmount, Number(decimals)),
                    }))

                const endTime = Math.floor(new Date(value.endDate).getTime() / 1000)
                const startTime = Math.floor(new Date(value.startTime).getTime() / 1000)
                const airdropAddress = await createAirdrop({
                    jettonAddress: Address.parse(value.jettonAddress),
                    endTime,
                    startTime,
                    entries: parsedEntries,
                })

                setAirdropAddress(airdropAddress)
                setParsedEntriesSubmitted(parsedEntries)
                await createAirdropWalletToClaim({
                    airdropAddress: airdropAddress.toString(),
                    startDate: new Date(value.startTime).getTime() / 1000,
                    endDate: endTime,
                    jettonAddress: Address.parse(value.jettonAddress).toString(),
                    // TODO: do actual check for the mainnet, not this
                    mainnet: isProduction,
                    airdropWalletsForClaim: parsedEntries.map((entry, index) => ({
                        walletAddress: entry.address.toString(),
                        // tokenAmount: entry.amount.toString(),
                        tokenAmount: entry.amount.toString(),
                        index,
                    })),
                    metadata: {
                        decimals: +decimals,
                        image: image!,
                        title
                    }
                })
                toast.success("Airdrop created successfully")
            } catch (error) {
                console.log(error)
                const errorMessage =
                    error instanceof Error ? error.message : "An unknown error occurred"

                if (errorMessage === "Airdrop already deployed") {
                    toast.error(
                        "This airdrop with these entries has already been deployed.",
                        {
                            icon: "🚫",
                        },
                    )
                } else {
                    toast.error(`Error creating airdrop: ${errorMessage}`, {
                        icon: "❌",
                    })
                }
            }
        },
    })

    const addInputPair = () => {
        form.pushFieldValue("pairs", {userWallet: "", tokenAmount: ""})
        setInputPairs([
            ...inputPairs,
            {id: inputPairs.length, wallet: "", amount: ""},
        ])
    }

    const removeInputPair = (index: number) => {
        if (inputPairs.length > 1) {
            setInputPairs(inputPairs.filter((_, i) => i !== index))
        }
    }

    useEffect(() => {
        const currentStartTime = form.getFieldValue("startTime")
        if (!currentStartTime) {
            form.setFieldValue("startTime", new Date().toISOString().slice(0, 16))
        }
    }, [])

    // was here for testing but no longer needed as there should be no default date set for airdrop (users should set it)
    // useEffect(() => {
    //   const now = new Date()
    //   const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60000) // 2 hours in milliseconds
    //   // Set the start time to now
    //   form.setFieldValue("startTime", now.toISOString().slice(0, 16))
    //   // Set the end date to 2 hours from now
    //   form.setFieldValue("endDate", twoHoursLater.toISOString().slice(0, 16))
    // }, [])

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center w-full mb-6">
                <h2 className="text-2xl font-bold ">New Airdrop for Claim</h2>
                <TonConnectButton/>
            </div>
            <h3 className="text-xl font-semibold mb-4 w-full text-left">
                {/* TODO: add link to docs that opens and says what format the file must be in */}
                Helpers
            </h3>

            <div className="w-[50%] mr-auto mb-4">
                <label
                    htmlFor="fileInput"
                    className="px-4 mr-auto py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600 text-left w-[50%] mb-4"
                >
                    Attach JSON with airdrop details
                </label>
                <button
                    className="p-2 ml-2 text-gray-500 hover:text-blue-500 transition-colors relative"
                    onClick={() => setShowInfoPopup(!showInfoPopup)}
                >
                    <Info size={20}/>
                    {showInfoPopup && (
                        <div
                            className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded shadow-lg z-10 w-80">
                            <p className="text-md">Format of JSON should be like this:</p>
                            <pre className="text-xs whitespace-pre-wrap break-words">
                {/* TODO: make prettier */}
                                <code>
                  {`
[
{
 "wallet": "0QBg74IjuUYh2YiE87zzdHzf_E_XgscFKfmtZGFLOBkMNGgM",
 "amount": 15
}
 ]
`}
                </code>
              </pre>
                        </div>
                    )}
                </button>
                <input
                    id="fileInput"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                try {
                                    const jsonData = JSON.parse(e.target?.result as string)
                                    const newPairs = jsonData.map(
                                        (
                                            item: { wallet: string; amount: number },
                                            index: number,
                                        ) => ({
                                            id: index,
                                            wallet: item.wallet,
                                            amount: item.amount.toString(),
                                        }),
                                    )
                                    setInputPairs(newPairs)
                                    const mappedPairs = newPairs.map(
                                        (pair: { wallet: string; amount: number }) => ({
                                            userWallet: pair.wallet,
                                            tokenAmount: pair.amount,
                                        }),
                                    )
                                    form.setFieldValue("pairs", mappedPairs)
                                } catch (error) {
                                    console.error("Error parsing JSON file:", error)
                                }
                            }
                            reader.readAsText(file)
                        }
                    }}
                />
            </div>
            <button
                onClick={() => {
                    form.setFieldValue(
                        "jettonAddress",
                        "EQCXzO7HhoK5fDQuCONE43l8-Qsreq5zq89ZVNhEna24eK-h",
                    )
                }}
                className="px-4 mr-auto py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600 text-left w-[50%] mb-4"
            >
                Enter 🐸 Mainnet Jetton Address
            </button>
            {!isProduction && (
                <div className="mb-4 mr-auto w-[50%]">
                    <label
                        htmlFor="fileInputWithoutFilePicker"
                        className="inline-block px-4 py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600 text-left w-full cursor-pointer"
                    >
                        Dev: Load airdrop details for testing
                    </label>
                    <input
                        id="fileInputWithoutFilePicker"
                        accept=".json"
                        className="hidden"
                        onClick={() => {
                            try {
                                const newPairs = newAirdropForClaimJson.map((pair, index) => ({
                                    id: index,
                                    wallet: pair.wallet,
                                    amount: pair.amount.toString(), // Convert amount to string
                                }))
                                setInputPairs(newPairs)
                                const mappedPairs = newPairs.map((pair) => ({
                                    userWallet: pair.wallet,
                                    tokenAmount: pair.amount,
                                }))
                                form.setFieldValue("pairs", mappedPairs)
                                console.log("airdropJson parsed successfully:", newPairs)
                            } catch (error) {
                                console.error("Error parsing airdropJson:", error)
                            }
                        }}
                    />
                </div>
            )}
            {!isProduction && (
                <div className="mb-4 mr-auto w-[50%]">
                    <button
                        className="inline-block px-4 py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600 text-left w-full cursor-pointer"
                        onClick={() => {
                            form.setFieldValue(
                                "jettonAddress",
                                "kQC6cYfMFYFur2IgJroc3wBxg-q4hOxsqGQwEYSEARxtOmZf",
                            )
                        }}
                    >
                        Dev: Enter LOM Jetton Address
                    </button>
                </div>
            )}

            <div className="w-full border-b border-gray-300 dark:border-gray-700 mb-6"></div>
            <h3 className="text-xl font-semibold mb-4 w-full text-left">
                Airdrop details
            </h3>
            <form.Field name="jettonAddress">
                {(field) => (
                    <label className="flex flex-col w-full mb-4">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
              Jetton Address
            </span>
                        <input
                            type="text"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter Jetton Address"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </label>
                )}
            </form.Field>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="flex flex-col gap-6 w-full"
            >
                <div className="flex gap-4">
                    <form.Field name="startTime">
                        {(field) => (
                            <label className="flex flex-col flex-grow">
                <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
                  {/* TODO: hide the () if it was set by user in some way */}
                    Start Time
                </span>
                                <input
                                    type="datetime-local"
                                    value={field.state.value || ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </label>
                        )}
                    </form.Field>
                    <form.Field name="endDate">
                        {(field) => (
                            <label className="flex flex-col flex-grow">
                <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
                  {/* TODO: hide the () if it was set by user in some way */}
                    End Date
                </span>
                                <input
                                    type="datetime-local"
                                    // TODO: don't set default end date
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </label>
                        )}
                    </form.Field>
                </div>
                {inputPairs.map((pair, index) => (
                    <div key={pair.id} className="flex items-end gap-2 w-full">
                        <form.Field name={`pairs[${index}].userWallet`}>
                            {(field) => (
                                <label className="flex flex-col flex-grow">
                  <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
                    User Wallet
                  </span>
                                    <input
                                        type="text"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </label>
                            )}
                        </form.Field>
                        <form.Field name={`pairs[${index}].tokenAmount`}>
                            {(field) => (
                                <label className="flex flex-col w-32">
                  <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
                    Token Amount
                  </span>
                                    <input
                                        type="number"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </label>
                            )}
                        </form.Field>

                        {index !== 0 && (
                            <button
                                type="button"
                                onClick={() => removeInputPair(index)}
                                className="p-2 text-gray-500 hover:text-red-500"
                            >
                                <Trash2 size={20}/>
                            </button>
                        )}
                    </div>
                ))}

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={addInputPair}
                        className="px-4 py-2 bg-neutral-500 hover:opacity-45 transition-opacity text-white text-sm rounded"
                    >
                        Add More
                    </button>
                </div>

                <form.Subscribe
                    selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                        state.values.pairs.some(
                            (pair) => pair.userWallet && pair.tokenAmount,
                        ),
                        state.values.endDate,
                    ]}
                >
                    {([canSubmit, isSubmitting, hasValidPair, endDate]) => (
                        <button
                            type="submit"
                            disabled={!canSubmit || !hasValidPair || !endDate}
                            className={`w-full px-4 py-2 text-white rounded transition-colors ${
                                canSubmit && hasValidPair && endDate
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting ? "Creating..." : "Create Airdrop for Claim"}
                        </button>
                    )}
                </form.Subscribe>
            </form>
        </div>
    )
}

export const Route = createFileRoute("/new-airdrop-for-claim")({
    component: () => <RouteComponent/>,
})
