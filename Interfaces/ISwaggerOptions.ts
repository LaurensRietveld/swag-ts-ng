interface ISwaggerOptions {
    swaggerObject: Swagger.ISwagger;
    interfaceDestination?: string;
    classDestination?: string;
    modelModuleName?: string
    clientDestination?: string;
    clientModuleName?: string;
    clientRoutesName?: string;
    clientClassName?: string;
    singleFile?: boolean;
    interfacesOnly?: boolean
}
