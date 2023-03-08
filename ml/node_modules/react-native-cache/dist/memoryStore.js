"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoryStore = {};
exports.default = {
    setItem: async (key, value) => {
        memoryStore[key] = value;
    },
    getAllKeys: async () => {
        return Object.keys(memoryStore);
    },
    getItem: async (key) => {
        return memoryStore[key];
    },
    multiGet: async (keys) => {
        const results = [];
        for (const key of keys) {
            results.push([key, memoryStore[key]]);
        }
        return results;
    },
    multiRemove: async (keys) => {
        for (const key of keys) {
            delete memoryStore[key];
        }
    },
    removeItem: async (key) => {
        delete memoryStore[key];
    }
};
//# sourceMappingURL=memoryStore.js.map