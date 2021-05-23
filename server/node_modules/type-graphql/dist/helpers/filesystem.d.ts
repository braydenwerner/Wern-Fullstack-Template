/// <reference types="node" />
import * as fs from "fs";
export declare const fsMkdir: typeof fs.mkdir.__promisify__;
export declare const fsWriteFile: typeof fs.writeFile.__promisify__;
export declare function parsePath(targetPath: string): string[];
export declare function mkdirRecursive(filePath: string): Promise<void>;
export declare function mkdirRecursiveSync(filePath: string): void;
export declare function outputFile(filePath: string, fileContent: any): Promise<void>;
export declare function outputFileSync(filePath: string, fileContent: any): void;
