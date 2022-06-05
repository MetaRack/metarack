const load_module = async (ipfs_hash) => {
  console.log('loading module from', ipfs_hash)
  /* TODO: it is better to use some third party library than making
  * direct call to ipfs.io, but for the proof of concept I decided to make it
  * as simple, as possible */

  const ipfs_provider = 'https://ipfs.io/ipfs/'
  const uri = ipfs_provider.concat(ipfs_hash)
  const response = await fetch(uri)
  const module_code = await response.text()

  /* TODO: this is very unsecure way to load JS files, especially if there is
  * some blockchain lib involved in the same memory space. But again, this is
  * just proof of concept */
  eval(module_code)
}
