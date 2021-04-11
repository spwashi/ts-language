import {Rule} from './rules/rule';
import {ICombinator} from './combinators/abstract';
import {RuleReferenceCombinator} from './combinators/standard/rule-reference';

export class Grammar {
    _ruleNames: Set<string> = new Set;

    private _rules: Array<Rule> = []

    constructor(rules: Rule[] = []) {
        rules.forEach(rule => this.addRule(rule))
    }

    get rules(): Array<Rule> {
        return this._rules;
    }

    has(item: Grammar | Rule | ICombinator | any): boolean {
        if (item === this) return true;

        if ((item instanceof Rule) || (item instanceof RuleReferenceCombinator)) {
            return this._ruleNames.has(item.ruleName);
        }

        return false;
    }

    addRule(rule: Rule) {
        this._rules.push(rule);
        this._ruleNames.add(rule.ruleName);

        return this;
    }
}