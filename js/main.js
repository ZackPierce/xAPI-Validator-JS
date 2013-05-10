$(function () {
    var sampleValidStatements = [
            '{"id":"12345678-1234-5678-1234-567812345678","actor":{"mbox":"mailto:zachary+pierce@gmail.com"},"verb":{"id":"http://adlnet.gov/expapi/verbs/created","display":{"en-US":"created"}},"object":{"id":"http://ZackPierce.github.io/xAPI-Validator-JS", "objectType":"Activity"}}',
            '{"id":"12345678-1234-5678-1234-567812345678","actor":{"mbox":"mailto:zachary+pierce@gmail.com"},"verb":{"id":"http://adlnet.gov/expapi/verbs/created","display":{"en-US":"created"}},"object":{"id":"http://ZackPierce.github.io/xAPI-Validator-JS","objectType":"Activity"},"attachments":[{"usageType":"http://example.com/usage/info/A","display":{},"contentType":"text/plain","length":11,"sha2":"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]}'
        ],
        sampleInvalidStatements = [
            '{"id":"54321876-b88b-4b20-a0a5-a4c32391aaa0", "verb":{"id":"http://adlnet.gov/expapi/verbs/created","display":{"en-US":"created"}},"object":{"id":"http://ZackPierce.github.io/xAPI-Validator-JS","objectType":"Activity"},"stored":"totally wrong date"}',
            '{"id":"87654321-b88b-4b20-a0a5-a4c32391aaa0","actor":{"mbox":"mailto:zachary+pierce@gmail.com"},"verb":{"id":"http://adlnet.gov/expapi/verbs/created"},"object":{"id":"http://ZackPierce.github.io/xAPI-Validator-JS","objectType":"Activity"},"authority":{"objectType":"Group","member":[{"objectType":"Agent","mbox":"mailto:bob@example.com"},{"objectType":"Group","mbox":"mailto:group@example.com"}]}}',
            '{"id":"99966633-b88b-4b20-a0a5-a4c32391aaa0","actor":{"objectType":"Group"},"verb":{"id":"http://adlnet.gov/expapi/verbs/created"},"object":{"id":"http://ZackPierce.github.io/xAPI-Validator-JS","objectType":"Activity"},"authority":{"objectType":"Group","member":[{"objectType":"Agent","mbox":"mailto:bob@example.com"},{"objectType":"Group","mbox":"mailto:group@example.com"}]}}',
            '{"actor":{"mbox":"mailto:zachary+pierce@gmail.com"},"verb":{"id":"http://adlnet.gov/expapi/verbs/created","display":{"en-US":"created"}},"object":{"id":"http://ZackPierce.github.io/xAPI-Validator-JS","objectType":"Activity"},"attachments":[{"display":{},"contentType":"text/plain","length":11,"sha2":"uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="}]}',
            '{"id":"22446688-1234-5678-1234-567812345678","actor":{"mbox":"mailto:zachary+pierce@gmail.com"},"verb":{"id":"http://adlnet.gov/expapi/verbs/created"},"attachments":[{"usageType":"http://example.com/usage/info/A","display":{},"contentType":1.23,"length":"654","sha2":null}]}',
            '{"id":"88664422-1234-5678-1234-567812345678","actor":{"mbox":"zachary+pierce@gmail.com"},"verb":{"id":"http://adlnet.gov/expapi/verbs/created","display":{"en-US":"created"}},"object":{"id":"http://ZackPierce.github.io/xAPI-Validator-JS", "objectType":"Activity"}}',
        ],
        model;

    function prettifyJsonUnsafe(text) {
        return JSON.stringify(JSON.parse(text), null, 4);
    }

    model = {
        source: ko.observable(prettifyJsonUnsafe(sampleValidStatements[0])).extend({ throttle: 250 }),
        hasReport: ko.observable(false),
        errors: ko.observableArray([])
    };

    model.report = ko.computed(function () {
        var r, errs;
        r = xapiValidator.validateStatement(model.source());
        model.errors(r.errors);
        return r;
    });

    model.formatJson = function () {
        var statementText = model.source(),
            parsed;
        try {
            parsed = JSON.parse(statementText);
        } catch (e) {
            return false;
        }
        model.source(JSON.stringify(parsed, null, 4));
        return true;
    }

    model.randomInvalidStatement = function() {
        model.source(prettifyJsonUnsafe(sampleInvalidStatements[Math.floor(Math.random()*sampleInvalidStatements.length)]));
    }

    model.gridOptions = { data: model.errors,
        displaySelectionCheckbox: false,
        footerVisible: false,
        showColumnMenu: false,
        columnDefs: [
            {
                field : "level",
                width : 85,
            },
            {
                field : "trace",
                width : 200
            },
            {
                field : "message",
                minWidth : 200
            }
        ]
    };
    ko.applyBindings(model);
});
