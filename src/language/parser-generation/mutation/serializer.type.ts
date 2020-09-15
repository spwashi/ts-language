import {ParserRuleComponent} from '../grammar/pattern/pattern';
import {ParserRuleContext} from '../context/parserRuleContext';

export type Serializer<T> = (component: ParserRuleComponent | any, context: ParserRuleContext<T>) => Promise<T>;