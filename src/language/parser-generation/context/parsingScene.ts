/**
 * Maintains context through the duration of parsing, regardless of context
 */
import {ParserRuleContext} from './parserRuleContext';

export class ParsingScene {
    protected _openContexts = new Set<ParserRuleContext>();


    get openContexts(): Set<ParserRuleContext> {
        return this._openContexts;
    }


    open(context: ParserRuleContext): this {
        this._openContexts.add(context);
        return this;
    }

    close(context: ParserRuleContext): this {
        if (!this._openContexts.has(context)) {
            throw new Error('Trying to close context that has not been opened');
        }

        this._openContexts.delete(context);

        return this;
    }
}