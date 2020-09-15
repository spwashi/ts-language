import {Rule} from './rules/rule';
import {isPegComponent, Pattern} from './pattern/pattern';
import {RuleReferencePattern} from './pattern/sub/rule-reference';

type RuleIdentifier = string;

export class Grammar {
    _anticipatedRuleNames: Set<string> = new Set;

    private _rules: Array<Rule> = []

    get rules(): Array<Rule> {
        return this._rules;
    }

    has(item: Grammar | Rule | Pattern | any): boolean {
        if (item === this) return true;

        if ((item instanceof Rule) || (item instanceof RuleReferencePattern)) {
            return this._anticipatedRuleNames.has(item.ruleName);
        }

        return isPegComponent(item);
    }

    expectRule(ruleIdentifier: RuleIdentifier) {
        this._anticipatedRuleNames.add(ruleIdentifier);
    }


    addRule(rule: Rule) {
        this._rules.push(rule);
        this.expectRule(rule.ruleName);

        return this;
    }
}