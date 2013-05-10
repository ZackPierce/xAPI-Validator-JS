$(function () {
    var model = {
        source: ko.observable("").extend({ throttle: 250 }),
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
