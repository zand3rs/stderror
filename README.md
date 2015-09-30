# stderror

WIP: Extendable error class derived from native Error object.


## Installation

```sh
$ npm install stderror
```

## Usage

```javascript
var StandardError = require("stderror");

throw new StandardError();
throw new StandardError("My custom error.");
throw new StandardError({code: 1000, message: "My custom error."});

//-- also works without using new
throw StandardError("My custom error.");

//-- extend
var UnknownError = StandardError.extend("UnknownError");
var SystemError = StandardError.extend({
  code: 2000,
  name: "SystemError",
  message: "System error."
});

var RecordNotFound = StandardError.extend("RecordNotFound");
var UserNotFound = RecordNotFound.extend({
  name: "UserNotFound",
  message: "User not found."
});

//-- define
var Exception = StandardError.extend("Exception");
Exception.define("InvalidArgument");
Exception.define({
  code: 1000,
  name: "InvalidPassword",
  message: "Invalid password.",
  parent: "InvalidArgument"
});

throw new Exception.InvalidArgument();
throw new Exception.InvalidPassword();
```
