import { contractAddresses, factoryAbi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

import CreateNew from "./CreateNew"
import AccountDetails from "./AccountDetails"

export default function SavingsAccount() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex) === 1337 ? 31337 : parseInt(chainIdHex)
    // const chainId = "31337"
    console.log("chainId : ", chainId)
    // console.log(`ChainId is ${chainId}`)
    const savingsFactoryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log("savingsFactoryAddress : ", savingsFactoryAddress)

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [mainAccount, setMainAccount] = useState("");
    const [page, setPage] = useState(0)

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


    return (
        <div className="p-5">
          <h1 className="py-4 px-4 font-bold text-3xl">Savings Account Factory</h1>
          <p>This smart contract may be useful for users who have large Ethereum holdings and wish to add a layer of protection to their holdings.</p>
          { page === 1 ? <CreateNew /> : [] }

          {/* Main Account */}
          { isWeb3Enabled ? <AccountDetails isMain={ true } account={ mainAccount } instanceAddress={ contractInstanceAddressFromMain } /> : [] }


          <p>
            <ol>
              <li>New user</li>
              <ul>
                <li>Create new savings Account</li>
              </ul>
              <li>Main user</li>
              <ul>
                <li>Withdraw ETH</li>
                <li>Withdraw ERC20</li>
                <li>Make large withdrawal</li>
                <li>Set withdrawal limit for ERC20 token</li>
              </ul>
              <li>Backup user</li>
              <ul>
                <li>Withdraw ETH</li>
                <li>Withdraw ERC20</li>
                <li>Enable large withdrawal</li>
              </ul>
            </ol>
          </p>
            { isWeb3Enabled ? (
              <>
                <p>
                  Your Savings Account:
                </p>
                <p>{ contractInstanceAddressFromMain }</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                  onClick={ () => setPage(2) }
                >
                  Go To Your Account
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                  onClick={ () => setPage(1) }
                >
                  Create New Savings Account
                </button>
              </> )  : [] }



                { isWeb3Enabled ? (
                  <>
                <p>{ mainAccount }</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                  onClick={ async () =>
                    await getContractFromMainAddress({
                      onSuccess: (res) => console.log(res),
                      onError: (error) => console.log(error)
                    })
                  }
                >
                  I am the account's main user
                </button>
                </>
            ) : [] }

            




            {/* {savingsFactoryAddress ? (
                <>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>
                            await enterRaffle({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Raffle"
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>The current number of players is: {numberOfPlayers}</div>
                    <div>The most previous winner was: {recentWinner}</div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )} */}
        </div>
    )
}
