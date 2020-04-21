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

  it('should get the complete DID Document for a DID', async () => {
    const doc = await resolver.resolve('did:lor:labtest:324793842738472')
    console.log(doc)
  })

  it('should get the fragment for a DID path', async () => {
    const doc = await resolver.resolve('did:lor:labtest:324793842738472/path/to#fragment=123')
    console.log(doc)
  })

  it('should get nothing for an unknown DID', async () => {
    const doc = await resolver.resolve('did:lor:xxx:324793842738472')
    console.log(doc)
  })
})
