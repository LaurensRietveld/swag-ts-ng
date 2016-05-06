declare class clientRouteCreator {
    static getParamTypeAsString(paramType: ParamType): string;
    static getMethodBlock(usd: ISignatureDefinition): string;
    static create(options: ISwaggerOptions, signatureDefinitions: ISignatureDefinition[]): ICodeBlock;
}
export = clientRouteCreator;
