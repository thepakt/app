import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(8);
    let _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(32);
    let _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type ModeratorCloseTask = {
    $$type: 'ModeratorCloseTask';
    taskId: bigint;
    isLastTask: boolean;
}

export function storeModeratorCloseTask(src: ModeratorCloseTask) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1103476706, 32);
        b_0.storeUint(src.taskId, 64);
        b_0.storeBit(src.isLastTask);
    };
}

export function loadModeratorCloseTask(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1103476706) { throw Error('Invalid prefix'); }
    let _taskId = sc_0.loadUintBig(64);
    let _isLastTask = sc_0.loadBit();
    return { $$type: 'ModeratorCloseTask' as const, taskId: _taskId, isLastTask: _isLastTask };
}

function loadTupleModeratorCloseTask(source: TupleReader) {
    let _taskId = source.readBigNumber();
    let _isLastTask = source.readBoolean();
    return { $$type: 'ModeratorCloseTask' as const, taskId: _taskId, isLastTask: _isLastTask };
}

function loadGetterTupleModeratorCloseTask(source: TupleReader) {
    let _taskId = source.readBigNumber();
    let _isLastTask = source.readBoolean();
    return { $$type: 'ModeratorCloseTask' as const, taskId: _taskId, isLastTask: _isLastTask };
}

function storeTupleModeratorCloseTask(source: ModeratorCloseTask) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.taskId);
    builder.writeBoolean(source.isLastTask);
    return builder.build();
}

function dictValueParserModeratorCloseTask(): DictionaryValue<ModeratorCloseTask> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeModeratorCloseTask(src)).endCell());
        },
        parse: (src) => {
            return loadModeratorCloseTask(src.loadRef().beginParse());
        }
    }
}

export type SetArgue = {
    $$type: 'SetArgue';
    argue: boolean;
}

export function storeSetArgue(src: SetArgue) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(523230747, 32);
        b_0.storeBit(src.argue);
    };
}

export function loadSetArgue(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 523230747) { throw Error('Invalid prefix'); }
    let _argue = sc_0.loadBit();
    return { $$type: 'SetArgue' as const, argue: _argue };
}

function loadTupleSetArgue(source: TupleReader) {
    let _argue = source.readBoolean();
    return { $$type: 'SetArgue' as const, argue: _argue };
}

function loadGetterTupleSetArgue(source: TupleReader) {
    let _argue = source.readBoolean();
    return { $$type: 'SetArgue' as const, argue: _argue };
}

function storeTupleSetArgue(source: SetArgue) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.argue);
    return builder.build();
}

function dictValueParserSetArgue(): DictionaryValue<SetArgue> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetArgue(src)).endCell());
        },
        parse: (src) => {
            return loadSetArgue(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    excess_to: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Slice;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.excess_to);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _excess_to = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0;
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, excess_to: _excess_to, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _excess_to = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, excess_to: _excess_to, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadGetterTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _excess_to = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, excess_to: _excess_to, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.excess_to);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type OneTask = {
    $$type: 'OneTask';
    amount: bigint;
    finished: boolean;
}

export function storeOneTask(src: OneTask) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.amount);
        b_0.storeBit(src.finished);
    };
}

export function loadOneTask(slice: Slice) {
    let sc_0 = slice;
    let _amount = sc_0.loadCoins();
    let _finished = sc_0.loadBit();
    return { $$type: 'OneTask' as const, amount: _amount, finished: _finished };
}

function loadTupleOneTask(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _finished = source.readBoolean();
    return { $$type: 'OneTask' as const, amount: _amount, finished: _finished };
}

function loadGetterTupleOneTask(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _finished = source.readBoolean();
    return { $$type: 'OneTask' as const, amount: _amount, finished: _finished };
}

function storeTupleOneTask(source: OneTask) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeBoolean(source.finished);
    return builder.build();
}

function dictValueParserOneTask(): DictionaryValue<OneTask> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOneTask(src)).endCell());
        },
        parse: (src) => {
            return loadOneTask(src.loadRef().beginParse());
        }
    }
}

