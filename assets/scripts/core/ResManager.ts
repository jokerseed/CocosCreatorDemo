export class ResManager {
    private static _instance: ResManager;
    static get instance(): ResManager {
        if (!this._instance) {
            this._instance = new ResManager();
        }
        return this._instance;
    }
    private constructor() { }
}