var crypto = require('crypto');

function create_signature(secret, name, parts) {
  var hmac = crypto.createHmac('sha1', secret);
  hmac.update(name);
  for (var i = 0; i < parts.length; i++) {
    hmac.update(parts[i]);
  }

  return hmac.digest('hex');
}

export let decode_signed_value = (secret, name, value, max_age_days) => {
  max_age_days = max_age_days === null ? 31 : max_age_days;
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
