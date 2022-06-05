// import { TezosToolkit } from '@taquito/taquito';
// import { BeaconWallet } from '@taquito/beacon-wallet';

const TezosToolkit = taquito.TezosToolkit;
const BeaconWallet = beacon_wallet.BeaconWallet;

const tezos = new TezosToolkit('https://testnet-tezos.giganode.io');
const options = {
  name: 'MyAwesomeDapp',
  preferredNetwork: 'ithacanet',
  eventHandlers: {
    PERMISSION_REQUEST_SUCCESS: {
      handler: async (data) => {
        console.log('permission data:', data);
      },
    },
  },
};

const wallet = new BeaconWallet(options);

const sync = async () => {
  await wallet.requestPermissions({
    network: {
      type: 'mainnet' | 'hangzhounet' | 'ithacanet' | 'custom',
    },
  });
}
