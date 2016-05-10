import typeParser = require("../Parsers/typeParser");
import _          = require('lodash');

class modelParser {
    static parse(options: ISwaggerOptions, swaggerDefinitions: any, moduleName: string): IModelDefinition[] {
        var getPropsFromModule = function(modName: string) {
          var definition = swaggerDefinitions[modName];
          var properties: IPropertyDefinition[] = [];

          var getPropsFromList = function(propertiesObject:any, required: string[]) {
            var propArray: IPropertyDefinition[] = [];
            for (var p in propertiesObject) {
                var property: IPropertyDefinition = {
                    name: p,
                    dataType: typeParser.parse(options, propertiesObject[p], "I"),
                    required: (required && required.indexOf(p) >= 0) || propertiesObject[p].required
                };

                propArray.push(property);
            }
            return propArray;
          }

          var extendModels: string[] = []
          if (definition.allOf) {
            //allof is not actual inheritance. But, to keep this simple, treat it as such in typescript
            _.forEach(definition.allOf, function(val:any) {
              if (val['$ref']) {
                var refName = val['$ref'].replace("#/definitions/", "");
                //very simpel circular dependency check
                // if (modName != refName) properties = properties.concat(getPropsFromModule(refName));
                extendModels.push(refName);
              } else if (val['properties']) {
                properties = properties.concat(getPropsFromList(val['properties'], val['required']));
              }
            })
          } else {
            properties = properties.concat(getPropsFromList(definition.properties, definition.required));
          }

          return {properties, extendModels};
        }
        var models: IModelDefinition[] = [];
        for (var d in swaggerDefinitions) {
            var properties = getPropsFromModule(d);
            var name = d;


            var model: IModelDefinition = {
                moduleName: moduleName,
                definitionName: "#/definitions/" + name,
                name: name,
                properties: properties.properties,
                extends: properties.extendModels
            };

            models.push(model);
        }

        return models;
    }
}

export = modelParser;
