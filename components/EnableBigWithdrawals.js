import { instanceAbi } from "../constants"
// dont export from moralis when using react
import { useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"


export default function EnableBigWithdrawals(props) {


    const instanceAddress = props.instanceAddress

    const dispatch = useNotification()


    const { data: largeWithdrawalDate, runContractFunction: getLargeWithdrawalDate } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getBackupAccountBigWithdrawalDay",
      params: { },
    });

    const { data: makeBigTokenWithdrawalData, runContractFunction: backupAccountEnableBigWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "backupAccountEnableBigWithdrawal",
      params: { },
    });





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

          <div className="w-full md:w-2/3 px-3 mb-6 mt-10 md:mb-0">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={ async () => await backupAccountEnableBigWithdrawal({
                onSuccess: (d) => console.log(d),
                onError: (e) => console.log(e)
              })
              }
            >
              Enable Big Withdrawal
            </button>
          </div>
        </div>
      </div>
  )
}
