import { _decorator, assetManager, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
    private _btnStart: Node;

    protected onLoad(): void {
        this._btnStart = this.node.getChildByName("btnStart");
    }

    protected start(): void {
        this._btnStart.on(Node.EventType.TOUCH_END, this.clickEnter, this);
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