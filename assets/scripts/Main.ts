import { _decorator, assetManager, Canvas, Component, director, Node, UITransform } from 'cc';
import { ConfigManager } from './core/ConfigManager';
import { ResManager } from './core/ResManager';
import { QuadTree } from './core/QuadTree';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    protected onLoad(): void {
        this.node._persistNode = true;
    }

    protected start() {
        ConfigManager.instance.init();
        ResManager.instance.init();
        QuadTree.instance.init(64, 2);
    }

    protected update(deltaTime: number) {

    }
}


