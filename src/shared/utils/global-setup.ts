import * as crypto from 'crypto';

type NodeCryptoType = typeof crypto;

declare global {
  // eslint-disable-next-line
  var nodeCrypto: NodeCryptoType;
}

globalThis.nodeCrypto = crypto;

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto as unknown as Crypto;
}
