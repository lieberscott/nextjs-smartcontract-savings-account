import { instanceAbi, regex } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract, useWeb3Transfer } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"


export default function Eth(props) {

  const { account } = useMoralis();

    const instanceAddress = props.instanceAddress
    const isMain = props.isMain

    const [depositAmount, setDepositAmount] = useState("")
    const [depositAmount_Wei, setDepositAmount_Wei] = useState("")



    /* View Functions */

    const { data: withdrawalLimit, runContractFunction: getEthWithdrawalLimit } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "getMainAccountWithdrawalLimit" : "getSafekeeperAccountWithdrawalLimit",
      params: { },
    });

    const { data: lastWithdrawalDay, runContractFunction: getEthLastWithdrawalDay } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "getMainAccountLastWithdrawalDay" : "getSafekeeperAccountLastWithdrawalDay",
      params: { },
    });

    const { runContractFunction: makeEthWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "mainUserWithdrawal" : "safekeeperUserWithdrawal",
      params: { },
    });

    const { fetch: makeDeposit, error, isFetching } = useWeb3Transfer({
      type: "native",
      amount: depositAmount_Wei,
      receiver: instanceAddress,
    });


    const handleDeposit = () => {
      // ensure eth amount is valid (not letters)
      const isnum = regex.test(depositAmount);
      if (isnum) {
        // convert token amount with decimals
        const wei = ethers.utils.parseUnits(depositAmount, "ether").toString()
        setDepositAmount_Wei(wei)
      }
      else {
        window.alert("Withdrawal amount is not valid")
      }
    }

    const getEthWithdrawalData = async () => {
      (await getEthWithdrawalLimit().toString());
      (await getEthLastWithdrawalDay().toString());
    }



    useEffect(() => {
      if (account) {
        getEthWithdrawalData()
      }
    }, [account]);

    useEffect(() => {
      if (depositAmount_Wei !== "") {
        makeDeposit({
          onSuccess: async (tx) => {
            console.log("success")
            props.handleSuccess(tx, 1)
            await tx.wait(1)
            getEthLastWithdrawalDay()
          },
          onError: e => window.alert(e.message)
        })
      }
    }, [depositAmount_Wei]);



    return (

    <div className="w-full max-w-lg mt-8">
      <div className="flex flex-wrap -mx-3 mb-6">

        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            ETH Balance
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ props.ethBalance ? ethers.utils.formatEther(props.ethBalance) + " ETH" : "..." }</p>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              await props.getEthBalance({
                onSuccess: (res) => console.log(res),
                onError: (error) => window.alert(error.message)
              })
            }
          >
            Show ETH balance
          </button>
        </div>
        
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Your Daily Limit
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ withdrawalLimit ? ethers.utils.formatEther(withdrawalLimit) + " ETH" : "..." }</p>
        </div>
        
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Last withdrawal
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ lastWithdrawalDay ? props.displayLastWithdrawalDay(lastWithdrawalDay.toString()) : "..." }</p>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              await getEthWithdrawalData({
                onSuccess: (res) => console.log(res),
                onError: (error) => window.alert(error.message)
              })
            }
          >
            Get Wdrawal data
          </button>
        </div>
        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              await makeEthWithdrawal({
                onSuccess: async (tx) => {
                  props.handleSuccess(tx, 1)
                  await tx.wait(1)
                  getEthLastWithdrawalDay()
                },
                onError: (error) => window.alert(error.message + " You may have already made a withdrawal today.")
              })
            }
          >
            Make Eth Withdrawal Now
          </button>
        </div>




        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0 mt-10">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Or
          </p>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" placeholder="ETH amount" value={ depositAmount } onChange={ e => setDepositAmount(e.target.value)} />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 mt-16">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ handleDeposit }
          >
            Deposit ETH
          </button>
        </div>
        <p className="text-red-500 text-xs italic">You can also choose to deposit by sending ETH directly to the contract address listed at the top of the page.</p>
      </div>
    </div>
  )
}
