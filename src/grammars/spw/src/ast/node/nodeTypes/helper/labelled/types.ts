import {SpwNode} from '../../../spwNode';

export interface CanHaveLabel {
    label: SpwNode | undefined;
}

export function setLabelledNodeItem(node: CanHaveLabel) {
    node.label?.setProp('labelledNode', node);
}
