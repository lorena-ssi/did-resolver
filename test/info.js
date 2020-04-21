const LorenaDidResolver = require('..')
const chai = require('chai')
const expect = chai.expect

describe('blockchain info (type, endpoints) for did', () => {
  it('should get the info for the "labdev" network', () => {
    const info = LorenaDidResolver.getInfoForNetwork('labdev')
    expect(info).to.not.be.undefined
    expect(info.type).to.eq('substrate')
    expect(info.blockchainEndpoint).to.contain('labdev')
  })

  it('should get the info for a did on the "and" network', () => {
    const info = LorenaDidResolver.getInfoForDid('did:lor:and:UVRaa2VFOURZVjk0YkVsV1pGZHhhR3RU')
    expect(info).to.not.be.undefined
  })

  it('should get undefined for a did on the "xxx" network', () => {
    const info = LorenaDidResolver.getInfoForDid('did:lor:xxx:UVRaa2VFOURZVjk0YkVsV1pGZHhhR3RU')
    expect(info).be.undefined
  })
})
