import peg from 'pegjs';
import {ParserRuleContext} from './context/parserRuleContext';
import {initHandlers} from './mutation/string-mutator';
import serialize from './mutation/serialize';
import {Serializer} from './mutation/serializer.type';
import {init} from '../../grammars/spw/src/tokenization';

export async function generateParser(jsPreText: string) {
    const spw                = init();
    const stringification    = initHandlers(serialize as Serializer<string>);
    const context            = new ParserRuleContext({
                                                         mutator: stringification,
                                                         grammar: spw,
                                                     });
    const out                = await serialize(spw, context);
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