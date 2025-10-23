//app/api/player/_util/timer.ts

export function withTiming<T>(name: string, fn: () => Promise<T>) {
    const start = process.hrtime.bigint();
    return fn().then((res) => {
        const end = process.hrtime.bigint();
        const ms = Number(end - start) / 1e6;  // get the difference calculation
        return { res, ms, name };
    });
}