﻿import fs = require("fs");

class testHelper {
    static getSampleSwaggerObject(): Swagger.ISwagger {
        var swaggerObject: Swagger.ISwagger = JSON.parse('{ "swagger":"2.0", "info":{ "version":"v1", "title":"ContactsAPI" },"host":"localhost:54144", "schemes":["http"], "paths":{ "/api/Contacts/GetById/{id}":{ "get":{ "tags":["Contacts"], "operationId":"Contacts_GetById", "consumes":[], "produces":["application/json", "text/json", "application/xml", "text/xml"], "parameters":[{ "name": "id", "in": "path", "required": true, "type": "integer", "format": "int32" }], "responses":{ "200":{ "description":"OK", "schema":{ "$ref":"#/definitions/Contact" } } },"deprecated":false } },"/api/Contacts/GetByName/{name}":{ "get":{ "tags":["Contacts"], "operationId":"Contacts_GetByName", "consumes":[], "produces":["application/json", "text/json", "application/xml", "text/xml"], "parameters":[{ "name": "name", "in": "path", "required": true, "type": "string" }], "responses":{ "200":{ "description":"OK", "schema":{ "type":"string" } } },"deprecated":false } },"/api/Contacts/GetByNameSurname/{name}/{surname}":{ "get":{ "tags":["Contacts"], "operationId":"Contacts_GetByNameSurname", "consumes":[], "produces":["application/json", "text/json", "application/xml", "text/xml"], "parameters":[{ "name": "name", "in": "path", "required": true, "type": "string" }, { "name": "surname", "in": "path", "required": true, "type": "string" }], "responses":{ "200":{ "description":"OK", "schema":{ "type":"string" } } },"deprecated":false } },"/api/Contacts/GetFook":{ "get":{ "tags":["Contacts"], "operationId":"Contacts_GetFook", "consumes":[], "produces":["application/json", "text/json", "application/xml", "text/xml"], "parameters":[{ "name": "fook", "in": "query", "required": true, "type": "string" }], "responses":{ "200":{ "description":"OK", "schema":{ "type":"string" } } },"deprecated":false } },"/api/Contacts/FindByTags":{ "get":{ "tags":["Contacts"], "operationId":"Contacts_FindByTags", "consumes":[], "produces":["application/json", "text/json", "application/xml", "text/xml"], "parameters":[{ "name": "tags", "in": "query", "required": true, "type": "array", "items": { "type": "integer", "format": "int32", "enum": [0, 1] }, "collectionFormat": "multi" }], "responses":{ "200":{ "description":"OK", "schema":{ "type":"array", "items":{ "$ref":"#/definitions/Contact" } } } },"deprecated":false } },"/api/Contacts/GetAll":{ "get":{ "tags":["Contacts"], "operationId":"Contacts_GetAll", "consumes":[], "produces":["application/json", "text/json", "application/xml", "text/xml"], "responses":{ "200":{ "description":"OK", "schema":{ "type":"array", "items":{ "$ref":"#/definitions/Contact" } } } },"deprecated":false } },"/api/Contacts/Save":{ "post":{ "tags":["Contacts"], "operationId":"Contacts_Save", "consumes":["application/json", "text/json", "application/xml", "text/xml", "application/x-www-form-urlencoded"], "produces":["application/json", "text/json", "application/xml", "text/xml"], "parameters":[{ "name": "contact", "in": "body", "required": true, "schema": { "$ref": "#/definitions/Contact" } }], "responses":{ "200":{ "description":"OK", "schema":{ "$ref":"#/definitions/Contact" } } },"deprecated":false },"options":{ "tags":["Contacts"], "operationId":"Contacts_Save", "consumes":["application/json", "text/json", "application/xml", "text/xml", "application/x-www-form-urlencoded"], "produces":["application/json", "text/json", "application/xml", "text/xml"], "parameters":[{ "name": "contact", "in": "body", "required": true, "schema": { "$ref": "#/definitions/Contact" } }], "responses":{ "200":{ "description":"OK", "schema":{ "$ref":"#/definitions/Contact" } } },"deprecated":false } } },"definitions":{ "Contact":{ "type":"object", "properties":{ "FirstName":{ "type":"string" },"LastName":{ "type":"string" },"Age":{ "format":"int32", "type":"integer" },"Relations":{ "type":"array", "items":{ "$ref":"Contact" } },"Address":{ "$ref":"Address" },"fooks":{ "type":"array", "items":{ "type":"string" } } } },"Address":{ "type":"object", "properties":{ "No":{ "type":"string" },"Type":{ "type":"string" },"PostCode":{ "type":"string" },"State":{ "type":"string" },"Country":{ "type":"string" } } } } }');
        return swaggerObject;
    }
    static getIAddressSample(): string {
        var IAddressSample = fs.readFileSync("./test/samples/IAddress.sample", "utf8");
        return IAddressSample;
    }
    static getIContactSample(): string {
        var IAddressSample = fs.readFileSync("./test/samples/IContact.sample", "utf8");
        return IAddressSample;
    }
}
export = testHelper;