import {UnhydratedSpwNode} from './types';
import {SpwNode, SpwNodeKeyValue} from './node/spwNode';
import {SpwChannelNode} from './node/sub/channelNode';
import {SpwStrandNode} from './node/sub/strandNode';
import {SpwNodeNode} from './node/sub/nodeNode';
import {SpwEssenceNode} from './node/sub/domainNode';
import {SpwDomainNode} from './node/sub/essenceNode';
import {SpwStringNode} from './node/sub/stringNode';
import {SpwPerformanceNode} from './node/sub/performanceNode';
import {SpwEvaluationNode} from './node/sub/evaluationNode';
import {SpwPerspectiveNode} from './node/sub/perspectiveNode';
import {SpwTransportNode} from './node/sub/transportNode';
import {SpwAnchorNode} from './node/sub/anchorNode';
import {SpwPhraseNode} from './node/sub/phraseNode';
import {SpwConceptNode} from './node/sub/conceptNode';

interface HydrationContext {
    location: {}

    absorb(spwNode: SpwNode): SpwNode;
}

async function hydrateNode(node: UnhydratedSpwNode, runtime: HydrationContext) {
    const {kind, location, ...rest} = node;


    Object.assign(location, runtime.location)

    const map: { [key: string]: () => SpwNode } = {
        channel:     () => new SpwChannelNode(node),
        transport:   () => new SpwTransportNode(node),
        domain:      () => new SpwDomainNode(node),
        evaluation:  () => new SpwEvaluationNode(node),
        concept:     () => new SpwConceptNode(node),
        essence:     () => new SpwEssenceNode(node),
        node:        () => new SpwNodeNode(node),
        performance: () => new SpwPerformanceNode(node),
        anchor:      () => new SpwAnchorNode(node),
        phrase:      () => new SpwPhraseNode(node),
        perspective: () => new SpwPerspectiveNode(node),
        strand:      () => new SpwStrandNode(node),
        string:      () => new SpwStringNode(node),
    }

    const spwNode: SpwNode = map[kind] ? map[kind]()
                                       : new SpwNode(node);

    // Hydrate and set the properties
    const hydrationPromises =
              Object.entries(rest)
                    .map(
                        async ([k, v]) => {
                            const incorporated =
                                      v.kind || Array.isArray(v)
                                      ? await incorporate(v, runtime)
                                      : v;
                            node[k]            = incorporated;
                            spwNode.set(k, incorporated)
                        },
                    )
    await Promise.all(hydrationPromises);

    return spwNode;
}


type HydrationInput = UnhydratedSpwNode | UnhydratedSpwNode[] | any;

export async function incorporate(node: HydrationInput, runtime: HydrationContext): Promise<SpwNodeKeyValue> {
    if (Array.isArray(node)) {
        const hydrateChild = (node: HydrationInput): Promise<SpwNodeKeyValue> => incorporate(node, runtime);

        return Promise.all(node.map(hydrateChild));
    }

    if (!node?.kind) {
        console.log(node)
        return node;
    }

    const spwNode = await hydrateNode(node, runtime);

    return runtime.absorb(spwNode);
}