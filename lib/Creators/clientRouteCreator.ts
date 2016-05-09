import _                    = require("lodash");
import deleteCreator        = require("./deleteCreator");
import documentationCreator = require("./documentationCreator");
import interfaceCreator     = require("./interfaceCreator");
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
    static getMethodBlock(options: ISwaggerOptions,usd: ISignatureDefinition) {

      //path to name

      // name = name.replace(/[{}]/g, '_');

      var methodBlock = '\t\t\texport module ' + clientRouteCreator.getMethodName(usd.method) + ' {\n';
      var groupedParams = _.groupBy(usd.parameters, function(param) {
        return param.paramType
      })
      //go through all param types
      _.forEach([ParamType.Query, ParamType.Header, ParamType.Path, ParamType.FormData, ParamType.Body], function(paramType) {
        var paramName = clientRouteCreator.getParamTypeAsString(paramType);
        var paramTypeBlock = '\t\t\t\texport interface ' + paramName + ' {';
        if (groupedParams[paramType]) {
          paramTypeBlock += '\n';
          groupedParams[paramType].forEach(function(param) {

            paramTypeBlock += "\t\t\t\t\t" + param.name + (param.required? '':'?') + ": " + param.dataType + ";\n";
          })
        }
        paramTypeBlock += '\t\t\t\t}\n';
        methodBlock += paramTypeBlock;
      })
      var responseIfaces:string[] = []
      _.forEach(usd.responses, function(respClass, respStatus) {
        var respName = 'Response_' + respStatus;
        methodBlock += '\t\t\t\texport interface ' + respName + (respClass? ' extends ' + respClass + ' ' : ' ') + '{}\n'
        responseIfaces.push(respName);
      })
      //add combined response type as well
      methodBlock += '\t\t\t\texport type Response = ' + responseIfaces.join(' | ') + '\n'

      //export middleware that links all info above together
      methodBlock += '\t\t\t\texport module IKoa {\n';
      methodBlock += '\t\t\t\t\texport interface Request extends Koa.Request {\n';
      methodBlock += '\t\t\t\t\t\tquery: query\n';
      methodBlock += '\t\t\t\t\t\tbody: body\n';
      methodBlock += '\t\t\t\t\t}\n';
      methodBlock += '\t\t\t\t\texport interface Context extends Router.IRouterContext {\n';
      // methodBlock += '\t\t\t\t\t\tquery: ' + [options.clientRoutesName, clientRouteCreator.getRouteName(usd.path), clientRouteCreator.getMethodName(usd.method), 'query'].join('.') + ',\n';
      // methodBlock += '\t\t\t\t\t\tbody: ' + [options.clientRoutesName, clientRouteCreator.getRouteName(usd.path), clientRouteCreator.getMethodName(usd.method), 'body'].join('.') + ',\n';
      methodBlock += '\t\t\t\t\t\tquery: query\n';
      methodBlock += '\t\t\t\t\t\tbody: body\n';
      methodBlock += '\t\t\t\t\t}\n';
      methodBlock += '\t\t\t\t}\n';
      methodBlock += '\t\t\t\t\texport interface Middleware {\n';
      methodBlock += '\t\t\t\t\t\t(ctx: IKoa.Context, next?: () => any): Response | void;\n'
      methodBlock += '\t\t\t\t}\n';
      methodBlock += "\t\t\t}\n"
      return methodBlock;
    }
    static getRouteName(path: string) {
      if (path.charAt(0) == '/') path = path.substring(1)
      var routeName = path.split('/').join('_');
      return routeName.replace(/[{}]/g, '_');
    }
    static getMethodName(methodName: string) {
      return (methodName === 'delete'? 'del': methodName)
    }
    static create(options: ISwaggerOptions, signatureDefinitions: ISignatureDefinition[]): ICodeBlock {
        var template: string = "";

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
          signatureText += '\t\texport module ' + routeName + ' {\n'
          var methodInterfaces: {[key: string]: string} = {}
          _.forEach(usds, function(usd) {
            signatureText += clientRouteCreator.getMethodBlock(options,usd)
          })
          signatureText += "\t\t}\n\n"
        })
        template += signatureText;
        var result: ICodeBlock = {
            codeType: CodeBlockType.ClientClass,
            moduleName: options.clientRoutesName,
            name: options.clientClassName,
            body: template
        }

        return result;
    }
}

export = clientRouteCreator;