export type Subtasks = {
    $$type: 'Subtasks';
    token: Address;
    finishAmount: bigint;
    tasks: Dictionary<number, OneTask>;
}

export function storeSubtasks(src: Subtasks) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.token);
        b_0.storeCoins(src.finishAmount);
        b_0.storeDict(src.tasks, Dictionary.Keys.Uint(16), dictValueParserOneTask());
    };
}

export function loadSubtasks(slice: Slice) {
    let sc_0 = slice;
    let _token = sc_0.loadAddress();
    let _finishAmount = sc_0.loadCoins();
    let _tasks = Dictionary.load(Dictionary.Keys.Uint(16), dictValueParserOneTask(), sc_0);
    return { $$type: 'Subtasks' as const, token: _token, finishAmount: _finishAmount, tasks: _tasks };
}

function loadTupleSubtasks(source: TupleReader) {
    let _token = source.readAddress();
    let _finishAmount = source.readBigNumber();
    let _tasks = Dictionary.loadDirect(Dictionary.Keys.Uint(16), dictValueParserOneTask(), source.readCellOpt());
    return { $$type: 'Subtasks' as const, token: _token, finishAmount: _finishAmount, tasks: _tasks };
}

function loadGetterTupleSubtasks(source: TupleReader) {
    let _token = source.readAddress();
    let _finishAmount = source.readBigNumber();
    let _tasks = Dictionary.loadDirect(Dictionary.Keys.Uint(16), dictValueParserOneTask(), source.readCellOpt());
    return { $$type: 'Subtasks' as const, token: _token, finishAmount: _finishAmount, tasks: _tasks };
}

function storeTupleSubtasks(source: Subtasks) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.token);
    builder.writeNumber(source.finishAmount);
    builder.writeCell(source.tasks.size > 0 ? beginCell().storeDictDirect(source.tasks, Dictionary.Keys.Uint(16), dictValueParserOneTask()).endCell() : null);
    return builder.build();
}

function dictValueParserSubtasks(): DictionaryValue<Subtasks> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSubtasks(src)).endCell());
        },
        parse: (src) => {
            return loadSubtasks(src.loadRef().beginParse());
        }
    }
}

export type InitializeContract = {
    $$type: 'InitializeContract';
    subtasksIT: Subtasks;
}

export function storeInitializeContract(src: InitializeContract) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1690366863, 32);
        b_0.store(storeSubtasks(src.subtasksIT));
    };
}

export function loadInitializeContract(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1690366863) { throw Error('Invalid prefix'); }
    let _subtasksIT = loadSubtasks(sc_0);
    return { $$type: 'InitializeContract' as const, subtasksIT: _subtasksIT };
}

function loadTupleInitializeContract(source: TupleReader) {
    const _subtasksIT = loadTupleSubtasks(source);
    return { $$type: 'InitializeContract' as const, subtasksIT: _subtasksIT };
}

function loadGetterTupleInitializeContract(source: TupleReader) {
    const _subtasksIT = loadGetterTupleSubtasks(source);
    return { $$type: 'InitializeContract' as const, subtasksIT: _subtasksIT };
}

function storeTupleInitializeContract(source: InitializeContract) {
    let builder = new TupleBuilder();
    builder.writeTuple(storeTupleSubtasks(source.subtasksIT));
    return builder.build();
}

function dictValueParserInitializeContract(): DictionaryValue<InitializeContract> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInitializeContract(src)).endCell());
        },
        parse: (src) => {
            return loadInitializeContract(src.loadRef().beginParse());
        }
    }
}

export type ReleaseSubtask = {
    $$type: 'ReleaseSubtask';
    taskId: bigint;
    isLastTask: boolean;
}

export function storeReleaseSubtask(src: ReleaseSubtask) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2648785511, 32);
        b_0.storeInt(src.taskId, 257);
        b_0.storeBit(src.isLastTask);
    };
}

export function loadReleaseSubtask(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2648785511) { throw Error('Invalid prefix'); }
    let _taskId = sc_0.loadIntBig(257);
    let _isLastTask = sc_0.loadBit();
    return { $$type: 'ReleaseSubtask' as const, taskId: _taskId, isLastTask: _isLastTask };
}

