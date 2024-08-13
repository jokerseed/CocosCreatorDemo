import { JsonAsset, assetManager } from "cc";

export class ConfigManager {
    private static _instance: ConfigManager;
    static get instance(): ConfigManager {
        if (!this._instance) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    }
    private constructor() { }

    private _data: JsonAsset[];

    init() {
        assetManager.loadBundle("config", (err, bundle) => {
            bundle.loadDir("./", (err, data) => {
                this._data = data as JsonAsset[];
            });
        })
    }
}