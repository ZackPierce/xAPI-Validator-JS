describe("xapiValidator", function() {
  describe("#validateStatement", function() {
  
    function reportHasErrorWithTracePrefix(report, prefix, targetLevel) {
      if (report == null || report == undefined || report.errors == null || report.errors == undefined) {
        return false;
      }
      var hasTargetLevel = targetLevel !== null && targetLevel !== undefined;
      return _.any(report.errors, function(err) {
        var foundPrefix = err.trace.indexOf(prefix) == 0;
        return hasTargetLevel ? targetLevel == err.level && foundPrefix : foundPrefix;
      });
    }
  
    describe("when passed no arguments", function() {
      it("returns non-null report", function() {
        var result = xapiValidator.validateStatement();
        expect(result).to.be.not.null;
        expect(result).to.be.a("Object");
      });
      
      it("includes one error", function() {
        var result = xapiValidator.validateStatement();
        var errors = result.errors;
        expect(errors).to.be.instanceOf(Array);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property("message")
          .that.is.a('string')
          .that.equals('No statement argument provided.');
        expect(errors[0]).to.have.property("level")
          .that.equals("MUST_VIOLATION");
      });
      
      it("has a null instance property in the report", function() {
        expect(xapiValidator.validateStatement())
          .to.have.property("instance")
            .that.is.null;
      });
    });
    
    describe("when passed a null argument", function() {
      it("returns non-null report", function() {
        var result = xapiValidator.validateStatement(null);
        expect(result).to.be.not.null;
        expect(result).to.be.a("Object");
        expect(result).to.have.property("errors")
          .that.is.a("Array");
        expect(result).to.have.property("instance");
      });
      
      it("includes one error", function() {
        var result = xapiValidator.validateStatement(null);
        var errors = result.errors;
        expect(errors).to.be.instanceOf(Array);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property("message")
          .that.is.a('string')
          .that.equals('Null statement argument provided.');
        expect(errors[0]).to.have.property("level")
          .that.equals("MUST_VIOLATION");
      });
      
      it("has a null instance property in the report", function() {
        expect(xapiValidator.validateStatement(null))
          .to.have.property("instance")
            .that.is.null;
      });
    });
    
    describe("when passed a json string argument", function() {
      var minimalJsonString = "{\"id\":\"whatever\"}";
      it("returns non-null report", function() {
        var result = xapiValidator.validateStatement(minimalJsonString);
        expect(result).to.be.not.null;
        expect(result).to.be.a("Object");
        expect(result).to.have.property("errors")
          .that.is.a("Array");
        expect(result).to.have.property("instance");
      });
      
      it("has an instance property with the deserialized JSON in the report", function() {
        var result = xapiValidator.validateStatement(minimalJsonString);
        expect(result).to.have.property("instance")
          .that.is.an("Object")
          .that.deep.equals({"id":"whatever"});
      });
    });
    
    describe("when passed a json string argument encoding null", function() {
      var minimalJsonString = "null";
      it("returns non-null report", function() {
        var result = xapiValidator.validateStatement(minimalJsonString);
        expect(result).to.be.not.null;
        expect(result).to.be.a("Object");
        expect(result).to.have.property("errors")
          .that.is.a("Array");
        expect(result).to.have.property("instance");
      });
      
      it("includes one error", function() {
        var result = xapiValidator.validateStatement(minimalJsonString);
        var errors = result.errors;
        expect(errors).to.be.instanceOf(Array);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property("message");
        expect(errors[0]).to.have.property("level")
          .that.equals("MUST_VIOLATION");
      });
      
      it("has an instance property with null value", function() {
        var result = xapiValidator.validateStatement(minimalJsonString);
        expect(result).to.have.property("instance")
          .that.is.null;
      });
    });
    
    describe("when passed an invalid json string argument", function() {
      var minimalJsonString = "derp";
      it("returns non-null report", function() {
        var result = xapiValidator.validateStatement(minimalJsonString);
        expect(result).to.be.not.null;
        expect(result).to.be.a("Object");
        expect(result).to.have.property("errors")
          .that.is.a("Array");
        expect(result).to.have.property("instance");
      });
      
      it("includes one error", function() {
        var result = xapiValidator.validateStatement(minimalJsonString);
        var errors = result.errors;
        expect(errors).to.be.instanceOf(Array);
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property("message")
          .that.equals("Invalid JSON. The statement could not be parsed: Unexpected token d");
        expect(errors[0]).to.have.property("level")
          .that.equals("MUST_VIOLATION");
      });
      
      it("has an instance property with null value", function() {
        var result = xapiValidator.validateStatement(minimalJsonString);
        expect(result).to.have.property("instance")
          .that.is.null;
      });
    });
    
    describe("when passed a statement object", function() {
      var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {mbox:"mailto:agent@example.com"},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("returns non-null report", function() {
        var result = xapiValidator.validateStatement(inputStatement);
        expect(result).to.be.not.null;
        expect(result).to.be.a("Object");
        expect(result).to.have.property("errors")
          .that.is.a("Array");
        expect(result).to.have.property("instance");
      });
      
      it("has an instance property that matches the input object", function() {
        var result = xapiValidator.validateStatement(inputStatement);
        expect(result).to.have.property("instance")
          .that.deep.equals(inputStatement);
      });
    });
    
    describe("when given a null id property", function() {
      var inputStatement = {id : null ,
          actor : {mbox:"mailto:agent@example.com"},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("has an error about the id property", function() {
        var result = xapiValidator.validateStatement(inputStatement);
        expect(reportHasErrorWithTracePrefix(result, "statement.id")).to.be.true;
      });
    });
    
    describe("when given an invalid UUID id property", function() {
      var inputStatement = {id : "abc123",
          actor : {mbox:"mailto:agent@example.com"},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("has an error about the id property", function() {
        var result = xapiValidator.validateStatement(inputStatement);
        expect(reportHasErrorWithTracePrefix(result, "statement.id")).to.be.true;
      });
    });
    
    describe("when given a valid UUID id property", function() {
      var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
          actor : {mbox:"mailto:agent@example.com"},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("has an error about the id property", function() {
        var result = xapiValidator.validateStatement(inputStatement);
        expect(reportHasErrorWithTracePrefix(result, "statement.id")).to.be.false;
      });
    });
    
    describe("when given a null actor property", function() {
      var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : null,
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("has an error about the actor property", function() {
        var result = xapiValidator.validateStatement(inputStatement);
        expect(reportHasErrorWithTracePrefix(result, "statement.actor")).to.be.true;
      });
    });
    
    describe("when given an empty non-null actor property", function() {
      var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("has an error about the actor property", function() {
        var result = xapiValidator.validateStatement(inputStatement);
        expect(reportHasErrorWithTracePrefix(result, "statement.actor")).to.be.true;
      });
    });
    
    describe("when given an otherwise valid actor", function() {
      var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {mbox:"mailto:group@example.com"},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("the name property is optional", function() {
        var result = xapiValidator.validateStatement(inputStatement);
        expect(result.errors).to.have.property("length", 0);
      });
      
      it("the name property produces no errors when a simple string", function() {
        inputStatement.actor.name = "hello";
        var result = xapiValidator.validateStatement(inputStatement);
        expect(result.errors).to.have.property("length", 0);
      });
      
      it("the name property produces no errors when a simple string", function() {
        inputStatement.actor.name = 1.23;
        var result = xapiValidator.validateStatement(inputStatement);
        expect(reportHasErrorWithTracePrefix(result, "statement.actor.name")).to.be.true;
        expect(result.errors).to.have.property("length", 1);
      });
    });
    
    describe("when given an actor with an objectType of 'Group'", function() {
      var moreValidStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {objectType:"Group", member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("the member property has no errors about it when present", function() {
        var result = xapiValidator.validateStatement(moreValidStatement);
        expect(reportHasErrorWithTracePrefix(result, "statement.actor.member")).to.be.false;
      });
      
      it("the member property is required to be present if the actor is unidentified, and produces an error when absent", function() {
        var inputInvalidStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {objectType:"Group"},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        var result = xapiValidator.validateStatement(inputInvalidStatement);
        expect(reportHasErrorWithTracePrefix(result, "statement.actor.member")).to.be.true;
      });
      
      it("the member property is not required to be present if the actor is identified", function() {
        var result = xapiValidator.validateStatement({id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" , 
          actor : {objectType:"Group", mbox:"mailto:group@example.com"},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}});
        expect(reportHasErrorWithTracePrefix(result, "statement.actor.member")).to.be.false;
      });
      
      it("the member property is allowed to be present if the actor is identified", function() {
        var result = xapiValidator.validateStatement({id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
          actor : {objectType:"Group", mbox:"mailto:group@example.com", member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}});
        expect(reportHasErrorWithTracePrefix(result, "statement.actor.member")).to.be.false;
      });
    });
    
    describe("when given an actor with a members property", function() {
      var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
      it("the member property has no errors about it when present but empty", function() {
        expect(xapiValidator.validateStatement(inputStatement).errors).to.be.empty;
      });
      
      it("the member property has no errors when populated with a simple agent", function() {
        inputStatement.actor.member = [{mbox:"mailto:group@example.com"}];
        expect(xapiValidator.validateStatement(inputStatement).errors).to.be.empty;
      });
      
      it("the member property reports an error when populated with a Group object via objectType", function() {
        inputStatement.actor.member = [{mbox:"mailto:group@example.com", objectType:"Group"}];
        expect(xapiValidator.validateStatement(inputStatement).errors)
          .to.have.property("length", 1);
      });
      
      it("the member property's agent reports an error when given an account missing its homePage", function() {
        inputStatement.actor.member = [{account:{name:"bob"}}];
        expect(reportHasErrorWithTracePrefix(xapiValidator.validateStatement(inputStatement), "statement.actor.member[0].account.homePage")).to.be.true;
      });
      
      it("the member property's agent reports an error when given an account missing its name", function() {
        inputStatement.actor.member = [{account:{homePage:"http://example.com"}}];
        expect(reportHasErrorWithTracePrefix(xapiValidator.validateStatement(inputStatement), "statement.actor.member[0].account.name")).to.be.true;
      });
      
      it("the member property's agent reports an error when given an account with an all-lowercase homepage", function() {
        inputStatement.actor.member = [{account:{homepage:"http://example.com", name:"bob"}}];
        var report = xapiValidator.validateStatement(inputStatement);
        expect(reportHasErrorWithTracePrefix(report, "statement.actor.member[0].account.homepage")).to.be.true;
        expect(report.errors)
          .to.have.property("length", 2);
      });

      it("the member property's agent reports no error when given a full account", function() {
        inputStatement.actor.member = [{account:{homePage:"http://example.com", name: "bob"}}];
        expect(xapiValidator.validateStatement(inputStatement).errors)
          .to.have.property("length", 0);
      });
      
      it("the member property's agent reports no error when given a valid mbox", function() {
        inputStatement.actor.member = [{mbox:"mailto:bob@example.com"}];
        expect(xapiValidator.validateStatement(inputStatement).errors)
          .to.have.property("length", 0);
      });
      
      it("the member property's agent reports an error when given an invalid mbox", function() {
        inputStatement.actor.member = [{mbox:"SOMETHINGWRONG:bob@example.com"}];
        var results = xapiValidator.validateStatement(inputStatement);
        expect(reportHasErrorWithTracePrefix(results, "statement.actor.member[0].mbox")).to.be.true;
        expect(results.errors).to.have.property("length", 1);
      });
      
      it("the member property reports an error when populated with a Group object via member", function() {
        inputStatement.actor.member = [{mbox:"mailto:group@example.com", member:[]}];
        expect(xapiValidator.validateStatement(inputStatement).errors)
          .to.have.property("length", 1);
      });
      
    });
    
    describe("when given a statement without a verb property", function() {
      it("reports an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.verb")).to.be.true;
      });
    });
    
    describe("when given a verb without an id property", function() {
      it("reports an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.verb.id", "MUST_VIOLATION")).to.be.true;
      });
    });
    
    describe("when given a verb with a non-string id property", function() {
      it("reports an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":12.34, "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.verb.id", "MUST_VIOLATION")).to.be.true;
      });
    });
    
    describe("when given a verb with a relative URI id property", function() {
      it("reports an SHOULD_VIOLATION error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"fragment", "display":{"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.verb.id", "SHOULD_VIOLATION")).to.be.true;
      });
    });
    
    describe("when given a verb without a display property", function() {
      it("reports an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created"},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.verb.display", "SHOULD_VIOLATION")).to.be.true;
      });
    });
    
    describe("when given a verb with an empty display property", function() {
      it("reports no errors", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        expect(xapiValidator.validateStatement(inputStatement).errors).to.have.property("length", 0);
      });
    });
    
    describe("when given a verb.display with RFC 5646 key and string value", function() {
      it("reports no errors", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        expect(xapiValidator.validateStatement(inputStatement).errors).to.have.property("length", 0);
      });
    });
    
    describe("when given a verb.display with RFC 5646 key and non-string value", function() {
      it("reports an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US": 1.23}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.verb.display[\"en-US\"]", "MUST_VIOLATION")).to.be.true;
      });
    });
    
    describe("when given a verb.display with invalid key and string value", function() {
      it("reports an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"123totallyWrong":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity"}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.verb.display.123totallyWrong", "MUST_VIOLATION")).to.be.true;
      });
    });
    
    describe("when the object property is absent", function() {
      it("reports a MUST_VIOLATION error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object", "MUST_VIOLATION")).to.be.true;
      });
    });
    
    describe("when the object property is null", function() {
      it("reports a MUST_VIOLATION error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : null};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object", "MUST_VIOLATION")).to.be.true;
      });
    });
    
    describe("when the object lacks an objectType property", function() {
      it("reports a SHOULD_VIOLATION error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId"}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.objectType", "SHOULD_VIOLATION")).to.be.true;
      });
    });

    describe("when the object is an activity with a null definition property", function() {
      it("reports a MUST_VIOLATION error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition: null}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition", "MUST_VIOLATION")).to.be.true;
      });
    });

    describe("when the object is an activity with an array definition property", function() {
      it("reports a MUST_VIOLATION error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition: []}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition", "MUST_VIOLATION")).to.be.true;
      });
    });

    describe("when the object is an Activity with a definition", function() {
      it("an array for the name property produces a must violation error.", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity",
            definition:{name:[]}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.name", "MUST_VIOLATION")).to.be.true;
      });

      it("a number for the name property produces a must violation error.", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{name:1.23}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.name", "MUST_VIOLATION")).to.be.true;
      });

      it("an invalid language Map key for the name property produces a must violation error.", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{name:{"123 totally not a language code" : "created"}}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.name", "MUST_VIOLATION")).to.be.true;
      });

      it("a CMI interactionType value produces no errors", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{type:"http://adlnet.gov/expapi/activities/cmi.interaction", interactionType:"true-false"}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 0);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.name", "MUST_VIOLATION")).to.be.false;
      });

      

      it("a non-CMI interactionType value produces an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{type:"http://adlnet.gov/expapi/activities/cmi.interaction", interactionType:"graphicGapMatchInteraction"}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.interactionType", "MUST_VIOLATION")).to.be.true;
      });

      it("a numeric correctResponsesPattern value produces an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{correctResponsesPattern: 1.23}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.correctResponsesPattern", "MUST_VIOLATION")).to.be.true;
      });

      it("a flat string correctResponsesPattern value produces an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{correctResponsesPattern: "1.23"}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.correctResponsesPattern", "MUST_VIOLATION")).to.be.true;
      });

      it("a nested number in a correctResponsesPattern Array value produces an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{correctResponsesPattern: [1.23]}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.correctResponsesPattern[0]", "MUST_VIOLATION")).to.be.true;
      });

      it("a nested string in a correctResponsesPattern Array value produces no errors", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{correctResponsesPattern: ["1.23"]}}};
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 0);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.correctResponsesPattern", "MUST_VIOLATION")).to.be.false;
      });

      it("an interaction activity without the standard \"http://adlnet.gov/expapi/activities/cmi.interaction\" value for the type property should produce a SHOULD error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{type:"http://example.com/somethingElse", interactionType:"choice", choices:[]}}
        };
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.type", "SHOULD_VIOLATION")).to.be.true;
      });

      it("an interaction component array property not associated with the current interactionType produces an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{type:"http://adlnet.gov/expapi/activities/cmi.interaction", interactionType:"choice", steps:[]}}
        };
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.steps", "SHOULD_VIOLATION")).to.be.true;
      });

      it("an interaction component with whitespace in the id property produces an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{type:"http://adlnet.gov/expapi/activities/cmi.interaction", interactionType:"choice", 
                choices:[{id:"hello invalid id", description:{}}]}}
        };
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.choices[0]", "SHOULD_VIOLATION")).to.be.true;
      });

      it("an interaction component with repeated non-unique id produces an error", function() {
        var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
          actor : {member:[]},
          verb: { "id":"http://adlnet.gov/expapi/verbs/created", display : {"en-US":"created"}},
          object : {id : "http://example.com/myUniqueId", objectType:"Activity", 
            definition:{type:"http://adlnet.gov/expapi/activities/cmi.interaction", interactionType:"choice", 
                choices:[{id:"idA", description:{}}, {id:"idA", description:{}}]}}
        };
        var results = xapiValidator.validateStatement(inputStatement);
        expect(results.errors).to.have.property("length", 1);
        expect(reportHasErrorWithTracePrefix(results, "statement.object.definition.choices[1]", "MUST_VIOLATION")).to.be.true;
      });

      describe("given a statement reference type object", function() {
        it("reports a MUST error when the id property is missing", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {objectType:"StatementRef"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.object.id", "MUST_VIOLATION")).to.be.true;
        });

        it("reports a MUST error when the id property is not a UUID", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id: "not a UUID", objectType:"StatementRef"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.object.id", "MUST_VIOLATION")).to.be.true;
        });
      });
      
      describe("given a substatement type object", function() {
          it("should not report an error when valid", function() {
              var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
                    actor : {mbox:"mailto:agent@example.com"},
                    verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                    object : { objectType:"SubStatement",
                      actor : { mbox:"mailto:agent@example.com"},
                      verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                      object: { id : "http://example.com/myUniqueId", objectType:"Activity"}}};
                var results = xapiValidator.validateStatement(inputStatement);

                expect(results.errors).to.have.property("length", 0);
          });
          
          it("reports a MUST error when the id property is present", function() {
              var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
                  actor : {mbox:"mailto:agent@example.com"},
                  verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                  object : { id: "fd41c918-b88b-4b20-a0a5-a4c32391aaa1",
                    objectType:"SubStatement",
                    actor : { mbox:"mailto:agent@example.com"},
                    verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                    object: { id : "http://example.com/myUniqueId", objectType:"Activity"}}};
              var results = xapiValidator.validateStatement(inputStatement);
              
              expect(results.errors).to.have.property("length", 1);
              expect(reportHasErrorWithTracePrefix(results, "statement.object.id", "MUST_VIOLATION")).to.be.true;
          });
          
          it("reports a MUST error when the version property is present", function() {
              var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
                    actor : {mbox:"mailto:agent@example.com"},
                    verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                    object : { version: "1.0.0",
                      objectType:"SubStatement",
                      actor : { mbox:"mailto:agent@example.com"},
                      verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                      object: { id : "http://example.com/myUniqueId", objectType:"Activity"}}};
                var results = xapiValidator.validateStatement(inputStatement);

                expect(results.errors).to.have.property("length", 1);
                expect(reportHasErrorWithTracePrefix(results, "statement.object.version", "MUST_VIOLATION")).to.be.true;
          });
          
          it("reports a MUST error when the stored property is present", function() {
                var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
                      actor : {mbox:"mailto:agent@example.com"},
                      verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                      object : { stored: "2013-05-28T07:12:57.245Z",
                        objectType:"SubStatement",
                        actor : { mbox:"mailto:agent@example.com"},
                        verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                        object: { id : "http://example.com/myUniqueId", objectType:"Activity"}}};
                  var results = xapiValidator.validateStatement(inputStatement);
                  
                  expect(results.errors).to.have.property("length", 1);
                  expect(reportHasErrorWithTracePrefix(results, "statement.object.stored", "MUST_VIOLATION")).to.be.true;
          });
          
          it("reports a MUST error when the authority property is present", function() {
                var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
                      actor : {mbox:"mailto:agent@example.com"},
                      verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                      object : { authority: { mbox:"mailto:agent@example.com" },
                        objectType:"SubStatement",
                        actor : { mbox:"mailto:agent@example.com"},
                        verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                        object: { id : "http://example.com/myUniqueId", objectType:"Activity"}}};
                  var results = xapiValidator.validateStatement(inputStatement);

                  expect(results.errors).to.have.property("length", 1);
                  expect(reportHasErrorWithTracePrefix(results, "statement.object.authority", "MUST_VIOLATION")).to.be.true;
          });
      });

      describe("given a non-Object results property", function() {
        it("if null, produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : null};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result", "MUST_VIOLATION")).to.be.true;
        });

        it("if an Array, produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : []};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result", "MUST_VIOLATION")).to.be.true;
        });

        it("if an number, produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : 1.23};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result", "MUST_VIOLATION")).to.be.true;
        });
      });

      describe("given a results property that is an object", function() {
        it("if empty, all is okay, no properties were required", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a non-Boolean success property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {success:123}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.success", "MUST_VIOLATION")).to.be.true;
        });

        it("a Boolean success property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {success:false}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a non-Boolean completion property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {completion:123}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.completion", "MUST_VIOLATION")).to.be.true;
        });

        it("a Boolean completion property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {completion:false}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
            
        });

        it("a non-String response property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {response:123}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.response", "MUST_VIOLATION")).to.be.true;
        });

        it("a String response property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {response:"idA"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0); 
        });

        it("a non-String duration property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {duration:123}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.duration", "MUST_VIOLATION")).to.be.true;
        });

        it("a non-ISO 8601 duration String duration property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {duration:"not an ISO compliant duration"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.duration", "MUST_VIOLATION")).to.be.true;
        });

        it("an ISO 8601 duration String response property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {duration:"P3Y6M4DT12H30M5S"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("an ISO 8601 duration String response property with fractional seconds produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {duration:"P3Y6M4DT12H30M5.01S"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });
      });

      describe("given a score property on the results", function() {
        it("a non-Number raw property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{raw:"123"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.raw", "MUST_VIOLATION")).to.be.true;
        });

        it("a Number raw property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{raw:123}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0); 
        });

        it("a Number raw property below min produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{raw:123, min:200}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.raw", "MUST_VIOLATION")).to.be.true;
        });

        it("a Number raw property above max produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{raw:123, max:100}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.raw", "MUST_VIOLATION")).to.be.true;
        });

        it("a Number raw property between min and max produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{raw:123, min:120, max:125}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0); 
        });

        it("a non-Number scaled property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{scaled:"0.5"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.scaled", "MUST_VIOLATION")).to.be.true;
        });

        it("a Number scaled property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{scaled:0.5}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0); 
        });

        it("a Number scaled property below 0 produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{scaled:-0.5}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.scaled", "MUST_VIOLATION")).to.be.true;
        });

        it("a Number scaled property above 1 produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{scaled:2}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.scaled", "MUST_VIOLATION")).to.be.true;
        });

        it("a non-Number max property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{max:"123"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.max", "MUST_VIOLATION")).to.be.true;
        });

        it("a Number max property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{max:123}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0); 
        });

        it("a Number max property below min produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{max:123, min:200}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.max", "MUST_VIOLATION")).to.be.true;
        });

        it("a non-Number min property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{min:"123"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.min", "MUST_VIOLATION")).to.be.true;
        });

        it("a Number min property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{min:123}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0); 
        });

        it("a Number min property above max produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                result : {score:{max:123, min:200}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.result.score.max", "MUST_VIOLATION")).to.be.true;
        });
      });

      describe("for a given defined context property", function() {
        it("an empty object produces no errors", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0); 
        });

        it("an non-object context value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: 123};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context", "MUST_VIOLATION")).to.be.true;
        });

        it("an array context value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: []};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context", "MUST_VIOLATION")).to.be.true;
        });

        it("a non-UUID registration value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {registration:"not a UUID"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.registration", "MUST_VIOLATION")).to.be.true;
        });

        it("a UUID registration value produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {registration:"ed41c918-b88b-4b20-a0a5-a4c32391aaa0"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("an empty map for an instructor value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {instructor:{}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.instructor", "MUST_VIOLATION")).to.be.true;
        });

        it("an unidentified Agent for an instructor value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {instructor:{objectType:"Agent"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.instructor", "MUST_VIOLATION")).to.be.true;
        });

        it("an unidentified Group with no member property for an instructor value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {instructor:{objectType:"Group"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.instructor", "MUST_VIOLATION")).to.be.true;
        });

        it("an Agent instructor value produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {instructor:{mbox:"mailto:bob@example.com"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a Group instructor identified by member property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {instructor:{mbox:"mailto:bob@example.com", member:[]}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a Group instructor identified by objectType property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {instructor:{mbox:"mailto:bob@example.com", objectType:"Group"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("if the statement's object is an Agent, the presence of the revision property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {mbox : "mailto:bob@example.com", objectType:"Agent"},
                context: {revision:"1.0"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.revision", "MUST_VIOLATION")).to.be.true;
        });

        it("if the statement's object is an Group, the presence of the revision property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {mbox : "mailto:group@example.com", objectType:"Group"},
                context: {revision:"1.0"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.revision", "MUST_VIOLATION")).to.be.true;
        });

        it("a String revision property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {revision:"1.0"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a non-String numeric revision property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {revision:1.0}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.revision", "MUST_VIOLATION")).to.be.true;
        });

        it("a null revision property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {revision:null}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.revision", "MUST_VIOLATION")).to.be.true;
        });

        ///
        it("if the statement's object is an Agent, the presence of the platform property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {mbox : "mailto:bob@example.com", objectType:"Agent"},
                context: {platform:"1.0"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.platform", "MUST_VIOLATION")).to.be.true;
        });

        it("if the statement's object is an Group, the presence of the platform property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {mbox : "mailto:group@example.com", objectType:"Group"},
                context: {platform:"1.0"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.platform", "MUST_VIOLATION")).to.be.true;
        });

        it("a String platform property produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {platform:"1.0"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a non-String numeric platform property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {platform:1.0}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.platform", "MUST_VIOLATION")).to.be.true;
        });

        it("a null platform property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {platform:null}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.platform", "MUST_VIOLATION")).to.be.true;
        });

        it("a null team property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {team:null}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.team", "MUST_VIOLATION")).to.be.true;
        });

        it("a Group object team property will result in no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {team:{objectType:"Group", mbox:"mailto:group@example.com"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a RFC 5646 string value for the language property will result in no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {language:"en-US"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a non-RFC 5646 string value for the language property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {language:"123 totally not RFC compliant"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.language", "MUST_VIOLATION")).to.be.true;
        });

        it("a null value for the language property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {language:null}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.language", "MUST_VIOLATION")).to.be.true;
        });

        it("a non-String value for the language property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {language:1}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.language", "MUST_VIOLATION")).to.be.true;
        });


        it("a null value for the context's statement property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {statement:null}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.statement", "MUST_VIOLATION")).to.be.true;
        });

        it("an Array value for the context's statement property will result in an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {statement:[]}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.statement", "MUST_VIOLATION")).to.be.true;
        });

        it("an empty object value for the context's statement property will result in errors", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {statement:{}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 2);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.statement.objectType", "MUST_VIOLATION")).to.be.true;
            expect(reportHasErrorWithTracePrefix(results, "statement.context.statement.id", "MUST_VIOLATION")).to.be.true;
        });

        it("a valid statement reference for the context's statement property will result in no errors", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {statement:{objectType:"StatementRef", id:"abcdc918-b88b-4b20-a0a5-a4c32391aaa0"}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });
      });

      describe("for a context property with a contextActivities property", function() {
        it("a null contextActivities value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {contextActivities:null}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.contextActivities", "MUST_VIOLATION")).to.be.true;
        });

        it("an Array contextActivities value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {contextActivities:[]}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.contextActivities", "MUST_VIOLATION")).to.be.true;
        });

        it("an Numeric contextActivities value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {contextActivities:1.23}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.contextActivities", "MUST_VIOLATION")).to.be.true;
        });

        it("an empty contextActivities object value produces no errors", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {contextActivities:{}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a single Activity parent property value produces a SHOULD warning", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {contextActivities:{parent:{id : "http://example.com/myOtherActivityUniqueId", objectType:"Activity"}}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.contextActivities", "SHOULD_VIOLATION")).to.be.true;
        });

        it("an empty Array parent property value produces no errors", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {contextActivities:{parent:[]}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("an Array with a valid Activity in the parent property produces no errors", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {contextActivities:{parent:[{id : "http://example.com/myOtherActivityUniqueId", objectType:"Activity"}]}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("an Array with a invalid Activity in the parent property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                context: {contextActivities:{parent:[{objectType:"Activity"}]}}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.context.contextActivities.parent[0].id", "MUST_VIOLATION")).to.be.true;
        });
      });

      describe("given a timestamp property on the statement", function() {
        it("a null value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: null};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.timestamp", "MUST_VIOLATION")).to.be.true;
        });

        it("a numeric value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: 1.23};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.timestamp", "MUST_VIOLATION")).to.be.true;
        });

        it("a Date value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: new Date()};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.timestamp", "MUST_VIOLATION")).to.be.true;
        });

        it("a String value not in ISO 8601 produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: "totally wrong"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.timestamp", "MUST_VIOLATION")).to.be.true;
        });

        it("a String value with ISO 8601 at UTC via Z produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: "2013-05-09T14:45:15Z"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 at UTC via Z with millisecond precision produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: "2013-05-09T14:45:15.008Z"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 with a positive timezone offset hour produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: "2013-05-09T14:45:15+01"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 with a positive timezone offset hour and minutes produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: "2013-05-09T14:45:15+01:02"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 with a negative timezone offset hour produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: "2013-05-09T14:45:15-01"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 with a negative timezone offset hour and minutes produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: "2013-05-09T14:45:15-01:02"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO8601 with no timezone offset or Z produces a SHOULD error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                timestamp: "2013-05-09T14:45:15"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.timestamp", "SHOULD_VIOLATION")).to.be.true;
        });
      });

      describe("given a stored property on the statement", function() {
        it("a null value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: null};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.stored", "MUST_VIOLATION")).to.be.true;
        });

        it("a numeric value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: 1.23};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.stored", "MUST_VIOLATION")).to.be.true;
        });

        it("a Date value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: new Date()};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.stored", "MUST_VIOLATION")).to.be.true;
        });

        it("a String value not in ISO 8601 produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: "totally wrong"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.stored", "MUST_VIOLATION")).to.be.true;
        });

        it("a String value with ISO 8601 at UTC via Z produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: "2013-05-09T14:45:15Z"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 at UTC via Z with millisecond precision produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: "2013-05-09T14:45:15.008Z"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 with a positive timezone offset hour produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: "2013-05-09T14:45:15+01"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 with a positive timezone offset hour and minutes produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: "2013-05-09T14:45:15+01:02"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 with a negative timezone offset hour produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: "2013-05-09T14:45:15-01"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO 8601 with a negative timezone offset hour and minutes produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: "2013-05-09T14:45:15-01:02"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a String value with ISO8601 with no timezone offset or Z produces a SHOULD error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                stored: "2013-05-09T14:45:15"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.stored", "SHOULD_VIOLATION")).to.be.true;
        });
      });

      describe("for a non-object authority property on the statement", function() {
        it("a null authority value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: null};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.authority", "MUST_VIOLATION")).to.be.true;
        });

        it("an Array authority value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: []};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.authority", "MUST_VIOLATION")).to.be.true;
        });

        it("an Numeric authority value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: []};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.authority", "MUST_VIOLATION")).to.be.true;
        });
      });

      describe("for an authority property with an object value on the statement", function() {
        it("an Agent authority value produces no errors", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: {objectType:"Agent", mbox:"mailto:bob@example.com"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("an Agent authority value produces an error if an invalid Agent", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: {objectType:"Agent"}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.authority", "MUST_VIOLATION")).to.be.true;
        });

        it("an Group authority value with two members produces no errors", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: {objectType:"Group", member:[{objectType:"Agent", mbox:"mailto:bob@example.com"}, 
                    {objectType:"Agent", mbox:"mailto:tom@example.com"}]}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("an Group authority value with less than two members produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: {objectType:"Group", member:[{objectType:"Agent", mbox:"mailto:bob@example.com"}]}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.authority.member", "MUST_VIOLATION")).to.be.true;
        });

        it("an Group authority value with more than two members produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: {objectType:"Group", member:[{objectType:"Agent", mbox:"mailto:bob@example.com"}, 
                    {objectType:"Agent", mbox:"mailto:tom@example.com"},
                    {objectType:"Agent", mbox:"mailto:frank@example.com"}]}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.authority.member", "MUST_VIOLATION")).to.be.true;
        });

        it("an Group authority value with an invalid member produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                authority: {objectType:"Group", member:[{objectType:"Agent", mbox:"mailto:bob@example.com"}, 
                    {objectType:"Agent"}]}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.authority.member[1]", "MUST_VIOLATION")).to.be.true;
        });
      });

      describe("for an version property on the statement with a non-string value", function() {
        it("a null value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                version: null};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.version", "MUST_VIOLATION")).to.be.true;
        });

        it("a numeric value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                version: 1.0};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.version", "MUST_VIOLATION")).to.be.true;
        });        
      });

      describe("for an version property with a string value", function() {
        it("a simple semantic version produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                version: "1.0.0"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a semantic version with intermixed non-numbers in the major/minor/patch produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                version: "1.0.a"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.version", "MUST_VIOLATION")).to.be.true;
        });

        it("a semantic version with valid pre-release info produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                version: "1.0.0-rc1"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("a semantic version with invalid pre-release info produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                version: "1.0.0-rc.1"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.version", "MUST_VIOLATION")).to.be.true;
        });

        it("a semantic version with SemVer 2.0.0 build release info characters not in SemVer 1.0.0 produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                version: "1.0.0-alpha.1"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.version", "MUST_VIOLATION")).to.be.true;
        });
        
        it("a semantic version with SemVer 2.0.0 build release metadata not in SemVer 1.0.0 produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                version: "1.0.0-alpha+001"};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.version", "MUST_VIOLATION")).to.be.true;
        });    
      });

      describe("for an attachments property on the statement with a non-Array value", function() {
        it("a null value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: null};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments", "MUST_VIOLATION")).to.be.true;
        });

        it("a numeric value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: 1.0};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments", "MUST_VIOLATION")).to.be.true;
        });
        
        it("an object map value produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: {}};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments", "MUST_VIOLATION")).to.be.true;
        });        
      });

      describe("for an attachments property on the statement with an Array value", function() {
        it("an empty Array produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: []};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });        
      });

      describe("for an attachment object within the attachments property's Array on the statement", function() {
        it("a null object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [null]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0]", "MUST_VIOLATION")).to.be.true;
        });

        it("minimal valid attachment object produces no error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", length:11, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 0);
        });

        it("an absent usageType property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{display:{}, contentType:"text/plain", length:11, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].usageType", "MUST_VIOLATION")).to.be.true;
        });

        it("a null usageType property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:null, display:{}, contentType:"text/plain", length:11, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].usageType", "MUST_VIOLATION")).to.be.true;
        });

        it("a numeric usageType property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:123, display:{}, contentType:"text/plain", length:11, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].usageType", "MUST_VIOLATION")).to.be.true;
        });

        it("an object usageType property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:{}, display:{}, contentType:"text/plain", length:11, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].usageType", "MUST_VIOLATION")).to.be.true;
        });

        it("an absent contentType property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, length:11, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].contentType", "MUST_VIOLATION")).to.be.true;
        });

        it("a null contentType property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:null, length:11, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].contentType", "MUST_VIOLATION")).to.be.true;
        });

        it("an absent length property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].length", "MUST_VIOLATION")).to.be.true;
        });

        it("a null length property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", length:null, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].length", "MUST_VIOLATION")).to.be.true;
        });

        it("a string length property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", length:"11", sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].length", "MUST_VIOLATION")).to.be.true;
        });

        it("a non-integer length property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", length:11.5, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].length", "MUST_VIOLATION")).to.be.true;
        });

        it("a null sha2 property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", length:11, sha2:null}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].sha2", "MUST_VIOLATION")).to.be.true;
        });

        it("an absent sha2 property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", length:11}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].sha2", "MUST_VIOLATION")).to.be.true;
        });

        it("a numeric sha2 property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", length:11, sha2:1.23}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].sha2", "MUST_VIOLATION")).to.be.true;
        });

        it("a non-base64 sha2 property object produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, contentType:"text/plain", length:11, sha2:"uses ~ - characters &^% not in base64"}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].sha2", "MUST_VIOLATION")).to.be.true;
        });

        it("a null fileUrl property produces an error", function() {
            var inputStatement = {id : "fd41c918-b88b-4b20-a0a5-a4c32391aaa0" ,
                actor : {mbox:"mailto:agent@example.com"},
                verb: { "id":"http://adlnet.gov/expapi/verbs/created", "display":{"en-US":"created"}},
                object : {id : "http://example.com/myUniqueId", objectType:"Activity"},
                attachments: [{usageType:"http://example.com/usage/info/A", display:{}, fileUrl:null, contentType:"text/plain", length:11, sha2:"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]};
            var results = xapiValidator.validateStatement(inputStatement);
            expect(results.errors).to.have.property("length", 1);
            expect(reportHasErrorWithTracePrefix(results, "statement.attachments[0].fileUrl", "MUST_VIOLATION")).to.be.true;
        });
      });
    });
  });
});