import {ParserRuleContext} from '../context/parserRuleContext';
import serialize from '../mutation/serialize';
import {initHandlers} from '../mutation/string-mutator';
import {Serializer} from '../mutation/serializer.type';
import patterns from '../grammar/pattern/sub';

describe('Peggification', function () {
    const stringification = initHandlers(serialize as Serializer<string>);
    it('should be able to peggify all of the main patterns', async function () {
        const input =
                  [
                      patterns.any([patterns.string('boon'), patterns.string('man')]),
                      patterns.oneOrMore(patterns.string('boon')),
                      patterns.optional(patterns.string('boon')),
                      patterns.regExp('a-zA-Z'),
                      patterns.sequence([patterns.string('boon'), patterns.string('man')]),
                      patterns.string('boon'),
                      patterns.zeroOrMore(patterns.string('boon')),
                  ];

        const context = new ParserRuleContext({mutator: stringification});
        const out     =
                  input.map(
                      async pattern => await serialize(
                          pattern,
                          context,
                      ),
                  )
        console.log(await Promise.all(out));
    });
});


