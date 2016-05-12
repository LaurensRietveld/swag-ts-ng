import _                = require("lodash");
import parameterParser  = require("../Parsers/parameterParser");
import typeParser       = require("../Parsers/typeParser");

class signatureCreator {
    static create(options: ISwaggerOptions, pathsObject:any, modelPrefix: string, headerPrefix:string): ISignatureDefinition[] {
        var signatureDefinitions: ISignatureDefinition[] = [];
        var modelMappings = options.modelMapping;
        for (var p in pathsObject) {
            // loop through the METHODS of the path
            for (var method in pathsObject[p]) {
                if (method != "options") {
                    var functionName: string = pathsObject[p][method].operationId;
                    var parameters: any[] = pathsObject[p][method].parameters;
                    var responses: any = pathsObject[p][method].responses;
                    var headers: any = pathsObject[p][method].headers;
                    var summary: any = pathsObject[p][method].summary;

                    var signature: string = functionName;
                    var paramDefs: IParamDefinition[] = [];
                    if (parameters && parameters.length > 0) {
                        signature += "(";
                        _.forEach(parameters, (param) => {
                            var paramDef = parameterParser.parse(options, param, "I");
                            paramDefs.push(paramDef);
                            signature += paramDef.text + ", ";
                        });
                        signature = signature.substr(0, signature.length - 2);
                        signature += ")";
                    } else {
                        signature += "()";
                    }
                    var responseTypes: {[status:string]: string} = {};
                    var responseHeaders:{[status:string]: string} = {};
                    var responseFound: boolean = false;
                    for (var r in responses) {
                        var responseType: string = typeParser.parse(options, responses[r], options.modelModuleName, "I");
                        responseTypes[r] = responseType;
                        var headerType: string;
                        if (responses[r].headers) {
                          headerType = typeParser.parse(options, responses[r].headers, options.headerModuleName,"I");
                          responseHeaders[r] = headerType;
                        }

                        if (r == "200") {
                            signature += ": ng.IPromise<" + responseType + ">;"
                            responseFound = true;
                        }
                    }


                    if (!responseFound) {
                        signature += ": ng.IPromise<any>;"
                    }

                    var signatureDefinition: ISignatureDefinition = {
                        methodName: functionName,
                        signature: signature,
                        parameters: paramDefs,
                        path: p,
                        method: method,
                        responses: responseTypes,
                        responseHeaders: responseHeaders
                    };

                    if (summary && summary.length > 0) {
                        signatureDefinition.summary = summary;
                    }

                    signatureDefinitions.push(signatureDefinition);
                }
            }
        }
        return signatureDefinitions;
    }
}

export = signatureCreator;
