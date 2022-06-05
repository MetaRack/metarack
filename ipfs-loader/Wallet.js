/* TODO: it might be good idea to move this code from `ipfs-loader` directory
 * but I am not sure where to. Maybe it is better to rename this directory to
 * something else
 */

const TezosToolkit = taquito.TezosToolkit;
const BeaconWallet = beacon_wallet.BeaconWallet;

const tezos = new TezosToolkit('https://testnet-tezos.giganode.io');
const options = {
  name: 'metarack',
  preferredNetwork: 'ithacanet',
};
const metarackTokensAddress = 'KT19EGcwYy8xFS7WVyf6sc1WrLwEnj8GwuKz';

const wallet = new BeaconWallet(options);

const getUserTokens = async (userAddress) => {
  /* NOTE: the simplest way to get all users tokens is to use TzKT indexer API.
  * The best way to do this is by building own L2 indexer using dipdup.
  */
  /* NOTE: it might require to request multiple pages in the future */
  const method = 'https://api.ithacanet.tzkt.io/v1/tokens/balances';
  const uri = `${method}?token.contract.eq=${metarackTokensAddress}&account.eq=${userAddress}`;
  const response = await fetch(uri);
  const userTokens = await response.json();
  return userTokens
}

const loadToken = async (tzktTokenInfo) => {
  console.log('token info', tzktTokenInfo);
  const artifactUri = tzktTokenInfo.token.metadata.artifactUri;
  const name = tzktTokenInfo.token.metadata.name;
  const ipfsUri = artifactUri.replace(/^ipfs:\/\//, '');
  await load_module(ipfsUri);
  new engine.module_registry[name]();
}

const sync = async () => {
  await wallet.requestPermissions({
    network: {
      type: 'ithacanet',
    },
  });
  const userAddress = await wallet.getPKH();
  console.log('synced with user address:', userAddress);
  const userTokens = await getUserTokens(userAddress);
  userTokens.forEach(async (tokenInfo) => {await loadToken(tokenInfo)});
}

