import {isPegComponent, ParserRuleComponent, ParsingActionOwner} from '../grammar/pattern/pattern';
import {ParserRuleContext} from '../context/parserRuleContext';
import {Rule} from '../grammar/rules/rule';
import {Grammar} from '../grammar/grammar';


async function serialize<ReturnType>(
    subject: Grammar | Rule | ParserRuleComponent | ParsingActionOwner,
    context: ParserRuleContext,
): Promise<ReturnType | null> {
    if (context.grammar && !context.grammar.has(subject)) {
        return null;
    }

    const mutators = context.mutators;
    const mutator  = mutators.get(subject.constructor);

    if (!mutator) throw new Error('No handler for constructor')

    if (subject instanceof Rule || subject instanceof Grammar) {
        return mutator(subject, context);
    }

    if (!isPegComponent(subject)) {
        throw new Error('Cannot pegify item')
    }

    const childContext: ParserRuleContext = context.enter({component: subject});

    const raw: ReturnType     = await mutator(subject, childContext);
    const mutated: ReturnType = await mutators.normalize(subject, context, raw);

    childContext.exit({component: subject});

    return mutated;
}

export default serialize;