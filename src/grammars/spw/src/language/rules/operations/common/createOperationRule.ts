import {Pattern} from '../../../../../../../language/parser-generation/grammar/pattern/pattern';
import {rule} from '../../../../../../../language/parser-generation/grammar/rules/rule';
import patterns from '../../../../../../../language/parser-generation/grammar/pattern/sub';

export function createOperationRule(token: Pattern, ruleName: string, nodeName: string) {
    return rule(
        ruleName,
        patterns.any(
            [
                patterns.sequence([
                                      token,
                                      patterns.string('_'),
                                      patterns.rule('LabelNode', 'label'),
                                  ],
                                  null,
                                  '{return label}'),
                token,
            ],
            'label',
        ),
        // language=JavaScript
        `
            {
                return spwNode({kind: "${nodeName}", label: label})
            }
        `,
    );
}