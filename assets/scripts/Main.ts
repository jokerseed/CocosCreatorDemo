import { _decorator, assetManager, Component, director, Node } from 'cc';
import { ConfigManager } from './core/ConfigManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        ConfigManager.instance.init();
    }

    update(deltaTime: number) {

    }

    /**点击进入游戏 */
    clickEnter() {
        assetManager.loadBundle("main_scene", (err, bundle) => {
            bundle.loadScene('main_scene', (err, scene) => {
                director.runScene(scene);
            });
        });
    }
}


