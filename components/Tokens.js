import { instanceAbi } from "../constants"
// dont export from moralis when using react
import { useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"


export default function Tokens(props) {

    const instanceAddress = props.instanceAddress
    const isMain = props.isMain

    // updates when user types into text input
    const [newTokenAddress, setNewTokenAddress] = useState("")

    // turns to true when user presses "Add" button next to text input
    const [getNewTokenData, setGetNewTokenData] = useState(false)


    const dispatch = useNotification()


    /* View Functions */

    const { data: tokenWithdrawalData, runContractFunction: getTokenWithdrawalData } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getTokenWithdrawalData",
      params: { _tokenAddress: props.tokenDropdown[props.tokenDropdownIndex].contractAddress },
    });

    const { data: tokenWithdrawal, runContractFunction: makeTokenWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "transferErcTokenMain" : "transferErcTokenBackup",
      params: { _tokenAddress: props.tokenDropdown[props.tokenDropdownIndex].contractAddress, _amount: isMain && tokenWithdrawalData ? tokenWithdrawalData.toString()[0] : !isMain && tokenWithdrawalData ? tokenWithdrawalData.toString()[1] : "0" },
    });



    useEffect(() => {
      if (getNewTokenData) {
        props.fetchNewTokenData()
        setGetNewTokenData(false)
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
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }


    const handleSelection = ({ target }) => {
      // console.log("selectedIndex : ", target.selectedIndex)
      if (target.value !== "Select") {
        props.setTokenDropdownIndex(target.selectedIndex)
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
  

    return (
    <div className="w-full max-w-lg mt-6">
      <div className="flex flex-wrap -mx-3 mb-6">

        <div className="w-full max-w-lg px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Select Token
          </label>
          <div className="relative">
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onChange={ handleSelection }>
              { props.tokenDropdown.map((item, i) => {
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
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ props.tokenBalance ? props.tokenBalance.toString() : "..." }</p>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              props.tokenDropdownIndex !== 0 ? await props.getTokenBalance({
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
            { tokenWithdrawalData && isMain ? props.displayLastWithdrawalDay(tokenWithdrawalData.toString()[2]) :
              tokenWithdrawalData && !isMain ? props.displayLastWithdrawalDay(tokenWithdrawalData.toString()[3]) :
            "..." }
          </p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={ async () =>
            props.tokenDropdownIndex !== 0 ? getTokenWithdrawalData({
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
          props.tokenDropdownIndex !== 0 ? makeTokenWithdrawal({
            onSuccess: (res) => console.log(res.toString()),
            onError: (error) => console.log(error)
          }) : window.alert("Press buttons to get token balance and withdrawal data first") 
        }
      >
        Make Token Withdrawal Now
      </button>
    </div>
  )
}
