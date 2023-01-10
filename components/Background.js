// dont export from moralis when using react
import { useMoralis } from "react-moralis"


export default function Background(props) {

  const { account } = useMoralis();

    const instanceAddress = props.instanceAddress
    const isMain = props.isMain


    return (

    <div className="w-full max-w-lg mt-8">      
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-900">Project Inspiration:</h2>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-400">The project is taken from a blog post by Vitalik Buterin when he first introduced the Ethereum project in Bitcoin Magazine in 2014:</p>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-400">"[O]ne interesting setup works as follows. Suppose that Alice wants to store a large amount of money, but does not want to risk losing everything if her private key is lose or stolen. She makes a contract with Bob, a semi-trustworthy bank, with the following rules: Alice is allowed to withdraw up to 1 per day, Alice with Bob approval can withdrawn any amount, and Bob alone can withdraw up to 0.05 per day. Normally, Alice will only need small amounts at a time, and if Alice wants more she can prove her identity to Bob and make the withdrawal. If Alice's private key gets stolen, she can run to Bob and move the funds into another contract before the thief gets away with more than 1 of the funds. If Alice loses her private key, Bob will eventually be able to recover her funds. And if Bob turns out to be evil, Alice can withdraw her own funds twenty times faster than he can. In short, all of the security of traditional banking, but with almost none of the trust."</p>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-400">Vitalik Buterin,  <a href="#" className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline">Bitcoin Magazine, Jan. 23, 2014</a></p>
      <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
        <li className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            At least 10 characters
        </li>
        <li className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            At least one lowercase character
        </li>
        <li className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
            At least one special character, e.g., ! @ # ?
        </li>
      </ul>

    </div>
  )
}
