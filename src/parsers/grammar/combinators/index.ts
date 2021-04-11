import {AnyCombinator, anyOf} from './standard/any';
import {OneOrMoreCombinator, oneOrMoreOf} from './standard/one-or-more';
import {OptionalCombinator, optionally} from './standard/optional';
import {regExpLike, RegularExpressionCombinator} from './standard/regular-expression';
import {referenceTo, RuleReferenceCombinator} from './standard/rule-reference';
import {SequenceCombinator, sequenceOf} from './standard/sequence';
import {StringCombinator, stringLike} from './standard/string';
import {ZeroOrMoreCombinator, zeroOrMoreOf} from './standard/zero-or-more';
import {Combinator} from './abstract';

export {
    Combinator,

    AnyCombinator,
    OneOrMoreCombinator,
    OptionalCombinator,
    RuleReferenceCombinator,
    SequenceCombinator,
    RegularExpressionCombinator,
    StringCombinator,
    ZeroOrMoreCombinator,

    anyOf,
    oneOrMoreOf,
    optionally,
    referenceTo,
    regExpLike,
    sequenceOf,
    stringLike,
    zeroOrMoreOf,
}