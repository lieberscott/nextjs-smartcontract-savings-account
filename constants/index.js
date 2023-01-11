const contractAddresses = require("./contractAddresses.json")
const factoryAbi = require("./factoryAbi.json")
const instanceAbi = require("./instanceAbi.json")
const erc20Abi = require("./erc20Abi.json");
const myTokenAddess = require("./myTokenAddress.json")

// positive decimals and numbers
const regex = /^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/

module.exports = {
    contractAddresses,
    myTokenAddess,
    factoryAbi,
    instanceAbi,
    erc20Abi,
    regex
}
