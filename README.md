# DApp Token Exchange

A decentralized token exchange built with Solidity, Hardhat, React, Redux, and ethers.js. The app deploys mock ERC-20 tokens and an exchange contract for creating, cancelling, and filling token pair orders.

Live site: https://token-exchange-seven.vercel.app/

Current testnet target: Base Sepolia.

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Required deployment variables:

```bash
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEYS=0xYOUR_DEPLOYER_PRIVATE_KEY
FEE_ACCOUNT=
```

`FEE_ACCOUNT` is optional. If omitted, the deploy script uses the second configured account, then falls back to the deployer.

## Local Development

Start a local Hardhat chain:

```bash
npx hardhat node
```

Deploy contracts locally:

```bash
npx hardhat run --network localhost scripts/1_deploy.js
```

Seed local exchange activity:

```bash
npx hardhat run --network localhost scripts/2_seed-exchange.js
```

Start the React app:

```bash
npm run start
```

## Base Sepolia Deployment

Deploy to Base Sepolia:

```bash
npx hardhat run --network baseSepolia scripts/1_deploy.js
```

The deploy script updates `src/config.json` with deployed contract addresses. It is resumable: if a contract address already exists in config, the script reuses it instead of redeploying. To force fresh contracts:

```bash
FORCE_REDEPLOY=true npx hardhat run --network baseSepolia scripts/1_deploy.js
```

## Build

Create a production build:

```bash
npm run build
```
