export class ConfigManager {
    private static _instance: ConfigManager;
    static get instance(): ConfigManager {
        if (!this._instance) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    }
    private constructor() { }

    init() {

    }
}