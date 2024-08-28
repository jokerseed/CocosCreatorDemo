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
    halfSize: Vec2;
    /**x1,x2,y1,y2 */
    pointValue: Array<number> = [];

    constructor(center: Vec2, size: Vec2) {
        super();
        this.shapeType = ShapeType2D.Box;
        this.center = center;
        this.size = size;
        this.halfSize = new Vec2(size.x * 0.5, size.y * 0.5);
        this.pointValue[0] = this.center.x - this.halfSize.x;
        this.pointValue[1] = this.center.x + this.halfSize.x;
        this.pointValue[2] = this.center.y - this.halfSize.y;
        this.pointValue[3] = this.center.y + this.halfSize.y;
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
    let checkX = (a1.pointValue[0] >= b1.pointValue[0] && a1.pointValue[0] <= b1.pointValue[1]) || (a1.pointValue[1] >= b1.pointValue[0] && a1.pointValue[1] <= b1.pointValue[1]);
    let checkY = (a1.pointValue[2] >= b1.pointValue[2] && a1.pointValue[2] <= b1.pointValue[3]) || (a1.pointValue[3] >= b1.pointValue[2] && a1.pointValue[3] <= b1.pointValue[3]);
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
    let nearestX = Math.max(a1.pointValue[0], Math.min(b1.center.x, a1.pointValue[1]));
    let nearestY = Math.max(a1.pointValue[2], Math.min(b1.center.y, a1.pointValue[3]));
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