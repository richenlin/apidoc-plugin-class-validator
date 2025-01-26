/**
 * Parser for class
 */
export declare class ApiClassParser {
    protected type: string;
    protected filePath: string;
    protected className: string;
    private ast;
    private typeMap;
    constructor(type: string);
    /**
     * Entrance for apidoc plugin
     * @param elements
     * @param element
     */
    parseElements(elements: any[], element: any): any[];
    /**
     * Get apidoc elements from class ast
     * @param param0
     */
    private transferToNewElement;
    /**
     * Extract file path and class name from element definition
     * @param content element definition
     */
    private extractElementContent;
    private getClassAst;
    private capitalize;
    private isNativeType;
}
//# sourceMappingURL=ApiClassParser.d.ts.map