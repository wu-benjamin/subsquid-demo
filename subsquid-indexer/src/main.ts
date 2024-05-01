import { TypeormDatabase } from '@subsquid/typeorm-store'
import { processor } from './processor'
import { BalanceSnapshot, Tx, User } from './model';
import { WALLET_CONTRACT_ADDRESS } from './utils/env';
import * as walletAbi from './abi/Wallet';
import { In } from 'typeorm';

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const userIds = new Set<string>();

    // Prefetch users
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            if (log.address.toLowerCase() === WALLET_CONTRACT_ADDRESS.toLowerCase()) {
                const transaction = {
                    hash: log.transaction?.hash || "",
                };
                const evmLog = {
                    logIndex: log.logIndex,
                    transactionIndex: log.transactionIndex,
                    transactionHash: transaction.hash,
                    address: log.address,
                    data: log.data,
                    topics: log.topics,
                };
                switch (log.topics[0]) {
                    case walletAbi.events.Deposit.topic: {
                        const deposit = walletAbi.events.Deposit.decode(evmLog);
                        userIds.add(deposit.user);
                        break;
                    }
                    case walletAbi.events.WithdrawAll.topic: {
                        const withdraw = walletAbi.events.WithdrawAll.decode(evmLog);
                        userIds.add(withdraw.user);
                        break;
                    }
                }
            }
        }
    }

    const users: Map<string, User> = new Map(
        (await ctx.store.findBy(User, { id: In([...userIds])}))
        .map((user) => [user.id, user])
    );
    const txs: Tx[] = [];
    const balanceSnapshots: BalanceSnapshot[] = [];

    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            if (log.address.toLowerCase() === WALLET_CONTRACT_ADDRESS.toLowerCase()) {
                const transaction = {
                    hash: log.transaction?.hash || "",
                };
                const evmLog = {
                    logIndex: log.logIndex,
                    transactionIndex: log.transactionIndex,
                    transactionHash: transaction.hash,
                    address: log.address,
                    data: log.data,
                    topics: log.topics,
                };
                const tx = new Tx({
                    id: transaction.hash,
                    block: block.header.height,
                    balanceSnapshotUpdates: [],
                });
                txs.push(tx);
                switch (log.topics[0]) {
                    case walletAbi.events.Deposit.topic: {
                        const deposit = walletAbi.events.Deposit.decode(evmLog);
                        if (users.get(deposit.user) === undefined) {
                            users.set(deposit.user, new User({ id: deposit.user, balance: 0n }));
                        }
                        users.get(deposit.user)!.balance += deposit.amount;
                        balanceSnapshots.push(new BalanceSnapshot({
                            id: `${deposit.user}-${block.header.height}-${tx.balanceSnapshotUpdates.length}`,
                            user: users.get(deposit.user)!,
                            timestamp: new Date(block.header.timestamp),
                            balance: users.get(deposit.user)!.balance,
                            tx: tx,
                        }));
                        break;
                    }
                    case walletAbi.events.WithdrawAll.topic: {
                        const withdraw = walletAbi.events.WithdrawAll.decode(evmLog);
                        if (users.get(withdraw.user) === undefined) {
                            users.set(withdraw.user, new User({ id: withdraw.user, balance: 0n }));
                        }
                        users.get(withdraw.user)!.balance = 0n;
                        balanceSnapshots.push(new BalanceSnapshot({
                            id: `${withdraw.user}-${block.header.height}-${tx.balanceSnapshotUpdates.length}`,
                            user: users.get(withdraw.user)!,
                            timestamp: new Date(block.header.timestamp),
                            balance: users.get(withdraw.user)!.balance,
                            tx: tx,
                        }));
                        break;
                    }
                }                    
            }
        }
    }
    
    await ctx.store.save([...users.values()]);
    await ctx.store.save(txs);
    await ctx.store.save(balanceSnapshots);
})
