import {stringRules} from './rules/string';
import {Grammar} from '../../../../language/parser-generation/grammar/grammar';
import {rule, Rule} from '../../../../language/parser-generation/grammar/rules/rule';
import {nodeRules} from './rules/node';
import {topRule} from './rules/top';
import {strandRule} from './rules/strand';
import {anchorRules} from './rules/anchor';
import {essenceRules} from './rules/container-elements/essence';
import {domainRules} from './rules/container-elements/domain';
import {channelRules} from './rules/operations/channel';
import {evaluationRules} from './rules/operations/evaluation';
import {performanceRules} from './rules/operations/performance';
import {perspectiveRules} from './rules/operations/perspective';
import {analogRules} from './rules/analog';
import {phraseRules} from './rules/phrase';
import {conceptDomainRules} from './rules/container-elements/concept';
import {invocationRules} from './rules/operations/invocation';
import {asideRules} from './rules/container-elements/aside';
import {bondRules} from './rules/bond';
import {compoundNodeRules} from './rules/compound-node';
import {transportRules} from './rules/transport';


export function init() {
    const rules =
              [
                  topRule,

                  //
                  ...nodeRules,
                  ...stringRules,
                  ...phraseRules,
                  ...compoundNodeRules,
                  ...analogRules,
                  ...bondRules,

                  strandRule,
                  ...transportRules,

                  // containers
                  ...domainRules,
                  ...asideRules,
                  ...conceptDomainRules,
                  ...essenceRules,

                  // operations
                  ...channelRules,
                  ...performanceRules,
                  ...invocationRules,
                  ...evaluationRules,
                  ...perspectiveRules,
                  ...anchorRules,
              ];

    const spw = new Grammar();
    rules.forEach((rule: Rule) => spw.addRule(rule));
    return spw;
}