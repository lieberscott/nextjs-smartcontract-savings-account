// dont export from moralis when using react
import { useMoralis } from "react-moralis"


export default function Background(props) {

  const { account } = useMoralis();

    const instanceAddress = props.instanceAddress
    const isMain = props.isMain


    return (

    <div className="w-full max-w-lg mt-8">      
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-900">Overview:</h2>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-600">This is a different take on multi-sig wallets. It gives users a second layer of security in case their private keys are lost or stolen by limiting the amount of cryptocurrency that can be withdrawn from the account each day, and by introducing a (semi-)trusted safekeeper, who can withdraw tokens if the primary account holder loses access to their account. Note: This can NOT be used to back up centralized exchange accounts.</p>
      
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-900">Project Inspiration:</h2>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-600">The project is taken from an idea in an article written by Vitalik Buterin when he first introduced the Ethereum project in Bitcoin Magazine in 2014:</p>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-600">Suppose that Alice wants to store a large amount of money, but does not want to risk losing everything if her private key is lost or stolen. She makes a contract with Bob, a semi-trustworthy bank, with the following rules: Alice is allowed to withdraw up to 1 per day, Alice with Bobs approval can withdraw any amount, and Bob alone can withdraw up to 0.05 per day. Normally, Alice will only need small amounts at a time, and if Alice wants more she can prove her identity to Bob and make the withdrawal. If Alices private key gets stolen, she can run to Bob and move the funds into another contract before the thief gets away with more than 1 of the funds. If Alice loses her private key, Bob will eventually be able to recover her funds. And if Bob turns out to be evil, Alice can withdraw her own funds twenty times faster than he can. In short, all of the security of traditional banking, but with almost none of the trust.</p>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-600">Vitalik Buterin,  <a href="#" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">Bitcoin Magazine, Jan. 23, 2014</a></p>
    </div>
  )
}
