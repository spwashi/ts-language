export type ParsingAction<A = unknown> = A;
export type RuleComponentMeta<A = undefined> =
    {
        name?: string
        action?: ParsingAction<A>;
    };

// Interface
export interface RuleComponent<A extends ParsingAction = ParsingAction<unknown>> {
    meta: RuleComponentMeta<A>;
    componentName?: string | undefined;
    count?: (filter?: (i: any) => boolean) => number;

    withAction<P>(actionString: P): this;
}