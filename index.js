const networks = require('./networks.json')
// const matrix = require('@lorena-ssi/matrix-lib')
// const maxonrow = require('@lorena-ssi/maxonrow-lib')
// const substrate = require('@lorena-ssi/substrate-lib')

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

    /* let blockchain
    if (info.type === 'substrate') {
      blockchain = substrate.
    } */
    // {method: 'mymethod', id: 'abcdefg', did: 'did:mymethod:abcdefg/some/path#fragment=123', path: '/some/path', fragment: 'fragment=123'}
    const didDoc = {} // ...// lookup doc
    return didDoc
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
