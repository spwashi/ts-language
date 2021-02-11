// @ts-ignore
import dedent from 'dedent';
import {Parser, Runtime, SpwDocument} from '../../src';
import {isSpwNode, SpwNode} from '../../src/grammars/spw/src/ast/node/spwNode';
import {spwParser} from '../../src/generated/spw/parser';
import {getConceptId} from '../../src/grammars/spw/src/runtime/getConceptId';
import {SpwPhraseNode} from '../../src/grammars/spw/src/ast/node/nodeTypes/phraseNode';
import {SpwDomainNode} from '../../src/grammars/spw/src/ast/node/nodeTypes/domainNode';
import {SpwStrandNode} from '../../src/grammars/spw/src/ast/node/nodeTypes/strandNode';
import {SpwAnchorNode} from '../../src/grammars/spw/src/ast/node/nodeTypes/anchorNode';
import {spwNodeConstructors} from '../../src/grammars/spw/src/ast/node';

function fromEntries(iterable: Iterable<any>) {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
    }, {})
}


type Concept = {
    domain: string,
    label: string,
    body: string
};
const initializeRuntime = () => { return new Runtime(spwParser as unknown as Parser) }

const loadConcept =
          async ({domain, label, body}: Concept, runtime: Runtime) => {
              const moduleID = getConceptId(domain, label);
              const document = new SpwDocument(moduleID, body);

              await runtime.module__register(document);

              return await runtime.module__load(moduleID)
          };

// Testing standard behaviors
test('can generate parser',
     async function () {
         const runtime     = initializeRuntime();
         const conceptList =
                   await loadConcept(
                       {
                           domain: 'testing',
                           label:  'concept_1',
                           body:
                                   dedent`
                                            {
                                                {_concept_1
                                                    node_1_0 => 
                                                        node_1_1
                                                            => node_1_2_0 node_1_2_1 node_1_2_2
                                                }
                                                {_concept_2
                                                    boon => 
                                                        boonboon
                                                }
                                            }
                                        `,
                       },
                       runtime,
                   );

         if (!(isSpwNode(conceptList))) return;


         const sorted: {
             domain: { all: SpwDomainNode[], objective: { [k: string]: SpwNode[] }, subjective: { [k: string]: SpwNode[] }, [k: string]: any },
             anchor: { all: SpwAnchorNode[], [k: string]: any },
             strand: { all: SpwStrandNode[], [k: string]: any },
             phrase: { all: SpwPhraseNode[], [k: string]: any },
         }         =
                   {
                       domain: {all: [], objective: {}, subjective: {}},
                       anchor: {all: []},
                       strand: {all: []},
                       phrase: {all: []},
                   }
         const all = Array.from(runtime.registers.get(Runtime.symbols.all)?.items ?? []).map(_ => _.item);

         function _sortDomainIndex(node: SpwDomainNode, index: 'objective' | 'subjective') {
             const nodeElement = node[index];
             if (!nodeElement) { return; }

             const dict = sorted.domain[index] = sorted.domain[index];
             const arr  = dict[nodeElement.key] = dict[nodeElement.key] ?? [];
             arr.push(nodeElement);
         }

         all.forEach(
             (node) => {
                 if (node instanceof spwNodeConstructors.phrase) {
                     sorted.phrase.all.push(node);
                 }

                 if (node instanceof spwNodeConstructors.domain) {
                     sorted.domain.all.push(node);
                     _sortDomainIndex(node, 'objective');
                     _sortDomainIndex(node, 'subjective');
                 }
                 if (node instanceof spwNodeConstructors.anchor) {
                     sorted.anchor.all.push(node);
                 }
                 if (node instanceof spwNodeConstructors.strand) {
                     sorted.strand.all.push(node);
                 }
             },
         )
         console.log(all, sorted);

         const objectiveAnchorDomains = fromEntries(Object
                                                        .entries(sorted.domain.objective)
                                                        .map(([key, domain]: [string, SpwNode[]]) => [key,
                                                                                                      domain.map(node => node.getProp('owner'))]));
         const strands = sorted.strand.all.map(strand => strand.getProp('nodes'))

         console.log(strands, objectiveAnchorDomains)
         ;debugger;
     });