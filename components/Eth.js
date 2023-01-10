import { instanceAbi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"


export default function Eth(props) {

  const { account } = useMoralis();

    const instanceAddress = props.instanceAddress
    const isMain = props.isMain

    const dispatch = useNotification()


    /* View Functions */

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

    const { runContractFunction: makeEthWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "mainUserWithdrawal" : "backupUserWithdrawal",
      params: { },
    });



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
    }


    useEffect(() => {
      if (account) {
        updateUIValues()
      }
    }, [account]);



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
  
    // console.log("tokenDropdownIndex : ", tokenDropdownIndex)


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
    </div>
  )
}
