export default function HowItWorks(props) {

  return (

    <div className="w-full max-w-lg mt-8">      
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-900">How it works:</h2>
      <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
      <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong class="font-semibold text-gray-900 dark:text-black:400">Read the "Background" tab to understand the general setup. </strong>
          The account is for people who want an extra layer of security from a trusted friend to recover their funds in case they misplace their seed phrase.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong class="font-semibold text-gray-900 dark:text-black:400">Create a New Savings Account by clicking the tab and specifying a main account and a backup account. </strong>
          After you create the Savings Account, you may deposit ETH or any ERC20 token by using our interface, or by sending it directly to the Savings Account contract address. There are unlimited deposits.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong class="font-semibold text-gray-900 dark:text-black:400">The backup account user should be someone (semi-)trusted. </strong>
          This can be a friend, spouse, or family member. If they choose to steal from you, they can gain access to a small portion of your funds.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong class="font-semibold text-gray-900 dark:text-black:400">Each wallet address can only have one main account, and be the backup for only one other account. </strong>
          However, any wallet address can set up accounts and deposit tokens on behalf of others, such as for a family member or friend, as long as you know their public wallet address. Doing so will set up a new Savings Account at a new address for the given user, who can then access it themselves. But remember, your wallet address can only be the Backup Account for one other account.</p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong class="font-semibold text-gray-900 dark:text-black:400">You can only set a withdrawal limit once per ERC20 token. </strong>
          Each ERC20 token must individually be given a withdrawal limit. ERC20 tokens are initialized with a daily withdrawal limit of 0. You may set the limit either before or after depositing.
        </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong class="font-semibold text-gray-900 dark:text-black:400">Be mindful of setting appropriate withdrawal limits.</strong> Tokens with very high circulating supply, like SHIBA, should have correspondingly higher daily withdrawal limits.
        </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          For the daily withdrawal limits, we recommend a ratio between the Main Account and the Backup Account of about 20:1 (i.e., Main Account Daily Limit of 1 ETH, Backup Account Daily Limit of 0.05 ETH)
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          When the Backup Account enables a large withdrawal, it applies to both ETH and any ERC20 token
        </li>
      </ul>

    </div>
  )
}
