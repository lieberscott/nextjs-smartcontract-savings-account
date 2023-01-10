import { contractAddresses, factoryAbi, instanceAbi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"


export default function AccountDetails(props) {

  const { account } = useMoralis();

    const instanceAddress = props.instanceAddress
    const isMain = props.isMain

    // updates when user types into text input
    const [newTokenAddress, setNewTokenAddress] = useState("")

    // turns to true when user presses "Add" button next to text input
    const [getNewTokenData, setGetNewTokenData] = useState(false)

    // list of the dropdown items
    const [tokenDropdown, setTokenDropdown] = useState([{ index: "0", name: "Select", contractAddress: "none", decimals: "0" }]);

    // current selection of the dropdown items
    const [tokenDropdownIndex, setTokenDropdownIndex] = useState(0);

    const [largeWithdrawalAmt_ETH, setLargeWithdrawalAmt_ETH] = useState("") // for display purposes
    const [largeWithdrawalAmt_ETH_FORMATTED, setLargeWithdrawalAmt_ETH_FORMATTED] = useState("") // to be sent to the web3 function
    const [largeWithdrawalAmt_ERC20, setLargeWithdrawalAmt_ERC20] = useState("")
    const [largeWithdrawalAmt_ERC20_FORMATTED, setLargeWithdrawalAmt_ERC20_FORMATTED] = useState("")
    const [largeWithdrawalAddress_ETH, setLargeWithdrawalAddress_ETH] = useState(account)
    const [largeWithdrawalAddress_ERC20, setLargeWithdrawalAddress_ERC20] = useState(account)

    const dispatch = useNotification()

    // const {
    //     runContractFunction: enterRaffle,
    //     data: enterTxResponse,
    //     isLoading,
    //     isFetching,
    // } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: savingsFactoryAddress,
    //     functionName: "getContractFromMainAddress",
    //     msgValue: entranceFee,
    //     params: {},
    // })

    /* View Functions */


    const { data: ethBalance, runContractFunction: getEthBalance } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getEthBalance",
      params: { },
    });

    const { data: withdrawalLimit, runContractFunction: getEthWithdrawalLimit } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "getMainAccountWithdrawalLimit" : "getBackupAccountWithdrawalLimit",
      params: { },
    });

    const { data: lastWithdrawalDay, runContractFunction: getEthLastWithdrawalDay } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "getMainAccountLastWithdrawalDay" : "getBackupAccountLastWithdrawalDay",
      params: { },
    });

    const { data: name, runContractFunction: getName } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getName",
      params: { },
    });

    const { data: withdrwawalMade, runContractFunction: makeEthWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "mainUserWithdrawal" : "backupUserWithdrawal",
      params: { },
    });

    const { data: tokenBalance, runContractFunction: getTokenBalance } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getTokenBalance",
      params: { _tokenAddress: tokenDropdown[tokenDropdownIndex].contractAddress },
    });

    const { data: tokenWithdrawalData, runContractFunction: getTokenWithdrawalData } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getTokenWithdrawalData",
      params: { _tokenAddress: tokenDropdown[tokenDropdownIndex].contractAddress },
    });

    const { data: tokenWithdrawal, runContractFunction: makeTokenWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "transferErcTokenMain" : "transferErcTokenBackup",
      params: { _tokenAddress: tokenDropdown[tokenDropdownIndex].contractAddress, _amount: isMain && tokenWithdrawalData ? tokenWithdrawalData.toString()[0] : !isMain && tokenWithdrawalData ? tokenWithdrawalData.toString()[1] : "0" },
    });


    // get new ERC20 token data
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

    const { data: largeWithdrawalDate, runContractFunction: getLargeWithdrawalDate } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getBackupAccountBigWithdrawalDay",
      params: { },
    });

    const { data: makeBigWithdrawalData, runContractFunction: mainAccountMakeBigWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "mainAccountMakeBigWithdrawal",
      params: { _withdrawalAmount: largeWithdrawalAmt_ETH_FORMATTED, _withdrawalAddress: largeWithdrawalAddress_ETH },
    });

    const { data: makeBigTokenWithdrawalData, runContractFunction: mainAccountMakeBigTokenWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "mainAccountMakeBigTokenWithdrawal",
      params: { _tokenAddress: tokenDropdown[tokenDropdownIndex].contractAddress, _withdrawalAmount: largeWithdrawalAmt_ETH_FORMATTED, _withdrawalAddress: largeWithdrawalAddress_ETH },
    });


  

    const handleBigWithdrawalEth = () => {
      // ensure eth amount is valid (not letters)
      const isnum = /^\d+$/.test(largeWithdrawalAmt_ETH);
      if (isnum) {
        // convert eth amount to wei
        const formattedEth = ethers.utils.parseUnits(largeWithdrawalAmt_ETH, "ether").toString()
        console.log("formattedEth : ", formattedEth.toString())

        // ensure withdrawal address is valid eth address
        const isAddress = ethers.utils.isAddress(largeWithdrawalAddress_ETH)

        if (isAddress) {
          // update formattedEth state to trigger the web3 call
          setLargeWithdrawalAmt_ETH_FORMATTED(formattedEth)

        }
        else {
          window.alert("Withdrawal Address is not a valid Ethereum address")
        }
      }
      else {
        window.alert("Withdrawal amount is not valid")
      }
    }

    const handleBigWithdrawalErc20 = () => {
      // ensure eth amount is valid (not letters)
      const isnum = /^\d+$/.test(largeWithdrawalAmt_ERC20);
      if (isnum) {
        // convert token amount with decimals
        const formattedErc20 = ethers.utils.parseUnits(largeWithdrawalAmt_ERC20, tokenDropdown[tokenDropdownIndex].decimals).toString()
        console.log("formattedErc20 : ", formattedErc20)

        // ensure withdrawal address is valid eth address
        const isAddress = ethers.utils.isAddress(largeWithdrawalAddress_ERC20)

        if (largeWithdrawalAddress_ERC20 === tokenDropdown[tokenDropdownIndex].contractAddress) {
          window.alert("Withdrawal address is set to token address. This will result in the loss of your funds. Please change the withdrwal address to a valid Ethereum address that you control")
        }
        else if (isAddress) {
          // update formattedEth state to trigger the web3 call
          setLargeWithdrawalAmt_ERC20_FORMATTED(formattedErc20)

        }
        else {
          window.alert("Withdrawal Address is not a valid Ethereum address")
        }
      }
      else {
        window.alert("Withdrawal amount is not valid")
      }
    }



    const getEthWithdrawalData = async () => {
      (await getEthWithdrawalLimit().toString());
      (await getEthLastWithdrawalDay().toString());
      (await getName().toString());
    }



    const updateUIValues = async () => {
        (await getEthWithdrawalLimit().toString());
        (await getEthLastWithdrawalDay().toString());
        (await getName().toString());
        // (await getEthBalance()).toString(); // causing errors when included in this function, but no errors when called separately

        // get ERC-20 tokens that have been saved
        let list = isMain ? JSON.parse(window.localStorage.getItem("mainAccountTokens")) : JSON.parse(window.localStorage.getItem("backupAccountTokens"));
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

    const updateTokenValues = async () => {
      await getTokenBalance()
    }

    const fetchNewTokenData = async () => {

       // Add to local storage item
       let list = isMain ? JSON.parse(window.localStorage.getItem("mainAccountTokens")) : JSON.parse(window.localStorage.getItem("backupAccountTokens"));
       list = list && list.length ? list : [];
 
       // check if item is already in list
       const index = list.findIndex((item, i) => item.contractAddress === newTokenAddress)

       if (index !== -1) {
        window.alert("Item is already in your list");
        return;
       }

      else {

        // Get Name, Symbol, and Logo
        const name = (await getTokenName()).toString();
        const symbol = (await getTokenSymbol()).toString();
        const decimals = (await getTokenDecimals()).toString();
        
        const newItem = { index: list.length + 1, name, symbol, contractAddress: newTokenAddress, decimals } // +1 because "Select is index 0 and is not a part of the list (so list will have 0 length when we add the first item, which should be at index 1)
        list.push(newItem)
        
        
        if (isMain) {
          window.localStorage.setItem("mainAccountTokens", JSON.stringify(list))
        }
        else {
          window.localStorage.setItem("backupAccountTokens", JSON.stringify(list));
        }
        
        // Add to current list
        setTokenDropdown(prev => prev.concat(newItem))
        setTokenDropdownIndex(list.length)
      }
    }


    useEffect(() => {
      if (largeWithdrawalAmt_ERC20_FORMATTED) {
        (async () => mainAccountMakeBigTokenWithdrawal())
      }
    }, [largeWithdrawalAmt_ETH_FORMATTED])

    useEffect(() => {
      if (largeWithdrawalAmt_ETH_FORMATTED) {
        (async () => mainAccountMakeBigWithdrawal())
      }
    }, [largeWithdrawalAmt_ETH_FORMATTED])

    useEffect(() => {
      if (account) {
        updateUIValues()
      }
    }, [account]);

    useEffect(() => {
      if (tokenDropdownIndex !== 0) {
        console.log("updateTokenValues: balance and withdrawal data")
        updateTokenValues()
        setGetNewTokenData(false)
      }
    }, [tokenDropdownIndex])

    useEffect(() => {
      if (getNewTokenData) {
        console.log("fetchNewTokenData : symbol and name")
        fetchNewTokenData()
      }
    }, [getNewTokenData])

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


    const handleSelection = ({ target }) => {
      // console.log("selectedIndex : ", target.selectedIndex)
      if (target.value !== "Select") {
        setTokenDropdownIndex(target.selectedIndex)
      }
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
  
    // console.log("tokenDropdownIndex : ", tokenDropdownIndex)


    return (
    <>
      <p>{ isMain ? "Your Primary Account" : "Your Friend's Account (you're the backup)" }</p>
      <p>Smart Contract Address: { account.toString() }</p>

    <div className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">

        <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Date when a large withdrawal was most recently enabled
          </label>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ largeWithdrawalDate ? displayLastWithdrawalDay(largeWithdrawalDate.toString()) : "..." }</p>
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <button
              className="bg-blue-500 hover:bg-blue-700 md:mt-12 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={ async () =>
                await getLargeWithdrawalDate({
                  onSuccess: (res) => console.log(res),
                  onError: (error) => console.log(error)
                })
              }
            >Get Date</button>
          </div>

        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <p>Daily ETH Withdrawal ({ name ? name.toString() : "No name" })</p>
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            ETH Balance
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ ethBalance ? ethers.utils.formatEther(ethBalance) + " ETH" : "..." }</p>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              await getEthBalance({
                onSuccess: (res) => console.log(res),
                onError: (error) => console.log(error)
              })
            }
          >
            Show ETH balance
          </button>
        </div>
        
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Daily Limit
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ withdrawalLimit ? ethers.utils.formatEther(withdrawalLimit) + " ETH" : "..." }</p>
        </div>
        
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Last withdrawal
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ lastWithdrawalDay ? displayLastWithdrawalDay(lastWithdrawalDay.toString()) : "..." }</p>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              await getEthWithdrawalData({
                onSuccess: (res) => console.log(res),
                onError: (error) => console.log(error)
              })
            }
          >
            Get Wdrawal data
          </button>
        </div>
      </div>


      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={ async () =>
          await makeEthWithdrawal({
            onSuccess: (res) => console.log(res),
            onError: (error) => console.log(error)
          })
        }
      >
        Make Eth Withdrawal Now
      </button>

      <div className="w-full max-w-lg mt-10">
        <p>Large withdrawals</p>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Date when a large withdrawal was most recently enabled
            </label>
            <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ largeWithdrawalDate ? displayLastWithdrawalDay(largeWithdrawalDate.toString()) : "..." }</p>
          </div>
          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <button
              className="bg-blue-500 hover:bg-blue-700 md:mt-12 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={ async () =>
                await getLargeWithdrawalDate({
                  onSuccess: (res) => console.log(res),
                  onError: (error) => console.log(error)
                })
              }
            >Get Date</button>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              ETH Amount
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" value={ largeWithdrawalAmt_ETH } onChange={ e => setLargeWithdrawalAmt_ETH(e.target.value)} type="text" placeholder="Amount" />
          </div>
          <div className="w-full md:w-3/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Send To
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={ largeWithdrawalAddress_ETH } onChange={ e => setLargeWithdrawalAddress_ETH(e.target.value)} type="text" placeholder="You can withdraw to your main address or another" />
            <p className="text-red-500 text-xs italic">You may withdraw to your main account address, or another address. Specify here.</p>
          </div>
          <div className="w-full md:w-2/3 px-3 mb-6 mt-10 md:mb-0">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" onClick={ handleBigWithdrawalEth }>
              Make Large ETH withdrawal
            </button>
          </div>
        </div>
      </div>

    </div>


    <div className="w-full max-w-lg mt-6">
      <p>Token Withdrawals</p>
      <div className="flex flex-wrap -mx-3 mb-6">

        <div className="w-full max-w-lg px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Select Token
          </label>
          <div className="relative">
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onChange={ handleSelection }>
              { tokenDropdown.map((item, i) => {
                return (
                  <option key={item.contractAddress} value={item.name}>{ `${item.name}` } { item.index === "0" ? "" : `(${item.symbol})` }</option>
                )
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Or
          </label>
          <div className="relative">
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" value={newTokenAddress} onChange={ (e) => setNewTokenAddress(e.target.value) } placeholder="Paste token address" />
          </div>
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 md:mt-7 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ () => handleAddNewToken() }
          >Add</button>
        </div>
          
        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Balance
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ tokenBalance ? tokenBalance.toString() : "..." }</p>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              tokenDropdownIndex !== 0 ? await getTokenBalance({
                onSuccess: (res) => console.log(res),
                onError: (error) => console.log(error)
              }) : window.alert("Select a token in the dropdown menu first") 
            }
          >
            Get Token Balance
          </button>
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Daily Limit
          </label>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
            { tokenWithdrawalData && isMain ? tokenWithdrawalData.toString()[0] :
              tokenWithdrawalData && !isMain ? tokenWithdrawalData.toString()[1] :
            "..." }
          </p>
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Last Withdrawal
          </label>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
            { tokenWithdrawalData && isMain ? displayLastWithdrawalDay(tokenWithdrawalData.toString()[2]) :
              tokenWithdrawalData && !isMain ? displayLastWithdrawalDay(tokenWithdrawalData.toString()[3]) :
            "..." }
          </p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={ async () =>
            tokenDropdownIndex !== 0 ? getTokenWithdrawalData({
              onSuccess: (res) => console.log(res.toString()),
              onError: (error) => console.log(error)
            }) : window.alert("Select a token in the dropdown menu first") 
          }
        >
          Get Wdrawal Data
        </button>
        </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={ async () =>
          tokenDropdownIndex !== 0 ? makeTokenWithdrawal({
            onSuccess: (res) => console.log(res.toString()),
            onError: (error) => console.log(error)
          }) : window.alert("Press buttons to get token balance and withdrawal data first") 
        }
      >
        Make Token Withdrawal Now
      </button>

      <div className="w-full max-w-lg mt-10">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Or Make Large Withdrawal
        </label>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Withdrawal Amount
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" value={ largeWithdrawalAmt_ETH } onChange={ e => setLargeWithdrawalAmt_ERC20(e.target.value)} type="text" placeholder="Amount" />
          </div>
          <div className="w-full md:w-3/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Send To
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={ largeWithdrawalAddress_ETH } onChange={ e => setLargeWithdrawalAddress_ERC20(e.target.value)} type="text" placeholder="You can withdraw to your main address or another" />
            <p className="text-red-500 text-xs italic">You may withdraw to your main account address, or another address. Specify here.</p>
          </div>
          <div className="w-full md:w-2/3 px-3 mb-6 mt-10 md:mb-0">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={ async () =>
                tokenDropdownIndex !== 0 ? handleBigWithdrawalErc20 : window.alert("Choose a token from the dropdown menu first")
              }
            >
              Make Large ERC20 withdrawal
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
