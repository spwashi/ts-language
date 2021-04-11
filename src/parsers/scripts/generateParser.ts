import peg from 'pegjs';
import {Grammar} from '../grammar';
import {SerializationContext} from '../grammar/serialization/core';
import serialize from '../grammar/serialization/core/serialize';
import toPegJs from '../grammar/serialization/impl/toPegJs';

export async function generateParser(jsPreText: string, grammar: Grammar) {
    const context            = new SerializationContext({grammar, serializer: toPegJs});
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