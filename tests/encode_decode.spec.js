/* globals it, describe */
import { assert } from 'chai';
import { configure, decode_signed_value, create_signed_value } from '../index';
import sinon from 'sinon';

const secret = 'MY-SUPER-SECRET-KEY';
const cookieName = 'cookie-name';

configure({
  secret_key: secret,
  user_cookie: cookieName,
});

const timestamp = 1461104071; // const date = new Date('19 Apr 2016 19:14:31');
const encodedValue = 'eyJwaWQiOjMwMTE3LCJ1aWQiOjMwMTE4fQ==|1461104071|e08a24c780b74a7d6722d2e467abd4a8dc38b48b';
const value = { pid: 30117, uid: 30118 };

describe('Basic test for encoding and decoding any value', () => {
  it('should encode any value', () => {
    const clock = sinon.useFakeTimers(timestamp * 1000);
    const signedValue = create_signed_value(value);

    assert.equal(encodedValue, signedValue);

    clock.restore();
  });

  it('should decode to the right value', () => {
    const decodedValue = decode_signed_value(secret, cookieName, encodedValue);

    assert.deepEqual(JSON.parse(decodedValue), value);
  });
});
