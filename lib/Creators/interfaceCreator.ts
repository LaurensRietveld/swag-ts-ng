import typeParser = require("../Parsers/typeParser");

class interfaceCreator {
    static create(models: IModelDefinition[], moduleName: string): ICodeBlock[] {
        var blocks: ICodeBlock[] = [];

        for (var i = 0; i < models.length; i++) {
            /**
            Main interface
            **/
            var model: IModelDefinition = models[i];
            var body = "";
            var name = "I" + model.name + "Props";
            body += "\texport interface " + name + " {\n";
            // if (model.extends.length > 0) body += ' extends I' + model.extends.join(', ');
            // body +=  " {\n";
            for (var j = 0; j < model.properties.length; j++) {
                var property: IPropertyDefinition = model.properties[j];
                body += "\t\t" + property.name + (property.required? '': '?') + ": " + property.dataType + ";\n";
            }

            body += "\t}\n";



            /**
            Interface including extended Interfaces
            **/
            // var name = "I" + model.name;
            var wrapperIfaceName = "I" + model.name;
            body += "\texport interface " + wrapperIfaceName;
            model.extends.push(name.substring(1));//substring. prepended I is re-added below
            body += ' extends I' + model.extends.join(', I') + ' {}\n';

            var block: ICodeBlock = {
                codeType: CodeBlockType.ModelInterface,
                moduleName: moduleName,
                name: name,
                body: body
            }
            blocks.push(block);

            // propsInterfaceBody += " {\n";
            // blocks.push({
            //   codeType: CodeBlockType.ModelInterface,
            //   moduleName: moduleName,
            //   name: name,
            //   body: body
            // })
        }

        return blocks;
    }
}

export = interfaceCreator;
