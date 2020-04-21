const LorenaDidResolver = require('..')
const chai = require('chai')
const expect = chai.expect

describe('blockchain info (type, endpoints) for did', () => {
  it('should get the info on the "and" network', () => {
    const info = LorenaDidResolver.getInfoForDid('did:lor:and:UVRaa2VFOURZVjk0YkVsV1pGZHhhR3RU')
    expect(info).to.not.be.undefined
  })

  it('should get undefined for the "xxx" network', () => {
    const info = LorenaDidResolver.getInfoForDid('did:lor:xxx:UVRaa2VFOURZVjk0YkVsV1pGZHhhR3RU')
    expect(info).be.undefined
  })
})
