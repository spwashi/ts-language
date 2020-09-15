import patterns from '../../../../../language/parser-generation/grammar/pattern/sub';
import {rule} from '../../../../../language/parser-generation/grammar/rules/rule';


export const strandRule =
                 rule('Strand',
                      patterns.sequence([
                                            patterns.any([
                                                             patterns.rule('Phrase'),
                                                             patterns.rule('CompoundNode'),
                                                             patterns.rule('Node'),
                                                         ], 'head'),
                                            patterns.zeroOrMore(patterns.regExp('\\t ')),
                                            patterns.oneOrMore(
                                                patterns.sequence(
                                                    [
                                                        patterns.zeroOrMore(patterns.regExp('\\n\\t ')),
                                                        patterns.any([
                                                                         patterns.rule('ObjectiveTransport', 'transport'),
                                                                         patterns.rule('SubjectiveTransport', 'transport'),
                                                                     ], 'transport'),
                                                        patterns.zeroOrMore(patterns.regExp('\\n\\t ')),
                                                        patterns.any([
                                                                         patterns.rule('Phrase'),
                                                                         patterns.rule('CompoundNode'),
                                                                         patterns.rule('Node'),
                                                                     ], 'node'),
                                                    ],
                                                    null,
                                                    // language=JavaScript

                                                        `
                                                        {
                                                            return spwNode({kind: 'strand-tail', node, transport});
                                                        }
                                                    `,
                                                ),
                                                'tail',
                                            ),
                                        ],
                      ),
                      // language=JavaScript
                         `
                         {
                             return spwNode({
                                                kind: 'strand',
                                                head: head,
                                                tail: tail
                                            });
                         }
                     `);
