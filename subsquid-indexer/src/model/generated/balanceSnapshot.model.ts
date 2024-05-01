import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {User} from "./user.model"
import {Tx} from "./tx.model"

@Index_(["user", "timestamp"], {unique: false})
@Entity_()
export class BalanceSnapshot {
    constructor(props?: Partial<BalanceSnapshot>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @ManyToOne_(() => User, {nullable: true})
    user!: User

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @Index_()
    @ManyToOne_(() => Tx, {nullable: true})
    tx!: Tx
}
