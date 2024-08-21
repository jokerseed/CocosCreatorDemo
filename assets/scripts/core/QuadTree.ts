/**
 * 四叉树
 */

import { Node, ResolutionPolicy, Vec2, View, view } from "cc";

export class QuadTree {
    private static _instance: QuadTree;
    static get instance(): QuadTree {
        if (!this._instance) {
            this._instance = new QuadTree();
        }
        return this._instance;
    }
    private constructor() { }

    /**分割的最小边长 */
    private _minSide: number;
    get minSide() {
        return this._minSide;
    }
    /**区域最大节点数 */
    private _maxNum: number;
    get maxNum() {
        return this._maxNum;
    }
    /**根节点 */
    private _rootNode: QuadTreeNode;

    init(minSide: number, maxNum: number) {
        this._minSide = minSide;
        this._maxNum = maxNum;
        let size = View.instance.getDesignResolutionSize();
        this._rootNode = new QuadTreeNode(0, 0, size.width, size.height);
    }

    updateNode(node: Node2D) {
        //需要先清除现有节点的node缓存
        this._rootNode.checkAgain(node);
        this._rootNode.updateNode(node);
    }
}

export class QuadTreeNode {
    private _leftUp: QuadTreeNode;
    private _leftDown: QuadTreeNode;
    private _rightUp: QuadTreeNode;
    private _rightDown: QuadTreeNode;

    /**节点中心x */
    private _x: number;
    /**节点中心x */
    private _y: number;
    /**区域宽 */
    private _w: number;
    /**区域高 */
    private _h: number;
    /**区域内的节点 */
    private _nodes: Array<Node2D> = [];

    constructor(x: number, y: number, w: number, h: number) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }

    checkAgain(node: Node2D) {
        if (this._leftUp && this._leftDown && this._rightDown && this._rightUp) {
            this._leftUp.checkAgain(node);
            this._leftDown.checkAgain(node);
            this._rightDown.checkAgain(node);
            this._rightUp.checkAgain(node);
        } else {
            let index = this._nodes.findIndex(v => {
                return v.uid == node.uid;
            })
            if (index > -1) {
                this._nodes.splice(index, 1);
            }
        }
    }

    checkSplitRect() {
        let maxNum = QuadTree.instance.maxNum;
        if (this._nodes.length <= maxNum) return;
        let halfW = this._w * 0.5;
        let halfH = this._h * 0.5;
        let minSide = QuadTree.instance.minSide;
        if (halfW <= minSide || halfH <= minSide) return;
        let devHalfW = halfW * 0.5;
        let devHalfH = halfH * 0.5;
        this._leftUp = new QuadTreeNode(this._x - devHalfW, this._y + devHalfH, halfW, halfH);
        this._leftDown = new QuadTreeNode(this._x - devHalfW, this._y - devHalfH, halfW, halfH);
        this._rightUp = new QuadTreeNode(this._x + devHalfW, this._y + devHalfH, halfW, halfH);
        this._rightDown = new QuadTreeNode(this._x + devHalfW, this._y - devHalfH, halfW, halfH);
        for (let i = 0; i < this._nodes.length; i++) {
            let node = this._nodes[i];
            this._leftUp.updateNode(node);
            this._leftDown.updateNode(node);
            this._rightDown.updateNode(node);
            this._rightUp.updateNode(node);
        }
        this._nodes.length = 0;
    }

    updateNode(node: Node2D) {
        //要判断交集

        if (this._leftUp && this._leftDown && this._rightDown && this._rightUp) {
            this._leftUp.updateNode(node);
            this._leftDown.updateNode(node);
            this._rightDown.updateNode(node);
            this._rightUp.updateNode(node);
        } else {
            this._nodes.push(node);
            this.checkSplitRect();
        }
    }
}

export class Node2D {
    x: number = 0;
    y: number = 0;
    w: number = 0;
    h: number = 0;
    node: Node;
    uid: number;
}