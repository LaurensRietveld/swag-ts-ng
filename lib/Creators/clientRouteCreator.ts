import _                    = require("lodash");
import deleteCreator        = require("./deleteCreator");
import documentationCreator = require("./documentationCreator");
import getCreator           = require("./getCreator");
import postCreator          = require("./postCreator");
import putCreator           = require("./putCreator");



class clientRouteCreator {

    static getParamTypeAsString(paramType:ParamType) {
      switch (paramType) {
        case ParamType.Query:
            return 'query';
        case ParamType.Header:
            return 'header';
        case ParamType.Path:
            return 'path';
        case ParamType.FormData:
            return 'formData';
        case ParamType.Body:
            return 'body';
        default:
          throw new Error('undefined parameter enum');
      }
    }
    static getMethodBlock(usd: ISignatureDefinition) {
      //path to name

      // name = name.replace(/[{}]/g, '_');

      var methodBlock = '\texport module ' + (usd.method === 'delete'? 'del': usd.method) + ' {\n';
      var groupedParams = _.groupBy(usd.parameters, function(param) {
        return param.paramType
      })
      //go through all param types. create empty interface if needed
      _.forEach([ParamType.Query, ParamType.Header, ParamType.Path, ParamType.FormData, ParamType.Body], function(paramType) {
        var paramName = clientRouteCreator.getParamTypeAsString(paramType);
        var paramTypeBlock = '\t\texport interface ' + paramName + ' {';
        if (groupedParams[paramType]) {
          paramTypeBlock += '\n';
          groupedParams[paramType].forEach(function(param) {

            paramTypeBlock += "\t\t\t" + param.name + (param.required? '':'?') + ": " + param.dataType + ";\n";
          })
        }
        paramTypeBlock += '\t\t}\n';
        methodBlock += paramTypeBlock;
      })
      _.forEach(usd.responses, function(respClass, respStatus) {
        methodBlock += '\t\texport interface Response_' + respStatus + (respClass? ' extends ' + respClass + ' ' : ' ') + '{}\n'
      })
      methodBlock += "\t}\n"
      return methodBlock;
    }
    static create(options: ISwaggerOptions, signatureDefinitions: ISignatureDefinition[]): ICodeBlock {
        var template: string = "";
        // template += "module " + options.modelModuleName + " {\n";
        template = "[FUNCTIONS]\n";

        var signatureText = "";

        // get a list of unique signatures names
        var uniqSignatures = _.uniq(signatureDefinitions, 'methodName');

        //want to loop through these in the hierarchy: router -> method -> param types (body|query|path)
        var groupedByPath = _.groupBy(uniqSignatures, function(usd) {
          return usd.path
        })
        // loop through unique signatures
        _.forEach(groupedByPath, function(usds, path) {
          var routeName = path.split('/').join('_');
          routeName = routeName.replace(/[{}]/g, '_');
          if (routeName.charAt(0) == "_") routeName = routeName.substring(1);
          signatureText += 'export module ' + routeName + ' {\n'
          _.forEach(usds, function(usd) {
            signatureText += clientRouteCreator.getMethodBlock(usd)
          })
          signatureText += "}\n\n"
        })
        template = template.replace("[FUNCTIONS]", signatureText);

        var result: ICodeBlock = {
            codeType: CodeBlockType.ClientClass,
            moduleName: options.clientModuleName,
            name: options.clientClassName,
            body: template
        }

        return result;
    }
}

export = clientRouteCreator;
