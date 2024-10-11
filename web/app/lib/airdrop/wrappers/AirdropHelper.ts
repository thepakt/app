import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, toNano } from '@ton/core';
import { AirdropEntry } from './Airdrop';

export type AirdropHelperConfig = {
    airdrop: Address;
    proofHash: Buffer;
    index: bigint;
};

export function airdropHelperConfigToCell(config: AirdropHelperConfig): Cell {
    return beginCell()
        .storeBit(false)
        .storeAddress(config.airdrop)
        .storeBuffer(config.proofHash, 32)
        .storeUint(config.index, 256)
        .endCell();
}

export class AirdropHelper implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new AirdropHelper(address);
    }

    static createFromConfig(config: AirdropHelperConfig, code: Cell, workchain = 0) {
        const data = airdropHelperConfigToCell(config);
        const init = { code, data };
        return new AirdropHelper(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, queryId: bigint, proof: Cell, forwardAmount: bigint) {
        await provider.internal(via, {
            value: forwardAmount,
            body: beginCell()
                .storeUint(0x1, 32) //op code
                .storeUint(queryId, 64) //query_id
                .storeRef(proof) //proof
                .endCell(),
            bounce: true
        });
    }


    async getClaimed(provider: ContractProvider): Promise<boolean> {
        if ((await provider.getState()).state.type == 'uninit') {
            return false;
        }
        const stack = (await provider.get('get_claimed', [])).stack;
        return stack.readBoolean();
    }
}
