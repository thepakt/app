import {tonClient, useProviderSender} from "~/lib/ton-sender";
import {useMemo} from "react";
import {Address, beginCell, Cell, Dictionary, Sender, Slice, toNano} from "@ton/core";
import {OneTask, Collection} from "./ton-guarantee-collection";
import {storeNotifyMessage, TonGuarantee} from "./ton-guarantee";
import {JettonMaster} from "~/lib/ton-master";
import {JettonChild} from "~/lib/ton-child";


export default function useActions() {
    const sender = useProviderSender();

    return useMemo(() => ({
        createContract: (data: InitalizeContractData) => createContract(sender, data),
        argue: (contractAddress: Address, isArguing: boolean) => argue(sender, contractAddress, isArguing),
        releaseSubtask: (contractAddress: Address, taskId: number) => releaseSubtask(sender, contractAddress, BigInt(taskId)),
        moderatorReleaseSubtask: (contractAddress: Address, taskId: number) => moderatorReleaseSubtask(sender, contractAddress, BigInt(taskId)),
        moderatorCancelContract: (contractAddress: Address) => moderatorCancel(sender, contractAddress),
        cancelByPerformer: (contractAddress: Address) => cancelByPerformer(sender, contractAddress),
        getData
    }), [sender])
}
type InitalizeContractData = {
    investor: Address;
    performer: Address;
    moderator: Address;
    tokenMaster: Address;
    tasks: { amount: bigint }[];

    finishAmount: bigint;
}
async function getData(address: Address) {
    const tonInvestor = tonClient.open(TonGuarantee.fromAddress(address));
    return tonInvestor.getData();
}
async function createContract(sender: Sender, {
    performer,
    moderator,
    tokenMaster: master,
    tasks: tasksMap,
    finishAmount
}: InitalizeContractData) {
    // const tonInvestor = tonClient.open(await TonGuarantee.fromInit(investor, performer, moderator));
    // const master = tonClient.open(JettonMaster.fromAddress(tokenMaster));
    // const childAddress = await master.getGetWalletAddress(tonInvestor.address);
    // const tasks = Dictionary.empty<number, OneTask>();
    // for (const [key, value] of tasksMap.map((task, index) => [index, task] as [number, { amount: bigint }])) {
    //     tasks.set(key, {
    //         $$type: 'OneTask',
    //         amount: value.amount,
    //         finished: false
    //     });
    // }
    //
    // const senderJetton = tonClient.open(JettonChild.fromAddress(await master.getGetWalletAddress(sender.address!)));
    // const senderBalance = await senderJetton.getGetWalletData().then((e) => e.balance);
    // const amountToSend = tasks.values().map(e => e.amount).reduce((a, b) => a + b) + finishAmount;
    // if (senderBalance < amountToSend) {
    //     throw new Error('Not enough balance');
    // }
    // await Promise.all([
    //     tonInvestor.send(sender, {value: toNano('0.03')}, {
    //         $$type: 'InitializeContract',
    //         subtasksIT: {
    //             $$type: 'Subtasks',
    //             token: childAddress,
    //             finishAmount: finishAmount,
    //             tasks
    //         }
    //     }),
    //     senderJetton.send(sender, {value: toNano('0.14')}, {
    //         $$type: 'TokenTransfer',
    //         queryId: 0n,
    //         amount: amountToSend,
    //         destination: tonInvestor.address,
    //         response_destination: sender.address!,
    //         custom_payload: null,
    //         forward_ton_amount: 1n,
    //         forward_payload: beginCell().storeUint(32, 0).storeStringTail('Comment').endCell()
    //     })
    // ]);
    // await new Promise(resolve => setTimeout(resolve, 10_000));
    // for (let i = 0; i < 10; i++) {
    //     try {
    //         const balance = await tonClient.getBalance(tonInvestor.address);
    //         if (balance > 0) {
    //             return tonInvestor.address;
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    //     await new Promise(resolve => setTimeout(resolve, 10_000));
    // }
    // throw new Error('Contract not created');
    const collection = tonClient.open(await Collection.fromInit());
    let tasks: Dictionary<number, OneTask> = Dictionary.empty();
    for(let i = 0; i < tasksMap.length; i++) {
        tasks = tasks.set(i, {
            amount: tasksMap[i].amount,
            finished: false,
            $$type: 'OneTask',
        });
    }

    const tokenMaster = tonClient.open(JettonMaster.fromAddress(master));
    const randomId = BigInt(Math.floor(Math.random() * 1000000));
    const collectionJetton = tonClient.open(
        JettonChild.fromAddress(await tokenMaster.getGetWalletAddress(collection.address)),
    );

    const lockContract = tonClient.open(
        await TonGuarantee.fromInit(
            collection.address,
            await collection.getRandomIdFor(collectionJetton.address, sender.address!, randomId),
        ),
    );
    const investorToken = tonClient.open(
        JettonChild.fromAddress(await tokenMaster.getGetWalletAddress(sender.address!)),
    );
    await investorToken.send(
        sender,
        {
            value: toNano('0.3'),
            bounce: true,
        },
        {
            $$type: 'TokenTransfer',
            queryId: 0n,
            amount: tasksMap.map(e => e.amount).reduce((a, b) => a + b) + finishAmount,
            destination: collection.address,
            response_destination: sender.address!,
            custom_payload: null,
            forward_ton_amount: toNano('0.2'),
            forward_payload: beginCell()
                .storeBit(1)
                .storeRef(
                    beginCell()
                        .store(
                            storeNotifyMessage({
                                $$type: 'NotifyMessage',
                                randomId,
                                subtasks: {
                                    $$type: 'Subtasks',
                                    token: await tokenMaster.getGetWalletAddress(lockContract.address),
                                    finishAmount,
                                    tasks,
                                },
                                moderator: moderator,
                                performer: performer,
                            }),
                        ),
                )
                .endCell()
        },
    );

    for(let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 10_000));
        const deployed = await tonClient.getContractState(lockContract.address);
        if(deployed.state === 'active') return lockContract.address;
    }
    throw new Error('Contract not created');
}


