import { task } from 'hardhat/config'
import { getWalletDeployment } from './helpers/getWalletDeployment'

task('getBalance', 'View balance of a user account')
  .addParam('user', 'Address of the user')
  .setAction(async ({ user }, { ethers }) => {
    const { wallet } = await getWalletDeployment(ethers);    
    const balance = await wallet.getBalance(user);

    console.log('User:', user);
    console.log('Balance:', balance.toString());
  })
