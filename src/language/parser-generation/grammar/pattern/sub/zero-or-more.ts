import {ParsingActionOwner, Pattern, PegJsMeta, setComponentName, setPegJsAction} from '../pattern';

export class ZeroOrMorePattern implements Pattern, ParsingActionOwner {
    _pegjs: PegJsMeta = {};
    setAction         = setPegJsAction;
    setComponentName  = setComponentName;

    readonly #_pattern: Pattern;

    constructor(pattern: Pattern) {
        this.#_pattern = pattern;
    }


    get pattern(): Pattern {
        return this.#_pattern;
    }
}