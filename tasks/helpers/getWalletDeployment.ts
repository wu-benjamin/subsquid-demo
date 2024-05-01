import fs from 'fs'
import { getSigner } from './getSigner';

export async function getWalletDeployment(ethers: any, privatekey: string = '') {
  let walletContractAddress: string;
  if (fs.existsSync('./deployments.json')) {
    const rawdata = fs.readFileSync('./deployments.json');
    const deployments = JSON.parse(rawdata.toString());
    const network = await ethers.provider.getNetwork();
    const deployment = deployments[network.chainId];
    if (!deployment || !deployment.walletContractAddress) {
      throw new Error('Wallet contract address not found in deployments.json');
    }
    walletContractAddress = deployment.walletContractAddress;

    const { signer } = await getSigner(ethers);
    const WalletFactory = await ethers.getContractFactory('Wallet', signer);
    const wallet = await WalletFactory.attach(walletContractAddress);

    return { wallet, owner: signer };
  } else {
    throw new Error('deployments.json file does not exist');
  }
}
