import {ParsingScene} from './parsingScene';
import {ParserRuleComponent, ParsingActionOwner, Pattern} from '../grammar/pattern/pattern';
import {Rule} from '../grammar/rules/rule';
import {Grammar} from '../grammar/grammar';

export type PeggificationMachineGenerator =
    (currentContext: ParserRuleContext) =>
        ParserRuleContext | Generator<any, any, any>;

export type PeggificationMachine =
    Map<any,
        PeggificationMachineGenerator>;

type ContextParameters =
    {
        parent?: ParserRuleContext,
        grammar?: Grammar
        component?: ParserRuleComponent,
        machine?: PeggificationMachine;
        mutator?: MutatorMap<any>
    };

type Mutator<T> = (pattern: Pattern | any, context: ParserRuleContext) => Promise<T>;

export interface MutatorMap<T> extends Map<any, Mutator<T>> {
    normalize(
        component: Rule | ParserRuleComponent | ParsingActionOwner,
        parentContext: ParserRuleContext<T>,
        fragment: T,
    ): Promise<T>
}

export class ParserRuleContext<T = unknown> {
    private readonly _parentContext: ParserRuleContext<any> | undefined;
    private readonly _component: ParserRuleComponent | undefined;
    private readonly _nestingLevel: number = 0;
    private readonly _scene: ParsingScene;
    private readonly _mutators: MutatorMap<any> | undefined;
    private readonly _grammar: Grammar | undefined;

    constructor({parent, component, mutator, grammar}: ContextParameters = {}) {
        this._parentContext = parent;
        this._grammar       = grammar || parent?.grammar;
        this._component     = component;
        this._mutators      = mutator || parent?.mutators;
        this._scene         = parent?.scene || new ParsingScene();
        if (parent) {
            this._nestingLevel = parent.nestingLevel + 1;
        }
    }

    get grammar(): Grammar | undefined {
        return this._grammar;
    }

    get component(): ParserRuleComponent | undefined {
        return this._component;
    }

    get mutators(): MutatorMap<any> {
        if (!this._mutators) throw new Error('No mutators set')
        return this._mutators;
    }

    get scene(): ParsingScene {
        return this._scene;
    }

    get nestingLevel(): number {
        return this._nestingLevel;
    }

    get parentContext(): ParserRuleContext | undefined {
        return this._parentContext;
    }


    enter<RType>({component}: { component: ParserRuleComponent }): ParserRuleContext<RType> {
        return new ParserRuleContext({parent: this, component})
    }


    exit({}: { component: ParserRuleComponent, closeParents?: boolean }) {
        return this.parentContext || this;
    }
}