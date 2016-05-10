import _ = require("lodash");

class typeParser {
    static parse(options: ISwaggerOptions, property:any, modelPrefix?: string): string {
        if (property.schema) {
            return this.parse(options, property.schema, modelPrefix);
        }

        if (property.$ref) {

            if (property.$ref == "Object")
                return "any";


            var prefix: string = modelPrefix || "";
            var res = property.$ref.replace("#/definitions/", "");
            res = prefix + res;

            var moduleName: string = "";
            if (options.modelModuleName)
                moduleName = options.modelModuleName + ".";



            return moduleName + res;
        }
        if (property.enum) {
          console.log(property)
        }
        if (!property.type) return null;

        switch (property.type) {
            case "array":
                return 'Array<'+this.parse(options, property.items, modelPrefix)+'>';
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
