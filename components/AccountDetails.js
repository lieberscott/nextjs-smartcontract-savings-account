import { contractAddresses, factoryAbi, instanceAbi } from "../constants"
// dont export from moralis when using react
import { useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"


export default function MainAccount(props) {

    const instanceAccount = props.account;
    const instanceAddress = props.instanceAddress
    const isMain = props.isMain

    const [tokenList, setTokenList] = useState([])

    let tokenAddress = "";



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


    const { data: ethBalance, runContractFunction: getEthBalanceMain } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getEthBalance",
      params: { },
    });

    const { data: withdrawalLimit, runContractFunction: getMainAccountWithdrawalLimit } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "getMainAccountWithdrawalLimit" : "getBackupAccountWithdrawalLimit",
      params: { },
    });

    const { data: lastWithdrawalDay, runContractFunction: getMainAccountLastWithdrawalDay } = useWeb3Contract({
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

    const { data: withdrwawalMade, runContractFunction: makeWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "mainUserWithdrawal" : "backupUserWithdrawal",
      params: { _withdrawalAmount: withdrawalLimit },
    });

    const { data: tokenBalance, runContractFunction: getTokenBalance } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getTokenBalance",
      params: { _tokenAddress: tokenAddress },
    });

    const { data: tokenWithdrawalData, runContractFunction: getTokenWithdrawalData } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: "getTokenWithdrawalData",
      params: { _tokenAddress: tokenAddress },
    });

    const { data: tokenWithdrawal, runContractFunction: makeTokenWithdrawal } = useWeb3Contract({
      abi: instanceAbi,
      contractAddress: instanceAddress,
      functionName: isMain ? "transferErcTokenMain" : "transferErcTokenBackup",
      params: { _tokenAddress: tokenAddress },
    });



    const updateUIValues = async () => {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: savingsFactoryAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        const balanceFromCall = (await getEthBalanceMain()).toString();
        const limitFromCall = (await getMainAccountWithdrawalLimit().toString());
        const lastWithdrawalDayFromCall = (await getMainAccountLastWithdrawalDay().toString());
        const nameFromCall = (await getName().toString());

        // get ERC-20 tokens that have been saved
        let list = isMain ? JSON.parse(window.localStorage.getItem("mainAccountTokens")) : JSON.parse(window.localStorage.getItem("backupAccountTokens"));
        list = list && list.length ? list : [];
        setTokenList(list);

        /*
          tokenList = [
            {
              symbol: "UNI",
              tokenAddress: "0x32fa...",

            }
          ]
        */

    }


    useEffect(() => {
      if (instanceAccount && instanceAccount !== "") {
        updateUIValues()
      }
    }, [instanceAccount]);

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


    const handleSelection = async ({ target: { value }}) => {
      tokenAddress = value;
      await (getTokenBalance()).toString()
    }



    return (
    <>
      <p>{ isMain ? "Your Primary Account" : "Your Friend's Account (you're the backup)" }</p>
      <p>Address: { instanceAccount }</p>
      <p>Name: { name }</p>
      <p>ETH Balance: { ethBalance }</p>
      <p>Your daily Withdrawal Limit: { withdrawalLimit }</p>
      <p>Your Most Recent Withdrawal Day: { lastWithdrawalDay }</p>

      <div class="w-full max-w-lg">
        <div class="flex flex-wrap -mx-3 mb-6">
          <p>Daily ETH Withdrawal</p>

          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              ETH Balance
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
            <p class="text-red-500 text-xs italic">Please fill out this field.</p>
          </div>
          
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Daily Withdrawal Limit
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
            <p class="text-red-500 text-xs italic">Please fill out this field.</p>
          </div>
          
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Date of last withdrawal
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
            <p class="text-red-500 text-xs italic">Please fill out this field.</p>
          </div>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={ async () =>
            await makeWithdrawal({
              onSuccess: (res) => console.log(res),
              onError: (error) => console.log(error)
            })
          }
        >
          Make Daily Withdrawal Now
        </button>
      </div>


      <div class="w-full max-w-lg">
        <div class="flex flex-wrap -mx-3 mb-6">
          <p>Token Withdrawals</p>

          <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
              Token
            </label>
            <div class="relative">
              <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onChange={ handleSelection }>
                { tokenList.map((item, i) => {
                  return (
                    <option>{ item }</option>
                  )
                })}
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Balance
            </label>
            <p class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">{ tokenBalance ? tokenBalance : "" }</p>
          </div>

          <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Daily Withdrawal Limit
            </label>
            <p class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
              { tokenWithdrawalData && isMain ? tokenWithdrawalData.mainAccountWithdrawalLimit :
                tokenWithdrawalData && !isMain ? tokenWithdrawalData.backupAccountWithdrawalLimit :
                "" }
            </p>
          </div>

          <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Date of last withdrawal
            </label>
            <p class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
              { tokenWithdrawalData && isMain ? tokenWithdrawalData.mainAccountLastWithdrawalDay :
                tokenWithdrawalData && !isMain ? tokenWithdrawalData.backupAccountLastWithdrawalDay :
                "" }
            </p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={ async () =>
              await makeTokenWithdrawal({
                onSuccess: (res) => console.log(res),
                onError: (error) => console.log(error)
              })
            }
          >
            Make Daily Withdrawal Now
          </button>
        </div>
      </div>

      <div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
              Password
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" />
            <p class="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
              City
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque" />
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
              State
            </label>
            <div class="relative">
              <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                <option>New Mexico</option>
                <option>Missouri</option>
                <option>Texas</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
              Zip
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210" />
          </div>
        </div>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={ async () =>
          await getContractFromMainAddress({
            onSuccess: () => updateInstance(true),
            onError: (error) => console.log(error)
          })
        }
      >
        I am the account's main user
      </button>
      </>
  )
}
