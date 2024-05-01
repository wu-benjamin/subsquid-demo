import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
  } from "@subsquid/evm-processor";
  
  import * as walletAbi from "./abi/Wallet";
  import {
      RPC_ENDPOINT,
      WALLET_CONTRACT_ADDRESS,
      START_BLOCK_NUMBER,
      NUMBER_OF_CONFIRMATION_FOR_BLOCK_FINALITY,
      USE_ARCHIVE_GATEWAY,
      GATEWAY_URL,
  } from "./utils/env";
  
  export const processor = new EvmBatchProcessor()
    .setRpcEndpoint(RPC_ENDPOINT)
    .setFinalityConfirmation( // https://docs.subsquid.io/sdk/reference/processors/evm-batch/general/#set-finality-confirmation
      NUMBER_OF_CONFIRMATION_FOR_BLOCK_FINALITY
    )
    .addLog({
      address: [WALLET_CONTRACT_ADDRESS],
      topic0: [
          walletAbi.events.Deposit.topic,
          walletAbi.events.WithdrawAll.topic,
      ],
      transaction: true,
    })
    .setFields({
      transaction: {
        from: true,
        to: true,
        hash: true,
        value: true,
        gas: true,
        gasPrice: true,
      },
      log: {
        topics: true,
        data: true,
        address: true,
        transactionHash: true,
      },
    })
    .setBlockRange({
      from: START_BLOCK_NUMBER,
    });
  
  if (USE_ARCHIVE_GATEWAY) {
      processor.setGateway(GATEWAY_URL); // https://docs.subsquid.io/subsquid-network/reference/evm-networks/
  }
  
  export type Fields = EvmBatchProcessorFields<typeof processor>
  export type Block = BlockHeader<Fields>
  export type Log = _Log<Fields>
  export type Transaction = _Transaction<Fields>
  export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
  