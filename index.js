/*
 * StdError
 *
 */

module.exports = StdError;

//==============================================================================
//-- constructor

function StdError(message) {
  if (! (this instanceof StdError)) {
    return new StdError(message);
  }

  Error.captureStackTrace(this, this.constructor);

  this.code = this._defaults.code;
  this.name = this._defaults.name;
  this.message = this._defaults.message;

  switch (typeof(message)) {
    case "string":
      this.message = message;
      break;
    case "object":
      (message.code) && (this.code = message.code);
      (message.name) && (this.name = message.name);
      (message.message) && (this.message = message.message);
      break;
  }
}

//------------------------------------------------------------------------------

StdError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: StdError
  },
  _defaults: {
    value: {
      code: null,
      name: "StdError",
      message: "Standard Error"
    }
  }
});

//------------------------------------------------------------------------------

StdError.prototype.toString = function() {
  var str = this.name;

  if (this.name !== this.message) {
    str += ": " + this.message;
  }

  return str;
};

//------------------------------------------------------------------------------

Object.defineProperty(StdError, "_name", { value: StdError.name });

//------------------------------------------------------------------------------

Object.defineProperty(StdError, "extend", {
  value: function(options) {
    var self = this;
    var defaults = {
      code: null,
      name: "",
      message: ""
    };

    switch (typeof(options)) {
      case "string":
        defaults.name = defaults.message = options;
        break;
      case "object":
        (options.code) && (defaults.code = options.code);
        (options.name) && (defaults.name = options.name);
        defaults.message = options.message || defaults.name;
        break;
    }

    switch (defaults.name) {
      case "extend":
      case "define":
      case "_name":
      case "":
        throw new Error("invalid name");
        break;
    }

    //-- constructor
    var child = function() {
      var args = Array.prototype.slice.call(arguments);

      if (! (this instanceof child)) {
        var obj = Object.create(child.prototype);
        child.apply(obj, args);
        return obj;
      }

      self.apply(this, args);
    };

    child.prototype = Object.create(self.prototype, {
      constructor: { value: child },
      _defaults: { value: defaults }
    });
    Object.defineProperties(child, {
      _name:  { value: defaults.name },
      extend: { value: self.extend },
      define: { value: self.define }
    });

    return child;
  }
});

//------------------------------------------------------------------------------

Object.defineProperty(StdError, "define", {
  value: function(options) {
    var self = this;
    var E = self[(typeof(options) === "object") ? options.parent : ""];
    var error = (E || self).extend(options);

    if (error) {
      Object.defineProperty(self, error._name, { value: error });
    }

    return error;
  }
});

//==============================================================================
