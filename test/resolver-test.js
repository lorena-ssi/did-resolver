const { Resolver } = require('did-resolver')
const LorenaDidResolver = require('..')
const chai = require('chai')
const expect = chai.expect

describe('did-resolver interface', () => {
  let resolver, lorResolver

  it('should get the lorena resolver', () => {
    lorResolver = LorenaDidResolver.getResolver()
    expect(lorResolver).to.not.be.undefined
  })

  it('should construct the resolver', () => {
    resolver = new Resolver(lorResolver)
    expect(resolver).to.not.be.undefined
    expect(resolver.resolve).to.not.be.undefined
  })

  const badDids = [
    'did:lor:labdev:TuNaFiShSaNdWiChAnDfRiEsPlEaSe5q',
    'did:lor:maxtest:TuNaFiShSaNdWiChAnDfRiEsPlEaSe5q',
    'did:lor:fake:TuNaFiShSaNdWiChAnDfRiEsPlEaSe5q'
  ]

  badDids.forEach((did) => {
    it('should get an empty public key for a nonexistent DID', async () => {
      // using a valid DID, retrieve public key
      const publicKey = await LorenaDidResolver.getPublicKeyForDid(did)
      expect(publicKey).to.be.empty
    })

    it('should get nothing for a nonexistent DID', async () => {
      // using a invalid DID, empty did doc
      const doc = await resolver.resolve(did)
      expect(doc).to.be.null
    })
  })

  const goodDids = [
    // 'did:lor:labdev:ZVdsVWQybHVhM0YxWDFoTFRqWk5jVk5X',
    'did:lor:labtest:WTNaQ2QwMUljVzlmTmxVMWFGWnVZMWx2' //,
    // 'did:lor:maxtest:WW5SeGFXZHNjRWxLTVVWeU9WUlJaa3A1'
  ]

  goodDids.forEach((did) => {
    let publicKey

    it('should get the public key for a DID', async () => {
      // using a valid DID, retrieve public key
      publicKey = await LorenaDidResolver.getPublicKeyForDid(did)
      expect(publicKey).to.not.be.empty
    })

    it('should get the complete DID Document for a DID', async () => {
      // using a valid DID, retrieve public key
      const doc = await resolver.resolve(did)
      expect(doc.id).to.eq(did)
      expect(doc.authentication[0].id).to.contain(did)
      // the public key should be the same as the one in the blockchain
      expect(doc.authentication[0].publicKey).to.eq(publicKey)
    })
  })

  it('should get the fragment for a DID path', async () => {
    const did = 'did:lor:labdev:Wldvd1pqVmZWbEoxYVdaWFdGOW5ja05I/service/0#serviceEndpoint'
    await resolver.resolve(did)
    // console.log(doc)
    // TODO: using a valid DID path, retrieve valid did doc fragment
  })

  it('should get nothing for an unknown DID', async () => {
    const doc = await resolver.resolve('did:lor:xxx:324793842738472')
    expect(doc).to.be.null
  })

  it('should disconnect cached connections for a clean shutdown', () => {
    LorenaDidResolver.disconnectAll()
  })
})
