import {ParsingActionOwner, Pattern, PegJsMeta, setComponentName, setPegJsAction} from '../pattern';

export class AnyPattern implements Pattern, ParsingActionOwner {
    _pegjs: PegJsMeta = {};
    setAction         = setPegJsAction;
    setComponentName  = setComponentName;

    protected readonly _patterns: Pattern[];

    constructor(options: Pattern[]) {
        this._patterns = options;
    }

    get patterns() {
        return this._patterns;
    }

    count(filter = (i: any) => !!i): number {
        const filtered = this._patterns.filter(filter);
        const length   = filtered.length;
        if (length === 1 && filtered[0]?.count) {
            return filtered[0].count(filter);
        }
        return length;
    }
}