async function argue(sender: Sender, contractAddress: Address, isArguing: boolean) {
    const tonInvestor = tonClient.open(TonGuarantee.fromAddress(contractAddress));
    await tonInvestor.send(sender, {value: toNano('0.03')}, {
        $$type: 'SetArgue',
        argue: isArguing
    });
}


async function releaseSubtask(sender: Sender, contractAddress: Address, taskId: bigint) {
    const tonInvestor = tonClient.open(TonGuarantee.fromAddress(contractAddress));
    const {subtasks, investor} = await tonInvestor.getData();
    if (!investor.equals(sender.address!)) {
        throw new Error('Only investor can release subtask');
    }
    const isLastTask = subtasks.tasks.values().filter(e => !e.finished).length === 1;
    await tonInvestor.send(sender, {value: toNano('0.25')}, {
        $$type: 'ReleaseSubtask',
        taskId,
        isLastTask
    });
}


async function moderatorReleaseSubtask(sender: Sender, contractAddress: Address, taskId: bigint) {
    const tonInvestor = tonClient.open(TonGuarantee.fromAddress(contractAddress));
    const {subtasks, moderator} = await tonInvestor.getData();
    if (!moderator.equals(sender.address!)) {
        throw new Error('Only moderator can release subtask');
    }
    const isLastTask = subtasks.tasks.values().filter(e => !e.finished).length === 1;
    await tonInvestor.send(sender, {value: toNano('0.25')}, {
        $$type: 'ModeratorCloseTask',
        taskId,
        isLastTask
    });
}


async function moderatorCancel(sender: Sender, contractAddress: Address) {
    const tonInvestor = tonClient.open(TonGuarantee.fromAddress(contractAddress));
    await tonInvestor.send(sender, {value: toNano('0.18')}, 'moderator_cancel');
}

async function cancelByPerformer(sender: Sender, contractAddress: Address) {
    const tonInvestor = tonClient.open(TonGuarantee.fromAddress(contractAddress));
    await tonInvestor.send(sender, {value: toNano('0.18')}, 'cancel_performer');
}

