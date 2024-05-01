import { task } from 'hardhat/config'
import { getWalletDeployment } from './helpers/getWalletDeployment'
import { saveEvents } from './helpers/saveEvents';

task('withdrawAll', 'Withdraw full balance from a user account')
  .addParam('user', 'Address of the user')
  .setAction(async ({ user }, { ethers }) => {
    const { wallet } = await getWalletDeployment(ethers);    
    const tx = await wallet.withdrawAll(user);

    console.log('Full withdrawal performed with tx:', tx.hash);
    await saveEvents(tx); // NOTE: this dumps the contents of the swap event to console for debugging
  })
