import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './Wallet.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Deposit: new LogEvent<([user: string, amount: bigint] & {user: string, amount: bigint})>(
        abi, '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c'
    ),
    WithdrawAll: new LogEvent<([user: string] & {user: string})>(
        abi, '0x2b3ede1cd1dfcbe081c86c4381460612351a278070aef7f89dad40e805fda5ab'
    ),
}

export const functions = {
    balances: new Func<[_: string], {}, bigint>(
        abi, '0x27e235e3'
    ),
    deposit: new Func<[user: string, amount: bigint], {user: string, amount: bigint}, []>(
        abi, '0x47e7ef24'
    ),
    getBalance: new Func<[user: string], {user: string}, bigint>(
        abi, '0xf8b2cb4f'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    withdrawAll: new Func<[user: string], {user: string}, []>(
        abi, '0xfa09e630'
    ),
}

export class Contract extends ContractBase {

    balances(arg0: string): Promise<bigint> {
        return this.eth_call(functions.balances, [arg0])
    }

    getBalance(user: string): Promise<bigint> {
        return this.eth_call(functions.getBalance, [user])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }
}
