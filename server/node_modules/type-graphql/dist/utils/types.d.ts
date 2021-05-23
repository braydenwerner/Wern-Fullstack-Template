export declare type Without<FirstType, SecondType> = {
    [KeyType in Exclude<keyof FirstType, keyof SecondType>]?: never;
};
export declare type MergeExclusive<FirstType, SecondType> = FirstType | SecondType extends object ? (Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType) : FirstType | SecondType;
