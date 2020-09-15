export type SpwModuleIdentifier = string;

export class SpwModule {
    private readonly _identifier: SpwModuleIdentifier;
    private readonly _src: string | null = null;

    constructor(identifier: SpwModuleIdentifier, src: string | null = null) {
        this._identifier = identifier;
        this._src        = src;
    }

    get src(): string | null {
        return this._src;
    }

    get identifier(): SpwModuleIdentifier {
        return this._identifier;
    }
}

export class SpwModuleRegistry {
    private _modules = new Map<SpwModuleIdentifier, SpwModule>();

    get modules() {
        return this._modules;
    }

    register(spwModule: SpwModule) {
        this._modules.set(spwModule.identifier, spwModule)

        return this;
    }

}