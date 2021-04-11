import {SerializationContext, Mutator, MutatorMap} from '../core/context';
import {AnyCombinator, CountableCombinator} from '../../combinators/standard/any';
import {OneOrMoreCombinator} from '../../combinators/standard/one-or-more';
import {OptionalCombinator} from '../../combinators/standard/optional';
import {RegularExpressionCombinator} from '../../combinators/standard/regular-expression';
import {SequenceCombinator} from '../../combinators/standard/sequence';
import {StringCombinator} from '../../combinators/standard/string';
import {RuleReferenceCombinator} from '../../combinators/standard/rule-reference';
import {ZeroOrMoreCombinator} from '../../combinators/standard/zero-or-more';
import {getComponentName, getParsingAction, ICombinator, ParsingActionOwner} from '../../combinators/abstract';
import {Rule} from '../../rules/rule';
import {Grammar} from '../../grammar';
import {minify as m} from 'terser';
import serialize from '../core/serialize';
import {RuleComponent} from '../../abstract/component';

const minify = (string: string) => m(string, {
    parse: {bare_returns: true},
}).code

type P = ICombinator;
type C = SerializationContext<string>;

const truthy                = (i: any) => !!i;
const notMissing            = (i: any) => i !== null && i !== undefined;
const isContextNested       = (context: SerializationContext, depth = 1) => context.nestingLevel > depth;
const isCountableCombinator = (component: RuleComponent | undefined): component is RuleComponent & CountableCombinator => !!(component as unknown as CountableCombinator)?.count;
const needsParentheses      = (component: RuleComponent, parentContext: SerializationContext | undefined, which: 'component' | 'action' = 'component') => {
    const inGrammar = (i: any) => !!parentContext?.grammar.has(i);

    switch (which) {
        case 'component':
            if (!getComponentName(component)) {
                if (getParsingAction(component as ParsingActionOwner)) {
                    return false
                }
            }
            let parentComponent = parentContext?.component;
            if ((parentComponent instanceof ZeroOrMoreCombinator) || (parentComponent instanceof OneOrMoreCombinator)) {
                return true;
            }
            if (isCountableCombinator(parentComponent)) {
                return (component?.count?.() ?? 0) > 1;
            }
            break;
        case 'action':
            return !!getComponentName(component) && component?.count
                   ? component.count(inGrammar) > 1
                   : true
    }

    return false;
};
async function normalize(component: RuleComponent | ParsingActionOwner, fragment: string, cont: SerializationContext<string>): Promise<string> {
    if (component instanceof Rule || component instanceof Grammar) {
        return fragment;
    }

    const context                     = cont.parentContext;
    const shouldParenthesizeComponent =
              (
                  item: RuleComponent | ParsingActionOwner | any,
                  which: 'component' | 'action' = 'component',
              ) =>
                  needsParentheses(item, context, which);

    const componentName = getComponentName(component);
    const action        = getParsingAction(component as ParsingActionOwner);
    const parenthesized =
              shouldParenthesizeComponent(component)
              ? `(${fragment})`
              : fragment;

    const patternString =
              [componentName, parenthesized]
                  .filter(truthy)
                  .join(':');

    if (!action) return patternString;

    const minified_action = await minify(action as string);
    if (!minified_action) {
        console.error(action)
        throw new Error('Could not minify action... is there a syntax error?')
    }
    const actionString =
              [patternString, `{${minified_action}}`]
                  .filter(truthy)
                  .join(' ');

    const parentComponentIsComplex = shouldParenthesizeComponent(component, 'action');

    if (parentComponentIsComplex) {
        return `(${actionString})`;
    }

    return actionString;
}

type SerializerEntry = [any, Mutator<string>];
const serializers                 = [
    [
        Grammar,
        async (a: Grammar, context: C) => {
            const strings = await Promise.all(
                a.rules
                 .map(async (rule) => serialize(rule, context)),
            );
            return strings
                .join('\n\n');
        },
    ],
    [
        Rule,
        async (a: Rule, context: C): Promise<string> => {
            const action  = await minify(a.action || '');
            const strings = await Promise.all([
                                                  `${a.ruleName} = `,
                                                  await serialize(a.pattern, context),
                                                  action ? `{${action}}`.replace('{{', '{')
                                                                        .replace('}}', '}')
                                                         : action,
                                              ]);
            return strings.filter(truthy).join('\n');
        },
    ],
    [
        AnyCombinator,
        async (a: AnyCombinator, context: C): Promise<string> => {
            const options  = a.patterns;
            const filtered = (
                await Promise.all(
                    options.map(async (i) => serialize(i, context)),
                )
            )
                .filter(notMissing);

            if (filtered.length === 1)
                return filtered[0] as string;

            return filtered.join(` / `);
        },
    ],
    [
        OneOrMoreCombinator,
        async (a: OneOrMoreCombinator, context: C) => `${await serialize(a.pattern, context)}+`,
    ],
    [
        OptionalCombinator,
        async (a: OptionalCombinator, context: C) => `${await serialize(a.pattern, context)}?`,
    ],
    [
        RegularExpressionCombinator,
        async (a: RegularExpressionCombinator, context: C) => `[${a.chars.replace('\\d', '0-9')}]`,
    ],
    [
        SequenceCombinator,
        async (a: SequenceCombinator, context: C) => {
            const options = a.patterns;
            const strings = await Promise.all(
                options.map(async (i) => serialize(i, context)),
            );
            return strings.filter(notMissing).join(' ');

        },
    ],
    [
        StringCombinator,
        async (a: StringCombinator, context: C) => `"${a.chars}"`,
    ],
    [
        RuleReferenceCombinator,
        async (a: RuleReferenceCombinator, context: C) => a.ruleName,
    ],
    [
        ZeroOrMoreCombinator,
        async (a: ZeroOrMoreCombinator, context: C) => `${await serialize(a.pattern, context)}*`,
    ],
] as SerializerEntry[];
const handlers: SerializerEntry[] = serializers.map(([TypeofComponent, serializer]) => [
    TypeofComponent,
    ((async (subject, context) => {
            const serialized = await serializer(subject, context);
            return normalize(subject, serialized, context);
        }) as Mutator<string>
    )])
const toPegJs                     = new Map(handlers) as MutatorMap<string>;
export default toPegJs
