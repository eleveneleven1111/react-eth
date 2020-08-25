require('dotenv').config()
import { OreId, AuthProvider, ChainNetwork } from 'oreid-js'
import { ChainFactory, ChainType, HelpersEos, Models} from '@open-rights-exchange/chainjs'

global.fetch = require("node-fetch");

const {
  APP_ID: appId, // Provided when you register your app
  API_KEY:apiKey, // Provided when you register your app
  SERVICE_KEY: serviceKey, // Provided when you register your app
  AUTH_CALLBACK:authCallbackUrl, // The url called by the server when login flow is finished - must match one of the callback strings listed in the App Registration
  SIGN_CALLBACK:signCallbackUrl, // The url called by the server when transaction signing flow is finished - must match one of the callback strings listed in the App Registration
  OREID_URL:oreIdUrl, // HTTPS Address of OREID server
  BACKGROUND_COLOR:backgroundColor, // Background color shown during login flow
  FUNDING_ACCOUNT_ADDRESS: ethFundingAccount, // ethereum account to fund oreid user wallets
  FUNDING_ACCOUNT_PRIVATE_KEY: ethFundingAccountPrivateKey,
  APP_TOKEN_FUNDING_ACCOUNT_ADDRESS: tokenFundingAccount,
  APP_TOKEN_FUNDING_ACCOUNT_PRIVATE_KEY: tokenFundingAccountPrivateKey,
  APP_TOKEN_FUNDING_ACCOUNT_PERMISSION: tokenFundingAccountPermission,
  APP_TOKEN_CONTRACT_ACCOUNT: tokenContractAccount,
  APP_TOKEN: appToken
} = process.env;

const ETH_NETWORK = 'eth_ropsten'

const ropstenEndpoints = [
  {
    url: new URL('https://ropsten.infura.io/v3/fc379c787fde4363b91a61a345e3620a'),
    //url: new URL('https://ropsten.infura.io/v3/1a64a07905c24a50b750ffaa3737f30c'),//Our Infura
  },
]

const ropstenChainOptions = {
  chainName: 'ropsten',
  hardFork: 'istanbul',
}

const oreTestEndpoints = [
  {
    url: new URL('https://ore-staging.openrights.exchange/'),
  }
]

const oreChainSettings = {}
const sendToAccount = 'ore1qujdz1wf'
const sendFromAccount = "ore1qujd5na4"
const chainNetwork = ChainNetwork.OreTest
const userPassword = '1993'
const appPermission = 'app1qqlfxsvj'

async function run() {
  /*
  * Initialize oreid
  */
  const oreId = new OreId({ appName:'Test app', appId, apiKey, oreIdUrl, authCallbackUrl, signCallbackUrl, backgroundColor, serviceKey, setBusyCallback:null });

  // Part 1 - construct transaction to send from user's account
  const sendTransactionParams = {
    contractName: "apptoken.ore",
    fromAccountName: sendFromAccount,
    toAccountName: sendToAccount, // oreid account name is the same as account name on ore network
    amount: "5.0000",
    symbol: "DMILES",
    memo: 'token airdrop',
    permission: appPermission,
    precision:4
  }
  const oreTest = new ChainFactory().create(ChainType.EosV2, oreTestEndpoints, oreChainSettings)
  await oreTest.connect()
  let fundingAccountTokenBalance =  await oreTest.fetchBalance(HelpersEos.toEosEntityName("ore1qujd5na4"), HelpersEos.toEosSymbol(appToken), HelpersEos.toEosEntityName(tokenContractAccount))
  console.log('Funding account %o current balance: %o', appToken, fundingAccountTokenBalance)
  const tokenTransferTransaction = oreTest.new.Transaction()
  tokenTransferTransaction.actions = [await oreTest.composeAction(Models.ChainActionType.TokenTransfer, sendTransactionParams)]
  const transactionActionToSign = tokenTransferTransaction.actions[0]

  // Part 2 - have oreid attach the user's signature
  const oreidSignTransactionParams = {
    account: sendFromAccount,
    broadcast: true,
    returnSignedTransaction: true,
    chainAccount: sendFromAccount,
    chainNetwork,
    transaction: transactionActionToSign,
    userPassword,
    provider: AuthProvider.Custodial,
  }
  const signedUserTransaction = await oreId.sign(oreidSignTransactionParams)
  console.log('signedUserTransaction', signedUserTransaction)

}

;(async () => {
  try {
    await run()
  } catch (error) {
    console.log('Error:', error)
  }
  process.exit()
})()
