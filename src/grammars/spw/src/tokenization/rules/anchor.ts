import patterns from '../../../../../language/parser-generation/grammar/pattern/sub';
import {rule} from '../../../../../language/parser-generation/grammar/rules/rule';


export const anchorRules =
                 [
                     rule(
                         'Anchor',
                         patterns.any(
                             [
                                 patterns.oneOrMore(patterns.regExp('-a-zA-Z_\\d', 'body'),
                                                    null,
                                                    '{ return body.join(""); }'),
                                 patterns.string('&'),
                             ],
                             'anchor',
                         ),
                         // language=JavaScript
                         `
                             {

                                 return spwNode({
                                     kind: 'anchor',
                                     key:  anchor
                                 });
                             }`,
                     ),
                 ];

