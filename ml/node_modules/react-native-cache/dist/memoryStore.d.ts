declare const _default: {
    setItem: (key: string, value: string) => Promise<void>;
    getAllKeys: () => Promise<string[]>;
    getItem: (key: string) => Promise<string>;
    multiGet: (keys: string[]) => Promise<any[][]>;
    multiRemove: (keys: string[]) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
};
export default _default;
