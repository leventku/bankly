export const notReachable = (state: never) => {
    throw new Error("should not be reachable");
};