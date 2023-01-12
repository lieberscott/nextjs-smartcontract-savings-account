import { factoryAbi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function CreateNew(props) {
  const {chainId: chainIdHex, account } = useMoralis();
  // These get re-rendered every time due to our connect button!
  const chainId = parseInt(chainIdHex)
  // console.log(`ChainId is ${chainId}`)
  const savingsFactoryAddress = props.savingsFactoryAddress

  // State hooks
  // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
  const [mainAccount, setMainAccount] = useState("");
  const [safekeeperAccount, setSafekeeperAccount] = useState("");
  const [mainAccountWithdrawalLimit_Eth, setMainAccountWithdrawalLimit_Eth] = useState("");
  const [mainAccountWithdrawalLimit_Wei, setMainAccountWithdrawalLimit_Wei] = useState("")
  const [safekeeperAccountWithdrawalLimit_Eth, setSafekeeperAccountWithdrawalLimit_Eth] = useState("");
  const [safekeeperAccountWithdrawalLimit_Wei, setSafekeeperAccountWithdrawalLimit_Wei] = useState("");
  const [initialDeposit_Eth, setInitialDeposit_Eth] = useState("");
  const [initialDeposit_Wei, setInitialDeposit_Wei] = useState("");
  const [name, setName] = useState("");

  const dispatch = useNotification()


    /* View Functions */

    const { data: data, runContractFunction: createSavingsAccount } = useWeb3Contract({
      abi: factoryAbi,
      contractAddress: savingsFactoryAddress,
      functionName: "getContractFromMainAddress",
      params: { mainAccount, safekeeperAccount, mainAccountWithdrawalLimit_Wei, safekeeperAccountWithdrawalLimit_Wei, name },
      msgValue: initialDeposit_Wei !== 0 && initialDeposit_Wei
    });

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
            setMainAccount("")
            setSafekeeperAccount("")
            setMainAccountWithdrawalLimit_Eth("")
            setSafekeeperAccountWithdrawalLimit_Eth("")
            setMainAccountWithdrawalLimit_Wei("")
            setSafekeeperAccountWithdrawalLimit_Wei("")
            setName("")
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCreateSavingsAccount = () => {
      if (!ethers.utils.isAddress(mainAccount)) {
        alert("Main account is not a valid Ethereum address");
      }
      else if (!ethers.utils.isAddress(safekeeperAccount)) {
        alert("Safekeeper account is not a valid Ethereum address");
      }
      else if (mainAccount === safekeeperAccount) {
        alert("Safekeeper account can not be the same as main account")
      }
      else if (parseInt(mainAccountWithdrawalLimit_Wei) <= 0 || isNaN(parseInt(mainAccountWithdrawalLimit_Wei))) {
        alert("Main account withdrawal limit must be positive and must be a number");
      }
      else if (parseInt(safekeeperAccountWithdrawalLimit_Wei) <= 0 || isNaN(parseInt(safekeeperAccountWithdrawalLimit_Wei))) {
        alert("Safekeeper account withdrawal limit must be positive and must be a number");
      }
      else {
        createSavingsAccount({
          onSuccess: (tx) => window.alert("Savings Account successfully created. Refresh to view your updated account details"),
          onError: (error) => window.alert(error.message)
        });
      }
    }

    // 1. non-numeric characters
    // 2. eliminate leading 0s unless it's a decimal

    const checkValidNumber = (input) => {

      if (input === "" || input.length > 16) {
        return false;
      }

      // allows only positive integers and decimals - however, also allows leading zeroes 0000000005
      const regex = /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/

      if (input.match(regex)) {
        return true;
      }

      return false;

    }

    const handleMainAccountLimit = (amountInEth) => {
      const isValid = checkValidNumber(amountInEth);

      const wei = isValid ? ethers.utils.parseUnits(amountInEth, "ether").toString() : ""
      const amt = isValid ? amountInEth : ""
      setMainAccountWithdrawalLimit_Eth(amt);
      setMainAccountWithdrawalLimit_Wei(wei);
    }

    const handleSafekeeperAccountLimit = (amountInEth) => {
      const isValid = checkValidNumber(amountInEth);
      const wei = isValid ? ethers.utils.parseUnits(amountInEth, "ether").toString() : ""
      const amt = isValid ? amountInEth : ""
      setSafekeeperAccountWithdrawalLimit_Eth(amt);
      setSafekeeperAccountWithdrawalLimit_Wei(wei);
    }

    const handleInitialDeposit = (amountInEth) => {
      const isValid = checkValidNumber(amountInEth);
      const wei = isValid ? ethers.utils.parseUnits(amountInEth, "ether").toString() : ""
      const amt = isValid ? amountInEth : ""
      setInitialDeposit_Eth(amt);
      setInitialDeposit_Wei(wei);
    }


    return (
        <div className="mt-6">
          <form className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Name (optional)
              </label>
              <p className="text-gray-600 text-xs italic">This is stored on-chain so you can identify it. The shorter, the cheaper.</p>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" placeholder="Scott's Account" onChange={(e) => setName(e.target.value)} />
            </div>
          </div>


            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 align-baseline">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Primary Account Address
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-primary-address" type="text" placeholder={account} onChange={(e) => setMainAccount(e.target.value) } />
                <p className="text-red-500 text-xs italic">Please fill out this field.</p>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Daily ETH withdrawal limit
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-primary-eth-limit" type="number" min="0" placeholder="0.5" value={ mainAccountWithdrawalLimit_Eth } onChange={(e) => handleMainAccountLimit(e.target.value) } />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Safekeeper Account Address
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-safekeeper-address" type="text" placeholder={account} value={safekeeperAccount} onChange={(e) => setSafekeeperAccount(e.target.value) } />
                <p className="text-red-500 text-xs italic">Please fill out this field.</p>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Daily ETH withdrawal limit
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-safekeeper-eth-limit" type="number" min="0" placeholder="0.02" value={ safekeeperAccountWithdrawalLimit_Eth } onChange={(e) => handleSafekeeperAccountLimit(e.target.value) } />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Initial ETH Deposit (optional)
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-safekeeper-address" type="text" placeholder="0" value={ initialDeposit_Eth } onChange={(e) => handleInitialDeposit(e.target.value) } />
                <p className="text-red-500 text-xs italic">Optional.</p>
              </div>
            </div>


          </form>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ () => handleCreateSavingsAccount() }
          >
            Create Savings Account
          </button>
        </div>
    )
}
