import { ResolverData } from "../interfaces";
export declare function createParamDecorator<TContextType = {}>(resolver: (resolverData: ResolverData<TContextType>) => any): ParameterDecorator;
