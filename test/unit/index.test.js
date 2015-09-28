require("node-test-helper");

var StdError = require(process.cwd());

describe(TEST_NAME, function() {

  describe("constructor", function() {
    it("should return an error object", function() {
      var err = new StdError();
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(0);
      expect(err.name).to.equal("StdError");
      expect(err.message).to.equal("Standard Error");
    });

    it("should return an error object without using new", function() {
      var err = StdError();
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(0);
      expect(err.name).to.equal("StdError");
      expect(err.message).to.equal("Standard Error");
    });

    it("should return an error object with custom message", function() {
      var err = new StdError("My custom error");
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(0);
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
    it("should allow instantiation of the derived class", function() {
      var DerivedStdError = StdError.extend();
      var err = new DerivedStdError();
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(0);
      expect(err.name).to.equal("StdError");
      expect(err.message).to.equal("StdError");
    });

    it("should allow instantiation of the derived class without using new", function() {
      var DerivedStdError = StdError.extend();
      var err = DerivedStdError();
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(0);
      expect(err.name).to.equal("StdError");
      expect(err.message).to.equal("StdError");
    });

    it("should allow derived class to be extended", function() {
      var DerivedStdError = StdError.extend("DerivedStdError");
      var MyDerivedStdError = DerivedStdError.extend("MyDerivedStdError");
      var err = new MyDerivedStdError();
      expect(err).to.be.instanceof(MyDerivedStdError);
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(0);
      expect(err.name).to.equal("MyDerivedStdError");
      expect(err.message).to.equal("MyDerivedStdError");
    });

    it("accepts string parameter", function() {
      var DerivedStdError = StdError.extend("DerivedStdError");
      var err = new DerivedStdError();
      expect(err).to.be.instanceof(DerivedStdError);
      expect(err).to.be.instanceof(StdError);
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.equal(0);
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
    it("allows definition of custom exception", function() {
      expect(StdError.CustomError).to.not.exist;
      StdError.define("CustomError");
      expect(StdError.CustomError).to.exist;

      var err = StdError.CustomError();
      expect(err.code).to.equal(0);
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

    it("allows definition of custom exception derived from another exception", function() {
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
    });
  });

});
