interface IModelDefinition {
    moduleName: string;
    definitionName: string;
    name: string;
    properties: IPropertyDefinition[];
    extends: string[];
    arrayType: string
}
