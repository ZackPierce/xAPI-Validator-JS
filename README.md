# xAPI Validator

A stand-alone Javascript validator for Experience API (xAPI) statements.

The xAPI Validator is configured to work in the browser or on Node.  Both AMD and global-variable usage are supported.

No external libraries or schema files are necessary.

Presently only the 1.0.0 version of the xAPI specification is targeted for validation.

## Usage

The core functionality is exposed via `xapiValidator.validateStatement(statement)`

### Input

The input `statement` may either be JSON string of an xAPI statement or a Javascript object that aligns with the deserialization of a JSON xAPI statement.

#### Using an object
    var report = xapiValidator.validateStatement({
                    "id": "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
                    "actor": {
                        "mbox": "mailto:bob@example.com"
                    },
                    "verb": { 
                        "id": "http://adlnet.gov/expapi/verbs/created",
                        "display" :{"en-US": "created"}
                    },
                    "object": {
                        "id": "http://example.com/activities/someUniqueId",
                        "objectType": "Activity"
                    }
                });

#### Direct JSON
    var report = xapiValidator.validateStatement("{\"id\":\"fd41c918-b88b-4b20-a0a5-a4c32391aaa0\",\"actor\":{\"mbox\":\"mailto:bob@example.com\"},\"verb\":{\"id\":\"http:\/\/adlnet.gov\/expapi\/verbs\/created\",\"display\":{\"en-US\":\"created\"}},\"object\":{\"id\":\"http:\/\/example.com\/activities\/someUniqueId\",\"objectType\":\"Activity\"}}");


### Output

The produced report object contains three key properties: a collection of any `errors` found, the `version` of xAPI validated against, and reference to the statement object `instance` that was evaluated (after JSON parsing, if necessary).

    var report = {
                    version: "1.0.0",
                    errors: [
                        {
                            trace : "statement.id",
                            message : "Id was not a valid UUID",
                            level : "MUST_VIOLATION"
                        },
                        {
                            trace : "statement.object.objectType",
                            message : "objectType property was required to be a string but was absent.",
                            level : "SHOULD_VIOLATION"
                        }
                    ],
                    instance : {
                        "id": "abc123",
                        "actor": {
                            "mbox": "mailto:charles@example.com"
                        },
                        "verb": { 
                            "id": "http://adlnet.gov/expapi/verbs/created",
                            "display" :{"en-US": "created"}
                        },
                        "object": {
                            "id": "http://example.com/activities/someUniqueId",
                        }
                    }
    };

#### Validation Error objects
Each object in the `errors` Array provides a `trace` property, to help track down the precise location of the error in the supplied schema.

    {
        trace: "statement.context.contextActivities.group[2].id",
        message: "id property, if present, must be a URI string.",
        level: "MUST_VIOLATION"
    }
The trace is formatted akin to Javascript object and Array access notation.  It should be possible to copy a trace into a Javascript console or debugger watch field, substitute the initial "statement" with the actual name of the evaluated statement variable, and thus directly see the erroneous value.

The `message` property gives a human-readable explanation of the error.

The `level` property clarifies whether a MUST, SHOULD, or MAY requirement from the xAPI specification has been violated.  The constant string conventions used to convey these levels are `"MUST_VIOLATION"`, `"SHOULD_VIOLATION"`, and `"MAY_VIOLATION"`, in descending degree of severity.

## Tests
Tests for this library are available in the `spec/xapiValidator_spec.js` file, and may be run by opening the `spec/mocha_runner.html` page or via command line tools.

## Contribution
Community feedback, criticism, and collaboration are most welcome.

On the less-technical side, if an error message appears cryptic or unhelpful, please report it as an Issue and it should be addressed.

## License
MIT License (C) 2013 Zachary Pierce, Measured Progress