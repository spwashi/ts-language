import {ParsingActionOwner, Pattern, PegJsMeta, setComponentName, setPegJsAction} from '../pattern';

/**
 * A set of patterns, one after the other
 */
export class SequencePattern implements Pattern, ParsingActionOwner {
    _pegjs: PegJsMeta = {};
    setAction         = setPegJsAction;
    setComponentName  = setComponentName;
    protected readonly _patterns: Pattern[];

    constructor(patterns: Pattern[]) {
        this._patterns = patterns;
    }

    get patterns(): Pattern[] {
        return this._patterns;
    }

    count(filter = (i: any) => !!i): number {
        return this._patterns.filter(filter).length;
    }
}


