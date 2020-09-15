export type PegJsMeta = { action?: string; name?: string };


//
// Interface
export interface ParserRuleComponent {
    _pegjs: PegJsMeta;
    componentName?: string | undefined;
    count?: (filter?: (i: any) => boolean) => number;
}

export interface Pattern extends ParserRuleComponent {
    setComponentName(string: string): this;
}

export type ParsingAction = string;

export interface ParsingActionOwner {
    _pegjs: PegJsMeta;

    setAction(actionString: ParsingAction): this;
}

//
// Recognizers
export function isPegComponent(component: { _pegjs: PegJsMeta }): boolean {
    return !!component._pegjs;
}

export function isPattern(component: Pattern | any) {
    return !!(component as Pattern)?.setComponentName;
}


export function setPegJsAction(this: ParserRuleComponent, actionString: string): any {
    this._pegjs.action = actionString;
    return this;
}

export function setComponentName(this: ParserRuleComponent, actionString: string): any {
    this._pegjs.name = actionString;
    return this;
}

export function getParsingAction(item: ParsingActionOwner): string | undefined { return item._pegjs.action; }

export function getComponentName(item: ParserRuleComponent): string | undefined { return item._pegjs.name; }

