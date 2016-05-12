interface ISignatureDefinition {
    method: string;
    signature: string;
    methodName: string;
    parameters: IParamDefinition[];
    path: string;
    summary?: string;
    responses: {[status:string]: any}
    responseHeaders: {[status:string]: any}
    // responseHeaders:
}
