let wasm;
export function __wbg_set_wasm(val) {
  wasm = val;
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) {
  return heap[idx];
}

let heap_next = heap.length;

function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

const lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder("utf-8", { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === "undefined" ? (0, module.require)("util").TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder("utf-8");

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
  if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
    cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
  }
  return cachedFloat64Memory0;
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
  if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
    cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
  }
  return cachedBigInt64Memory0;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
  if (stack_pointer == 1) throw new Error("out of js stack");
  heap[--stack_pointer] = obj;
  return stack_pointer;
}
/**
 * The main wasm function to call
 * @param {any} input
 * @returns {any}
 */
export function schedule(input) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.schedule(retptr, addBorrowedObject(input));
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return takeObject(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    heap[stack_pointer++] = undefined;
  }
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}

export function __wbindgen_object_drop_ref(arg0) {
  takeObject(arg0);
}

export function __wbindgen_is_bigint(arg0) {
  const ret = typeof getObject(arg0) === "bigint";
  return ret;
}

export function __wbindgen_bigint_from_u64(arg0) {
  const ret = BigInt.asUintN(64, arg0);
  return addHeapObject(ret);
}

export function __wbindgen_jsval_eq(arg0, arg1) {
  const ret = getObject(arg0) === getObject(arg1);
  return ret;
}

export function __wbindgen_error_new(arg0, arg1) {
  const ret = new Error(getStringFromWasm0(arg0, arg1));
  return addHeapObject(ret);
}

export function __wbindgen_string_get(arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === "string" ? obj : undefined;
  var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}

export function __wbindgen_is_object(arg0) {
  const val = getObject(arg0);
  const ret = typeof val === "object" && val !== null;
  return ret;
}

export function __wbindgen_is_undefined(arg0) {
  const ret = getObject(arg0) === undefined;
  return ret;
}

export function __wbindgen_in(arg0, arg1) {
  const ret = getObject(arg0) in getObject(arg1);
  return ret;
}

export function __wbindgen_object_clone_ref(arg0) {
  const ret = getObject(arg0);
  return addHeapObject(ret);
}

export function __wbg_new_abda76e883ba8a5f() {
  const ret = new Error();
  return addHeapObject(ret);
}

export function __wbg_stack_658279fe44541cf6(arg0, arg1) {
  const ret = getObject(arg1).stack;
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}

export function __wbg_error_f851667af71bcfc6(arg0, arg1) {
  let deferred0_0;
  let deferred0_1;
  try {
    deferred0_0 = arg0;
    deferred0_1 = arg1;
    console.error(getStringFromWasm0(arg0, arg1));
  } finally {
    wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
  }
}

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
  const ret = getObject(arg0) == getObject(arg1);
  return ret;
}

export function __wbindgen_boolean_get(arg0) {
  const v = getObject(arg0);
  const ret = typeof v === "boolean" ? (v ? 1 : 0) : 2;
  return ret;
}

export function __wbindgen_number_get(arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === "number" ? obj : undefined;
  getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
  getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
}

export function __wbg_String_88810dfeb4021902(arg0, arg1) {
  const ret = String(getObject(arg1));
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}

export function __wbindgen_number_new(arg0) {
  const ret = arg0;
  return addHeapObject(ret);
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return addHeapObject(ret);
}

export function __wbg_getwithrefkey_5e6d9547403deab8(arg0, arg1) {
  const ret = getObject(arg0)[getObject(arg1)];
  return addHeapObject(ret);
}

export function __wbg_set_841ac57cff3d672b(arg0, arg1, arg2) {
  getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
}

export function __wbg_get_4a9aa5157afeb382(arg0, arg1) {
  const ret = getObject(arg0)[arg1 >>> 0];
  return addHeapObject(ret);
}

export function __wbg_length_cace2e0b3ddc0502(arg0) {
  const ret = getObject(arg0).length;
  return ret;
}

export function __wbg_new_08236689f0afb357() {
  const ret = new Array();
  return addHeapObject(ret);
}

export function __wbindgen_is_function(arg0) {
  const ret = typeof getObject(arg0) === "function";
  return ret;
}

export function __wbg_next_15da6a3df9290720(arg0) {
  const ret = getObject(arg0).next;
  return addHeapObject(ret);
}

export function __wbg_next_1989a20442400aaa() {
  return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_done_bc26bf4ada718266(arg0) {
  const ret = getObject(arg0).done;
  return ret;
}

export function __wbg_value_0570714ff7d75f35(arg0) {
  const ret = getObject(arg0).value;
  return addHeapObject(ret);
}

export function __wbg_iterator_7ee1a391d310f8e4() {
  const ret = Symbol.iterator;
  return addHeapObject(ret);
}

export function __wbg_get_2aff440840bb6202() {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_call_669127b9d730c650() {
  return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_new_c728d68b8b34487e() {
  const ret = new Object();
  return addHeapObject(ret);
}

export function __wbg_set_0ac78a2bc07da03c(arg0, arg1, arg2) {
  getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
}

export function __wbg_isArray_38525be7442aa21e(arg0) {
  const ret = Array.isArray(getObject(arg0));
  return ret;
}

export function __wbg_instanceof_ArrayBuffer_c7cc317e5c29cc0d(arg0) {
  let result;
  try {
    result = getObject(arg0) instanceof ArrayBuffer;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_isSafeInteger_c38b0a16d0c7cef7(arg0) {
  const ret = Number.isSafeInteger(getObject(arg0));
  return ret;
}

export function __wbg_buffer_344d9b41efe96da7(arg0) {
  const ret = getObject(arg0).buffer;
  return addHeapObject(ret);
}

export function __wbg_new_d8a000788389a31e(arg0) {
  const ret = new Uint8Array(getObject(arg0));
  return addHeapObject(ret);
}

export function __wbg_set_dcfd613a3420f908(arg0, arg1, arg2) {
  getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}

export function __wbg_length_a5587d6cd79ab197(arg0) {
  const ret = getObject(arg0).length;
  return ret;
}

export function __wbg_instanceof_Uint8Array_19e6f142a5e7e1e1(arg0) {
  let result;
  try {
    result = getObject(arg0) instanceof Uint8Array;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbindgen_bigint_get_as_i64(arg0, arg1) {
  const v = getObject(arg1);
  const ret = typeof v === "bigint" ? v : undefined;
  getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
  getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
}

export function __wbindgen_debug_string(arg0, arg1) {
  const ret = debugString(getObject(arg1));
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}

export function __wbindgen_memory() {
  const ret = wasm.memory;
  return addHeapObject(ret);
}
