import { instanceAbi } from "../constants"
// dont export from moralis when using react
import { useWeb3Contract } from "react-moralis"


export default function EnableBigWithdrawals(props) {

    const instanceAddress = props.instanceAddress

    const { data: largeWithdrawalDate, runContractFunction: getLargeWithdrawalDate } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getSafekeeperAccountBigWithdrawalDay",
      params: { },
    });

    const { data: makeBigTokenWithdrawalData, runContractFunction: safekeeperAccountEnableBigWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "safekeeperAccountEnableBigWithdrawal",
      params: { },
    });


    return (

    <div className="w-full max-w-lg mt-8">
      <div className="flex flex-wrap -mx-3 mb-6">

        <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Date when a large withdrawal was most recently enabled
          </label>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ largeWithdrawalDate ? props.displayLastWithdrawalDay(largeWithdrawalDate.toString()) : "..." }</p>
          <p className="text-red-500 text-xs italic">Your safekeeper account holder must enable a large withdrawal before you can make it.</p>
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 md:mt-12 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              await getLargeWithdrawalDate({
                onSuccess: res => console.log(res),
                onError: (error) => window.alert(error.message)
              })
            }
          >Get Date</button>
        </div>

          <div className="w-full md:w-2/3 px-3 mb-6 mt-10 md:mb-0">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={ async () => await safekeeperAccountEnableBigWithdrawal({
                onSuccess: async (tx) => {
                  props.handleSuccess(tx)
                  await tx.wait(1)
                  getLargeWithdrawalDate()
                },
                onError: (e) => window.alert(e.message)
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
