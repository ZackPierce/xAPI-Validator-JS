$(function () {
    var sampleStatementA = '{"id":"12345678-1234-5678-1234-567812345678","actor":{"mbox":"mailto:zachary+pierce@gmail.com"},"verb":{"id":"http://adlnet.gov/expapi/verbs/created","display":{"en-US":"created"}},"object":{"id":"http://ZackPierce.github.com/xAPI-Validator-JS", "objectType":"Activity"}}',
        model;

    function prettifyJsonUnsafe(text) {
        return JSON.stringify(JSON.parse(text), null, 4);
    }

    model = {
        source: ko.observable(prettifyJsonUnsafe(sampleStatementA)).extend({ throttle: 250 }),
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
