module.exports = class Data1714561095359 {
    name = 'Data1714561095359'

    async up(db) {
        await db.query(`CREATE TABLE "tx" ("id" character varying NOT NULL, "block" integer NOT NULL, CONSTRAINT "PK_2e04a1db73a003a59dcd4fe916b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "balance_snapshot" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "balance" numeric NOT NULL, "user_id" character varying, "tx_id" character varying, CONSTRAINT "PK_80a9974703b55cc1b0def1753db" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_57a0ecb3a57565d05a650361c8" ON "balance_snapshot" ("tx_id") `)
        await db.query(`CREATE INDEX "IDX_5f13267bb694d5e371c6be2b66" ON "balance_snapshot" ("user_id", "timestamp") `)
        await db.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "balance_snapshot" ADD CONSTRAINT "FK_2c2a018efe52f6efa95a4374e1d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "balance_snapshot" ADD CONSTRAINT "FK_57a0ecb3a57565d05a650361c86" FOREIGN KEY ("tx_id") REFERENCES "tx"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "tx"`)
        await db.query(`DROP TABLE "balance_snapshot"`)
        await db.query(`DROP INDEX "public"."IDX_57a0ecb3a57565d05a650361c8"`)
        await db.query(`DROP INDEX "public"."IDX_5f13267bb694d5e371c6be2b66"`)
        await db.query(`DROP TABLE "user"`)
        await db.query(`ALTER TABLE "balance_snapshot" DROP CONSTRAINT "FK_2c2a018efe52f6efa95a4374e1d"`)
        await db.query(`ALTER TABLE "balance_snapshot" DROP CONSTRAINT "FK_57a0ecb3a57565d05a650361c86"`)
    }
}
