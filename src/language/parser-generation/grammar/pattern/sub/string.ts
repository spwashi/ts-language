import {ParsingActionOwner, Pattern, PegJsMeta, setComponentName, setPegJsAction} from '../pattern';

export class StringPattern implements Pattern, ParsingActionOwner {
    _pegjs: PegJsMeta = {};
    setAction         = setPegJsAction;
    setComponentName  = setComponentName;
    private readonly _chars: string;

    constructor(chars: string) {
        this._chars = chars;
    }

    get chars(): string {
        return this._chars;
    }
}

