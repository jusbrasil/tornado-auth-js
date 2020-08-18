var crypto = require('crypto');
var utf8 = require('utf8');

let _MAX_AGE_DAYS = 31;
let _USER_COOKIE_NAME = 'user';
let _SECRET_KEY = null;

export const configure = (options = {}) => {
  _MAX_AGE_DAYS = options.max_age_days || _MAX_AGE_DAYS;
  _USER_COOKIE_NAME = options.user_cookie || _USER_COOKIE_NAME;
  _SECRET_KEY = options.secret_key || _SECRET_KEY;
}

const create_signature = (secret, name, parts) => {
  var hmac = crypto.createHmac('sha1', secret);
  hmac.update(name);
  for (var i = 0; i < parts.length; i++) {
    hmac.update(parts[i]);
  }
  return hmac.digest('hex');
}

export let decode_signed_value = (secret, name, value, max_age_days) => {
  max_age_days = max_age_days === null ? _MAX_AGE_DAYS : max_age_days;
  if (value === null) {
    return null;
  }

  var parts = value.split('|');
  if (parts.length != 3) {
    return null;
  }

  var signature = create_signature(secret, name, [parts[0], parts[1]]);
  if (parts[2] != signature) {
    console.warn('Invalid cookie signature', value);
    return null;
  }

  var now = new Date().getTime() / 1000;
  var timestamp = parts[1];
  if (timestamp < now - max_age_days * 86400) {
    console.warn('Expired cookie', value);
    return null;
  }

  if (timestamp > now + 31 * 864000) {
    console.warn('Cookie timestamp in future; possible tampering', value);
    return null;
  }

  if (timestamp[0] == '0') {
    console.warn('Tampered cookie', value);
  }

  return new Buffer(parts[0], 'base64').toString('utf8');
};

export let get_secure_cookie = (cookie_name, value, max_age_days=null) => {
  if (_SECRET_KEY === null) {
    throw new Error("Please, configure the secret key first.");
  }
  return JSON.parse(decode_signed_value(_SECRET_KEY, cookie_name, value, max_age_days));
}

export let get_secure_cookie_from_string = (cookie_name, value, max_age_days=null) => {
  if (_SECRET_KEY === null) {
    throw new Error("Please, configure the secret key first.");
  }
  return decode_signed_value(_SECRET_KEY, cookie_name, value, max_age_days);
}

export let get_current_user = (value, max_age_days=null) => {
  return get_secure_cookie(_USER_COOKIE_NAME, value, max_age_days);
}

function _create_signed_value(secret, name, value) {
  var timestamp = utf8.encode(Math.floor((new Date().getTime() / 1000)).toString());
  var utf8_value = utf8.encode(typeof value === "string" ? value : JSON.stringify(value));
  var value_base64 = new Buffer(utf8_value, 'utf8').toString('base64');
  var signature = create_signature(secret, name, [value_base64, timestamp]);

  return [value_base64, timestamp, signature].join('|');
}

export function create_signed_value(value) {
  return _create_signed_value(_SECRET_KEY, _USER_COOKIE_NAME, value);
}

export function create_signed_cookie(cookie_name, value) {
  return _create_signed_value(_SECRET_KEY, cookie_name, value);
}
