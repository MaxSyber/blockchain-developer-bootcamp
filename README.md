Dapp Token Exchange is a fully functioning decentralized cryptocurrency exchange created to facilitate the exchange of coin pairs. This app employs two smart contracts to create new cryptocurrencies as well as the exchange to trade them on. (Deployed to the Goerli test network).

The exhcange can also be run locally using npm/hardhat by imputing the following commands once you have cloned the project to your local drive into your terminal.

1. -npm install   [Installs packages and dependancies]
2. -npx hardhat node [Launches a local blockchain and distributes 20 Private Keys]
3. -npx hardhat run --network localhost scripts/deploy.js  [Deploys the solidity contracts to the local node]
4. -npx hardhat run --network localhost scripts/seed-exchange.js [Seeds the exchange with some orders the make the app have orders and trades awaiting at launch of site]
5. -npm run start  [boots up a local web browser so you and interact with and test the application]
