import { math, Vec2 } from "cc";

export abstract class Bound2D {
    shapeType: ShapeType2D = ShapeType2D.None;

    checkCollision(bound: Bound2D): boolean {
        return BoundCheckCollider2D[this.shapeType | bound.shapeType](this, bound);
    }
}

export class Box2D extends Bound2D {
    center: Vec2;
    size: Vec2;
    /**左上 */
    topLeft: Vec2 = new Vec2();
    /**左下 */
    bottomLeft: Vec2 = new Vec2();
    /**右上 */
    topRight: Vec2 = new Vec2();
    /**右下 */
    bottomRight: Vec2 = new Vec2();

    constructor(center: Vec2, size: Vec2) {
        super();
        this.shapeType = ShapeType2D.Box;
        this.center = center;
        this.size = size;
        let halfSize = new Vec2(size.x * 0.5, size.y * 0.5);
        let x1 = this.center.x - halfSize.x;
        let x2 = this.center.x + halfSize.x;
        let y1 = this.center.y - halfSize.y;
        let y2 = this.center.y + halfSize.y;
        this.topLeft.set(x1, y2);
        this.topRight.set(x2, y2);
        this.bottomLeft.set(x1, y1);
        this.bottomRight.set(x2, y1);
    }

    setRotation(rotation: math.Quat) {

    }
}

export class Circle2D extends Bound2D {
    center: Vec2;
    radius: number;

    constructor() {
        super();
        this.shapeType = ShapeType2D.Circle;
    }
}

export class polygon2D extends Bound2D {
    points: Vec2[];

    constructor() {
        super();
        this.shapeType = ShapeType2D.Polygon;
    }
}

export enum ShapeType2D {
    None = 0,
    Box = 1,
    Circle = 2,
    Polygon = 4
}

export const BoundCheckCollider2D: Array<(a: Bound2D, b: Bound2D) => boolean> = [];

BoundCheckCollider2D[ShapeType2D.Box | ShapeType2D.Box] = function (a: Bound2D, b: Bound2D) {
    let a1 = a as Box2D;
    let b1 = b as Box2D;
    let isTriger = false;
    let checkX = (a1.topLeft.x >= b1.topLeft.x && a1.topLeft.x <= b1.topRight.x) || (a1.topRight.x >= b1.topLeft.x && a1.topRight.x <= b1.topRight.x);
    let checkY = (a1.bottomLeft.y >= b1.bottomLeft.y && a1.bottomLeft.y <= b1.topLeft.y) || (a1.topLeft.y >= b1.bottomLeft.y && a1.topLeft.y <= b1.topLeft.y);
    if (checkX && checkY) {
        isTriger = true;
    }
    return isTriger;
}

BoundCheckCollider2D[ShapeType2D.Box | ShapeType2D.Circle] = function (a: Bound2D, b: Bound2D) {
    let a1 = a.shapeType == ShapeType2D.Box ? a as Box2D : b as Box2D;
    let b1 = a.shapeType == ShapeType2D.Circle ? a as Circle2D : b as Circle2D;
    let isTriger = false;
    // 计算圆形中心到矩形最近点的 x 和 y 距离
    let nearestX = Math.max(a1.topLeft.x, Math.min(b1.center.x, a1.topRight.x));
    let nearestY = Math.max(a1.bottomRight.y, Math.min(b1.center.y, a1.topRight.y));
    // 计算圆形中心到最近点的距离的平方
    let distanceSquared = (b1.center.x - nearestX) * (b1.center.x - nearestX) + (b1.center.y - nearestY) * (b1.center.y - nearestY);
    // 如果距离的平方小于圆形半径的平方，则发生碰撞
    isTriger = distanceSquared < b1.radius * b1.radius;
    return isTriger;
}

BoundCheckCollider2D[ShapeType2D.Circle | ShapeType2D.Circle] = function (a: Bound2D, b: Bound2D) {
    let a1 = a as Circle2D;
    let b1 = b as Circle2D;
    let isTriger = false;
    let distance = a1.center.subtract(b1.center).length();
    if (distance <= (a1.radius + b1.radius)) isTriger = true;
    return isTriger;
}