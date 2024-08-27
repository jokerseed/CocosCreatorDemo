import { Vec2 } from "cc";

export abstract class Bound2D {
    shapeType: ShapeType2D = ShapeType2D.None;

    checkCollision(bound: Bound2D): boolean {
        return false;
    }
}

export class Box2D extends Bound2D {
    center: Vec2;
    size: Vec2;

    constructor(center: Vec2, size: Vec2) {
        super();
        this.shapeType = ShapeType2D.Box;
        this.center = center;
        this.size = size;
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
    None,
    Box,
    Circle,
    Polygon
}