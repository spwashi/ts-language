import {ParsingActionOwner, PegJsMeta, Pattern, setComponentName, setPegJsAction} from '../pattern';

export class RegularExpressionPattern implements Pattern, ParsingActionOwner {
    _pegjs: PegJsMeta = {};
    setAction         = setPegJsAction;
    setComponentName  = setComponentName;

    readonly #_chars: string;

    constructor(chars: string) {
        this.#_chars = chars;
    }

    get chars(): string {
        return this.#_chars;
    }


}

