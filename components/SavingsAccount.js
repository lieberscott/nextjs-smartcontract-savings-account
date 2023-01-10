import { contractAddresses, factoryAbi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

import Background from "./Background"
import CreateNew from "./CreateNew"
import AccountDetails from "./AccountDetails"
import HowItWorks from "./HowItWorks"

export default function SavingsAccount() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    // These get re-rendered every time due to our connect button!
    // const chainId = parseInt(chainIdHex) === 1337 ? 31337 : parseInt(chainIdHex)
    const chainId = parseInt(chainIdHex)
    // const chainId = "31337"
    console.log("chainId : ", chainId)
    // console.log(`ChainId is ${chainId}`)
    const savingsFactoryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log("savingsFactoryAddress : ", savingsFactoryAddress)

    const zeroXAddress = "0x0000000000000000000000000000000000000000"

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [mainAccount, setMainAccount] = useState("");
    const [primaryTab, setPrimaryTab] = useState(0)


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

    const { data: contractInstanceAddressFromMain, runContractFunction: getContractFromMainAddress } = useWeb3Contract({
        abi: factoryAbi,
        contractAddress: savingsFactoryAddress,
        functionName: "getContractFromMainAddress",
        params: { _mainAccount: account },
    });

    const { data: contractInstanceAddressFromBackup, runContractFunction: getContractFromBackupAddress } = useWeb3Contract({
        abi: factoryAbi,
        contractAddress: savingsFactoryAddress,
        functionName: "getContractFromBackupAddress",
        params: { _backupAccount: account },
    });

    const updateUIValues = async () => {

        const instanceMain = (await getContractFromMainAddress()).toString();
        const instanceBackup = (await getContractFromBackupAddress().toString());

        // setContractInstanceMain(instanceMain)
        // setContractInstanceBackup(instanceBackup)
    }

    useEffect(() => {
      if (isWeb3Enabled) {
        updateUIValues();
      }
    }, [isWeb3Enabled, account]);

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

    const updateInstance = (isMainAccount) => {
      if (isMainAccount) {
        setContractInstance()
      }
    }

    const inactiveTab = "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
    const activeTab = "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"

    console.log("contractInstanceFromBackuop : ", contractInstanceAddressFromBackup)

    return (
        <div className="p-5">

          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <li className="mr-2">
              <a href="#" onClick={() => setPrimaryTab(0)} className={ primaryTab === 0 ? activeTab : inactiveTab }>Background</a>
            </li>
            <li className="mr-2">
              <a href="#" onClick={() => setPrimaryTab(1)} className={ primaryTab === 1 ? activeTab : inactiveTab }>How It Works</a>
            </li>
            <li className="mr-2">
              <a href="#" onClick={() => setPrimaryTab(2)} className={ primaryTab === 2 ? activeTab : inactiveTab }>Primary Account</a>
            </li>
            <li className="mr-2">
              <a href="#" onClick={() => setPrimaryTab(3)} className={ primaryTab === 3 ? activeTab : inactiveTab}>Backup Account</a>
            </li>
            <li>
              <a href="#" onClick={() => setPrimaryTab(4)} className={ primaryTab === 4 ? activeTab : inactiveTab}>Create New Savings Account!</a>
            </li>
          </ul>

          { primaryTab === 0 ? <Background /> : [] }
          { primaryTab === 1 ? <HowItWorks /> : [] }

          {/* Main Account */}
          { isWeb3Enabled && contractInstanceAddressFromMain !== zeroXAddress && primaryTab === 2 ? <AccountDetails isMain={ true } instanceAddress={ contractInstanceAddressFromMain } /> : [] }
          
          {/* Backup Account */}
          { isWeb3Enabled && contractInstanceAddressFromBackup !== zeroXAddress && primaryTab === 3 ? <AccountDetails isMain={ false } instanceAddress={ contractInstanceAddressFromBackup } /> : [] }

          { isWeb3Enabled && primaryTab === 4 ? <CreateNew /> : [] }

        </div>
    )
}
