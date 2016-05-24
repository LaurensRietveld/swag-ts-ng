import _                    = require("lodash");
import deleteCreator        = require("./deleteCreator");
import documentationCreator = require("./documentationCreator");
import interfaceCreator     = require("./modelInterfaceCreator");
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
      methodBlock += '\t\t\t\texport module req {\n'
      //go through all request parameters
      _.forEach([ParamType.Query, ParamType.Header, ParamType.Path, ParamType.FormData, ParamType.Body], function(paramType) {
        var paramName = clientRouteCreator.getParamTypeAsString(paramType);
        var modelReferences = <IParamDefinition[]>_.filter(groupedParams[paramType], 'models')

        var paramTypeBlock = '\t\t\t\t\texport interface ' + paramName + ' ';
        if (modelReferences.length) {
          //we are referencing a model, probably a schema defined for a post query or something. Don't do this the regular way for params,
          //but refer to the schema by extending it in typescript
          var extendsClasses = _.flatten(modelReferences.map(function(paramDef) {
            if (paramDef.models) {
              return _.flatten(paramDef.models.map(function(model) {
                if (model.extends) return model.extends.map(function(extendsClass){return model.moduleName + '.I' + extendsClass})
              }))
            }
          }));

          // console.log(model)

          paramTypeBlock += 'extends ' + extendsClasses.join(', ') + ' {'
          // console.log(interfaceCreator.create(model, options.modelModuleName))
        } else {
          paramTypeBlock += '{';
          if (groupedParams[paramType]) {
            paramTypeBlock += '\n';
            groupedParams[paramType].forEach(function(param) {

              paramTypeBlock += "\t\t\t\t\t\t" + param.name + (param.required? '':'?') + ": " + param.dataType + ";\n";
            })
          }
        }
        paramTypeBlock += '\t\t\t\t\t}\n';
        methodBlock += paramTypeBlock;
        // if (groupedParams[paramType].models) {
        //
        // }

      })
      methodBlock += '\t\t\t\t}\n'

      methodBlock += '\t\t\t\texport module res {\n'
      var responseIfaces:string[] = []
      _.forEach(usd.responses, function(respClass, respStatus) {
        var respName = 'Response_' + respStatus;
        methodBlock += '\t\t\t\t\texport interface ' + respName + (respClass? ' extends ' + respClass + ' ' : ' ') + '{}\n'
        responseIfaces.push(respName);
      })
      var headerIfaces:string[] = []
      var headerKeys:string[] = ['((field: any, val: any) => void)']//generic setter. always add this one
      _.forEach(usd.responseHeaders, function(respClass, respStatus) {
        var respName = 'Response_' + respStatus + '_Headers';
        methodBlock += '\t\t\t\t\texport interface ' + respName + (respClass? ' extends ' + respClass + ' ' : ' ') + '{}\n'
        headerIfaces.push(respName);


        var setterName = 'Response_' + respStatus + '_HeaderKeys';
        methodBlock += '\t\t\t\t\texport type ' + setterName + ' = ' + (respClass? respClass + 'Keys' : 'any') + ';\n';
        headerKeys.push(setterName)
      })


      //add combined response types as well
      methodBlock += '\t\t\t\t\texport type body = ' + responseIfaces.join(' | ') + '\n'
      methodBlock += '\t\t\t\t\texport type headers = ' + (headerIfaces.length > 0? headerIfaces.join(' | '): 'void') + '\n'
      methodBlock += '\t\t\t\t\texport type headerSetter = (field: ' + (headerKeys.length > 0? headerKeys.join(' | '): 'any') + ', val: string) => void\n'
      methodBlock += '\t\t\t\t}\n'
      //export middleware that links all info above together
      methodBlock += '\t\t\t\texport module koa {\n';
      methodBlock += '\t\t\t\t\texport interface Request extends Koa.Request {\n';
      methodBlock += '\t\t\t\t\t\tquery: req.query\n';
      methodBlock += '\t\t\t\t\t\tbody: req.body\n';
      methodBlock += '\t\t\t\t\t}\n';
      methodBlock += '\t\t\t\t\texport interface Response extends Koa.Response {\n';
      methodBlock += '\t\t\t\t\t\theaders: res.headers\n';
      methodBlock += '\t\t\t\t\t\tbody: res.body\n';
      methodBlock += '\t\t\t\t\t\tset: res.headerSetter\n';
      methodBlock += '\t\t\t\t\t}\n';
      methodBlock += '\t\t\t\t\texport interface Context extends Koa.Context {\n';
      methodBlock += '\t\t\t\t\t\tquery: req.query\n';
      methodBlock += '\t\t\t\t\t\tbody: res.body\n';
      methodBlock += '\t\t\t\t\t\tset: res.headerSetter\n';
      methodBlock += '\t\t\t\t\t\trequest: Request\n';
      methodBlock += '\t\t\t\t\t\tresponse: Response\n';
      methodBlock += '\t\t\t\t\t}\n';
      methodBlock += '\t\t\t\t}\n';
      methodBlock += '\t\t\t\t\texport interface Middleware {\n';
      methodBlock += '\t\t\t\t\t\t(ctx: koa.Context, next?: () => any): void;\n'
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

        //want to loop through these in the hierarchy: router -> method -> param types (body|query|path)
        var groupedByPath = _.groupBy(signatureDefinitions, function(usd) {
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
