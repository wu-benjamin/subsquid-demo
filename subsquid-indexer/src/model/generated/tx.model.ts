import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {BalanceSnapshot} from "./balanceSnapshot.model"

@Entity_()
export class Tx {
    constructor(props?: Partial<Tx>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    block!: number

    @OneToMany_(() => BalanceSnapshot, e => e.tx)
    balanceSnapshotUpdates!: BalanceSnapshot[]
}
