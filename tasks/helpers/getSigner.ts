import { Signer } from 'ethers'

export const getSigner = async (
  ethers: any,
): Promise<{ signer: Signer; signerAddress: string }> => {
  let signer: Signer;

  if (process.env.PRIVATE_KEY === undefined) {
    throw new Error('No private key provided');
  }
  signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);

  const signerAddress = await signer.getAddress();
  console.log('using wallet address: ', signerAddress);

  return { signer, signerAddress: signerAddress };
}
