import { Middleware } from "../interfaces/Middleware";
import { MethodAndPropDecorator } from "./types";
export declare function UseMiddleware(middlewares: Array<Middleware<any>>): MethodAndPropDecorator;
export declare function UseMiddleware(...middlewares: Array<Middleware<any>>): MethodAndPropDecorator;
