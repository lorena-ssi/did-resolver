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

  it('should get nothing for a nonexistent DID', async () => {
    // using a invalid DID, empty did doc
    const did = 'did:lor:labdev:TuNaFiShSaNdWiChAnDfRiEsPlEaSe5q'
    const doc = await resolver.resolve(did)
    expect(doc).to.be.empty
  })

  it('should get the complete DID Document for a DID', async () => {
    // using a valid DID, retrieve valid did doc
    const did = 'did:lor:labdev:Wldvd1pqVmZWbEoxYVdaWFdGOW5ja05I'
    const doc = await resolver.resolve(did)
    expect(doc.id).to.eq(did)
    expect(doc.authentication[0].id).to.contain(did)
  })

  it('should get the complete DID Document for a DID on Maxonrow', async () => {
    // using a valid DID, retrieve valid did doc
    const did = 'did:lor:maxtest:WW5SeGFXZHNjRWxLTVVWeU9WUlJaa3A1'
    const doc = await resolver.resolve(did)
    expect(doc.id).to.eq(did)
    expect(doc.authentication[0].id).to.contain(did)
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
})
