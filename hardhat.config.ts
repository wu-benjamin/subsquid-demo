import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';
import glob from 'glob'
import path from 'path'

glob.sync('./tasks/**/*.ts').forEach(function (file) {
  require(path.resolve(file));
});

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : 'remote';

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts,
    }
  }
};

export default config;
