const fs = require('fs')
const path = require('path')
const { ethers } = require('hardhat')

const configPath = path.join(__dirname, '..', 'src', 'config.json')
const BASE_SEPOLIA_CHAIN_ID = 84532
const confirmations = Number(process.env.DEPLOY_CONFIRMATIONS || 1)

const isAddress = (address) => {
  try {
    ethers.utils.getAddress(address)
    return true
  } catch {
    return false
  }
}

const saveConfig = (config) => {
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)
}

const deployContract = async (label, factory, args = []) => {
  console.log(`Deploying ${label}...`)

  const contract = await factory.deploy(...args)
  console.log(`${label} transaction: ${contract.deployTransaction.hash}`)

  const receipt = await contract.deployTransaction.wait(confirmations)
  contract.deploymentBlock = receipt.blockNumber
  console.log(`${label} deployed to: ${contract.address}`)
  console.log(`${label} deployment block: ${receipt.blockNumber}\n`)

  return contract
}

const getOrDeployContract = async (config, chainId, key, label, factory, args = []) => {
  const savedAddress = config[chainId]?.[key]?.address

  if (isAddress(savedAddress) && process.env.FORCE_REDEPLOY !== 'true') {
    console.log(`Using existing ${label}: ${savedAddress}\n`)
    return factory.attach(savedAddress)
  }

  const contract = await deployContract(label, factory, args)
  config[chainId][key].address = contract.address
  config[chainId][key].deploymentBlock = contract.deploymentBlock
  saveConfig(config)
  console.log(`Saved ${label} address to src/config.json\n`)

  return contract
}

async function main() {
  console.log(`Preparing deployment...\n`)

  const { chainId, name } = await ethers.provider.getNetwork()
  console.log(`Network: ${name} (${chainId})\n`)

  if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
    throw new Error(`Expected Base Sepolia (${BASE_SEPOLIA_CHAIN_ID}), got chain ${chainId}. Use --network baseSepolia.`)
  }

  // Fetch contract to deploy
  const Token = await ethers.getContractFactory('Token')
  const Exchange = await ethers.getContractFactory('Exchange')

  // Fetch accounts
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  if (!deployer) {
    throw new Error('No deployer account available. Set PRIVATE_KEYS before deploying to Base Sepolia.')
  }

  const feeAccount = process.env.FEE_ACCOUNT || accounts[1]?.address || deployer.address

  console.log(`Deployer: ${deployer.address}`)
  console.log(`Fee account: ${feeAccount}\n`)

  const balance = await deployer.getBalance()
  console.log(`Deployer balance: ${ethers.utils.formatEther(balance)} ETH\n`)

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const configKey = chainId.toString()
  config[configKey] = config[configKey] || {}
  config[configKey].exchange = config[configKey].exchange || { address: '' }
  config[configKey].DApp = config[configKey].DApp || { address: '' }
  config[configKey].mETH = config[configKey].mETH || { address: '' }
  config[configKey].mDAI = config[configKey].mDAI || { address: '' }
  config[configKey].exploreURL = 'https://sepolia.basescan.org/'

  // Deploy contracts
  await getOrDeployContract(config, configKey, 'DApp', 'DAPP', Token, ['Dapp University', 'DAPP', '1000000'])
  await getOrDeployContract(config, configKey, 'mETH', 'mETH', Token, ['mETH', 'mETH', '1000000'])
  await getOrDeployContract(config, configKey, 'mDAI', 'mDAI', Token, ['mDAI', 'mDAI', '1000000'])
  await getOrDeployContract(config, configKey, 'exchange', 'Exchange', Exchange, [feeAccount, 10])

  saveConfig(config)
  console.log(`\nUpdated src/config.json for chain ${chainId}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
