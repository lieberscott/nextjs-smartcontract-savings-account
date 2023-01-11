export default function HowItWorks(props) {

  return (

    <div className="w-full max-w-lg mt-8">      
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-900">How it works:</h2>
      <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">The Savings Accounts are free. </strong>
          There is no fee, other than gas costs, to open and operate an account.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">Read the "Background" tab to understand the general setup. </strong>
          The account is for people who want an extra layer of security for users who control their own wallet. Note: This can not be used to backup centralized exchange accounts.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">The backup account user should be someone (semi-)trusted. </strong>
          This can be a friend, spouse, or family member. They need to have a wallet address that they control (not on a centralized exchange). They should be (semi-)trusted, because if they choose to steal from you, they can gain access to a small portion of your funds (depending on the withdrawal limits you set).
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">Create a New Savings Account by clicking the tab and specifying a main account and a backup account. </strong>
          After you create the Savings Account, you may deposit ETH or any ERC20 token by using our interface, or by sending it directly to the Savings Account contract address. There are unlimited deposits.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">Each wallet address can only have one main account, and be the backup for only one other account. </strong>
          However, any wallet address can set up accounts and deposit tokens on behalf of others, such as for a family member or friend, as long as you know their public wallet address. Doing so will set up a new Savings Account at a new address for the given user, who can then access it themselves. But remember, your wallet address can only be the Backup Account for one other account.</p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">You can only set a withdrawal limit once per ERC20 token. </strong>
          Each ERC20 token must individually be given a withdrawal limit. ERC20 tokens are initialized with a daily withdrawal limit of 0. You may set the limit either before or after depositing.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">Be mindful of setting appropriate withdrawal limits.</strong> Tokens with very high circulating supply, like SHIBA, should have correspondingly higher daily withdrawal limits.
        </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">You can withdraw ETH, and each token, once per day. </strong>
          For example, if you have ETH, DAI, and LINK in your account, you may withdraw each of them once per day.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">The day resets at 0:00 UTC time. </strong>
          It is not 24 hours after your last withdrawal. If you withdraw at 23:59 UTC time on Wednesday, you can withdraw again two minutes later, at 00:01 UTC time, on Thursday.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">For the daily withdrawal limits, we recommend a ratio between the Main Account and the Backup Account of about 20:1. </strong>
          For example, a Main Account Daily Limit of 1 ETH, Backup Account Daily Limit of 0.05 ETH. This will depend on the total amount of ETH -- and each token -- you plan on depositing.
        </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">When the Backup Account enables a large withdrawal, it applies to both ETH and any ERC20 token. </strong>
          Large withdrawals do not need to be authorized for each token. One authorization applies to all ETH and all tokens in the account.
          </p>
        </li>
        <li className="flex">
          <svg className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <p><strong className="font-semibold text-gray-900 dark:text-black:400">Once a large withdrawal is authorized, the main account user may withdraw as much and as frequently that entire day, until 0:00 UTC time the next day. </strong>
          Large withdrawals enable the main account user to have free and unlimied access to their funds for that day.
          </p>
        </li>
      </ul>

    </div>
  )
}
