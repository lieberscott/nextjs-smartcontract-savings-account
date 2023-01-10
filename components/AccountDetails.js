import { instanceAbi } from "../constants"
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


export default function AccountDetails(props) {

  const { account, chainId: chainIdHex } = useMoralis();

  const chainId = parseInt(chainIdHex)
  // const chainId = "31337"
  console.log("chainId : ", chainId)

  const instanceAddress = props.instanceAddress
  const isMain = props.isMain

  // list of the dropdown items
  const [tokenDropdown, setTokenDropdown] = useState([{ index: "0", name: "Select", contractAddress: "none", decimals: "0" }]);

  // current selection of the dropdown items
  const [tokenDropdownIndex, setTokenDropdownIndex] = useState(0);

  const [tab, setTab] = useState(1)

  const dispatch = useNotification()

  /* View Functions */


  const { data: name, runContractFunction: getName } = useWeb3Contract({
    abi: instanceAbi,
    contractAddress: instanceAddress,
    functionName: "getName",
    params: { },
  });


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


  const fetchNewTokenData = async () => {

    const listName = isMain ? "mainAccountTokens" + chainId : "backupAccountTokens" + chainId

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

      const listName = isMain ? "mainAccountTokens" + chainId : "backupAccountTokens" + chainId

      window.localStorage.setItem(listName, JSON.stringify(list))
      
      
      // Add to current list
      setTokenDropdown(prev => prev.concat(newItem))
      setTokenDropdownIndex(list.length)
    }
  }



  const updateUIValues = async () => {
    (await getName().toString());
    // (await getEthBalance()).toString(); // causing errors when included in this function, but no errors when called separately

    const listName = isMain ? "mainAccountTokens" + chainId : "backupAccountTokens" + chainId
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


  // no list means it'll update everytime anything changes or happens
  // empty list means it'll run once after the initial rendering
  // and dependencies mean it'll run whenever those things in the list change

  // An example filter for listening for events, we will learn more on this next Front end lesson
  // const filter = {
  //     address: savingsFactoryAddress,
  //     topics: [
  //         // the name of the event, parnetheses containing the data type of each event, no spaces
  //         utils.id("RaffleEnter(address)"),
  //     ],
  // }

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
        updateUIValues()
        handleNewNotification(tx)
    } catch (error) {
        console.log(error)
    }
  }




  const displayLastWithdrawalDay = (daysSinceEpochString) => {
    const daysSinceEpochInt = parseInt(daysSinceEpochString)
    const now = new Date().getUTCDate()
    const today = Math.floor(now/8.64e7)

    if (daysSinceEpochInt === 0) {
      return "Never"
    }
    else if (today - daysSinceEpochInt === 0) {
      return "Today"
    }
    else if (today - daysSinceEpochInt === 1) {
      return "1d ago"
    }
    else if (today - daysSinceEpochInt < 30) {
      return (today - daysSinceEpochInt) + "d ago"
    }
    else if (today - daysSinceEpochInt < 365) {
      const months = Math.floor((today - daysSinceEpochInt) / 30)
      return months + "mo ago"
    }
    else if (today - daysSinceEpochInt >= 365) {
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
      <p>Smart Contract Address: { name ? name.toString() : "" } ({ account ? account.toString() : "" })</p>

      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="mr-2">
            <a href="#" onClick={() => setTab(1)} className={ tab === 1 ? activeTab : inactiveTab }>ETH</a>
        </li>
        <li className="mr-2">
            <a href="#" onClick={() => setTab(2)} className={ tab === 2 ? activeTab : inactiveTab}>ERC20 Tokens</a>
        </li>
        <li className="mr-2">
            <a href="#" onClick={() => setTab(3)} className={ tab === 3 ? activeTab : inactiveTab}>Large ETH Withdrawals</a>
        </li>
        <li className="mr-2">
            <a href="#" onClick={() => setTab(4)} className={ tab === 4 ? activeTab : inactiveTab}>Large ERC20 Withdrawals</a>
        </li>
        <li className="mr-2">
            <a href="#" onClick={() => setTab(5)} className={ tab === 5 ? activeTab : inactiveTab}>Set ERC20 Withdrawal Limits</a>
        </li>
      </ul>


    <div>

      { tab === 1 ?
        <Eth
          instanceAddress={ instanceAddress }
          isMain={ isMain }
          ethBalance={ ethBalance }
          getEthBalance={ getEthBalance }
        /> : [] }
        
      { tab === 2 ?
        <Tokens
          instanceAddress={ instanceAddress }
          isMain={ isMain }
          tokenDropdown={ tokenDropdown }
          tokenDropdownIndex={ tokenDropdownIndex }
          setTokenDropdownIndex={ setTokenDropdownIndex }
          fetchNewTokenData={ fetchNewTokenData }
          getTokenBalance={ getTokenBalance }
          tokenBalance={ tokenBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
        /> : [] }

      { tab === 3 ?
        <LargeETHWithdrawals
          instanceAddress={ instanceAddress }
          ethBalance={ ethBalance }
          getEthBalance={ getEthBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
        /> : [] }

      { tab === 4 ?
        <LargeERC20Withdrawals
          instanceAddress={ instanceAddress }
          tokenDropdown={ tokenDropdown }
          tokenDropdownIndex={ tokenDropdownIndex }
          setTokenDropdownIndex={ setTokenDropdownIndex }
          fetchNewTokenData={ fetchNewTokenData }
          getTokenBalance={ getTokenBalance }
          tokenBalance={ tokenBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
        /> : [] }

      { tab === 5 ?
        <WithdrawalLimits
          instanceAddress={ instanceAddress }
          tokenDropdown={ tokenDropdown }
          tokenDropdownIndex={ tokenDropdownIndex }
          setTokenDropdownIndex={ setTokenDropdownIndex }
          fetchNewTokenData={ fetchNewTokenData }
          getTokenBalance={ getTokenBalance }
          tokenBalance={ tokenBalance }
          displayLastWithdrawalDay={ displayLastWithdrawalDay }
        /> : [] }
        

      </div>

    </>
  )
}
