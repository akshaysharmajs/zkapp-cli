/**
 * @type {import("../../compiled/node_bindings/plonk_wasm.cjs")}
 */
export const wasm: typeof wasm_;
export const withThreadPool: <T>(run: () => Promise<T>) => Promise<T>;
import wasm_ from '../../compiled/node_bindings/plonk_wasm.cjs';