function loadTupleReleaseSubtask(source: TupleReader) {
    let _taskId = source.readBigNumber();
    let _isLastTask = source.readBoolean();
    return { $$type: 'ReleaseSubtask' as const, taskId: _taskId, isLastTask: _isLastTask };
}

function loadGetterTupleReleaseSubtask(source: TupleReader) {
    let _taskId = source.readBigNumber();
    let _isLastTask = source.readBoolean();
    return { $$type: 'ReleaseSubtask' as const, taskId: _taskId, isLastTask: _isLastTask };
}

function storeTupleReleaseSubtask(source: ReleaseSubtask) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.taskId);
    builder.writeBoolean(source.isLastTask);
    return builder.build();
}

function dictValueParserReleaseSubtask(): DictionaryValue<ReleaseSubtask> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReleaseSubtask(src)).endCell());
        },
        parse: (src) => {
            return loadReleaseSubtask(src.loadRef().beginParse());
        }
    }
}

export type InvestmentData = {
    $$type: 'InvestmentData';
    investor: Address;
    performer: Address;
    moderator: Address;
    subtasks: Subtasks;
    argueFromInvestor: boolean;
    argueFromWorker: boolean;
    started: boolean;
    canceled: boolean;
}

export function storeInvestmentData(src: InvestmentData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.investor);
        b_0.storeAddress(src.performer);
        b_0.storeAddress(src.moderator);
        let b_1 = new Builder();
        b_1.store(storeSubtasks(src.subtasks));
        b_1.storeBit(src.argueFromInvestor);
        b_1.storeBit(src.argueFromWorker);
        b_1.storeBit(src.started);
        b_1.storeBit(src.canceled);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadInvestmentData(slice: Slice) {
    let sc_0 = slice;
    let _investor = sc_0.loadAddress();
    let _performer = sc_0.loadAddress();
    let _moderator = sc_0.loadAddress();
    let sc_1 = sc_0.loadRef().beginParse();
    let _subtasks = loadSubtasks(sc_1);
    let _argueFromInvestor = sc_1.loadBit();
    let _argueFromWorker = sc_1.loadBit();
    let _started = sc_1.loadBit();
    let _canceled = sc_1.loadBit();
    return { $$type: 'InvestmentData' as const, investor: _investor, performer: _performer, moderator: _moderator, subtasks: _subtasks, argueFromInvestor: _argueFromInvestor, argueFromWorker: _argueFromWorker, started: _started, canceled: _canceled };
}

function loadTupleInvestmentData(source: TupleReader) {
    let _investor = source.readAddress();
    let _performer = source.readAddress();
    let _moderator = source.readAddress();
    const _subtasks = loadTupleSubtasks(source);
    let _argueFromInvestor = source.readBoolean();
    let _argueFromWorker = source.readBoolean();
    let _started = source.readBoolean();
    let _canceled = source.readBoolean();
    return { $$type: 'InvestmentData' as const, investor: _investor, performer: _performer, moderator: _moderator, subtasks: _subtasks, argueFromInvestor: _argueFromInvestor, argueFromWorker: _argueFromWorker, started: _started, canceled: _canceled };
}

function loadGetterTupleInvestmentData(source: TupleReader) {
    let _investor = source.readAddress();
    let _performer = source.readAddress();
    let _moderator = source.readAddress();
    const _subtasks = loadGetterTupleSubtasks(source);
    let _argueFromInvestor = source.readBoolean();
    let _argueFromWorker = source.readBoolean();
    let _started = source.readBoolean();
    let _canceled = source.readBoolean();
    return { $$type: 'InvestmentData' as const, investor: _investor, performer: _performer, moderator: _moderator, subtasks: _subtasks, argueFromInvestor: _argueFromInvestor, argueFromWorker: _argueFromWorker, started: _started, canceled: _canceled };
}

function storeTupleInvestmentData(source: InvestmentData) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.investor);
    builder.writeAddress(source.performer);
    builder.writeAddress(source.moderator);
    builder.writeTuple(storeTupleSubtasks(source.subtasks));
    builder.writeBoolean(source.argueFromInvestor);
    builder.writeBoolean(source.argueFromWorker);
    builder.writeBoolean(source.started);
    builder.writeBoolean(source.canceled);
    return builder.build();
}

