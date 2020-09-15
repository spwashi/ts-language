import {LineColumnOffset, SpwNodeLocation, UnhydratedSpwNode} from '../types';

export type SpwNodeKeyValue = string | number | SpwNode | SpwNodeKeyValue[];

function formatLCO(start: LineColumnOffset) {
    return [start.line, start.column].join('|');
}

export class SpwNode {
    #_kind: string;
    #_node: UnhydratedSpwNode;

    constructor(node: UnhydratedSpwNode) {
        const {kind, location} = node;
        this.#_node            = node;
        this.#_kind            = kind;
        this.#_location        = location;
    }

    protected _key?: string;

    get key(): string {
        if (!this._key) return '&';
        return this._key;
    }

    #_location: SpwNodeLocation;

    get location(): SpwNodeLocation {
        return this.#_location;
    }

    set(key: string, value: SpwNodeKeyValue): this {
        switch (key) {
            case 'key':
                this._key = (value as string);
                return this;
        }
        // @ts-ignore
        this[key] = value;
        return this;
    }

    toJSON() {
        const {kind, location, ...rest} = this.#_node;
        const {start, end}              = location;
        return {
            kind,
            ...Object.entries(rest)
                     .map(
                         ([k, v]) => {
                             // @ts-ignore
                             let vv = this[k] ?? v;
                             return [k, vv];
                         },
                     )
                     .reduce(
                         (acc, [k, v]) => ({...acc, [k]: v}),
                         {},
                     ),
            location: [formatLCO(start), formatLCO(end)].join(' '),
        }
    }
}

