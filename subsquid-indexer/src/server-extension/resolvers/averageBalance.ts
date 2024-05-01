import "reflect-metadata";
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { BalanceSnapshot } from '../../model'

@ObjectType()
export class AverageBalance {
  @Field(() => Number, { nullable: false })
  averageBalance!: number
  @Field(() => Date, { nullable: false })
  startTime!: Date
  @Field(() => Date, { nullable: false })
  endTime!: Date

  constructor(averageBalance: number, startTime: Date, endTime: Date) {
    this.averageBalance = averageBalance;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

@Resolver()
export class AverageBalanceResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => AverageBalance)
  async averageBalance (
    @Arg('user', { nullable: false }) user: string,
    @Arg('startTime', { nullable: true }) _startTime: string,
    @Arg('endTime', { nullable: true }) _endTime: string,
  ): Promise<AverageBalance> {
    const manager = await this.tx();
    const endTime = new Date(_endTime ? _endTime : Date.now());
    const startTime = new Date(_startTime ? _startTime : await getUserFirstDepositTime(manager, user));

    if (startTime.getTime() > endTime.getTime()) {
      return {
        averageBalance: 0,
        startTime: startTime,
        endTime: endTime,
      }
    }
    
    const balanceSnapshots = await manager
      .createQueryBuilder()
      .select(`
        timestamp,
        balance
      `)
      .from(BalanceSnapshot, 'balance_snapshot')
      .where(
        'balance_snapshot.user_id = :user AND balance_snapshot.timestamp > :startTime AND balance_snapshot.timestamp < :endTime',
        {
          user: user,
          startTime: startTime,
          endTime: endTime,
        }
      )
      .orderBy('timestamp', 'DESC')
      .getRawMany();
    const startBalance = await getBalanceAtMoment(manager, user, startTime);
    const averageBalance = [...balanceSnapshots, startBalance]
      .reduce((prev, cur) => {
        const timestamp = cur.timestamp;
        const duration = prev.timestamp.getTime() - timestamp.getTime();
        return {
          balance: prev.balance + Number(cur.balance) * duration,
          timestamp: timestamp,
        };
      }, {
        balance: 0,
        timestamp: endTime,
      }).balance / (endTime.getTime() - startTime.getTime());
    return {
      averageBalance: averageBalance,
      startTime: startTime,
      endTime: endTime,
    };
  }
}

const getUserFirstDepositTime = async (manager: EntityManager, user: string) => {
    const firstDeposit = await manager
      .createQueryBuilder()
      .select('MIN(timestamp) as timestamp')
      .from(BalanceSnapshot, 'balance_snapshot')
      .where('balance_snapshot.user_id = :user', { user: user })
      .getRawOne();
    if (firstDeposit) {
      return firstDeposit.timestamp.getTime();
    }
    return 0;
}

const getBalanceAtMoment = async (manager: EntityManager, user: string, time: Date) => {
  const latestBalanceSnapshot = await manager
    .createQueryBuilder()
    .select('balance')
    .from(BalanceSnapshot, 'balance_snapshot')
    .where(
      'balance_snapshot.user_id = :user AND balance_snapshot.timestamp <= :time',
      {
        user: user,
        time: time,
      }
    )
    .orderBy('balance_snapshot.timestamp', 'DESC')
    .limit(1)
    .getRawOne();
  if (latestBalanceSnapshot) {
    return {
        balance: latestBalanceSnapshot.balance,
        timestamp: time,
    }
  }
  return {
    balance: 0n,
    timestamp: time,
  }
}
