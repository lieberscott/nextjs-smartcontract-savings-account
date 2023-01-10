import { instanceAbi, erc20Abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"


export default function LargeWithdrawals(props) {

  const { account } = useMoralis();

    const instanceAddress = props.instanceAddress
    const isMain = props.isMain

    // updates when user types into text input
    const [newTokenAddress, setNewTokenAddress] = useState("")

    // turns to true when user presses "Add" button next to text input
    const [getNewTokenData, setGetNewTokenData] = useState(false)

    const [largeWithdrawalAmt_ETH, setLargeWithdrawalAmt_ETH] = useState("") // for display purposes
    const [largeWithdrawalAmt_ETH_FORMATTED, setLargeWithdrawalAmt_ETH_FORMATTED] = useState("") // to be sent to the web3 function
    const [largeWithdrawalAmt_ERC20, setLargeWithdrawalAmt_ERC20] = useState("")
    const [largeWithdrawalAmt_ERC20_FORMATTED, setLargeWithdrawalAmt_ERC20_FORMATTED] = useState("")
    const [largeWithdrawalAddress_ETH, setLargeWithdrawalAddress_ETH] = useState(account)
    const [largeWithdrawalAddress_ERC20, setLargeWithdrawalAddress_ERC20] = useState(account)

    const dispatch = useNotification()

 

    /* View Functions */

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
      params: { _tokenAddress: props.tokenDropdown[props.tokenDropdownIndex].contractAddress, _withdrawalAmount: largeWithdrawalAmt_ERC20_FORMATTED, _withdrawalAddress: largeWithdrawalAddress_ETH },
    });


  

    const handleBigWithdrawalEth = () => {
      // ensure eth amount is valid (not letters)
      const isnum = /^\d+$/.test(largeWithdrawalAmt_ETH);
      if (isnum) {
        // convert eth amount to wei
        const formattedEth = ethers.utils.parseUnits(largeWithdrawalAmt_ETH, "ether").toString()

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
        const formattedErc20 = ethers.utils.parseUnits(largeWithdrawalAmt_ERC20, props.tokenDropdown[props.tokenDropdownIndex].decimals).toString()

        // ensure withdrawal address is valid eth address
        const isAddress = ethers.utils.isAddress(largeWithdrawalAddress_ERC20)

        if (largeWithdrawalAddress_ERC20 === props.tokenDropdown[props.tokenDropdownIndex].contractAddress) {
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


    useEffect(() => {
      if (largeWithdrawalAmt_ETH_FORMATTED !== "") {
        (async () => await mainAccountMakeBigWithdrawal())
      }
    }, [largeWithdrawalAmt_ETH_FORMATTED])

    useEffect(() => {
      if (largeWithdrawalAmt_ERC20_FORMATTED !== "") {
        (async () => await mainAccountMakeBigTokenWithdrawal())
      }
    }, [largeWithdrawalAmt_ERC20_FORMATTED])

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
            updateUIValues()
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

    <div className="w-full max-w-lg mt-8">
      <div className="flex flex-wrap -mx-3 mb-6">

        <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Date when a large withdrawal was most recently enabled
          </label>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ largeWithdrawalDate ? props.displayLastWithdrawalDay(largeWithdrawalDate.toString()) : "..." }</p>
          <p className="text-red-500 text-xs italic">Your backup account holder must enable a large withdrawal before you can make it.</p>
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

        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0 mt-8">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            ETH Balance
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ props.ethBalance ? ethers.utils.formatEther(props.ethBalance) + " ETH" : "..." }</p>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 mt-8">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              await props.getEthBalance({
                onSuccess: (res) => console.log(res),
                onError: (error) => console.log(error)
              })
            }
          >
            Show ETH balance
          </button>
        </div>
        <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Withdrawal Amount
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

        <div className="w-full max-w-lg mt-6">
          <p>OR</p>
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

          </div>
        </div>


      <div className="w-full max-w-lg">
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
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={ largeWithdrawalAddress_ERC20 } onChange={ e => setLargeWithdrawalAddress_ERC20(e.target.value)} type="text" placeholder="You can withdraw to your main address or another" />
            <p className="text-red-500 text-xs italic">You may withdraw to your main account address, or another address. Specify here.</p>
          </div>
          <div className="w-full md:w-2/3 px-3 mb-6 mt-10 md:mb-0">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={ async () =>
                props.tokenDropdownIndex !== 0 ? handleBigWithdrawalErc20 : window.alert("Choose a token from the dropdown menu first")
              }
            >
              Make Large ERC20 withdrawal
            </button>
          </div>
        </div>
      </div>
      </div>
      </div>
  )
}
