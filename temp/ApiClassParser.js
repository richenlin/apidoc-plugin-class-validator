"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClassParser = void 0;
const ts_morph_1 = require("ts-morph");
/**
 * Parser for class
 */
class ApiClassParser {
    constructor(type) {
        this.typeMap = {
            'apiSuccessClass': 'apiSuccess',
            'apiParamClass': 'apiBody',
        };
        this.ast = new ts_morph_1.Project();
        this.type = type;
    }
    /**
     * Entrance for apidoc plugin
     * @param elements
     * @param element
     */
    parseElements(elements, element) {
        elements.pop();
        this.extractElementContent(element.content);
        const classAst = this.getClassAst({ filePath: this.filePath, className: this.className });
        if (!classAst) {
            return elements;
        }
        const newElements = this.transferToNewElement({ filePath: this.filePath, classAst, prefix: '' });
        elements.push(...newElements);
    }
    /**
     * Get apidoc elements from class ast
     * @param param0
     */
    transferToNewElement({ filePath, classAst, prefix }) {
        const properties = classAst.getProperties();
        let elements = [];
        for (const property of properties) {
            const name = prefix ? `${prefix}.${property.getName()}` : property.getName();
            const node = property.getJsDocs()[0];
            const comment = node ? node.getComment() : property.getName();
            const description = prefix ? `${prefix} > ${comment}` : comment;
            let type = property.getType().getText();
            let transferType = type;
            if (!this.isNativeType(type)) {
                transferType = transferType.includes('[]') ? 'Object[]' : 'Object';
            }
            const content = `{${this.capitalize(transferType)}} ${name} ${description}`;
            const transferParserType = this.typeMap[this.type];
            elements.push({
                content,
                name: transferParserType.toLowerCase(),
                source: `@${transferParserType} ${content}\n`,
                sourceName: transferParserType
            });
            if (!this.isNativeType(type)) {
                const childAst = this.getClassAst({ filePath, className: type.replace('[]', '') });
                if (childAst) {
                    const childs = this.transferToNewElement({ filePath, classAst: childAst, prefix: name });
                    elements.push(...childs);
                }
            }
        }
        return elements;
    }
    /**
     * Extract file path and class name from element definition
     * @param content element definition
     */
    extractElementContent(content) {
        let startPos = content.indexOf('(');
        let endPos = content.indexOf(')', startPos);
        this.filePath = content.substring(startPos + 1, endPos);
        startPos = content.indexOf('{', endPos);
        endPos = content.indexOf('}', startPos);
        this.className = content.substring(startPos + 1, endPos);
    }
    getClassAst({ filePath, className }) {
        const file = this.ast.addSourceFileAtPath(filePath);
        return file.getClass(className);
    }
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    isNativeType(propType) {
        return ['boolean', 'string', 'number', 'Date', 'any'].includes(propType);
    }
}
exports.ApiClassParser = ApiClassParser;
//# sourceMappingURL=ApiClassParser.js.map