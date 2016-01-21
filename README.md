# Tornado Web Authentication in JavaScript


## Usage

```javascript
var auth = require('tornado-auth-js');
auth.configure({
  secret_key: 'YOUR SECRET KEY HERE'
});
var get_current_user = auth.get_current_user;

var app = express();

app.get('/', function(req, res) {
  var user = get_current_user(req.cookies.user);
}
```

### Options

* `max_age_days` - Number of days that the signature is valid. Default is `31`. 
* `user_cookie` - The name of the cookie. Default is `'user'`.
* `secret_key` - The secret key used to decrypt the signed value. Required.
