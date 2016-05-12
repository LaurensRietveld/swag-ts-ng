const enum CodeBlockType { ModelInterface, ModelClass, ClientClass, HeaderInterface }

interface ICodeBlock {
    codeType: CodeBlockType;
    moduleName: string;
    name: string;
    body: string;
}
