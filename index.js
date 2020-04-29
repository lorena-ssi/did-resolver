const networks = require('./networks.json')
const Matrix = require('@lorena-ssi/matrix-lib')
const MaxonrowBlockchain = require('@lorena-ssi/maxonrow-lib')
const SubstrateBlockchain = require('@lorena-ssi/substrate-lib')
const bip39 = require('bip39')

/**
 * Interface for did-resolver
 *
 * @returns {*} resolver
 */
function getResolver () {
  /**
   * method for did-resolver
   *
   * @param {string} did to look up
   * @param {string} parsed DID
   * @param {*} didResolver the calling resolver
   * @returns {*} Promise of a DIDDocument
   */
  async function resolve (
    did, // : string,
    parsed, // : ParsedDID,
    didResolver // : DIDResolver
  ) /* : Promise<DIDDocument | null> */ {
    // console.log(parsed)

    const info = getInfoForDid(did)
    if (!info) {
      return null
    }

    // Connect to Blockchain
    let connection
    switch (info.type) {
      case 'maxonrow':
        connection = new MaxonrowBlockchain(info.symbol, {
          connection: {
            url: info.blockchainEndpoint,
            timeout: 60000
          },
          trace: {
            silent: true,
            silentRpc: true
          },
          chainId: 'maxonrow-chain',
          name: 'mxw'
        })
        break
      case 'substrate':
        connection = new SubstrateBlockchain(info.blockchainEndpoint)
        break
      default:
        throw new Error(`Unsupported network type ${info.type}`)
    }

    // Connect to the blockchain
    await connection.connect()

    // Even though we are read-only, we need to supply a key (for reasons)
    // to a certain blockchain. So here's a key.
    connection.setKeyring(bip39.generateMnemonic())

    // Look it up in the blockchain with just the ID
    const didParts = parsed.id.split(':')
    const didDocHash = await connection.getDidDocHash(didParts[1])
    connection.disconnect()

    // If there is no DID Document registered, return nothing
    if (didDocHash === '') {
      return {}
    }

    // Connect to Matrix to get the DID Document
    const matrix = await new Matrix(info.matrixEndpoint)
    const didDoc = await matrix.downloadFile(didDocHash)

    // no DID Document found: return nothing
    if (!didDoc || !didDoc.data) {
      return {}
    }

    // if there's no path, just return the whole shebang
    if (parsed.did === parsed.didUrl) {
      return didDoc.data
    }

    // TODO: process path and fragment
    // {method: 'mymethod', id: 'abcdefg', did: 'did:mymethod:abcdefg/some/path#fragment=123', path: '/some/path', fragment: 'fragment=123'}
    return didDoc.data
  }

  return { lor: resolve }
}

/**
 * Returns information specific to the namespace of the did specified
 *
 * @param {string} did for which to retrieve endpoint information
 * @returns {JSON} endpoint information (or undefined)
 */
function getInfoForDid (did) {
  const arr = /did:lor:(.*?):.*/.exec(did)
  return getInfoForNetwork(arr[1])
}

/**
 * Returns information for the network specified
 *
 * @param {string} network for which to retrieve endpoint information
 * @returns {JSON} endpoint information (or undefined)
 */
function getInfoForNetwork (network) {
  return networks[`did:lor:${network}`]
}

module.exports = { getResolver, getInfoForDid, getInfoForNetwork }
