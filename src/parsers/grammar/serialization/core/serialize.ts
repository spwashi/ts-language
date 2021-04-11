import {SerializationContext} from './context';
import {Rule} from '../../rules/rule';
import {Grammar} from '../../grammar';


const resolveGrammar = (context: SerializationContext, subject: any) => subject instanceof Grammar ? subject : context.grammar;

async function serialize<ReturnType>(component: any, context: SerializationContext): Promise<ReturnType | null> {
    const grammar = resolveGrammar(context, component);

    if ((component instanceof Rule) && !grammar.has(component)) {
        throw new Error(`Missing ${(component as any)?.ruleName ?? JSON.stringify(component)} from grammar`)
    }

    const serializers = context.serializers;
    const mutate      = serializers.get(component.constructor);
    if (!mutate) throw new Error('No handler for constructor')

    if (component instanceof Rule || component instanceof Grammar) return mutate(component, context);

    const childContext: SerializationContext = context.enter({component, grammar});
    const mutated: ReturnType                = await mutate(component, childContext);
    childContext.exit({component: component});

    return mutated;
}

export default serialize;