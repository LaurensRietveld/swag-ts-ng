"use strict";
const _ = require("lodash");
class clientRouteCreator {
    static getParamTypeAsString(paramType) {
        switch (paramType) {
            case 0:
                return 'query';
            case 1:
                return 'header';
            case 2:
                return 'path';
            case 3:
                return 'formData';
            case 4:
                return 'body';
            default:
                throw new Error('undefined parameter enum');
        }
    }
    static getMethodBlock(usd) {
        var methodBlock = '\texport module ' + (usd.method === 'delete' ? 'del' : usd.method) + ' {\n';
        var groupedParams = _.groupBy(usd.parameters, function (param) {
            return param.paramType;
        });
        _.forEach([0, 1, 2, 3, 4], function (paramType) {
            var paramName = clientRouteCreator.getParamTypeAsString(paramType);
            var paramTypeBlock = '\t\texport interface ' + paramName + ' {';
            if (groupedParams[paramType]) {
                paramTypeBlock += '\n';
                groupedParams[paramType].forEach(function (param) {
                    paramTypeBlock += "\t\t\t" + param.name + (param.required ? '' : '?') + ": " + param.dataType + ";\n";
                });
            }
            paramTypeBlock += '\t\t}\n';
            methodBlock += paramTypeBlock;
        });
        methodBlock += "\t}\n";
        return methodBlock;
    }
    static create(options, signatureDefinitions) {
        var template = "";
        template = "[FUNCTIONS]\n";
        var signatureText = "";
        var uniqSignatures = _.uniq(signatureDefinitions, 'methodName');
        var groupedByPath = _.groupBy(uniqSignatures, function (usd) {
            return usd.path;
        });
        _.forEach(groupedByPath, function (usds, path) {
            var routeName = path.split('/').join('_');
            routeName = routeName.replace(/[{}]/g, '_');
            if (routeName.charAt(0) == "_")
                routeName = routeName.substring(1);
            signatureText += 'export module ' + routeName + ' {\n';
            _.forEach(usds, function (usd) {
                signatureText += clientRouteCreator.getMethodBlock(usd);
            });
            signatureText += "}\n\n";
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
