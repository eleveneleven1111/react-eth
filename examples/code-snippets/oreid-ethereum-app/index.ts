const dotenv = require('dotenv');
const { OreId } = require('eos-auth');
const { ChainFactory, ChainType} = require('@open-rights-exchange/chainjs')
const {
  EthUnit
} = require('@open-rights-exchange/chainjs/dist/chains/ethereum_1/models')
const { toEthereumPrivateKey } = require('@open-rights-exchange/chainjs/dist/chains/ethereum_1/helpers')
const { toEosEntityName, toEosPrivateKey, toEosSymbol } = require('@open-rights-exchange/chainjs/dist/chains/eos_2/helpers')
const { ChainActionType, ConfirmType } = require('@open-rights-exchange/chainjs/dist/models')

dotenv.config();
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

async function run() {
  /*
  * Initialize oreid
  */
  const oreId = new OreId({ appName:'Test app', appId, apiKey, oreIdUrl, authCallbackUrl, signCallbackUrl, backgroundColor, serviceKey, setBusyCallback:this.setBusyCallback });
  
  /**
   * Create new oreid user
   * */
  //set the email field to a new email to generate a new oreid user.
  // const custodialNewAccountParams = { accountType: "native", email:  "johndoed117@gmail.com", name: "John Doe D", picture: "", phone: "+1213351111", userName: "jodoed", userPassword: "1993"}
  // const newUser = await oreId.custodialNewAccount(custodialNewAccountParams)
  // const { accountName, processId } = newUser
  // // const accountName="ore1qtwquaun"
  // // const processId="06b0c7ed83fe";
  // const userInfo = await oreId.getUserInfoFromApi(accountName, processId)
  // console.log("User info: %o", userInfo)
  // const { chainAccount  } = userInfo.permissions.find((perm) => perm.chainNetwork === ETH_NETWORK)
  // console.log("User's ethereum address: %o", chainAccount)

  /************************************************************************************************************************** */

  /**
   * Send eth from funding account to oreid user using chainjs
   */
  // const ropsten = new ChainFactory().create(ChainType.EthereumV1, ropstenEndpoints, {
  //   chainForkType: ropstenChainOptions,
  // })
  // // connect to the chain
  // await ropsten.connect()
  // console.log("Connected to ethereum ropsten network")

  // // construct eth transfer transaction 
  // const transaction = await ropsten.new.Transaction()
  // transaction.actions = [{
  //     from: ethFundingAccount,
  //     to: chainAccount,   
  //     value: 500000000000 // wei amount to send to oreid user
  // }]

  // // prepare the transaction to sign
  // await transaction.prepareToBeSigned()
  // await transaction.validate()
  // // send the transaction  to transfer eth to user wallet 
  // await transaction.sign([toEthereumPrivateKey(ethFundingAccountPrivateKey)])
  // console.log("Send test eth to oreid user wallet and confirm the transaction on the ropsten network")
  // const transactionResponse = await transaction.send(ConfirmType.After001)
  // console.log('send response: %o', transactionResponse)

  /************************************************************************************************************************** */
  
  /** 
   * Send  eth out of oreid user wallet 
   * This transaction will take few minutes to confirm
   * */
  // const userTransaction = {
  //   actions: [{
  //     from: chainAccount,
  //     to: "0x77af2513fd0bb339f70f47121507c9f53d767a23",
  //     value: 1000000000000 // wei amount to send out of oreid user wallet
  // }]}
  
  // const sendTransactionParams = {account:accountName,
  // broadcast: true,
  // returnSignedTransaction: true,
  // chainAccount,
  // chainNetwork: 'eth_ropsten',
  // processId,
  // transaction: userTransaction,
  // userPassword: '1993', // dummy user password
  // provider: 'custodial',
  // callbackUrl: ''
  // }
  // const signedUserTransaction = await oreId.sign(sendTransactionParams)
  // console.log('signedUserTransaction', signedUserTransaction)

  /************************************************************************************************************************** */

  /**
  * Send custom app tokens to the newly created oreid user wallet.
  * For the example, it is assumed that app token exists on ore test network
  */

  // if(appToken){
  //   const appTokenTransferOptions = {
  //     contractName: toEosEntityName(tokenContractAccount),
  //     fromAccountName: toEosEntityName(tokenFundingAccount),
  //     toAccountName: toEosEntityName("ore1qtwquaun"), // oreid account name is the same as account name on ore network
  //     amount: '1.0000',
  //     symbol: toEosSymbol(appToken),
  //     memo: 'token airdrop',
  //     permission: toEosEntityName(tokenFundingAccountPermission),
  //     precision:4
  //   }
  
  //   //console.log("appTokenTransferOptions =  %o",appTokenTransferOptions)
  //   const oreTest = new ChainFactory().create(ChainType.EosV2, oreTestEndpoints, oreChainSettings)
  //   await oreTest.connect()
  //   let fundingAccountTokenBalance =  await oreTest.fetchBalance(toEosEntityName("ore1qtwquaun"), toEosSymbol(appToken), toEosEntityName(tokenContractAccount))
  //   console.log('Funding account %o current balance: %o', appToken, fundingAccountTokenBalance)
  
  //   const tokenTransferTransaction = oreTest.new.Transaction()
  //   tokenTransferTransaction.actions = [oreTest.composeAction(ChainActionType.TokenTransfer, appTokenTransferOptions)]
  //   await tokenTransferTransaction.prepareToBeSigned()
  //   await tokenTransferTransaction.validate()
  //   await tokenTransferTransaction.sign([toEosPrivateKey(tokenFundingAccountPrivateKey)])
  //   const txResponse = await tokenTransferTransaction.send(ConfirmType.None)
  //   console.log('token transfer response: %o', txResponse)

  //    fundingAccountTokenBalance =  await oreTest.fetchBalance(toEosEntityName("ore1qtwquaun"), toEosSymbol(appToken), toEosEntityName(tokenContractAccount))
  //   console.log('Funding account %o current balance: %o', appToken, fundingAccountTokenBalance)
  // }


  /************************************************************************************************************************** */

  /**
  * Send custom app tokens oreid user wallet to another oreid user wallet.
  * For the example, it is assumed that app token exists on ore test network
  */

// ore1qujd5na4 -- OreId 1
// ore1qujdz1wf -- OreId 2

if(appToken){

  const appTokenTransferOptions = {
    contractName: "apptoken.ore",
    fromAccountName: "ore1qujd5na4",
    toAccountName: "ore1qujdz1wf",
    amount: "5.0000",
    symbol: "DMILES",
    memo: 'token airdrop',
    permission: "app1qqlfxsvj",
    precision:4
  }

  const sendTransactionParams = {
    account:"ore1qujd5na4",
    broadcast: true,
    returnSignedTransaction: true,
    chainAccount:"ore1qujd5na4",
    chainNetwork: 'ore_test',
    transaction: appTokenTransferOptions,
    userPassword: '1993',
    provider: 'custodial',
    callbackUrl: '',
    contractName: "apptoken.ore",
    fromAccountName: "ore1qujd5na4",
    toAccountName: "ore1qujdz1wf", // oreid account name is the same as account name on ore network
    amount: "5.0000",
    symbol: "DMILES",
    memo: 'token airdrop',
    permission: "app1qqlfxsvj",
    precision:4
  }

    const oreTest = new ChainFactory().create(ChainType.EosV2, oreTestEndpoints, oreChainSettings)
    await oreTest.connect()
    let fundingAccountTokenBalance =  await oreTest.fetchBalance(toEosEntityName("ore1qujd5na4"), toEosSymbol(appToken), toEosEntityName(tokenContractAccount))
    console.log('Funding account %o current balance: %o', appToken, fundingAccountTokenBalance)
  
    const tokenTransferTransaction = oreTest.new.Transaction()
    tokenTransferTransaction.actions = [oreTest.composeAction(ChainActionType.TokenTransfer, sendTransactionParams)]
    console.log("Actions: o%",tokenTransferTransaction.actions)
    console.log("Authorization: o%",tokenTransferTransaction.actions.authorization)

    await tokenTransferTransaction.prepareToBeSigned()
    await tokenTransferTransaction.validate()
    await tokenTransferTransaction.sign([toEosPrivateKey(tokenFundingAccountPrivateKey)])

    const txResponse = await tokenTransferTransaction.send(ConfirmType.None)
    console.log('token transfer response: %o', txResponse)
}

}

;(async () => {
  try {
    await run()
  } catch (error) {
    console.log('Error:', error)
  }
  process.exit()
})()
