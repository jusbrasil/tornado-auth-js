import { describe, it } from 'mocha';
import { expect } from 'chai';

import { configure, create_signed_value, get_current_user } from '../index.js';

describe('get_current_user', () => {
  it('with correct secret key', () => {
    configure({
      secret_key: 'SUPER_SECRET_KEY',
    });
    const signedValue = create_signed_value({ pid: 754 });
    expect(get_current_user(signedValue)).to.deep.equal({ pid: 754 });
  });
  it('with incorrect secret key', () => {
    configure({
      secret_key: 'SUPER_SECRET_KEY',
    });
    const signedValue = create_signed_value({ pid: 754 });
    configure({
      secret_key: 'INCORRECT_SECRET_KEY',
    });
    expect(get_current_user(signedValue)).to.equal(null);
  });
});
