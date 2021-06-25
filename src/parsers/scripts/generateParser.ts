import peg from 'pegjs';
import {Grammar} from '../grammar';
import {SerializationContext} from '../grammar/serialization/core';
import serialize from '../grammar/serialization/core/serialize';
import toPegJs from '../grammar/serialization/impl/toPegJs';

type Options = { allowedStartRules?: string[] };
export async function generateParser(jsPreText: string, grammar: Grammar, options: Options = {}) {
    const context            = new SerializationContext({grammar, serializer: toPegJs});
    const out                = await serialize(grammar, context);
    const pegJsGrammarString =
              [
                  `{\n${jsPreText.trim()}\n}`,
                  '\n\n',
                  out,
              ].join('');

    try {
        const parser =
                  peg.generate(pegJsGrammarString, {
                      output:            'source',
                      format:            'bare',
                      cache:             true,
                      allowedStartRules: options.allowedStartRules,
                  })
        return {parser, grammar: pegJsGrammarString};
    } catch (e) {
        console.log(e)
        debugger;
        return {parser: '', grammar: pegJsGrammarString};
    }
}