import _ = require("lodash");

class typeParser {
    static swagNameToTs(modelMappings: {[swagDefName: string]: string}, swagRef: string, prefix:string) {
      var tsReference:string = null;
      _.forEach(modelMappings, function(val, key) {
        if (swagRef.indexOf(key) === 0) tsReference = prefix + swagRef.substring(key.length);
      })
      return tsReference;
    }
    static parse(options: ISwaggerOptions, property:any,moduleName: string, modelPrefix: string ): string {

      var modelMappings = options.modelMapping;
        if (property.schema) {
            return this.parse(options, property.schema,moduleName, modelPrefix);
        }

        if (property.$ref) {

            if (property.$ref == "Object")
                return "any";


            var prefix: string = modelPrefix || "";
            var res = typeParser.swagNameToTs(modelMappings,property.$ref, prefix)
            moduleName = moduleName + ".";


            return moduleName + res;
        }
        if (!property.type) return null;

        switch (property.type) {
            case "array":
                return 'Array<'+this.parse(options, property.items,moduleName, modelPrefix)+'>';
            case "boolean":
                return "boolean";
            case "integer":
            case "number":
              if (property.enum) {
                return property.enum.join(' | ');
              } else {
                return"number"
              };
            case "string":
                if (property.format === "date-time" || property.format === "date") {
                    return "Date";
                } else if (property.enum) {
                  return property.enum.map(function(enumItem:string){
                      // This will wrap each element of the dates array with quotes
                      return '"' + enumItem + '"';
                  }).join(" | "); // This puts a comma in between every element
                } else {
                  return "string";
                }
            default:
              console.warn("Warning: Unknown data type '" + property.type + "' for property", property);
              return property.type;

        }
    }
}

export = typeParser;
