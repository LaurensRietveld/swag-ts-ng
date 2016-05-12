interface ISwaggerOptions {
    swaggerObject: Swagger.ISwagger;
    interfaceDestination?: string;
    classDestination?: string;
    modelModuleName?: string
    headerModuleName?: string
    clientDestination?: string;
    clientModuleName?: string;
    clientRoutesName?: string;
    clientRoutesImport?:string;
    clientClassName?: string;
    singleFile?: boolean;
    interfacesOnly?: boolean;
    modelMapping?: {[definitionString:string]: string}
}
