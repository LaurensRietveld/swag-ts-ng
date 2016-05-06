declare class clientRouteCreator {
    static getRouteBlock(usd: ISignatureDefinition): string;
    static create(options: ISwaggerOptions, signatureDefinitions: ISignatureDefinition[]): ICodeBlock;
}
export = clientRouteCreator;