function dictValueParserInvestmentData(): DictionaryValue<InvestmentData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInvestmentData(src)).endCell());
        },
        parse: (src) => {
            return loadInvestmentData(src.loadRef().beginParse());
        }
    }
}

export type TonInvestor$Data = {
    $$type: 'TonInvestor$Data';
    argueFromInvestor: boolean;
    argueFromWorker: boolean;
    started: boolean;
    canceled: boolean;
    investor: Address;
    performer: Address;
    moderator: Address;
    subtasks: Subtasks;
}

export function storeTonInvestor$Data(src: TonInvestor$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.argueFromInvestor);
        b_0.storeBit(src.argueFromWorker);
        b_0.storeBit(src.started);
        b_0.storeBit(src.canceled);
        b_0.storeAddress(src.investor);
        b_0.storeAddress(src.performer);
        b_0.storeAddress(src.moderator);
        let b_1 = new Builder();
        b_1.store(storeSubtasks(src.subtasks));
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTonInvestor$Data(slice: Slice) {
    let sc_0 = slice;
    let _argueFromInvestor = sc_0.loadBit();
    let _argueFromWorker = sc_0.loadBit();
    let _started = sc_0.loadBit();
    let _canceled = sc_0.loadBit();
    let _investor = sc_0.loadAddress();
    let _performer = sc_0.loadAddress();
    let _moderator = sc_0.loadAddress();
    let sc_1 = sc_0.loadRef().beginParse();
    let _subtasks = loadSubtasks(sc_1);
    return { $$type: 'TonInvestor$Data' as const, argueFromInvestor: _argueFromInvestor, argueFromWorker: _argueFromWorker, started: _started, canceled: _canceled, investor: _investor, performer: _performer, moderator: _moderator, subtasks: _subtasks };
}

function loadTupleTonInvestor$Data(source: TupleReader) {
    let _argueFromInvestor = source.readBoolean();
    let _argueFromWorker = source.readBoolean();
    let _started = source.readBoolean();
    let _canceled = source.readBoolean();
    let _investor = source.readAddress();
    let _performer = source.readAddress();
    let _moderator = source.readAddress();
    const _subtasks = loadTupleSubtasks(source);
    return { $$type: 'TonInvestor$Data' as const, argueFromInvestor: _argueFromInvestor, argueFromWorker: _argueFromWorker, started: _started, canceled: _canceled, investor: _investor, performer: _performer, moderator: _moderator, subtasks: _subtasks };
}

function loadGetterTupleTonInvestor$Data(source: TupleReader) {
    let _argueFromInvestor = source.readBoolean();
    let _argueFromWorker = source.readBoolean();
    let _started = source.readBoolean();
    let _canceled = source.readBoolean();
    let _investor = source.readAddress();
    let _performer = source.readAddress();
    let _moderator = source.readAddress();
    const _subtasks = loadGetterTupleSubtasks(source);
    return { $$type: 'TonInvestor$Data' as const, argueFromInvestor: _argueFromInvestor, argueFromWorker: _argueFromWorker, started: _started, canceled: _canceled, investor: _investor, performer: _performer, moderator: _moderator, subtasks: _subtasks };
}

function storeTupleTonInvestor$Data(source: TonInvestor$Data) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.argueFromInvestor);
    builder.writeBoolean(source.argueFromWorker);
    builder.writeBoolean(source.started);
    builder.writeBoolean(source.canceled);
    builder.writeAddress(source.investor);
    builder.writeAddress(source.performer);
    builder.writeAddress(source.moderator);
    builder.writeTuple(storeTupleSubtasks(source.subtasks));
    return builder.build();
}

function dictValueParserTonInvestor$Data(): DictionaryValue<TonInvestor$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTonInvestor$Data(src)).endCell());
        },
        parse: (src) => {
            return loadTonInvestor$Data(src.loadRef().beginParse());
        }
    }
}

 type TonInvestor_init_args = {
    $$type: 'TonInvestor_init_args';
    investor: Address;
    performer: Address;
    moderator: Address;
}

