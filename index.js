const networks = require('./networks.json')
const Matrix = require('@lorena-ssi/matrix-lib')
// const Maxonrow = require('@lorena-ssi/maxonrow-lib')
const Substrate = require('@lorena-ssi/substrate-lib')

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

    // Use the blockchain appropriate to the network
    let Blockchain
    if (info.type === 'substrate') {
      Blockchain = Substrate
    } else {
      throw new Error('unsupported network type')
    }

    // Connect to the blockchain
    const connection = new Blockchain(info.blockchainEndpoint)
    if (!await connection.connect()) {
      throw new Error('unable to connect')
    }

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
  return networks[`did:lor:${arr[1]}`]
}

module.exports = { getResolver, getInfoForDid }
