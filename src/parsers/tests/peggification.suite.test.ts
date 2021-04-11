import {SerializationContext} from '../grammar/serialization/core';
import serialize from '../grammar/serialization/core/serialize';
import toPegJs from '../grammar/serialization/impl/toPegJs';
import {anyOf, oneOrMoreOf, optionally, regExpLike, sequenceOf, stringLike, zeroOrMoreOf} from '../grammar/combinators';
import {Combinator, Grammar} from '../grammar';

async function runTest(pattern: Combinator, expected: string): Promise<string> {
    let serialized = await serialize<string>(
        pattern,
        new SerializationContext({serializer: toPegJs, grammar: new Grammar()}),
    );
    expect(serialized).toEqual(expected);
    return <string>serialized;
}


describe('PegJS Serialization', function () {
    it('should be able to handle each combinator', async function () {
        await runTest(anyOf([stringLike('abcde'), stringLike('xyz')]),
                      `"abcde" / "xyz"`);
        await runTest(oneOrMoreOf(stringLike('abcde')),
                      `("abcde")+`);
        await runTest(optionally(stringLike('abcde')),
                      `"abcde"?`);
        await runTest(regExpLike('a-zA-Z'),
                      `[a-zA-Z]`);
        await runTest(stringLike('abcde'),
                      `"abcde"`);
        await runTest(zeroOrMoreOf(stringLike('abcde')),
                      `("abcde")*`);
        await runTest(sequenceOf([stringLike('abcde'), stringLike('xyz')]),
                      `"abcde" "xyz"`);
    });
});


