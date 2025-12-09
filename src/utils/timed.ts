import { createTimed } from "@utils/createTimed.js";

export function timed<T>(
    fn: () => T | Promise<T>,
    timeout: number,
    timeoutMessage?: string,
): Promise<T> {
    return createTimed(fn, timeout, timeoutMessage)();
}
