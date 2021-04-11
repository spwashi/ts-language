import {ICombinator, ParsingActionOwner} from '../../combinators/abstract';
import {Rule} from '../../rules/rule';
import {Grammar} from '../../grammar';
import {RuleComponent} from '../../abstract/component';

export type PeggificationMachineGenerator =
    (currentContext: SerializationContext) =>
        SerializationContext | Generator<any, any, any>;

export type PeggificationMachine =
    Map<any,
        PeggificationMachineGenerator>;

type ContextParameters =
    {
        parent?: SerializationContext,
        grammar: Grammar
        component?: RuleComponent,
        machine?: PeggificationMachine;
        serializer?: MutatorMap<any>
    };

export type Mutator<T> = (pattern: ICombinator | any, context: SerializationContext<T>) => Promise<T>;

export interface MutatorMap<T> extends Map<any, Mutator<T>> {
    normalize(
        component: Rule | RuleComponent | ParsingActionOwner,
        parentContext: SerializationContext<T>,
        fragment: T,
    ): Promise<T>
}

export class ParsingScene {
    protected _openContexts = new Set<SerializationContext>();


    get openContexts(): Set<SerializationContext> {
        return this._openContexts;
    }


    open(context: SerializationContext): this {
        this._openContexts.add(context);
        return this;
    }

    close(context: SerializationContext): this {
        if (!this._openContexts.has(context)) {
            throw new Error('Trying to close context that has not been opened');
        }

        this._openContexts.delete(context);

        return this;
    }
}

export class SerializationContext<T = unknown> {
    private readonly _parentContext: SerializationContext<any> | undefined;
    private readonly _component: RuleComponent | undefined;
    private readonly _nestingLevel: number = 0;
    private readonly _scene: ParsingScene;
    private readonly _serializers: MutatorMap<any> | undefined;
    private readonly _grammar: Grammar;

    constructor({parent, component, serializer, grammar}: ContextParameters) {
        this._parentContext = parent;
        this._grammar       = grammar;
        this._component     = component;
        this._serializers   = serializer || parent?.serializers;
        this._scene         = parent?.scene || new ParsingScene();
        if (parent) {
            this._nestingLevel = parent.nestingLevel + 1;
        }
    }

    get grammar(): Grammar {
        return this._grammar;
    }

    get component(): RuleComponent | undefined {
        return this._component;
    }

    get serializers(): MutatorMap<any> {
        if (!this._serializers) throw new Error('No mutators set')
        return this._serializers;
    }

    get scene(): ParsingScene {
        return this._scene;
    }

    get nestingLevel(): number {
        return this._nestingLevel;
    }

    get parentContext(): SerializationContext | undefined {
        return this._parentContext;
    }

    enter<RType>(parameters: Partial<ContextParameters>): SerializationContext<RType> {
        return new SerializationContext({
                                            parent:  this,
                                            grammar: this.grammar,
                                            ...parameters,
                                        })
    }

    exit({}: { component: RuleComponent, closeParents?: boolean }) {
        return this.parentContext || this;
    }
}