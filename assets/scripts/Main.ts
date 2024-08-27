import { _decorator, assetManager, Canvas, Component, director, EPhysics2DDrawFlags, Node, PhysicsSystem2D, UITransform } from 'cc';
import { ConfigManager } from './core/ConfigManager';
import { ResManager } from './core/ResManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    protected onLoad(): void {
        this.node._persistNode = true;
    }

    protected start() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;

        ConfigManager.instance.init();
        ResManager.instance.init();
    }

    protected update(deltaTime: number) {

    }
}


