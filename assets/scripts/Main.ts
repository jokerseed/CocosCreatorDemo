import { _decorator, assetManager, Component, director, Node } from 'cc';
import { ConfigManager } from './core/ConfigManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    protected onLoad(): void {
        this.node._persistNode = true;
    }

    protected start() {
        ConfigManager.instance.init();
    }

    protected update(deltaTime: number) {

    }
}


