export function createTimed<TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => TReturn | Promise<TReturn>,
    timeout: number,
    timeoutMessage?: string,
): (...args: TArgs) => Promise<TReturn> {
    return (...args: TArgs) =>
        new Promise<TReturn>((resolve, reject) => {
            // set timeout
            const timeoutID = setTimeout(() => {
                reject(
                    new Error(
                        timeoutMessage ||
                            `Function timed out after ${timeout} ms`,
                    ),
                );
            }, timeout);

            Promise.resolve(fn(...args))
                .then(resolve)
                .catch(reject)
                .finally(() => clearTimeout(timeoutID));
        });
}
