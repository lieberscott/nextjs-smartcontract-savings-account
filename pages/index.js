import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import SavingsAccount from "../components/SavingsAccount";
import { useMoralis } from "react-moralis";

// Ethereum, Arbitrum, and Matic testnets and mainnets
const supportedChains = ["31337", "5", "421613", "80001", "42161", "137"];

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {/* <SavingsAccount className="p-8" /> */}
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(parseInt(chainId).toString()) ? (
            <div className="flex flex-row">
              <SavingsAccount className="p-8" />
            </div>
          ) : (
            <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
          )}
        </div>
      ) : (
        <div>Please connect to a Wallet</div>
      )}
    </div>
  );
}
