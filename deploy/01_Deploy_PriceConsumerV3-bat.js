let { networkConfig } = require('../helper-hardhat-config')

const AGGREGATOR = 'BatUsdAggregator';
const FEED = 'batUsdPriceFeed';
const TAG = 'BatUsd';
const LABEL = 'BAT/USD';

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    let priceFeedAddress
    if (chainId == 31337) {
        const aggregator = await deployments.get(AGGREGATOR)
        priceFeedAddress = aggregator.address
    } else {
        priceFeedAddress = networkConfig[chainId][FEED]
    }
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one below is ETH/USD contract on Kovan
    log("----------------------------------------------------")
    const priceConsumerV3 = await deploy(`PriceConsumerV3`, {
        from: deployer,
        args: [priceFeedAddress],
        log: true
    })
    log(`Run Price Feed (${LABEL}) contract with command:`)
    log("npx hardhat read-price-feed --contract " + priceConsumerV3.address + " --network " + networkConfig[chainId]['name'])
    log("----------------------------------------------------")

}

module.exports.tags = ['all', 'feed', 'main']
