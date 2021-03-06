require("node-test-helper");

describe(TEST_NAME, function() {

  describe("constructor", function() {
    it("should return an error object", function() {
      var err = new StdError();
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.null;
      expect(err.name).to.equal("StdError");
      expect(err.message).to.equal("Standard Error");
    });

    it("should return an error object without using new", function() {
      var err = StdError();
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.null;
      expect(err.name).to.equal("StdError");
      expect(err.message).to.equal("Standard Error");
    });

    it("should return an error object with custom message", function() {
      var err = new StdError("My custom error");
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.null;
      expect(err.name).to.equal("StdError");
      expect(err.message).to.equal("My custom error");
    });

    it("accepts code, name and message options", function() {
      var err = new StdError({code: 1000, name: "MyStdError", message: "My StdError"});
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(1000);
      expect(err.name).to.equal("MyStdError");
      expect(err.message).to.equal("My StdError");
    });
  });

  describe(".extend()", function() {
    it("requires a valid name", function() {
      expect(function() { StdError.extend() }).to.throw(Error, /invalid name/);
      expect(function() { StdError.extend() }).to.throw(Error, /invalid name/);
      expect(function() { StdError.extend("") }).to.throw(Error, /invalid name/);
      expect(function() { StdError.extend("_name") }).to.throw(Error, /invalid name/);
      expect(function() { StdError.extend("define") }).to.throw(Error, /invalid name/);
      expect(function() { StdError.extend("extend") }).to.throw(Error, /invalid name/);
    });

    it("should allow instantiation of the derived class", function() {
      var DerivedStdError = StdError.extend("DerivedStdError");
      var err = new DerivedStdError();
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.null;
      expect(err.name).to.equal("DerivedStdError");
      expect(err.message).to.equal("DerivedStdError");
    });

    it("should allow instantiation of the derived class without using new", function() {
      var DerivedStdError = StdError.extend("DerivedStdError");
      var err = DerivedStdError();
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.null;
      expect(err.name).to.equal("DerivedStdError");
      expect(err.message).to.equal("DerivedStdError");
    });

    it("should return an error object with custom message", function() {
      var DerivedStdError = StdError.extend("DerivedStdError");
      var err = new DerivedStdError("My custom error");
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.null;
      expect(err.name).to.equal("DerivedStdError");
      expect(err.message).to.equal("My custom error");
    });

    it("should allow derived class to be extended", function() {
      var DerivedStdError = StdError.extend("DerivedStdError");
      var MyDerivedStdError = DerivedStdError.extend("MyDerivedStdError");
      var err = new MyDerivedStdError();
      expect(err).to.be.instanceof(MyDerivedStdError);
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.null;
      expect(err.name).to.equal("MyDerivedStdError");
      expect(err.message).to.equal("MyDerivedStdError");
    });

    it("accepts string parameter", function() {
      var DerivedStdError = StdError.extend("DerivedStdError");
      var err = new DerivedStdError();
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.null;
      expect(err.name).to.equal("DerivedStdError");
      expect(err.message).to.equal("DerivedStdError");
    });

    it("accepts object parameter", function() {
      var DerivedStdError = StdError.extend({code: 2000, name: "DerivedStdError", message: "Derived StdError"});
      var err = new DerivedStdError();
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(2000);
      expect(err.name).to.equal("DerivedStdError");
      expect(err.message).to.equal("Derived StdError");
    });
  });

  describe(".define()", function() {
    it("requires a valid name", function() {
      expect(function() { StdError.define() }).to.throw(Error, /invalid name/);
    });

    it("allows definition of custom error", function() {
      expect(StdError.CustomError).to.not.exist;
      StdError.define("CustomError");
      expect(StdError.CustomError).to.exist;

      var err = StdError.CustomError();
      expect(err.code).to.be.null;
      expect(err.name).to.equal("CustomError");
      expect(err.message).to.equal("CustomError");

      expect(StdError.WhateverError).to.not.exist;
      StdError.define({code: 2000, name: "WhateverError", message: "Whatever error"});
      expect(StdError.WhateverError).to.exist;

      var err = new StdError.WhateverError();
      expect(err.code).to.equal(2000);
      expect(err.name).to.equal("WhateverError");
      expect(err.message).to.equal("Whatever error");
    });

    it("allows definition of custom error derived from another error", function() {
      expect(StdError.ParentError).to.not.exist;
      StdError.define("ParentError");
      expect(StdError.ParentError).to.exist;

      expect(StdError.ChildError).to.not.exist;
      StdError.define({name: "ChildError", parent: "ParentError"});
      expect(StdError.ChildError).to.exist;

      var err = new StdError.ChildError();
      expect(err).to.be.instanceof(StdError.ChildError);
      expect(err).to.be.instanceof(StdError.ParentError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);

      var err = new StdError.ChildError();
      var fn = function() { throw err }

      expect(fn).to.throw(StdError.ChildError);
      expect(fn).to.throw(StdError.ParentError);
      expect(fn).to.throw(Error);
    });

    it("allows definition of custom error on the derived error class", function() {
      var DerivedStdError = StdError.extend("DerivedStdError");
      var err = new DerivedStdError();

      expect(DerivedStdError.CustomError).to.not.exist;
      DerivedStdError.define("CustomError");
      expect(DerivedStdError.CustomError).to.exist;

      var err = DerivedStdError.CustomError();
      expect(err.code).to.be.null;
      expect(err.name).to.equal("CustomError");
      expect(err.message).to.equal("CustomError");

      expect(DerivedStdError.WhateverError).to.not.exist;
      DerivedStdError.define({code: 2000, name: "WhateverError", message: "Whatever error"});
      expect(DerivedStdError.WhateverError).to.exist;

      var err = new DerivedStdError.WhateverError();
      expect(err.code).to.equal(2000);
      expect(err.name).to.equal("WhateverError");
      expect(err.message).to.equal("Whatever error");
    });
  });

  describe("#toString()", function() {
    it("should return the error string", function() {
      var err = new StdError();
      expect(err.toString()).to.equal("StdError: Standard Error");

      var err = StdError();
      expect(err.toString()).to.equal("StdError: Standard Error");

      var err = StdError("My standard error");
      expect(err.toString()).to.equal("StdError: My standard error");

      var DerivedStdError = StdError.extend("DerivedStdError");

      var err = DerivedStdError();
      expect(err.toString()).to.equal("DerivedStdError");

      var err = new DerivedStdError();
      expect(err.toString()).to.equal("DerivedStdError");

      var err = new DerivedStdError("My custom error");
      expect(err.toString()).to.equal("DerivedStdError: My custom error");
    });
  });

  describe("error message", function() {
    it("should return the error string", function() {
      var err = new StdError();
      expect(err.message).to.equal("Standard Error");

      var err = StdError();
      expect(err.message).to.equal("Standard Error");

      var err = StdError("My standard error");
      expect(err.message).to.equal("My standard error");

      var DerivedStdError = StdError.extend("DerivedStdError");

      var err = DerivedStdError();
      expect(err.message).to.equal("DerivedStdError");

      var err = new DerivedStdError();
      expect(err.message).to.equal("DerivedStdError");

      var err = new DerivedStdError("My custom error");
      expect(err.message).to.equal("My custom error");
    });
  });

});
