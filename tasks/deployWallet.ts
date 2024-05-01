import { task } from 'hardhat/config'
import fs from 'fs'
import { getSigner } from './helpers/getSigner'

task('deployWallet', 'Deploys the Wallet contract')
  .setAction(async ({}, { ethers }) => {
    // Deploy the PriceOracle contract
    const { signer } = await getSigner(ethers);
    const Wallet = await ethers.getContractFactory('Wallet', signer);
    const walletContract = await Wallet.deploy();
    await walletContract.waitForDeployment();
    const walletContractAddress = await walletContract.getAddress();
    console.log('Wallet deployed to:', walletContractAddress);

    // Update deployments.json
    let deployments: any = {}
    if (fs.existsSync('./deployments.json')) {
      const rawdata = fs.readFileSync('./deployments.json');
      deployments = JSON.parse(rawdata.toString());
    }
    const network = await ethers.provider.getNetwork();
    if (!deployments[network.chainId.toString()]) {
      deployments[network.chainId.toString()] = {};
    }
    deployments[network.chainId.toString()]['walletContractAddress'] = walletContractAddress;
    fs.writeFileSync('./deployments.json', JSON.stringify(deployments, null, 2));
  })
