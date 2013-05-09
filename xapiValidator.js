// UMD flavor "commonjsStrictGlobal.js" from https://github.com/umdjs/umd
(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        factory(exports);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], function (exports) {
            factory((root.commonJsStrictGlobal = exports));
        });
    } else {
        // Browser globals
        factory((root.xapiValidator = {}));
    }
} (this, function (exports) {
    var MUST_VIOLATION = "MUST_VIOLATION",
        SHOULD_VIOLATION = "SHOULD_VIOLATION",
        MAY_VIOLATION = "MAY_VIOLATION",
        toString = Object.prototype.toString,
        uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        iso8601DurationRegex = /^P((\d+([\.,]\d+)?Y)?(\d+([\.,]\d+)?M)?(\d+([\.,]\d+)?W)?(\d+([\.,]\d+)?D)?)?(T(\d+([\.,]\d+)?H)?(\d+([\.,]\d+)?M)?(\d+([\.,]\d+)?S)?)?$/,
        iso8601DateTimeRegex,
        mailtoUriRegex = /^mailto:/,
        semVer1p0p0Regex = /^((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z\-]+))?$/,
        base64Regex = /^(?:[A-Za-z0-9\+\/]{4})*(?:[A-Za-z0-9\+\/]{2}==|[A-Za-z0-9\+\/]{3}=|[A-Za-z0-9\+\/]{4})$/,
        iriRegex,
        bcp47Regex,
        isString,
        isObject,
        isArray,
        ifiPropertyNames = ["mbox", "mbox_sha1sum", "openID", "account"],
        cmiInteractionTypes = ["true-false", "choice", "fill-in",
                                "long-fill-in", "matching", "performance",
                                "sequencing", "likert", "numeric",
                                "other"];
    iriRegex = /^[a-z](?:[\-a-z0-9\+\.])*:(?:\/\/(?:(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:])*@)?(?:\[(?:(?:(?:[0-9a-f]{1,4}:){6}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|::(?:[0-9a-f]{1,4}:){5}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:[0-9a-f]{1,4}:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+[\-a-z0-9\._~!\$&'\(\)\*\+,;=:]+)\]|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}|(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=@])*)(?::[0-9]*)?(?:\/(?:(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:@]))*)*|\/(?:(?:(?:(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:@]))+)(?:\/(?:(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:@]))*)*)?|(?:(?:(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:@]))+)(?:\/(?:(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:@]))*)*|(?!(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:@])))(?:\?(?:(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:@])|[\uE000-\uF8FF\uF0000-\uFFFFD|\u100000-\u10FFFD\/\?])*)?(?:\#(?:(?:%[0-9a-f][0-9a-f]|[\-a-z0-9\._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\u4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD!\$&'\(\)\*\+,;=:@])|[\/\?])*)?$/i;

    //                        1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
    iso8601DateTimeRegex = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;

    bcp47Regex = /^(?:(en-GB-oed|i-(?:ami|bnn|default|enochian|hak|klingon|lux|mingo|navajo|pwn|tao|tay|tsu)|sgn-(?:BE-FR|BE-NL|CH-DE))|(art-lojban|cel-gaulish|no-(?:bok|nyn)|zh-(?:guoyu|hakka|min|min-nan|xiang)))$|^(x(?:-[0-9a-z]{1,8})+)$|^(?:((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|[0-9]{3}))?((?:-(?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*)?((?:-[0-9a-wy-z](?:-[a-z0-9]{2,8}){1,})*)?(-x(?:-[0-9a-z]{1,8})+)?)$/i;

    isString = function (obj) {
        return toString.call(obj) == '[object String]';
    };

    isObject = function (obj) {
        return obj === Object(obj);
    };

    isArray = Array.isArray || function (obj) {
        return toString.call(obj) == '[object Array]';
    };

    isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };

    isNumber = function (obj) {
        return toString.call(obj) == '[object Number]';
    };

    function isNonNullMapObject(target) {
        return target !== null && isObject(target) && !isArray(target);
    }

    function isValidLanguageTag(target) {
        // TODO - use more precise 5646 handling, rather than this simplified BCP 47 regex, which combines RFC 5646 and RFC 4647.
        return target !== undefined && target !== null && isString(target) && bcp47Regex.test(target);
    }

    function addPropToTrace(trace, addendum) {
        if (addendum !== null && addendum !== undefined) {
            return trace + "." + addendum;
        } else {
            return trace;
        }
    }

    function addLookupToTrace(trace, key) {
        if (key === null || key === undefined) {
            return trace;
        }
        if (isString(key)) {
            return trace + "[\"" + key + "\"]";
        }
        return trace + "[" + key + "]";
    }

    function traceToString(trace, addendum) {
        return addPropToTrace(trace, addendum);
    }

    function Report(instance, errors, version) {
        this.instance = instance === null || instance === undefined ? null : instance;
        this.errors = errors === null || errors === undefined ? [] : errors;
        this.version = version;
    }

    function ValidationError(trace, message, level) {
        this.trace = trace;
        this.message = message;
        this.level = level;
    }

    function makeV1Report(instance, errors) {
        return new Report(instance, errors, "1.0.0");
    }

    function makeV1SingleErrorReport(instance, error) {
        return makeV1Report(instance, error === null || error == undefined ? [] :
                                      [error]);
    }

    function validateAmbiguousTypeStatement(statement) {
        var statementObject;
        if (statement === undefined) {
            return makeV1SingleErrorReport(null, new ValidationError("statement", "No statement argument provided.", MUST_VIOLATION));
        } else if (statement === null) {
            return makeV1SingleErrorReport(null, new ValidationError("statement", "Null statement argument provided.", MUST_VIOLATION));
        } else if (isString(statement)) {
            try {
                statementObject = JSON.parse(statement);
                if (statementObject === null || !isObject(statementObject) || isArray(statementObject)) {
                    return makeV1SingleErrorReport(statementObject, new ValidationError("statement", "Null or non-object statement value parsed from provided statment JSON.", MUST_VIOLATION));
                }
            } catch (e) {
                return makeV1SingleErrorReport(statementObject, new ValidationError("statement", "Invalid JSON. The statement could not be parsed: " + e.message, MUST_VIOLATION));
            }
            return makeStatementReport(statementObject);
        } else if (isObject(statement) && !isArray(statement)) {
            return makeStatementReport(statement);
        } else {
            return makeV1SingleErrorReport(null, new ValidationError("statement", "Statement argument provided was not a valid object or a valid JSON string.", MUST_VIOLATION));
        };
    }

    function makeStatementReport(statement) {
        var errors = [];
        validateStatement(statement, "statement", errors, false)
        return makeV1Report(statement, errors);
    }

    function validateStatement(statement, trace, errors, isSubStatement) {
        var errors = errors || [],
            trace = trace || "statement",
            statementObjectObjectType;
        if (!isNonNullMapObject(statement)) {
            errors.push(new ValidationError(traceToString(trace), "Statements must be non-null map objects", MUST_VIOLATION));
            return errors;
        }
        if (statement.id === null || statement.id === undefined || !isString(statement.id)) {
            errors.push(new ValidationError(traceToString(trace, "id"), "Ids should be generated by the Activity Provider, and must be generated by the LRS", SHOULD_VIOLATION));
        } else if (!uuidRegex.test(statement.id)) {
            errors.push(new ValidationError(traceToString(trace, "id"), "Id was not a valid UUID", MUST_VIOLATION));
        }

        validateActor(statement.actor, addPropToTrace(trace, "actor"), errors);
        validateVerb(statement.verb, addPropToTrace(trace, "verb"), errors);
        validateObject(statement.object, addPropToTrace(trace, "object"), errors, isSubStatement);
        validateResult(statement.result, addPropToTrace(trace, "result"), errors);

        statementObjectObjectType = statement.object && statement.object.objectType ? statement.object.objectType : "Activity";
        validateContext(statement.context, addPropToTrace(trace, "context"), errors, statementObjectObjectType);
        validatePropertyIsISO8601String(statement, "timestamp", trace, errors);
        validatePropertyIsISO8601String(statement, "stored", trace, errors);

        validateAuthority(statement.authority, addPropToTrace(trace, "authority"), errors);
        validateVersion(statement.version, addPropToTrace(trace, "version"), errors);
        validateAttachments(statement.attachments, addPropToTrace(trace, "attachments"), errors);

        validateAbsenceOfNonWhitelistedProperties(statement,
            ["id", "actor", "verb", "object", "result", "context", "timestamp", "stored", "authority", "version", "attachments"],
            trace, errors);

        return errors;
    }

    function validatePropertyIsString(parent, propertyName, trace, errors, isRequired, violationType) {
        var errors = errors || [],
            propValue = parent[propertyName],
            violationType = violationType || MUST_VIOLATION;
        if (propValue !== undefined) {
            if (propValue === null || !isString(propValue)) {
                errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property, if present, must be a string.", violationType));
            }
        } else if (isRequired) {
            errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property was required to be a string but was absent.", violationType));
        }
        return errors;
    }

    function validatePropertyIsUri(target, propertyName, trace, errors, isRequired) {
        var errors = errors || [],
            propValue = target[propertyName];
        if (propValue !== undefined) {
            if (propValue === null || !isString(propValue)) {
                errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property, if present, must be a URI string.", MUST_VIOLATION));
            } else if (!iriRegex.test(propValue)) {
                errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property, if present, should be a IRI-like absolute URI per RFC 3987.", SHOULD_VIOLATION));
            }
        } else if (isRequired) {
            errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property was required to be a URI string but was absent.", MUST_VIOLATION));
        }
        return errors;
    }

    function validatePropertyIsUrl(target, propertyName, trace, errors, isRequired) {
        // TODO - check whether a formal URL format definition is recommended/enforced for xAPI
        return validatePropertyIsString(target, propertyName, trace, errors, isRequired);
    }

    function validatePropertyIsBoolean(parent, propertyName, trace, errors, isRequired) {
        var errors = errors || [],
            propValue = parent[propertyName];
        if (propValue !== undefined) {
            if (propValue === null || !isBoolean(propValue)) {
                errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property, if present, must be a Boolean.", MUST_VIOLATION));
            }
        } else if (isRequired) {
            errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property was required to be a Boolean but was absent.", MUST_VIOLATION));
        }
        return errors;
    }

    function validatePropertyIsNumber(parent, propertyName, trace, errors, isRequired) {
        var errors = errors || [],
            propValue = parent[propertyName];
        if (propValue !== undefined) {
            if (propValue === null || !isNumber(propValue)) {
                errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property, if present, must be a Number.", MUST_VIOLATION));
            }
        } else if (isRequired) {
            errors.push(new ValidationError(traceToString(trace, propertyName), propertyName + " property was required to be a Number but was absent.", MUST_VIOLATION));
        }
        return errors;
    }

    function validateIFIProperties(target, trace, errors) {
        if (target.mbox != undefined && target.mbox !== null) {
            if (!isString(target.mbox)) {
                errors.push(new ValidationError(traceToString(trace, "mbox"), "mbox property was required to be a mailto URI string but was not a string at all.", MUST_VIOLATION));
            } else if (!mailtoUriRegex.test(target.mbox)) {
                errors.push(new ValidationError(traceToString(trace, "mbox"), "mbox property was required to be a mailto URI string but did not match the mailto format.", MUST_VIOLATION));
            }
        }
        validatePropertyIsString(target, "mbox_sha1sum", trace, errors, false);
        validatePropertyIsUri(target, "openID", trace, errors, false);
        if (target.account != undefined && target.account !== null) {
            var accountTrace = addPropToTrace(trace, "account");
            validatePropertyIsUri(target.account, "homepage", accountTrace, errors, true);
            validatePropertyIsString(target.account, "name", accountTrace, errors, true);
            validateAbsenceOfNonWhitelistedProperties(target.account, ["homepage", "name"], accountTrace, errors);
        }
    }

    function isGroup(actorOrGroup) {
        return (actorOrGroup.member !== null && actorOrGroup.member !== undefined) || actorOrGroup.objectType == "Group";
    }

    function validateActor(actor, trace, errors) {
        var errors = errors || [],
            trace = trace || "actor";
        if (actor === null || actor === undefined) {
            errors.push(new ValidationError(traceToString(trace) + "Actor must be provided.", MUST_VIOLATION));
            return errors;
        }
        if (isGroup(actor)) {
            validateGroup(actor, trace, errors);
        } else {
            validateAgent(actor, trace, errors);
        }
        return errors;
    }

    function validateAgent(agent, trace, errors) {
        var errors = errors || [],
            trace = trace || "agent",
            ifiCount;
        if (!isNonNullMapObject(agent)) {
            errors.push(new ValidationError(traceToString(trace), "Agent must be a non-null map object", MUST_VIOLATION));
            return errors;
        }

        ifiCount = getIFICount(agent);
        if (ifiCount != 1) {
            errors.push(new ValidationError(traceToString(trace), "Exactly one Inverse Functional Identifier property must be specified.", MUST_VIOLATION));
        }
        if (agent.objectType == "Group") {
            errors.push(new ValidationError(traceToString(trace), "Invalid object with characteristics of a Group when an Agent was expected.", MUST_VIOLATION));
        }
        validateIFIProperties(agent, trace, errors);
        validatePropertyIsString(agent, "name", trace, errors, false);

        validateAbsenceOfNonWhitelistedProperties(agent, ["objectType", "name"].concat(ifiPropertyNames), trace, errors);

        return errors;
    }

    function validateGroup(group, trace, errors) {
        var errors = errors || [],
            trace = trace || "group",
            memberTrace = addPropToTrace(trace, "member"),
            ifiCount;
        if (!isNonNullMapObject(group)) {
            errors.push(new ValidationError(traceToString(trace), "Group must be a non-null map object", MUST_VIOLATION));
            return errors;
        }

        ifiCount = getIFICount(group);
        if (ifiCount == 0) {
            if (group.member === null || group.member === undefined) {
                errors.push(new ValidationError(memberTrace, "member property must be provided for Anonymous Groups.", MUST_VIOLATION));
            }
        } else if (ifiCount > 1) {
            errors.push(new ValidationError(traceToString(trace), "Only one Inverse Functional Identifier property must be specified.", MUST_VIOLATION));
        }
        validateIFIProperties(group, trace, errors);
        validatePropertyIsString(group, "name", trace, errors, false);

        if (group.member !== undefined) {
            if (group.member === null || !isArray(group.member)) {
                errors.push(new ValidationError(traceToString(trace, "member"), "If present, the member property of a Group must be an Array", MUST_VIOLATION));
            } else {
                var numMembers = group.member.length;
                for (var i = 0; i < numMembers; i++) {
                    validateAgent(group.member[i], addLookupToTrace(memberTrace, i), errors);
                }
            }
        }

        validateAbsenceOfNonWhitelistedProperties(group, ["objectType", "name", "member"].concat(ifiPropertyNames), trace, errors);

        return errors;
    }

    function getIFICount(target) {
        return getIFIs(target).length;
    }

    function getIFIs(target) {
        var ifis = [];
        if (target === null || target === undefined) {
            return ifis;
        }
        for (var i = 0; i < ifiPropertyNames.length; i++) {
            var propName = ifiPropertyNames[i];
            var propValue = target[propName];
            if (propName in target && propValue !== null) {
                ifis.push({ key: propName, value: propValue });
            }
        }
        return ifis;
    }

    function validateVerb(verb, trace, errors) {
        var errors = errors || [],
            trace = trace || "verb";
        if (verb === undefined) {
            errors.push(new ValidationError(traceToString(trace), "verb property must be provided.", MUST_VIOLATION));
            return errors;
        } else if (!isNonNullMapObject(verb)) {
            errors.push(new ValidationError(traceToString(trace), "verb property value must a non-null map object.", MUST_VIOLATION));
            return errors;
        }
        validatePropertyIsUri(verb, "id", trace, errors, true);
        if (verb.display === undefined) {
            errors.push(new ValidationError(addPropToTrace(trace, "display"), "display property should be provided.", SHOULD_VIOLATION));
        } else {
            validateLanguageMap(verb.display, addPropToTrace(trace, "display"), errors);
        }

        validateAbsenceOfNonWhitelistedProperties(verb, ["id", "display"], trace, errors);

        return errors;
    }

    function validateLanguageMap(languageMap, trace, errors) {
        var errors = errors || [],
            trace = trace || "languageMap";
        if (languageMap === undefined) {
            return errors;
        }
        if (!isNonNullMapObject(languageMap)) {
            errors.push(new ValidationError(addPropToTrace(trace), "Language Maps, when present, must be non-null map objects", MUST_VIOLATION));
            return errors;
        }
        for (var prop in languageMap) {
            if (languageMap.hasOwnProperty(prop)) {

                if (!isValidLanguageTag(prop)) {
                    errors.push(new ValidationError(addPropToTrace(trace, prop), "Language Map key " + prop + "does not conform to RFC 5646.", MUST_VIOLATION));
                }
                var mappedValue = languageMap[prop];
                if (mappedValue === null || mappedValue === undefined || !isString(mappedValue)) {
                    errors.push(new ValidationError(addLookupToTrace(trace, prop), "Language Map value for key " + prop + "should be a String, but was not.", MUST_VIOLATION));
                }
            }
        }
        return errors;
    }

    function validateObject(object, trace, errors, isWithinSubStatement) {
        var errors = errors || [],
            trace = trace || "object",
            objectType;
        if (object === undefined) {
            errors.push(new ValidationError(traceToString(trace), "object property must be provided.", MUST_VIOLATION));
            return errors;
        } else if (!isNonNullMapObject(object)) {
            errors.push(new ValidationError(traceToString(trace), "object property must be a non-null map object.", MUST_VIOLATION));
            return errors;
        }
        validatePropertyIsString(object, "objectType", trace, errors, true, SHOULD_VIOLATION);
        objectType = object.objectType || "Activity";
        if (objectType == "Activity") {
            validateActivity(object, trace, errors);
        } else if (objectType == "Agent") {
            validateAgent(object, trace, errors);
        } else if (objectType == "Group") {
            validateGroup(object, trace, errors);
        } else if (objectType == "StatementRef") {
            validateStatementRef(object, trace, errors);
        } else if (objectType == "SubStatement") {
            if (isWithinSubStatement) {
                errors.push(new ValidationError(traceToString(trace, "objectType"), "A SubStatement must not contain a SubStatement", MUST_VIOLATION));
            }
            validateStatementObject(object, trace, errors, true);
        } else {
            errors.push(new ValidationError(traceToString(trace, "objectType"), "object's objectType did not match a valid option ['Activity', 'Agent', 'Group', 'StatementRef', 'SubStatement']", MUST_VIOLATION));
        }
        return errors;
    }

    function validateActivity(activity, trace, errors) {
        var errors = errors || [],
            trace = trace || "activity",
            correctResponsesPatternTrace = addPropToTrace(trace, "correctResponsesPattern");
        if (!isNonNullMapObject(activity)) {
            errors.push(new ValidationError(traceToString(trace), "Activities must be non-null map objects", MUST_VIOLATION));
            return errors;
        }
        validatePropertyIsUri(activity, "id", trace, errors, true);

        if (activity.definition !== undefined) {
            validateActivityDefintion(activity.definition, addPropToTrace(trace, "definition"), errors);
        }
        validateAbsenceOfNonWhitelistedProperties(activity, ["objectType", "id", "definition", ], trace, errors);
        return errors;
    }

    function validateActivityDefintion(definition, trace, errors) {
        var errors = errors || [],
            trace = trace || "definition",
            correctResponsesPatternTrace = addPropToTrace(trace, "correctResponsesPattern");

        if (!isNonNullMapObject(definition)) {
            errors.push(new ValidationError(addPropToTrace(trace), "definitions, when present, must be map objects", MUST_VIOLATION));
            return errors;
        }

        validateLanguageMap(definition.name, addPropToTrace(trace, "name"), errors);
        validateLanguageMap(definition.description, addPropToTrace(trace, "description"), errors);

        validatePropertyIsUri(definition, "type", trace, errors, false);
        validatePropertyIsUrl(definition, "moreInfo", trace, errors, false);
        validateExtensions(definition.extensions, addPropToTrace(trace, "extensions"), errors);

        if (definition.interactionType !== undefined) {
            if (definition.type != "http://adlnet.gov/expapi/activities/cmi.interaction") {
                errors.push(new ValidationError(traceToString(trace, "type"), "Interaction Activity Definitions should have a type property of \"http://adlnet.gov/expapi/activities/cmi.interaction\" ", SHOULD_VIOLATION));
            }
            if (cmiInteractionTypes.indexOf(definition.interactionType) == -1) {
                errors.push(new ValidationError(traceToString(trace, "interactionType"), "If present, the interactionType value must be a CMI interaction type option.", MUST_VIOLATION));
            }
        }

        if (definition.correctResponsesPattern !== undefined) {
            if (!isArray(definition.correctResponsesPattern)) {
                errors.push(new ValidationError(correctResponsesPatternTrace, "If present, the correctResponsesPattern value must be an Array of strings.", MUST_VIOLATION));
            } else {
                var crpLen = definition.correctResponsesPattern.length;
                for (var i = 0; i < crpLen; i++) {
                    var crpItem = definition.correctResponsesPattern[i];
                    if (crpItem === null || crpItem == undefined || !isString(crpItem)) {
                        errors.push(new ValidationError(addLookupToTrace(correctResponsesPatternTrace, i), "correctResponsesPattern items must be strings.", MUST_VIOLATION));
                    }
                }
            }
        }
        validateInteractionComponentArray(definition.choices, definition.interactionType, ["choice", "sequencing"], addPropToTrace(trace, "choices"), errors);
        validateInteractionComponentArray(definition.scale, definition.interactionType, ["likert"], addPropToTrace(trace, "scale"), errors);
        validateInteractionComponentArray(definition.source, definition.interactionType, ["matching"], addPropToTrace(trace, "source"), errors);
        validateInteractionComponentArray(definition.target, definition.interactionType, ["matching"], addPropToTrace(trace, "target"), errors);
        validateInteractionComponentArray(definition.steps, definition.interactionType, ["performance"], addPropToTrace(trace, "steps"), errors);

        validateAbsenceOfNonWhitelistedProperties(definition,
            ["name", "description", "type", "moreInfo", "extensions", "interactionType", "correctResponsesPattern", "choices", "scale", "source", "target", "steps"],
             trace, errors);
        return errors;
    }

    function validateInteractionComponentArray(components, interactionType, allowedInteractionTypes, trace, errors) {
        var errors = errors || [],
            trace = trace || "interactionComponents",
            isAllowedComponentType = allowedInteractionTypes.indexOf(interactionType) !== -1,
            ids = [],
            interactionComponent,
            perComponentTrace;
        if (isAllowedComponentType && components !== undefined) {
            if (components === null || !isArray(components)) {
                errors.push(new ValidationError(trace, "This interaction component collection property should be an array.", SHOULD_VIOLATION));
            } else {
                for (var i = 0; i < components.length; i++) {
                    interactionComponent = components[i];
                    perComponentTrace = addLookupToTrace(trace, i);
                    if (!isNonNullMapObject(interactionComponent)) {
                        errors.push(new ValidationError(perComponentTrace, "This interaction component collection member must be a non-null map object", MUST_VIOLATION));
                        continue;
                    }
                    validatePropertyIsString(interactionComponent, "id", perComponentTrace, errors, true, MUST_VIOLATION);
                    if (ids.indexOf(interactionComponent.id) != -1) {
                        errors.push(new ValidationError(addPropToTrace(perComponentTrace, "id"), "id properties must be unique within each interaction component array", MUST_VIOLATION));
                    } else {
                        ids.push(interactionComponent.id);
                    }
                    if (interactionComponent.id && /\s/g.test(interactionComponent.id)) {
                        errors.push(new ValidationError(addPropToTrace(perComponentTrace, "id"), "id properties on interaction components should not contain whitespace", SHOULD_VIOLATION));
                    }
                    validateLanguageMap(interactionComponent.description, addPropToTrace(perComponentTrace, "description"), errors);

                    validateAbsenceOfNonWhitelistedProperties(interactionComponent, ["id", "description"], perComponentTrace, errors);
                }
            }
        } else if (interactionType && components) {
            errors.push(new ValidationError(trace, "This interaction component collection property is not associated with the present interactionType of " + interactionType, SHOULD_VIOLATION));
        }
        return errors;
    }

    function validateExtensions(extensions, trace, errors) {
        var errors = errors || [],
            trace = trace || "extensions";
        if (extensions === undefined) {
            return errors;
        }
        if (!isNonNullMapObject(extensions)) {
            errors.push(new ValidationError(trace, "If present, the extensions property must be a non-null map object.", MUST_VIOLATION));
        }
        // TODO - double-check what further enforceable constraints exist on extension object properties
        return errors;
    }

    function validateStatementRef(statementRef, trace, errors) {
        var errors = errors || [],
            trace = trace || "statementRef";
        if (!isNonNullMapObject(statementRef)) {
            errors.push(new ValidationError(traceToString(trace), "StatementRef instances must be non-null map objects.", MUST_VIOLATION));
            return errors;
        }
        if (statementRef.objectType != "StatementRef") {
            errors.push(new ValidationError(addPropToTrace(trace, "objectType"), "objectType property value must be 'StatementRef' for statement reference objects.", MUST_VIOLATION));
        }
        if (!statementRef.id || !uuidRegex.test(statementRef.id)) {
            errors.push(new ValidationError(addPropToTrace(trace, "id"), "id property value must be a valid UUID string for statement reference objects.", MUST_VIOLATION));
        }
        validateAbsenceOfNonWhitelistedProperties(statementRef, ["id", "objectType"], trace, errors);
        return errors;
    }

    function validateSubStatement(subStatement, trace, errors) {
        return validateStatementObject(subStatement, trace, errors, true);
    }

    function validateResult(result, trace, errors) {
        var errors = errors || [],
            trace = trace || "result";
        if (result === undefined) {
            return errors;
        }
        if (!isNonNullMapObject(result)) {
            errors.push(new ValidationError(addPropToTrace(trace), "If present, the result must be a map object", MUST_VIOLATION));
            return errors;
        }
        validateScore(result.score, addPropToTrace(trace, "score"), errors);
        validatePropertyIsBoolean(result, "success", trace, errors, false);
        validatePropertyIsBoolean(result, "completion", trace, errors, false);
        validatePropertyIsString(result, "response", trace, errors, false);
        validateExtensions(result.extensions, addPropToTrace(trace, "extensions"), errors);
        if (result.duration !== undefined && (result.duration === null || !isString(result.duration) || !iso8601DurationRegex.test(result.duration))) {
            errors.push(new ValidationError(addPropToTrace(trace, "duration"), "If present, the duration property value must be an ISO 8601 duration", MUST_VIOLATION));
        }
        validateAbsenceOfNonWhitelistedProperties(result, ["score", "success", "completion", "response", "duration", "extensions"], trace, errors);

        return errors;
    }

    function validateScore(score, trace, errors) {
        var errors = errors || [],
            trace = trace || "score";
        if (score === undefined) {
            return errors;
        }
        validatePropertyIsNumber(score, "scaled", trace, errors, false);
        if (score.scaled !== undefined) {
            if (score.scaled < 0 || score.scaled > 1) {
                errors.push(new ValidationError(addPropToTrace(trace, "scaled"), "If present, the scaled property value must be between 0 and 1", MUST_VIOLATION));
            }
        }
        if (score.min !== undefined) {
            validatePropertyIsNumber(score, "min", trace, errors, false);
            if (score.raw !== undefined && score.raw < score.min) {
                errors.push(new ValidationError(addPropToTrace(trace, "raw"), "If both 'raw' and 'min' are present, the raw property value should be greater than min", MUST_VIOLATION));
            }
            if (score.max !== undefined && score.max < score.min) {
                errors.push(new ValidationError(addPropToTrace(trace, "max"), "If both 'max' and 'min' are present, the max property value should be greater than min", MUST_VIOLATION));
            }
        }
        if (score.max !== undefined) {
            validatePropertyIsNumber(score, "max", trace, errors, false);
            if (score.raw !== undefined && score.raw > score.max) {
                errors.push(new ValidationError(addPropToTrace(trace, "raw"), "If both 'raw' and 'max' are present, the raw property value should be less than max", MUST_VIOLATION));
            }
        }
        validatePropertyIsNumber(score, "raw", trace, errors, false);
        validateAbsenceOfNonWhitelistedProperties(score, ["scaled", "raw", "min", "max"], trace, errors);
        return errors;
    }

    function validateContext(context, trace, errors, statementObjectObjectType) {
        var errors = errors || [],
            trace = trace || "context";
        if (context === undefined) {
            return errors;
        }
        if (!isNonNullMapObject(context)) {
            errors.push(new ValidationError(trace, "If present, the context must be a non-null map object.", MUST_VIOLATION));
            return errors;
        }
        if (context.registration !== undefined && (context.registration === null || !isString(context.registration) || !uuidRegex.test(context.registration))) {
            errors.push(new ValidationError(traceToString(trace, "registration"), "If present, the registration property must be a UUID string.", MUST_VIOLATION));
        }
        if (["Group", "Agent"].indexOf(statementObjectObjectType) != -1) {
            if (context.revision !== undefined) {
                errors.push(new ValidationError(traceToString(trace, "revision"), "The revision property must not be used if the Statement's Object is an Agent or Group.", MUST_VIOLATION));
            }
            if (context.platform !== undefined) {
                errors.push(new ValidationError(traceToString(trace, "platform"), "The platform property must not be used if the Statement's Object is an Agent or Group.", MUST_VIOLATION));
            }
        }

        validatePropertyIsString(context, "revision", trace, errors, false, MUST_VIOLATION);
        validatePropertyIsString(context, "platform", trace, errors, false, MUST_VIOLATION);
        if (context.team !== undefined) {
            validateGroup(context.team, addPropToTrace(trace, "team"), errors);
        }
        if (context.contextActivities !== undefined) {
            validateContextActivities(context.contextActivities, addPropToTrace(trace, "contextActivities"), errors);
        }
        if (context.language !== undefined && !isValidLanguageTag(context.language)) {
            errors.push(new ValidationError(traceToString(trace, "language"), "The language property must be encoded as an RFC 5646 compliant string, but was not.", MUST_VIOLATION));
        }
        if (context.statement !== undefined) {
            validateStatementRef(context.statement, addPropToTrace(trace, "statement"), errors);
        }

        if (context.instructor !== undefined) {
            if (isGroup(context.instructor)) {
                validateGroup(context.instructor, addPropToTrace(trace, "instructor"), errors);
            } else {
                validateAgent(context.instructor, addPropToTrace(trace, "instructor"), errors);
            }
        }
        validateExtensions(context.extensions, addPropToTrace(trace, "extensions"), errors);
        validateAbsenceOfNonWhitelistedProperties(context,
            ["registration", "instructor", "team", "contextActivities", "revision", "platform", "language", "statement", "extensions"],
            trace, errors);
        return errors;
    }

    function validateContextActivities(contextActivities, trace, errors) {
        var errors = errors || [],
            trace = trace || "contextActivities";
        if (contextActivities === undefined) {
            return errors;
        }
        if (!isNonNullMapObject(contextActivities)) {
            errors.push(new ValidationError(traceToString(trace), "The Context Activities instances must be a non-null map object.", MUST_VIOLATION));
            return errors;
        }
        validateContextActivitySubContext(contextActivities.parent, addPropToTrace(trace, "parent"), errors);
        validateContextActivitySubContext(contextActivities.grouping, addPropToTrace(trace, "grouping"), errors);
        validateContextActivitySubContext(contextActivities.category, addPropToTrace(trace, "category"), errors);
        validateContextActivitySubContext(contextActivities.other, addPropToTrace(trace, "other"), errors);

        validateAbsenceOfNonWhitelistedProperties(contextActivities, ["parent", "grouping", "category", "other"], trace, errors);
        return errors;
    }

    function validateContextActivitySubContext(subContext, trace, errors) {
        var errors = errors || [],
            trace = trace || "subContext",
            numActivities;
        if (subContext === undefined) {
            return errors;
        } else if (subContext === null) {
            errors.push(new ValidationError(traceToString(trace), "Context Activities property values must not be null.", MUST_VIOLATION));
        } else if (isArray(subContext)) {
            numActivities = subContext.length;
            for (var i = 0; i < numActivities; i++) {
                validateActivity(subContext[i], addLookupToTrace(trace, i), errors);
            }
        } else if (isObject(subContext)) {
            errors.push(new ValidationError(traceToString(trace), "Context Activities property values should prefer to be an array of Activities rather than a single Activity object.", SHOULD_VIOLATION));
            validateActivity(subContext, trace, errors);
        } else {
            errors.push(new ValidationError(traceToString(trace), "Context Activities property values must be an array of Activity Objects or a single Activity Object.", MUST_VIOLATION));
        }
        return errors;
    }

    function validatePropertyIsISO8601String(parent, propertyName, trace, errors) {
        var errors = errors || [],
            trace = trace || "datetime",
            matched;
        var datetime = parent[propertyName];
        if (datetime === undefined) {
            return errors;
        }
        if (datetime === null || !isString(datetime)) {
            errors.push(new ValidationError(traceToString(trace, propertyName), "This property must be a string value, but was null or another value type.", MUST_VIOLATION));
            return errors;
        }
        matched = iso8601DateTimeRegex.exec(datetime);
        if (matched) {
            if (!(matched[8] || (matched[9] && matched[10]))) {
                errors.push(new ValidationError(traceToString(trace, propertyName), "ISO 8601 date time strings used in the xAPI should include time zone information.", SHOULD_VIOLATION));
            }
        } else {
            errors.push(new ValidationError(traceToString(trace, propertyName), "This property's string value must be conformant to ISO 8601 for Date Times.", MUST_VIOLATION));
        }

        return errors;
    }

    function validateAuthority(authority, trace, errors) {
        var errors = errors || [],
            trace = trace || "authority";
        if (authority === undefined) {
            return errors;
        }
        if (!isNonNullMapObject(authority)) {
            errors.push(new ValidationError(traceToString(trace), "If present, the authority property must be a non-null map object.", MUST_VIOLATION));
            return errors;
        }
        if (isGroup(authority)) {
            validateGroup(authority, trace, errors);
            if (!authority.member || !authority.member.length || authority.member.length != 2) {
                errors.push(new ValidationError(traceToString(trace, "member"), "If used as a Group, the authority property must contain a member property that is an array containing exactly two Agent objects.", MUST_VIOLATION));
            }
        } else {
            validateAgent(authority, trace, errors);
        }
        return errors;
    }

    function validateVersion(version, trace, errors) {
        var errors = errors || [],
            trace = trace || "version";
        if (version === undefined) {
            return errors;
        }
        if (version === null || !isString(version) || !semVer1p0p0Regex.test(version)) {
            errors.push(new ValidationError(traceToString(trace), "version must be a non-null string that complies with Semantic Versioning 1.0.0", MUST_VIOLATION));
        }
        return errors;
    }

    function validateAttachments(attachments, trace, errors) {
        var errors = errors || [],
            trace = trace || "attachments",
            numAttachments;
        if (attachments === undefined) {
            return errors;
        }
        if (attachments === null || !isArray(attachments)) {
            errors.push(new ValidationError(traceToString(trace), "attachments must be a non-null Array.", MUST_VIOLATION));
            return errors;
        }
        numAttachments = attachments.length;
        for (var i = 0; i < numAttachments; i++) {
            validateAttachmentObject(attachments[i], addLookupToTrace(trace, i), errors);
        }
        return errors;
    }

    function validateAttachmentObject(attachment, trace, errors) {
        var errors = errors || [],
            trace = trace || "attachment";
        if (!isNonNullMapObject(attachment)) {
            errors.push(new ValidationError(traceToString(trace), "attachment instances must be non-null map objects.", MUST_VIOLATION));
            return errors;
        }
        if (attachment.display === undefined) {
            errors.push(new ValidationError(traceToString(trace, "display"), "display property must be provided.", MUST_VIOLATION));
        } else {
            validateLanguageMap(attachment.display, addPropToTrace(trace, "display"), errors);
        }
        validateLanguageMap(attachment.description, addPropToTrace(trace, "description"), errors);

        validatePropertyIsUri(attachment, "usageType", trace, errors, true, MUST_VIOLATION);
        validatePropertyIsUri(attachment, "fileUrl", trace, errors, false, MUST_VIOLATION);

        // TODO - more complete validation for Internet Media Type via RFC 2046
        validatePropertyIsString(attachment, "contentType", trace, errors, true, MUST_VIOLATION);
        if (attachment.length === undefined || attachment.length === null || !isNumber(attachment.length) || !(attachment.length % 1 === 0)) {
            errors.push(new ValidationError(traceToString(trace, "length"), "length property must be provided with an integer value", MUST_VIOLATION));
        }

        if (attachment.sha2 === undefined) {
            errors.push(new ValidationError(traceToString(trace, "sha2"), "sha2 property must be provided on attachment objects", MUST_VIOLATION));
        } else if (attachment.sha2 === null || !isString(attachment.sha2) || !base64Regex.test(attachment.sha2)) {
            errors.push(new ValidationError(traceToString(trace, "sha2"), "sha2 property must contain a string with bas64 contents", MUST_VIOLATION));
        }

        validateAbsenceOfNonWhitelistedProperties(attachment, ["usageType", "display", "description", "contentType", "length", "sha2", "fileUrl"], trace, errors);
        return errors;
    }

    function validateAbsenceOfNonWhitelistedProperties(target, allowedProperties, trace, errors) {
        var errors = errors || [],
            trace = trace || "";
        for (var propertyName in target) {
            if (target.hasOwnProperty(propertyName) && allowedProperties.indexOf(propertyName) == -1) {
                errors.push(new ValidationError(addPropToTrace(trace, propertyName), "Unexpected property not permitted", MUST_VIOLATION));
            }
        }
        return errors;
    }

    exports.validateStatement = validateAmbiguousTypeStatement;
}));