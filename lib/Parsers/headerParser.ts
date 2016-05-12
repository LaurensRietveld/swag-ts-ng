import typeParser = require("../Parsers/typeParser");
import _          = require('lodash');

class headerParser {
    static parse(options: ISwaggerOptions, swaggerDefinitions: any, moduleName: string): IHeadersDefinition[] {
        // var getArrayType = function(definition:any) {
        //   // var arrayType: string;
        //   if (definition.items) {
        //     // console.log(definition.items)
        //     // process.exit(1)
        //     if (definition.items['$ref']) {
        //       var refName = definition.items['$ref'].replace("#/definitions/", "");
        //       return refName;
        //     } else {
        //       console.error('Model typed as array, but without reference to other model. Not supported atm')
        //     }
        //   }
        //   return null;
        // }
        //
        // var getPropsFromModule = function(definition:any) {
        //
        //   var properties: IPropertyDefinition[] = [];
        //
        //   var getPropsFromList = function(propertiesObject:any, required: string[]) {
        //     var propArray: IPropertyDefinition[] = [];
        //     for (var p in propertiesObject) {
        //         var property: IPropertyDefinition = {
        //             name: p,
        //             dataType: typeParser.parse(options, propertiesObject[p], "I"),
        //             required: (required && required.indexOf(p) >= 0) || propertiesObject[p].required
        //         };
        //
        //         propArray.push(property);
        //     }
        //     return propArray;
        //   }
        //
        //   var extendModels: string[] = []
        //   if (definition.allOf) {
        //     //allof is not actual inheritance. But, to keep this simple, treat it as such in typescript
        //     _.forEach(definition.allOf, function(val:any) {
        //       if (val['$ref']) {
        //         var refName = val['$ref'].replace("#/definitions/", "");
        //         //very simpel circular dependency check
        //         // if (modName != refName) properties = properties.concat(getPropsFromModule(refName));
        //         extendModels.push(refName);
        //       } else if (val['properties']) {
        //         properties = properties.concat(getPropsFromList(val['properties'], val['required']));
        //       }
        //     })
        //   } else {
        //     properties = properties.concat(getPropsFromList(definition.properties, definition.required));
        //   }
        //
        //   return {properties, extendModels};
        // }
        var headers: IHeadersDefinition[] = [];

        // console.log(swaggerDefinitions)
        for (var d in swaggerDefinitions) {
            var name = d;
            // moduleName: string;
            // definitionName: string;
            // name: string;
            // headers: IHeaderDefinition[]
            var definition = swaggerDefinitions[d];
            // console.log(definition)
            var headerDefs:IPropertyDefinition[] = [];
            for (var headerName in definition) {
              var header = definition[headerName];
              headerDefs.push({
                name: headerName,
                dataType: typeParser.parse(options,header, options.modelModuleName, "I"),
                required: (header.required ===undefined? true: header.required)//defaults to true
              });

            }
            // var headers:IHeadersDefinition;
            headers.push({
                moduleName: moduleName,
                definitionName: "#/x-headers/" + name,
                name: name,
                headers: headerDefs
                // properties: properties.properties,
                // extends: properties.extendModels,
                // arrayType: null
          })
        }

        return headers;
    }
}

export = headerParser;
