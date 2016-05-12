import typeParser = require("../Parsers/typeParser");

class interfaceCreator {
    static create(headers: IHeadersDefinition[], moduleName: string): ICodeBlock[] {
        var blocks: ICodeBlock[] = [];

        for (var i = 0; i < headers.length; i++) {
            /**
            Main interface
            **/
            var headerDef: IHeadersDefinition = headers[i];
            var body = "";
            var name = "I" + headerDef.name;
            body += "\texport interface " + name;
            // console.log(model)
            // if (header.arrayType) {
            //   body += " extends Array<I" + header.arrayType + "> {}\n"
            // } else {
              body += " {\n";
              for (var j = 0; j < headerDef.headers.length; j++) {
                  var header: IPropertyDefinition = headerDef.headers[j];
                  body += "\t\t" + header.name + (header.required? '': '?') + ": " + header.dataType + ";\n";
              }
              body += "\t}\n";
            // }


            // /**
            // Interface including extended Interfaces
            // **/
            // // var name = "I" + model.name;
            // var wrapperIfaceName = "I" + header.name;
            // body += "\texport interface " + wrapperIfaceName;
            // header.extends.push(name.substring(1));//substring. prepended I is re-added below
            // body += ' extends I' + header.extends.join(', I') + ' {}\n';
            //
            // var block: ICodeBlock = {
            //     codeType: CodeBlockType.ModelInterface,
            //     moduleName: moduleName,
            //     name: name,
            //     body: body
            // }
            // blocks.push(block);

            // propsInterfaceBody += " {\n";
            blocks.push({
              codeType: CodeBlockType.HeaderInterface,
              moduleName: moduleName,
              name: name,
              body: body
            })
        }

        return blocks;
    }
}

export = interfaceCreator;
