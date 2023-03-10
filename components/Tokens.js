import { instanceAbi, erc20Abi, regex, myTokenAddess } from "../constants"
// dont export from moralis when using react
import { useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"


export default function Tokens(props) {

    const instanceAddress = props.instanceAddress
    const isMain = props.isMain

    const [depositAmount, setDepositAmount] = useState("")
    const [depositAmount_Wei, setDepositAmount_Wei] = useState("")


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
      functionName: isMain ? "transferErcTokenMain" : "transferErcTokenSafekeeper",
      params: { _tokenAddress: props.tokenDropdown[props.tokenDropdownIndex].contractAddress },
    });

    const { data: tokenTransfer, runContractFunction: transfer } = useWeb3Contract({
      abi: erc20Abi,
      contractAddress: props.tokenDropdown[props.tokenDropdownIndex].contractAddress,
      functionName: "transfer",
      params: { _to: instanceAddress, _value: depositAmount_Wei }
    });

    useEffect(() => {
      console.log("depositAmount_Wei : ", depositAmount_Wei)
      if (depositAmount_Wei !== "" && props.tokenDropdownIndex !== 0) {
        transfer({
          onSuccess: async (tx) => {
            props.handleSuccess(tx, 2)
            await tx.wait(1)
            getTokenWithdrawalData()
          },
          onError: e => window.alert(e.message)
        })
      }
    }, [depositAmount_Wei]);


    const handleDeposit = () => {
      // ensure eth amount is valid (not letters)
      const isnum = regex.test(depositAmount);
      if (isnum) {
        // convert token amount with decimals
        const wei = ethers.utils.parseUnits(depositAmount, props.tokenDropdown[props.tokenDropdownIndex].decimals).toString()
        setDepositAmount_Wei(wei)
      }
      else {
        window.alert("Withdrawal amount is not valid")
      }
    }


    const handleSelection = ({ target }) => {
      // console.log("selectedIndex : ", target.selectedIndex)
      if (target.value !== "Select") {
        props.setTokenDropdownIndex(target.selectedIndex)
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
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" value={props.newTokenAddress} onChange={ (e) => props.setNewTokenAddress(e.target.value) } placeholder="Paste token address" />
          </div>
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 md:mt-7 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ () => props.handleAddNewToken() }
          >Add</button>
        </div>
          
        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Balance
          </p>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ props.tokenBalance ? ethers.utils.formatEther(props.tokenBalance.toString()).toString() : "..." }</p>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              props.tokenDropdownIndex !== 0 ? await props.getTokenBalance({
                onSuccess: (res) => console.log(res),
                onError: (error) => window.alert(error.message)
              }) : window.alert("Select a token in the dropdown menu first") 
            }
          >
            Get Token Balance
          </button>
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Your Daily Limit
          </label>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
            { tokenWithdrawalData && isMain ? ethers.utils.formatUnits(tokenWithdrawalData[0].toString()).toString() :
              tokenWithdrawalData && !isMain ? ethers.utils.formatUnits(tokenWithdrawalData[1].toString()).toString() :
            "..." }
          </p>
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Last Withdrawal
          </label>
          <p className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
            { tokenWithdrawalData && isMain ? props.displayLastWithdrawalDay(tokenWithdrawalData[2].toString()) :
              tokenWithdrawalData && !isMain ? props.displayLastWithdrawalDay(tokenWithdrawalData[3].toString()) :
            "..." }
          </p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={ async () =>
            props.tokenDropdownIndex !== 0 ? getTokenWithdrawalData({
              onSuccess: (res) => console.log(res.toString()),
              onError: (error) => window.alert(error.message)
            }) : window.alert("Select a token in the dropdown menu first") 
          }
        >
          Get Wdrawal Data
        </button>
        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={ async () =>
            tokenWithdrawalData[0].toString() === "0" ? window.alert("You have not set withdrawal limits yet. Go to the 'Set ERC20 Withdrawal Limits' tab first")
            : props.tokenDropdownIndex !== 0 ? makeTokenWithdrawal({
              onSuccess: async (tx) => {
                props.handleSuccess(tx, 2)
                await tx.wait(1)
                getTokenWithdrawalData()
              },
              onError: (error) => window.alert(error.message)
            }) : window.alert("Press buttons to get token balance and withdrawal data first") 
          }
        >
          Make Token Withdrawal Now
        </button>
        </div>

      <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0 mt-10">
        <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Or Make Deposit
        </p>
        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" placeholder="Token amount" value={ depositAmount } onChange={ e => setDepositAmount(e.target.value)} />
      </div>
      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 mt-16">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={ handleDeposit }
        >
          Deposit Token
        </button>
      </div>
      <p className="text-red-500 text-xs italic">You can also choose to deposit by sending the token directly to the contract address listed at the top of the page.</p>
      
        </div>
    </div>
  )
}
