import { erc20Abi, instanceAbi, myTokenAddress } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

import Eth from "./Eth"
import Tokens from "./Tokens"
import LargeETHWithdrawals from "./LargeETHWithdrawals"
import LargeERC20Withdrawals from "./LargeERC20Withdrawals"
import WithdrawalLimits from "./WithdrawalLimits"
import EnableBigWithdrawals from "./EnableBigWithdrawals"


export default function AccountDetails(props) {

  const { account, chainId: chainIdHex } = useMoralis();

  const chainId = parseInt(chainIdHex)
  // const chainId = "31337"
  console.log("chainId : ", chainId)

  const instanceAddress = props.instanceAddress
  const isMain = props.isMain

  // list of the dropdown items
  const [tokenDropdown, setTokenDropdown] = useState([{ index: "0", name: "Select", contractAddress: "none", decimals: "0" }]);
  const [newTokenAddress, setNewTokenAddress] = useState("")
  const [getNewTokenData, setGetNewTokenData] = useState(false)

  // current selection of the dropdown items
  const [tokenDropdownIndex, setTokenDropdownIndex] = useState(0);

  const [tab, setTab] = useState(1)

  const dispatch = useNotification()


  /* View Functions */


  const { data: ethBalance, runContractFunction: getEthBalance } = useWeb3Contract({
    abi: instanceAbi,
    contractAddress: instanceAddress,
    functionName: "getEthBalance",
    params: { },
  });

  const { data: tokenBalance, runContractFunction: getTokenBalance } = useWeb3Contract({
    abi: instanceAbi,
    contractAddress: instanceAddress,
    functionName: "getTokenBalance",
    params: { _tokenAddress: tokenDropdown[tokenDropdownIndex].contractAddress },
  });

  const { data: accountName, runContractFunction: getName } = useWeb3Contract({
    abi: instanceAbi,
    contractAddress: instanceAddress,
    functionName: "getName",
    params: { },
  });

  const { data: tokenName, runContractFunction: getTokenName } = useWeb3Contract({
    abi: erc20Abi,
    contractAddress: newTokenAddress,
    functionName: "name",
    params: { },
  });

  const { data: tokenSymbol, runContractFunction: getTokenSymbol } = useWeb3Contract({
    abi: erc20Abi,
    contractAddress: newTokenAddress,
    functionName: "symbol",
    params: { },
  });

  const { data: tokenDecimals, runContractFunction: getTokenDecimals } = useWeb3Contract({
    abi: erc20Abi,
    contractAddress: newTokenAddress,
    functionName: "decimals",
    params: { },
  });


  const fetchNewTokenData = async () => {

    const listName = isMain ? "mainAccountTokens" + chainId : "safekeeperAccountTokens" + chainId

    // Add to local storage item
    let list = JSON.parse(window.localStorage.getItem(listName))
    list = list && list.length ? list : [];

    // check if item is already in list
    const index = list.findIndex((item, i) => item.contractAddress === newTokenAddress)

    if (index !== -1) {
      window.alert("Item is already in your list");
      return;
    }

    else {

      // Get Name, Symbol, and Decimals
      const name = (await getTokenName()).toString();
      const symbol = (await getTokenSymbol()).toString();
      const decimals = (await getTokenDecimals()).toString();
      
      const newItem = { index: list.length + 1, name, symbol, contractAddress: newTokenAddress, decimals } // +1 because "Select is index 0 and is not a part of the list (so list will have 0 length when we add the first item, which should be at index 1)
      list.push(newItem)

      const listName = isMain ? "mainAccountTokens" + chainId : "safekeeperAccountTokens" + chainId

      window.localStorage.setItem(listName, JSON.stringify(list))
      
      
      // Add to current list
      setTokenDropdown(prev => prev.concat(newItem))
      setTokenDropdownIndex(list.length)
      setNewTokenAddress("")
      window.alert("Token added")
    }
  }



  const updateUIValues = async () => {

    await getName()

    const listName = isMain ? "mainAccountTokens" + chainId : "safekeeperAccountTokens" + chainId
    // get ERC-20 tokens that have been saved
    let list = JSON.parse(window.localStorage.getItem(listName))
    list = list && list.length ? list : [];
    const newList = list.filter((value, index, arr) => index === arr.findIndex((t) => (
      t.contractAddress === value.contractAddress
    ))
  )
    setTokenDropdown(prev => {
      
      const arr = prev.concat(newList)

      // remove duplicates
      const newArr = arr.filter((v,i,a)=>a.findIndex(v2=>(v2.contractAddress===v.contractAddress))===i)
      
      return newArr;
    })
    /*
      tokenList = [
        {
          index: "0"
          symbol: "UNI",
          contractAddress: "0x32fa...",
          decimals: "18"
        }
      ]
    */

  }

  const handleAddNewToken = async () => {
    const isValid = ethers.utils.isAddress(newTokenAddress)

    if (!isValid) {
      window.alert("Invalid token address")
      return;
    }
    else {
      setGetNewTokenData(true)
    }
  }

  useEffect(() => {
    if (getNewTokenData) {
      fetchNewTokenData()
      setGetNewTokenData(false)
    }
  }, [getNewTokenData])

  useEffect(() => {
    if (account) {
      updateUIValues()
    }
  }, [account, chainId]);

  useEffect(() => {
    if (tokenDropdownIndex !== 0) {
      (async () => await getTokenBalance())
    }
  }, [tokenDropdownIndex])




  const handleNewNotification = () => {
    dispatch({
        type: "info",
        message: "Transaction Complete!",
        title: "Transaction Notification",
        position: "topR",
        icon: "bell",
    })
  }

  const handleSuccess = async (tx) => {
    try {
        await tx.wait(1)
        handleNewNotification(tx)
    } catch (error) {
        console.log(error)
    }
  }




  const displayLastWithdrawalDay = (withdrawalDay) => {
    const withdrawalDayInt = parseInt(withdrawalDay)
    const daysSinceEpoch = Math.floor(Date.now() / 1000 / 60 / 60 / 24)


    if (withdrawalDayInt === 0) {
      return "Never"
    }
    else if (daysSinceEpoch - withdrawalDayInt === 0) {
      return "Today"
    }
    else if (daysSinceEpoch - withdrawalDayInt < 30) {
      return (daysSinceEpoch - withdrawalDayInt) + "d ago"
    }
    else if (daysSinceEpoch - withdrawalDayInt < 365) {
      const months = Math.floor((daysSinceEpoch - withdrawalDayInt) / 30)
      return months + "mo ago"
    }
    else if (daysSinceEpoch - withdrawalDayInt >= 365) {
      return "Over a year ago"
    }
    else {
      return "Could not determine last withdrawal date"
    }
  }

  const inactiveTab = "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
  const activeTab = "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"

  return (
    <>
      { isMain ? <p>Smart Contract Address: { accountName ? accountName.toString() : "" } ({ instanceAddress ? instanceAddress.toString() : "" })</p>
      : <p>You are safekeeping: { accountName ? accountName.toString() : "" } ({ instanceAddress ? instanceAddress.toString() : "" })</p> }

      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="mr-2">
            <a href="#" onClick={() => setTab(1)} className={ tab === 1 ? activeTab : inactiveTab }>ETH</a>
        </li>
        <li className="mr-2">
            <a href="#" onClick={() => setTab(2)} className={ tab === 2 ? activeTab : inactiveTab}>ERC20 Tokens</a>
        </li>
        { isMain ?
        <>
          <li className="mr-2">
              <a href="#" onClick={() => setTab(3)} className={ tab === 3 ? activeTab : inactiveTab}>Large ETH Withdrawals</a>
          </li>
          <li className="mr-2">
              <a href="#" onClick={() => setTab(4)} className={ tab === 4 ? activeTab : inactiveTab}>Large ERC20 Withdrawals</a>
          </li>
          <li className="mr-2">
              <a href="#" onClick={() => setTab(5)} className={ tab === 5 ? activeTab : inactiveTab}>Set ERC20 Withdrawal Limits</a>
          </li>
        </> :
        <>
          <li className="mr-2">
            <a href="#" onClick={() => setTab(6)} className={ tab === 6 ? activeTab : inactiveTab}>Enable Large Withdrawal</a>
          </li>
        </> }
      </ul>


    <div>

      { tab === 1 ?
        <Eth
          instanceAddress={ instanceAddress }
          isMain={ isMain }
          ethBalance={ ethBalance }
          getEthBalance={ getEthBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
          handleSuccess={ handleSuccess }
        /> : [] }
        
      { tab === 2 ?
        <Tokens
          instanceAddress={ instanceAddress }
          isMain={ isMain }
          tokenDropdown={ tokenDropdown }
          tokenDropdownIndex={ tokenDropdownIndex }
          newTokenAddress={ newTokenAddress }
          setNewTokenAddress={ setNewTokenAddress }
          setTokenDropdownIndex={ setTokenDropdownIndex }
          fetchNewTokenData={ fetchNewTokenData }
          handleAddNewToken={ handleAddNewToken }
          getTokenBalance={ getTokenBalance }
          tokenBalance={ tokenBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
          handleSuccess={ handleSuccess }
        /> : [] }

      { tab === 3 ?
        <LargeETHWithdrawals
          instanceAddress={ instanceAddress }
          ethBalance={ ethBalance }
          getEthBalance={ getEthBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
          handleSuccess={ handleSuccess }
        /> : [] }

      { tab === 4 ?
        <LargeERC20Withdrawals
          instanceAddress={ instanceAddress }
          isMain={ isMain }
          tokenDropdown={ tokenDropdown }
          tokenDropdownIndex={ tokenDropdownIndex }
          newTokenAddress={ newTokenAddress }
          setNewTokenAddress={ setNewTokenAddress }
          setTokenDropdownIndex={ setTokenDropdownIndex }
          fetchNewTokenData={ fetchNewTokenData }
          handleAddNewToken={ handleAddNewToken }
          getTokenBalance={ getTokenBalance }
          tokenBalance={ tokenBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
          handleSuccess={ handleSuccess }
        /> : [] }

      { tab === 5 ?
        <WithdrawalLimits
          instanceAddress={ instanceAddress }
          isMain={ isMain }
          tokenDropdown={ tokenDropdown }
          tokenDropdownIndex={ tokenDropdownIndex }
          setTokenDropdownIndex={ setTokenDropdownIndex }
          newTokenAddress={ newTokenAddress }
          setNewTokenAddress={ setNewTokenAddress }
          fetchNewTokenData={ fetchNewTokenData }
          handleAddNewToken={ handleAddNewToken }
          getTokenBalance={ getTokenBalance }
          tokenBalance={ tokenBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
          handleSuccess={ handleSuccess }
        /> : [] }

        { tab === 6 ?
          <EnableBigWithdrawals
            instanceAddress={ instanceAddress }
            displayLastWithdrawalDay={ displayLastWithdrawalDay}
            handleSuccess={ handleSuccess }
          />
        : [] }
        

      </div>

    </>
  )
}
