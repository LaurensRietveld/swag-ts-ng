"use strict";
const _ = require("lodash");
class clientRouteCreator {
    static getRouteBlock(usd) {
        var name = usd.path.split('/').join('_') + '_' + usd.method;
        if (name.charAt(0) == "_")
            name = name.substring(1);
        name = name.replace(/[{}]/g, '_');
        var routeBlock = 'export interface ' + name + '{\n';
        usd.parameters.forEach(function (val) {
            routeBlock += "\t" + val.name + (val.required ? '' : '?') + ": " + val.dataType + ";\n";
        });
        routeBlock += "}\n\n";
        return routeBlock;
    }
    static create(options, signatureDefinitions) {
        var template = "";
        template = "[FUNCTIONS]\n";
        var signatureText = "";
        var uniqSignatures = _.uniq(signatureDefinitions, 'methodName');
        _.forEach(uniqSignatures, (usd) => {
            signatureText += clientRouteCreator.getRouteBlock(usd);
        });
        template = template.replace("[FUNCTIONS]", signatureText);
        var result = {
            codeType: 2,
            moduleName: options.clientModuleName,
            name: options.clientClassName,
            body: template
        };
        return result;
    }
}
module.exports = clientRouteCreator;

//# sourceMappingURL=clientRouteCreator.js.map
