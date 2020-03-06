## Install

It worked only on `1.38.46` version, because
* `-s ONLY_MY_CODE` is removed from version `1.38.47`
* `--separate-asm` is not worked on `1.39.8`, [see this issue](https://github.com/emscripten-core/emscripten/issues/10646)

```cmd
emsdk install 1.38.46
emsdk activate 1.38.46
```

## Compile `C/C++` to `JS`
```cmd
emcc tests/hello_world.c -o tests/hello_world.js -s WASM=0 --separate-asm -Os -g2 -s ASM_JS=1 -s EXPORTED_FUNCTIONS="['_main']" -s ONLY_MY_CODE=1 

emcc tests/heap/queues/implicit_heap.c -o tests/implicit_heap.js -s WASM=0 -Os -g2 -s ASM_JS=1 -s EXPORTED_FUNCTIONS="['_pq_create', '_pq_destroy', '_pq_clear', '_pq_get_key', '_pq_get_item', '_pq_get_size', '_pq_insert', '_pq_find_min', '_pq_delete_min', '_pq_delete', '_pq_decrease_key', '_pq_empty']" -s ERROR_ON_UNDEFINED_SYMBOLS=0
```

## terser

https://xem.github.io/terser-online/

```json5
// options
{
  toplevel: true,
  compress: {
    passes: 5,
    unsafe: true,
    unused: true,
    pure_getters: true,
    hoist_funs : true,
    hoist_props : true,
    hoist_vars: false,
    module: true,
    keep_fargs: false,
    keep_fnames: false,
  },
  mangle: false,
}
```