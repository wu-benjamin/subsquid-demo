import { task } from 'hardhat/config'
import { getWalletDeployment } from './helpers/getWalletDeployment'
import { saveEvents } from './helpers/saveEvents';

task('deposit', 'Deposit an amount to a user account')
  .addParam('user', 'Address of the user')
  .addParam('amount', 'Amount to deposit')
  .setAction(async ({ user, amount }, { ethers }) => {
    const { wallet } = await getWalletDeployment(ethers);    
    const tx = await wallet.deposit(user, amount);

    console.log('Deposit performed with tx:', tx.hash);
    await saveEvents(tx); // NOTE: this dumps the contents of the swap event to console for debugging
  })
