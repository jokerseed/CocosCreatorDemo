import { Vec2 } from "cc";
import { Box2D } from "./Bound";
import { Object2D } from "./Object2D";

export class Quadtree {
    max_objects: number;
    max_levels: number;
    level: number;
    bounds: Box2D;
    objects: Array<Object2D>;
    nodes: Array<Quadtree>;

    constructor(bounds: Box2D, max_objects?: number, max_levels?: number, level?: number) {
        this.max_objects = max_objects || 10;
        this.max_levels = max_levels || 4;
        this.level = level || 0;
        this.bounds = bounds;
        this.objects = [];
        this.nodes = [];
    }

    /**
     * 将该节点分成4个子节点
     */
    split() {
        let nextLevel = this.level + 1,
            subWidth = this.bounds.size.x / 2,
            subHeight = this.bounds.size.y / 2,
            x = this.bounds.center.x,
            y = this.bounds.center.y;

        //右上节点
        this.nodes[0] = new Quadtree(
            new Box2D(new Vec2(x + subWidth / 2, y + subHeight / 2), new Vec2(subWidth, subHeight)),
            this.max_objects,
            this.max_levels,
            nextLevel
        );

        //左上节点
        this.nodes[1] = new Quadtree(
            new Box2D(new Vec2(x - subWidth / 2, y + subHeight / 2), new Vec2(subWidth, subHeight)),
            this.max_objects,
            this.max_levels,
            nextLevel
        );

        //左下节点
        this.nodes[2] = new Quadtree(
            new Box2D(new Vec2(x - subWidth / 2, y - subHeight / 2), new Vec2(subWidth, subHeight)),
            this.max_objects,
            this.max_levels,
            nextLevel
        );

        //右下节点
        this.nodes[3] = new Quadtree(
            new Box2D(new Vec2(x + subWidth / 2, y - subHeight / 2), new Vec2(subWidth, subHeight)),
            this.max_objects,
            this.max_levels,
            nextLevel
        );
    }

    /**
     * 确定该对象属于哪些节点
     * @param node 
     * @returns 
     */
    getIndex(node: Object2D): number[] {
        let indexs = [];
        for (let i = 0; i < this.nodes.length; i++) {
            let v = this.nodes[i];
            if (v.bounds.checkCollision(node.bound)) {
                indexs.push(i);
            }
        }
        return indexs;
    }

    /**
     * 将该对象插入节点。如果该节点超过容量，它就会分裂并将所有的对象到它们相应的子节点
     * @param node 
     */
    insert(node: Object2D) {
        if (this.nodes.length) {
            let indexs = this.getIndex(node);
            for (let i = 0; i < indexs.length; i++) {
                this.nodes[indexs[i]].insert(node);
            }
            return;
        }

        this.objects.push(node);

        if (this.objects.length > this.max_objects && this.level < this.max_levels) {
            if (!this.nodes.length) {
                this.split();
            }

            for (let i = 0; i < this.objects.length; i++) {
                let indexs = this.getIndex(this.objects[i]);
                for (let k = 0; k < indexs.length; k++) {
                    this.nodes[indexs[k]].insert(this.objects[i]);
                }
            }

            this.objects = [];
        }
    }

    /**
     * 返回所有可能与给定对象发生碰撞的对象
     * @param node 
     */
    retrieve(node: Object2D) {
        let indexs = this.getIndex(node),
            returnObjects = this.objects;

        if (this.nodes.length) {
            for (let i = 0; i < indexs.length; i++) {
                returnObjects = returnObjects.concat(this.nodes[indexs[i]].retrieve(node));
            }
        }

        returnObjects = returnObjects.filter(function (item, index) {
            return returnObjects.indexOf(item) >= index;
        });

        return returnObjects;
    }

    /**
     * 清除四叉树
     */
    clear() {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes.length) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    }
}