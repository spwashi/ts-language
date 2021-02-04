import {SpwNode, SpwNodeKeyValue} from '../node/spwNode';
import {SpwModule, SpwModuleIdentifier, SpwModuleRegistry} from './spwModule';
import {RegisterMap, RuntimeRegister} from './register';
import {incorporate} from '../incorporate';
import {SpwAnchorNode} from '../node/sub/anchorNode';
import {SpwStringNode} from '../node/sub/stringNode';
import {SpwNodeLocation, UnhydratedSpwNode} from '../types';
import {SpwPerformanceNode} from '../node/sub/performanceNode';


export type Parser = {
    parse: (input: string) => UnhydratedSpwNode,
    SyntaxError: Error
};

export type SpwNodeIdentifier = string | Symbol;

export interface SpwRuntime {
    absorb(node: SpwNode): any;

    locate(id: SpwNodeIdentifier): Promise<any>
}

const symbol_All: SpwNodeIdentifier              = Symbol('All');
const symbol_LastAcknowledged: SpwNodeIdentifier = Symbol('Last Acknowledged');
const symbol_KeyHaver: SpwNodeIdentifier         = Symbol('Anchors');
const symbol_Performance: SpwNodeIdentifier      = Symbol('Performance');
const symbol_Evaluation: SpwNodeIdentifier       = Symbol('Evaluation');

function hasStaticAnchor(node: SpwNode | { key: string }) {
    if (node instanceof SpwAnchorNode || node instanceof SpwStringNode) return true;

    return !!(node as { key: string }).key;
}

class ParsingError implements Error {
    message: string;
    name: string;
    location: SpwNodeLocation;

    constructor(e: any) {
        this.message  = e.message;
        this.name     = e.name;
        this.location = e.location
    }
}

export class Runtime implements SpwRuntime {
    static symbols    = {
        symbol_KeyHaver,
        symbol_LastAcknowledged,
        symbol_All,
        symbol_Performance,
        symbol_Evaluation,
    }
    public DEBUG_MODE = 0;

    /**
     * The parser used to generate the un-hydrated
     * @private
     */
    private readonly parser: Parser;

    private readonly trees: Map<SpwModuleIdentifier, SpwNode | SpwNode[] | Error> =
                         new Map<SpwModuleIdentifier, SpwNode | SpwNode[] | Error>()

    private readonly moduleRegistry: SpwModuleRegistry = new SpwModuleRegistry();
    private readonly loadedModules                     = new Set<SpwModule>();

    constructor(parser: Parser) {
        if (typeof parser.parse !== 'function') {
            throw new Error('Invalid parser');
        }
        this.parser = parser;
        this.initializeRegisters();
    }

    private _registers: RegisterMap = new Map();

    get registers(): RegisterMap {
        return this._registers;
    }

    identify(node: SpwNode | string | symbol | SpwNodeIdentifier | null): SpwNodeIdentifier {
        return typeof node === 'string' || typeof node === 'symbol'
               ? node
               : symbol_LastAcknowledged;
    }

    absorb(node: SpwNode): SpwNode {

        if (hasStaticAnchor(node)) {
            this.registerItem(symbol_KeyHaver, node)
        }

        if (node instanceof SpwPerformanceNode) {
            this.registerItem(symbol_Performance, node)
        }

        this.registerItem(symbol_All, node);

        const id = this.identify(node)
        this.registerItem(id, node)

        return node;
    }

    async locate(node: SpwNodeIdentifier): Promise<Generator> {
        const id                 = this.identify(node);
        let items: Iterable<any> = [];

        if (this._registers.has(id)) {
            const register = this._registers.get(id);

            items = register?.items || [];
        } else if (typeof id === 'string') {
            const anchors = this._registers.get(symbol_KeyHaver);
            items         = anchors?.get(`+${id}`) as [] || [];
        }


        return (function* () {
            for (const item of items) {
                yield item?.item;
            }
        })()
    }

    async refreshModules(which: true) {
        this.initializeRegisters();
        const loadModules = [...this.moduleRegistry.modules.values()]
            .map(async value => {
                try {
                    return await this.module__load(value);
                } catch (e) {
                    return e;
                }
            })
        await Promise.all(loadModules);
    }

    async module__load(key: SpwModuleIdentifier | SpwModule): Promise<SpwNodeKeyValue | Error> {
        this.DEBUG_MODE && console.log('loading module')
        const id = key instanceof SpwModule
                   ? key.identifier
                   : key;
        if (!this.moduleRegistry.modules.has(id)) throw new Error('Module has not been registered');

        const spwModule = this.moduleRegistry.modules.get(id) as SpwModule;
        const src       = spwModule.src;

        this.DEBUG_MODE && console.log('parsing module')
        let parsed: any;
        try {
            parsed = src ? this.parser.parse(src) : null;
        } catch (e) {
            throw new ParsingError(e)
        }
        this.DEBUG_MODE && console.log('module parsed')

        this.loadedModules.add(spwModule);
        let hydrated: string | number | SpwNode | SpwNodeKeyValue[] | Error;
        if (parsed) {
            hydrated = await incorporate(parsed, {
                absorb:   this.absorb.bind(this),
                location: {moduleID: spwModule.identifier},
            });
        } else {
            throw new Error('Could not parse');
        }

        this.trees.set(id, hydrated as SpwNode | SpwNode[])

        return hydrated;
    }

    async module__register(id: SpwModule | SpwModuleIdentifier) {
        const m: SpwModule =
                  !(id instanceof SpwModule) ? await this.module__locate(id)
                                             : id;
        this.moduleRegistry.register(m);
    }

    async module__locate(id: SpwModuleIdentifier): Promise<SpwModule> {
        if (!this.moduleRegistry.modules.has(id))
            throw new Error('Not sure how to find modules');

        return this.moduleRegistry.modules.get(id) as SpwModule;
    }

    private registerItem(id: SpwNodeIdentifier, node: SpwNode) {
        const register = this._registers.get(id) || new RuntimeRegister();
        register.add(node)
        this._registers.set(id, register);
    }

    private initializeRegisters() {
        this._registers = new Map<SpwNodeIdentifier, RuntimeRegister>();
        this._registers.set(symbol_All, new RuntimeRegister());
        this._registers.set(symbol_Performance, new RuntimeRegister());
        this._registers.set(symbol_KeyHaver, new RuntimeRegister({index: (node: SpwAnchorNode | any) => `+${node.key}`}));
        this._registers.set(symbol_LastAcknowledged, new RuntimeRegister({memory: 1}))
    }
}