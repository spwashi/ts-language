import peg from 'pegjs';
import {ParserRuleContext} from './context/parserRuleContext';
import {initHandlers} from './mutation/string-mutator';
import serialize from './mutation/serialize';
import {Serializer} from './mutation/serializer.type';
import {Grammar} from './grammar/grammar';

export async function generateParser(jsPreText: string, grammar: Grammar) {
    const stringification    = initHandlers(serialize as Serializer<string>);
    const context            = new ParserRuleContext({
                                                         mutator: stringification,
                                                         grammar: grammar,
                                                     });
    const out                = await serialize(grammar, context);
    const pegJsGrammarString =
              [
                  `{\n${jsPreText.trim()}\n}`,
                  '\n\n',
                  out,
              ].join('');

    debugger;
    try {
        const parser =
                  peg.generate(pegJsGrammarString, {
                      output: 'source',
                      format: 'bare',
                      cache:  true,
                  })
        return {parser, grammar: pegJsGrammarString};
    } catch (e) {
        console.log(e)
        debugger;
        return {parser: '', grammar: pegJsGrammarString};
    }
}