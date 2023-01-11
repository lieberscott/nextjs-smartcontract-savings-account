import { instanceAbi, erc20Abi, regex } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"


export default function LargeETHWithdrawals(props) {

  const { account } = useMoralis();

    const instanceAddress = props.instanceAddress

    const [largeWithdrawalAmt_ETH, setLargeWithdrawalAmt_ETH] = useState("") // for display purposes
    const [largeWithdrawalAmt_ETH_FORMATTED, setLargeWithdrawalAmt_ETH_FORMATTED] = useState("") // to be sent to the web3 function
    const [largeWithdrawalAddress_ETH, setLargeWithdrawalAddress_ETH] = useState(account)

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


  

    const handleBigWithdrawalEth = () => {
      // ensure eth amount is valid (not letters)
      const isnum = regex.test(largeWithdrawalAmt_ETH);
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



    useEffect(() => {
      console.log("withdraw: ", largeWithdrawalAmt_ETH_FORMATTED)
      if (largeWithdrawalAmt_ETH_FORMATTED !== "") {
        mainAccountMakeBigWithdrawal({
          onSuccess: (res) => console.log(res),
          onError: (error) => window.alert("Withdrawal may not be authorized")
        })
      }
    }, [largeWithdrawalAmt_ETH_FORMATTED])


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
            Withdrawal Amount (in ETHER)
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
  )
}
