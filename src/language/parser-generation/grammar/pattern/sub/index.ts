import {AnyPattern} from './any';
import {OneOrMorePattern} from './one-or-more';
import {OptionalPattern} from './optional';
import {RegularExpressionPattern} from './regular-expression';
import {RuleReferencePattern} from './rule-reference';
import {SequencePattern} from './sequence';
import {StringPattern} from './string';
import {ZeroOrMorePattern} from './zero-or-more';
import {ParsingActionOwner, Pattern} from '../pattern';


function addNameAndAction<T, I extends Pattern | (Pattern & ParsingActionOwner)>(callback: (p: T) => I): (p: T, name?: string | null, action?: string | undefined) => I {
    return (p, name = null, action = undefined) => {
        const pattern = callback(p);
        if (typeof name === 'string') {
            pattern.setComponentName(name);
        }

        const actionOwner = (pattern as ParsingActionOwner & Pattern)
        if (typeof action === 'string' && (pattern as ParsingActionOwner).setAction) {
            actionOwner.setAction(action);
        }
        return pattern;
    }
}


const patterns = {
    rule:       addNameAndAction((p: string) => new RuleReferencePattern(p)),
    regExp:     addNameAndAction((p: string) => new RegularExpressionPattern(p)),
    string:     addNameAndAction((p: string) => new StringPattern(p)),
    zeroOrMore: addNameAndAction((p: Pattern) => new ZeroOrMorePattern(p)),
    optional:   addNameAndAction((p: Pattern) => new OptionalPattern(p)),
    oneOrMore:  addNameAndAction((p: Pattern) => new OneOrMorePattern(p)),
    sequence:   addNameAndAction((p: Pattern[]) => new SequencePattern(p)),
    any:        addNameAndAction((p: Pattern[]) => new AnyPattern(p)),
};
export default patterns