function initTonInvestor_init_args(src: TonInvestor_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.investor);
        b_0.storeAddress(src.performer);
        b_0.storeAddress(src.moderator);
    };
}

async function TonInvestor_init(investor: Address, performer: Address, moderator: Address) {
    const __code = Cell.fromBase64('te6ccgECJQEACYUAART/APSkE/S88sgLAQIBYgIDA5rQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxVGds88uCCyPhDAcx/AcoAVZDbPMntVAcICQIBWAQFAhG4di2zzbPGyqgHBgARuCvu1E0NIAAYABRUdUNUdUNUf+0vAjjtRNDUAfhj0gABjoTbPGwa4Pgo1wsKgwm68uCJCgsE5u2i7fsBkjB/4HAh10nCH5UwINcLH94gghBkwPOPuo62MNMfAYIQZMDzj7ry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfoA9ARVIGwT4CCCEJ3hQme64wIgghBBxbfiuuMCIIIQHy/eG7oODxARAdxQmsoAF8oAFcoAE8oAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyFAzBBcB1tIA0gDSANIA+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1AHQDAHM+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhDMAPRWNs8DQBs+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6APQEVSAzEDoQORA4EDcQNhA1EDRYAGxwcHBwjQhgB//////////////////////////////////////////8cG0QaRBYEEcQNhA1EDQD+BCcEIsQehBsEFsQShA8S6yCAOqbKLPy9IELoY0IYAf//////////////////////////////////////////CTHBfL0ggCvafhCUnDHBfL0XwMpgBD0h2+lIJESlTFtMm0B4pCK6FuIEHoQaRBYEEcQNkVA+EIBf23bPH8SEx8BcjDTHwGCEJ3hQme68uCBgQEB1wDSAFls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');
    const __system = Cell.fromBase64('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brOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wgbAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAdxQmsoAF8oAFcoAE8oAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyFAzBB0ATlog10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZY+gL0AMkBzAIBWB8mAhG4di2zzbPGyqggJQI47UTQ1AH4Y9IAAY6E2zxsGuD4KNcLCoMJuvLgiSEjAdbSANIA0gDSAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdQB0CIAbPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+gD0BFUgMxA6EDkQOBA3EDYQNRA0WAHM+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhDMAPRWNs8JABscHBwcI0IYAf//////////////////////////////////////////HBtEGkQWBBHEDYQNRA0ABRUdUNUdUNUf+0vABG4K+7UTQ0gABjQYy3R');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initTonInvestor_init_args({ $$type: 'TonInvestor_init_args', investor, performer, moderator })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const TonInvestor_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    11: { message: `'Unknown' error` },
    12: { message: `Fatal error` },
    13: { message: `Out of gas error` },
    14: { message: `Virtualization error` },
    32: { message: `Action list is invalid` },
    33: { message: `Action list is too long` },
    34: { message: `Action is invalid or not supported` },
    35: { message: `Invalid source address in outbound message` },
    36: { message: `Invalid destination address in outbound message` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    39: { message: `Outbound message does not fit into a cell after rewriting` },
    40: { message: `Cannot process a message` },
    41: { message: `Library reference is null` },
    42: { message: `Library change action error` },
    43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
    50: { message: `Account state size exceeded limits` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    2977: { message: `Already initialized` },
    4429: { message: `Invalid sender` },
    8086: { message: `Not enough funds` },
    9196: { message: `Only moderator can call this method` },
    11295: { message: `No argue` },
    11651: { message: `Can not initialize contract with finished tasks` },
    16832: { message: `Contract is not started yet` },
    22073: { message: `Not all tasks are finished` },
    32438: { message: `Only worker can call this method` },
    33210: { message: `Contract is not canceled` },
    37726: { message: `Task is not found or already finished` },
    44905: { message: `Only investor can call this method` },
    56751: { message: `Contract is canceled` },
    60059: { message: `Contract is already started` },
}

const TonInvestor_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ModeratorCloseTask","header":1103476706,"fields":[{"name":"taskId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"isLastTask","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"SetArgue","header":523230747,"fields":[{"name":"argue","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"excess_to","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"OneTask","header":null,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"finished","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Subtasks","header":null,"fields":[{"name":"token","type":{"kind":"simple","type":"address","optional":false}},{"name":"finishAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"tasks","type":{"kind":"dict","key":"uint","keyFormat":16,"value":"OneTask","valueFormat":"ref"}}]},
    {"name":"InitializeContract","header":1690366863,"fields":[{"name":"subtasksIT","type":{"kind":"simple","type":"Subtasks","optional":false}}]},
    {"name":"ReleaseSubtask","header":2648785511,"fields":[{"name":"taskId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"isLastTask","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"InvestmentData","header":null,"fields":[{"name":"investor","type":{"kind":"simple","type":"address","optional":false}},{"name":"performer","type":{"kind":"simple","type":"address","optional":false}},{"name":"moderator","type":{"kind":"simple","type":"address","optional":false}},{"name":"subtasks","type":{"kind":"simple","type":"Subtasks","optional":false}},{"name":"argueFromInvestor","type":{"kind":"simple","type":"bool","optional":false}},{"name":"argueFromWorker","type":{"kind":"simple","type":"bool","optional":false}},{"name":"started","type":{"kind":"simple","type":"bool","optional":false}},{"name":"canceled","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"TonInvestor$Data","header":null,"fields":[{"name":"argueFromInvestor","type":{"kind":"simple","type":"bool","optional":false}},{"name":"argueFromWorker","type":{"kind":"simple","type":"bool","optional":false}},{"name":"started","type":{"kind":"simple","type":"bool","optional":false}},{"name":"canceled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"investor","type":{"kind":"simple","type":"address","optional":false}},{"name":"performer","type":{"kind":"simple","type":"address","optional":false}},{"name":"moderator","type":{"kind":"simple","type":"address","optional":false}},{"name":"subtasks","type":{"kind":"simple","type":"Subtasks","optional":false}}]},
]

const TonInvestor_getters: ABIGetter[] = [
    {"name":"data","arguments":[],"returnType":{"kind":"simple","type":"InvestmentData","optional":false}},
]

export const TonInvestor_getterMapping: { [key: string]: string } = {
    'data': 'getData',
}

const TonInvestor_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"InitializeContract"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ReleaseSubtask"}},
    {"receiver":"internal","message":{"kind":"text","text":"cancel_performer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ModeratorCloseTask"}},
    {"receiver":"internal","message":{"kind":"text","text":"moderator_cancel"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetArgue"}},
    {"receiver":"internal","message":{"kind":"text","text":"start"}},
    {"receiver":"internal","message":{"kind":"text","text":"cancel"}},
]

export class TonInvestor implements Contract {
    
    static async init(investor: Address, performer: Address, moderator: Address) {
        return await TonInvestor_init(investor, performer, moderator);
    }
    
    static async fromInit(investor: Address, performer: Address, moderator: Address) {
        const init = await TonInvestor_init(investor, performer, moderator);
        const address = contractAddress(0, init);
        return new TonInvestor(address, init);
    }
    
    static fromAddress(address: Address) {
        return new TonInvestor(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  TonInvestor_types,
        getters: TonInvestor_getters,
        receivers: TonInvestor_receivers,
        errors: TonInvestor_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: InitializeContract | ReleaseSubtask | 'cancel_performer' | ModeratorCloseTask | 'moderator_cancel' | SetArgue | 'start' | 'cancel') {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'InitializeContract') {
            body = beginCell().store(storeInitializeContract(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ReleaseSubtask') {
            body = beginCell().store(storeReleaseSubtask(message)).endCell();
        }
        if (message === 'cancel_performer') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ModeratorCloseTask') {
            body = beginCell().store(storeModeratorCloseTask(message)).endCell();
        }
        if (message === 'moderator_cancel') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetArgue') {
            body = beginCell().store(storeSetArgue(message)).endCell();
        }
        if (message === 'start') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === 'cancel') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('data', builder.build())).stack;
        const result = loadGetterTupleInvestmentData(source);
        return result;
    }
    
}