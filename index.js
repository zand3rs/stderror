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

  //-- defaults...
  this.code = 0;
  this.name = "StdError";
  this.message = "Standard Error";

  if (typeof(message) === "object") {
    (message.code) && (this.code = message.code);
    (message.name) && (this.name = message.name);
    (message.message) && (this.message = message.message);
  }
  if (typeof(message) === "string") {
    this.message = message;
  }
}

//------------------------------------------------------------------------------

StdError.prototype = Object.create(Error.prototype);
StdError.prototype.constructor = StdError;

//------------------------------------------------------------------------------

Object.defineProperty(StdError, "_name", { value: StdError.name });

//------------------------------------------------------------------------------

Object.defineProperty(StdError, "extend", {
  value: function(options) {
    var self = this;
    var code, name, message;

    switch (typeof(options)) {
      case "string":
        name = options;
        break;
      case "object":
        code = options.code;
        name = options.name;
        message = options.message;
        break;
    }

    if (typeof(name) !== "string") {
      throw new Error("name is required");
    } else {
      switch (name) {
        case "extend":
        case "define":
        case "_name":
          throw new Error("invalid name");
          break;
      }
    }

    function init(obj, constructor, args) {
      constructor.apply(obj, args);
      (code) && (obj.code = code);
      (name) && (obj.name = name);
      obj.message = message || obj.name;

      return obj;
    }

    //-- constructor
    var child = function() {
      var args = Array.prototype.slice.call(arguments);

      if (! (this instanceof child)) {
        var obj = Object.create(child.prototype);
        return init(obj, child, args);
      }

      init(this, self, args);
    };

    child.prototype = Object.create(self.prototype);
    child.prototype.constructor = child;
    Object.defineProperty(child, "extend", { value: self.extend });
    Object.defineProperty(child, "define", { value: self.define });
    Object.defineProperty(child, "_name", { value: name });

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
