import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {BalanceSnapshot} from "./balanceSnapshot.model"

@Entity_()
export class User {
    constructor(props?: Partial<User>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => BalanceSnapshot, e => e.user)
    balances!: BalanceSnapshot[]

    @BigIntColumn_({nullable: false})
    balance!: bigint
}
