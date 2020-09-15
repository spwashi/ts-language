import {MutatorMap, ParserRuleContext} from '../context/parserRuleContext';
import {AnyPattern} from '../grammar/pattern/sub/any';
import {OneOrMorePattern} from '../grammar/pattern/sub/one-or-more';
import {OptionalPattern} from '../grammar/pattern/sub/optional';
import {RegularExpressionPattern} from '../grammar/pattern/sub/regular-expression';
import {SequencePattern} from '../grammar/pattern/sub/sequence';
import {StringPattern} from '../grammar/pattern/sub/string';
import {RuleReferencePattern} from '../grammar/pattern/sub/rule-reference';
import {ZeroOrMorePattern} from '../grammar/pattern/sub/zero-or-more';
import {
    getComponentName,
    getParsingAction,
    ParserRuleComponent,
    ParsingActionOwner,
    Pattern,
} from '../grammar/pattern/pattern';
import {Serializer} from './serializer.type';
import {Rule} from '../grammar/rules/rule';
import {Grammar} from '../grammar/grammar';
import {minify as m} from 'terser';

const minify = (string: string) => m(string, {
    parse: {bare_returns: true},
}).code

type P = Pattern;
export type C = ParserRuleContext<string>;
type PegHandler<T> = (pattern: P | any, context: C) => Promise<T>;

const truthy     = (i: any) => !!i;
const notMissing = (i: any) => i !== null && i !== undefined;

function handlers<T = string>(serialize: Serializer<string>): Array<[any, Serializer<string>]> {
    return [
        [
            Grammar,
            async (a: Grammar, context: C) => {
                const strings =
                          await Promise.all(
                              a.rules
                               .map(async rule => serialize(rule, context)),
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
                                                      action ? `{${action}}` : action,
                                                  ]);
                return strings.filter(truthy).join('\n');
            },
        ],
        [
            AnyPattern,
            async (a: AnyPattern, context: C): Promise<string> => {
                const options  = a.patterns;
                const filtered =
                          (
                              await Promise.all(
                                  options.map(async i => serialize(i, context)),
                              )
                          )
                              .filter(notMissing);

                if (filtered.length === 1) return filtered[0];

                return filtered.join(` / `);
            },
        ],
        [
            OneOrMorePattern,
            async (a: OneOrMorePattern, context: C) => `${await serialize(a.pattern, context)}+`,
        ],
        [
            OptionalPattern,
            async (a: OptionalPattern, context: C) => `${await serialize(a.pattern, context)}?`,
        ],
        [
            RegularExpressionPattern,
            async (a: RegularExpressionPattern, context: C) => `[${a.chars.replace('\\d', '0-9')}]`,

        ],
        [
            SequencePattern,
            async (a: SequencePattern, context: C) => {
                const options = a.patterns;
                const strings =
                          await Promise.all(
                              options.map(async i => serialize(i, context)),
                          );
                return strings.filter(notMissing).join(' ')

            },
        ],
        [
            StringPattern,
            async (a: StringPattern, context: C) => `"${a.chars}"`,
        ],
        [
            RuleReferencePattern,
            async (a: RuleReferencePattern, context: C) => a.ruleName,
        ],
        [
            ZeroOrMorePattern,
            async (a: ZeroOrMorePattern, context: C) => `${await serialize(a.pattern, context)}*`,
        ],
    ]
}

function isNested(parentContext: ParserRuleContext, depth = 1) {
    return parentContext.nestingLevel > depth;
}

function isCountable(p: any) {
    return (p as ParserRuleComponent)?.count;
}

function needsParentheses(component: ParserRuleComponent | (ParserRuleComponent & ParsingActionOwner), context: ParserRuleContext, which: 'component' | 'action' = 'component') {
    const inGrammar = (i: any) => !!context.grammar?.has(i);

    switch (which) {
        case 'component':
            if (!getComponentName(component)) {
                if (getParsingAction(component as ParsingActionOwner)) {
                    return false
                }
            }
            if (
                context.component instanceof OneOrMorePattern
                || context.component instanceof ZeroOrMorePattern
                || getComponentName(component)
            ) {


                return component?.count
                       ? component.count(inGrammar) > 1
                       : false;
            }
            break;
        case 'action':
            return !!getComponentName(component) && component?.count
                   ? component.count(inGrammar) > 1
                   : true
    }

    return false;
}

const normalize =
          async function (
              component: ParserRuleComponent | ParsingActionOwner,
              context: ParserRuleContext<string>,
              fragment: string,
          ): Promise<string> {
              const shouldParenthesize =
                        (
                            item: ParserRuleComponent | ParsingActionOwner | any,
                            which: 'component' | 'action' = 'component',
                        ) =>
                            needsParentheses(item, context, which);

              const componentName = getComponentName(component);
              const action        = getParsingAction(component as ParsingActionOwner);

              const parenthesized =
                        shouldParenthesize(component)
                        ? `(${fragment})`
                        : fragment;

              const patternString =
                        [componentName, parenthesized]
                            .filter(truthy)
                            .join(':');

              if (!action) return patternString;

              const minified_action = await minify(action);
              const actionString    =
                        [patternString, `{${minified_action}}`]
                            .filter(truthy)
                            .join(' ');

              const parentComponentIsComplex = shouldParenthesize(component, 'action');

              if (parentComponentIsComplex) {
                  return `(${actionString})`;
              }

              return actionString;
          };

export function initHandlers(serialize: Serializer<string>): MutatorMap<string> {
    return Object.assign(
        new Map<any, PegHandler<string>>(handlers(serialize)),
        {normalize},
    );
}

