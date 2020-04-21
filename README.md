# Lorena DID Resolver

[![Build Status](https://travis-ci.com/lorena-ssi/did-resolver.svg?branch=master)](https://travis-ci.com/lorena-ssi/did-resolver)
[![Coverage Status](https://coveralls.io/repos/github/lorena-ssi/did-resolver/badge.svg?branch=master)](https://coveralls.io/github/lorena-ssi/did-resolver?branch=master&service=github)

Resolve DID Documents from DIDs in the Lorena namespace.  This is is a plug-in for [did-resolver](https://www.npmjs.com/package/did-resolver)

## Usage

The Lorena DID resolver exposes a function called `getResolver` which will return an object containing one of these key/value pairs.
```js
import { Resolver } from 'did-resolver'
import LorenaDidResolver from '@lorena-ssi/did-resolver'

//returns an object of { methodName: resolveFunction}
lorResolver = LorenaDidResolver.getResolver()

//If you are using one method you can simply pass the result of getResolver( into the constructor
const resolver = new Resolver(lorResolver)
```

## Resolving a DID document

The resolver presents a simple `resolve()` function that returns a ES6 Promise returning the DID document.

```js
resolver.resolve('did:lor:and:2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqX/some/path#fragment=123').then(doc => console.log)

// You can also use ES7 async/await syntax
const doc = await resolver.resolve('did:lor:and:2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqX/some/path#fragment=123')
```

## License

MIT
