import {SerializationContext} from '../context';
import {RuleComponent} from '../../../abstract/component';

export type Serializer<T> = (component: RuleComponent | any, context: SerializationContext<T>) => Promise<T>;