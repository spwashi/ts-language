// @ts-ignore
import dedent from 'dedent';
import {Parser, Runtime, SpwDocument} from '../../src';
import {isSpwNode} from '../../src/grammars/spw/src/interpretation/node/spwNode';
import {spwParser} from '../../src/generated/spw/parser';
import {getConceptId} from '../../src/grammars/spw/src/interpretation/runtime/getConceptId';

type Concept = {
    domain: string,
    label: string,
    body: string
};
const initializeRuntime = () => { return new Runtime(spwParser as unknown as Parser) }

const loadConcept =
          async ({domain, label, body}: Concept, runtime: Runtime) => {
              const moduleID = getConceptId({domain: domain, label: label});
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
                                                    boon => 
                                                        boonman
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

         console.log(runtime.registers.get(Runtime.symbols.all));
         debugger;
     });