export const _asm = function() {
    var out, err, tempRet0, setTempRet0, getTempRet0, buffer, HEAP8, HEAPU8, HEAP32, INITIAL_TOTAL_MEMORY, Module = {};

    function _emscripten_get_heap_size() {
        return HEAP8.length
    }
    return out = console.log.bind(console), err = console.warn.bind(console), Array(0), tempRet0 = 0, setTempRet0 = function(value) {
            tempRet0 = value
        }, getTempRet0 = function() {
            return tempRet0
        }, "undefined" != typeof TextDecoder && new TextDecoder("utf8"), "undefined" != typeof TextDecoder && new TextDecoder("utf-16le"), INITIAL_TOTAL_MEMORY = 16777216, INITIAL_TOTAL_MEMORY = (buffer = new ArrayBuffer(INITIAL_TOTAL_MEMORY)).byteLength,
        function(buf) {
            buffer = buf, HEAP8 = new Int8Array(buf), new Int16Array(buf), HEAP32 = new Int32Array(buf), HEAPU8 = new Uint8Array(buf), new Uint16Array(buf), new Uint32Array(buf), new Float32Array(buf), new Float64Array(buf)
        }(buffer), HEAP32[132] = 5243616,
        function() {
            var HEAP8 = new Int8Array(buffer),
                HEAP32 = new Int32Array(buffer),
                Math_imul = Math.imul,
                STACKTOP = 736;

            function _malloc(i1) {
                i1 |= 0;
                var i15, i2 = 0,
                    i3 = 0,
                    i4 = 0,
                    i5 = 0,
                    i6 = 0,
                    i7 = 0,
                    i8 = 0,
                    i9 = 0,
                    i10 = 0,
                    i11 = 0,
                    i12 = 0,
                    i13 = 0,
                    i14 = 0;
                i15 = STACKTOP, STACKTOP = STACKTOP + 16 | 0, i13 = i15;
                do {
                    if (i1 >>> 0 < 245) {
                        if (3 & (i2 = (i12 = 0 | HEAP32[3]) >>> (i1 = (i10 = i1 >>> 0 < 11 ? 16 : i1 + 11 & -8) >>> 3)) | 0) return (0 | (i3 = 0 | HEAP32[(i6 = 8 + (i2 = 0 | HEAP32[(i1 = 8 + (i5 = 52 + ((i4 = (1 & i2 ^ 1) + i1 | 0) << 1 << 2) | 0) | 0) >> 2]) | 0) >> 2])) == (0 | i5) ? HEAP32[3] = i12 & ~(1 << i4) : (HEAP32[i3 + 12 >> 2] = i5, HEAP32[i1 >> 2] = i3), HEAP32[i2 + 4 >> 2] = 3 | (i14 = i4 << 3), HEAP32[(i14 = i2 + i14 + 4 | 0) >> 2] = 1 | HEAP32[i14 >> 2], STACKTOP = i15, 0 | i6;
                        if (i10 >>> 0 > (i11 = 0 | HEAP32[5]) >>> 0) {
                            if (0 | i2) return i3 = ((i3 = i2 << i1 & ((i3 = 2 << i1) | 0 - i3)) & 0 - i3) - 1 | 0, (0 | (i2 = 0 | HEAP32[(i8 = 8 + (i6 = 0 | HEAP32[(i1 = 8 + (i3 = 52 + ((i4 = ((i2 = (i3 >>>= i8 = i3 >>> 12 & 16) >>> 5 & 8) | i8 | (i6 = (i3 >>>= i2) >>> 2 & 4) | (i1 = (i3 >>>= i6) >>> 1 & 2) | (i4 = (i3 >>>= i1) >>> 1 & 1)) + (i3 >>> i4) | 0) << 1 << 2) | 0) | 0) >> 2]) | 0) >> 2])) == (0 | i3) ? HEAP32[3] = i2 = i12 & ~(1 << i4) : (HEAP32[i2 + 12 >> 2] = i3, HEAP32[i1 >> 2] = i2, i2 = i12), i7 = (i14 = i4 << 3) - i10 | 0, HEAP32[i6 + 4 >> 2] = 3 | i10, HEAP32[4 + (i5 = i6 + i10 | 0) >> 2] = 1 | i7, HEAP32[i6 + i14 >> 2] = i7, 0 | i11 && (i4 = 0 | HEAP32[8], i3 = 52 + ((i1 = i11 >>> 3) << 1 << 2) | 0, i2 & (i1 = 1 << i1) ? (i1 = i2 = i3 + 8 | 0, i2 = 0 | HEAP32[i2 >> 2]) : (HEAP32[3] = i2 | i1, i1 = i3 + 8 | 0, i2 = i3), HEAP32[i1 >> 2] = i4, HEAP32[i2 + 12 >> 2] = i4, HEAP32[i4 + 8 >> 2] = i2, HEAP32[i4 + 12 >> 2] = i3), HEAP32[5] = i7, HEAP32[8] = i5, STACKTOP = i15, 0 | i8;
                            if (i6 = 0 | HEAP32[4]) {
                                for (i8 = (i6 & 0 - i6) - 1 | 0, i8 = (-8 & HEAP32[4 + (i9 = 0 | HEAP32[316 + (((i4 = (i8 >>>= i5 = i8 >>> 12 & 16) >>> 5 & 8) | i5 | (i7 = (i8 >>>= i4) >>> 2 & 4) | (i2 = (i8 >>>= i7) >>> 1 & 2) | (i9 = (i8 >>>= i2) >>> 1 & 1)) + (i8 >>> i9) << 2) >> 2]) >> 2]) - i10 | 0, i2 = i9;
                                    (i1 = 0 | HEAP32[i2 + 16 >> 2]) || (i1 = 0 | HEAP32[i2 + 20 >> 2]);) i8 = (i7 = (i2 = (-8 & HEAP32[i1 + 4 >> 2]) - i10 | 0) >>> 0 < i8 >>> 0) ? i2 : i8, i2 = i1, i9 = i7 ? i1 : i9;
                                if ((i7 = i9 + i10 | 0) >>> 0 > i9 >>> 0) {
                                    i5 = 0 | HEAP32[i9 + 24 >> 2], i1 = 0 | HEAP32[i9 + 12 >> 2];
                                    do {
                                        if ((0 | i1) == (0 | i9)) {
                                            if (!(i1 = 0 | HEAP32[(i2 = i9 + 20 | 0) >> 2]) && !(i1 = 0 | HEAP32[(i2 = i9 + 16 | 0) >> 2])) {
                                                i3 = 0;
                                                break
                                            }
                                            for (;;)
                                                if (i3 = 0 | HEAP32[(i4 = i1 + 20 | 0) >> 2]) i1 = i3, i2 = i4;
                                                else {
                                                    if (!(i3 = 0 | HEAP32[(i4 = i1 + 16 | 0) >> 2])) break;
                                                    i1 = i3, i2 = i4
                                                } HEAP32[i2 >> 2] = 0, i3 = i1
                                        } else HEAP32[12 + (i3 = 0 | HEAP32[i9 + 8 >> 2]) >> 2] = i1, HEAP32[i1 + 8 >> 2] = i3, i3 = i1
                                    } while (0);
                                    do {
                                        if (0 | i5) {
                                            if ((0 | i9) == (0 | HEAP32[(i2 = 316 + ((i1 = 0 | HEAP32[i9 + 28 >> 2]) << 2) | 0) >> 2])) {
                                                if (HEAP32[i2 >> 2] = i3, !i3) {
                                                    HEAP32[4] = i6 & ~(1 << i1);
                                                    break
                                                }
                                            } else if (HEAP32[((0 | HEAP32[(i14 = i5 + 16 | 0) >> 2]) == (0 | i9) ? i14 : i5 + 20 | 0) >> 2] = i3, !i3) break;
                                            HEAP32[i3 + 24 >> 2] = i5, 0 | (i1 = 0 | HEAP32[i9 + 16 >> 2]) && (HEAP32[i3 + 16 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3), 0 | (i1 = 0 | HEAP32[i9 + 20 >> 2]) && (HEAP32[i3 + 20 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3)
                                        }
                                    } while (0);
                                    return i8 >>> 0 < 16 ? (HEAP32[i9 + 4 >> 2] = 3 | (i14 = i8 + i10 | 0), HEAP32[(i14 = i9 + i14 + 4 | 0) >> 2] = 1 | HEAP32[i14 >> 2]) : (HEAP32[i9 + 4 >> 2] = 3 | i10, HEAP32[i7 + 4 >> 2] = 1 | i8, HEAP32[i7 + i8 >> 2] = i8, 0 | i11 && (i4 = 0 | HEAP32[8], i3 = 52 + ((i1 = i11 >>> 3) << 1 << 2) | 0, (i1 = 1 << i1) & i12 ? (i1 = i2 = i3 + 8 | 0, i2 = 0 | HEAP32[i2 >> 2]) : (HEAP32[3] = i1 | i12, i1 = i3 + 8 | 0, i2 = i3), HEAP32[i1 >> 2] = i4, HEAP32[i2 + 12 >> 2] = i4, HEAP32[i4 + 8 >> 2] = i2, HEAP32[i4 + 12 >> 2] = i3), HEAP32[5] = i8, HEAP32[8] = i7), STACKTOP = i15, 0 | i9 + 8
                                }
                            }
                        }
                    } else if (i1 >>> 0 > 4294967231) i10 = -1;
                    else if (i10 = -8 & (i1 = i1 + 11 | 0), i4 = 0 | HEAP32[4]) {
                        i2 = 0 - i10 | 0, i8 = (i1 >>>= 8) ? i10 >>> 0 > 16777215 ? 31 : i10 >>> (7 + (i8 = 14 - ((i11 = (520192 + (i14 = i1 << (i12 = (i1 + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | i12 | (i8 = (245760 + (i14 <<= i11) | 0) >>> 16 & 2)) + (i14 << i8 >>> 15) | 0) | 0) & 1 | i8 << 1 : 0, i1 = 0 | HEAP32[316 + (i8 << 2) >> 2];
                        L79: do {
                            if (i1)
                                for (i3 = 0, i6 = i10 << (31 == (0 | i8) ? 0 : 25 - (i8 >>> 1) | 0), i7 = i1, i1 = 0;;) {
                                    if ((i5 = (-8 & HEAP32[i7 + 4 >> 2]) - i10 | 0) >>> 0 < i2 >>> 0) {
                                        if (!i5) {
                                            i2 = 0, i3 = i7, i1 = i7, i14 = 65;
                                            break L79
                                        }
                                        i2 = i5, i1 = i7
                                    }
                                    if (i3 = 0 == (0 | (i14 = 0 | HEAP32[i7 + 20 >> 2])) | (0 | i14) == (0 | (i7 = 0 | HEAP32[i7 + 16 + (i6 >>> 31 << 2) >> 2])) ? i3 : i14, !i7) {
                                        i14 = 61;
                                        break
                                    }
                                    i6 <<= 1
                                } else i3 = 0, i1 = 0, i14 = 61
                        } while (0);
                        if (61 == (0 | i14)) {
                            if (0 == (0 | i3) & 0 == (0 | i1)) {
                                if (!(i1 = ((i1 = 2 << i8) | 0 - i1) & i4)) break;
                                i1 = (i1 & 0 - i1) - 1 | 0, i3 = 0 | HEAP32[316 + (((i8 = (i1 >>>= i9 = i1 >>> 12 & 16) >>> 5 & 8) | i9 | (i11 = (i1 >>>= i8) >>> 2 & 4) | (i12 = (i1 >>>= i11) >>> 1 & 2) | (i3 = (i1 >>>= i12) >>> 1 & 1)) + (i1 >>> i3) << 2) >> 2], i1 = 0
                            }
                            i3 ? i14 = 65 : (i7 = i2, i9 = i1)
                        }
                        if (65 == (0 | i14))
                            for (;;) {
                                if (i2 = (i5 = (i12 = (-8 & HEAP32[i3 + 4 >> 2]) - i10 | 0) >>> 0 < i2 >>> 0) ? i12 : i2, i5 = i5 ? i3 : i1, (i1 = 0 | HEAP32[i3 + 16 >> 2]) || (i1 = 0 | HEAP32[i3 + 20 >> 2]), !i1) {
                                    i7 = i2, i9 = i5;
                                    break
                                }
                                i3 = i1, i1 = i5
                            }
                        if (i9 && i7 >>> 0 < ((0 | HEAP32[5]) - i10 | 0) >>> 0 && (i8 = i9 + i10 | 0) >>> 0 > i9 >>> 0) {
                            i6 = 0 | HEAP32[i9 + 24 >> 2], i1 = 0 | HEAP32[i9 + 12 >> 2];
                            do {
                                if ((0 | i1) == (0 | i9)) {
                                    if (!(i1 = 0 | HEAP32[(i2 = i9 + 20 | 0) >> 2]) && !(i1 = 0 | HEAP32[(i2 = i9 + 16 | 0) >> 2])) {
                                        i1 = 0;
                                        break
                                    }
                                    for (;;)
                                        if (i3 = 0 | HEAP32[(i5 = i1 + 20 | 0) >> 2]) i1 = i3, i2 = i5;
                                        else {
                                            if (!(i3 = 0 | HEAP32[(i5 = i1 + 16 | 0) >> 2])) break;
                                            i1 = i3, i2 = i5
                                        } HEAP32[i2 >> 2] = 0
                                } else HEAP32[12 + (i14 = 0 | HEAP32[i9 + 8 >> 2]) >> 2] = i1, HEAP32[i1 + 8 >> 2] = i14
                            } while (0);
                            do {
                                if (i6) {
                                    if ((0 | i9) == (0 | HEAP32[(i3 = 316 + ((i2 = 0 | HEAP32[i9 + 28 >> 2]) << 2) | 0) >> 2])) {
                                        if (HEAP32[i3 >> 2] = i1, !i1) {
                                            HEAP32[4] = i4 &= ~(1 << i2);
                                            break
                                        }
                                    } else if (HEAP32[((0 | HEAP32[(i14 = i6 + 16 | 0) >> 2]) == (0 | i9) ? i14 : i6 + 20 | 0) >> 2] = i1, !i1) break;
                                    HEAP32[i1 + 24 >> 2] = i6, 0 | (i2 = 0 | HEAP32[i9 + 16 >> 2]) && (HEAP32[i1 + 16 >> 2] = i2, HEAP32[i2 + 24 >> 2] = i1), (i2 = 0 | HEAP32[i9 + 20 >> 2]) && (HEAP32[i1 + 20 >> 2] = i2, HEAP32[i2 + 24 >> 2] = i1)
                                }
                            } while (0);
                            L128: do {
                                if (i7 >>> 0 < 16) HEAP32[i9 + 4 >> 2] = 3 | (i14 = i7 + i10 | 0), HEAP32[(i14 = i9 + i14 + 4 | 0) >> 2] = 1 | HEAP32[i14 >> 2];
                                else {
                                    if (HEAP32[i9 + 4 >> 2] = 3 | i10, HEAP32[i8 + 4 >> 2] = 1 | i7, HEAP32[i8 + i7 >> 2] = i7, i1 = i7 >>> 3, i7 >>> 0 < 256) {
                                        i3 = 52 + (i1 << 1 << 2) | 0, (i2 = 0 | HEAP32[3]) & (i1 = 1 << i1) ? (i1 = i2 = i3 + 8 | 0, i2 = 0 | HEAP32[i2 >> 2]) : (HEAP32[3] = i2 | i1, i1 = i3 + 8 | 0, i2 = i3), HEAP32[i1 >> 2] = i8, HEAP32[i2 + 12 >> 2] = i8, HEAP32[i8 + 8 >> 2] = i2, HEAP32[i8 + 12 >> 2] = i3;
                                        break
                                    }
                                    if (i1 = 316 + ((i3 = (i1 = i7 >>> 8) ? i7 >>> 0 > 16777215 ? 31 : i7 >>> (7 + (i3 = 14 - ((i12 = (520192 + (i14 = i1 << (i13 = (i1 + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | i13 | (i3 = (245760 + (i14 <<= i12) | 0) >>> 16 & 2)) + (i14 << i3 >>> 15) | 0) | 0) & 1 | i3 << 1 : 0) << 2) | 0, HEAP32[i8 + 28 >> 2] = i3, HEAP32[4 + (i2 = i8 + 16 | 0) >> 2] = 0, HEAP32[i2 >> 2] = 0, !(i4 & (i2 = 1 << i3))) {
                                        HEAP32[4] = i4 | i2, HEAP32[i1 >> 2] = i8, HEAP32[i8 + 24 >> 2] = i1, HEAP32[i8 + 12 >> 2] = i8, HEAP32[i8 + 8 >> 2] = i8;
                                        break
                                    }
                                    i1 = 0 | HEAP32[i1 >> 2];
                                    L145: do {
                                        if ((-8 & HEAP32[i1 + 4 >> 2] | 0) != (0 | i7)) {
                                            for (i4 = i7 << (31 == (0 | i3) ? 0 : 25 - (i3 >>> 1) | 0); i2 = 0 | HEAP32[(i3 = i1 + 16 + (i4 >>> 31 << 2) | 0) >> 2];) {
                                                if ((-8 & HEAP32[i2 + 4 >> 2] | 0) == (0 | i7)) {
                                                    i1 = i2;
                                                    break L145
                                                }
                                                i4 <<= 1, i1 = i2
                                            }
                                            HEAP32[i3 >> 2] = i8, HEAP32[i8 + 24 >> 2] = i1, HEAP32[i8 + 12 >> 2] = i8, HEAP32[i8 + 8 >> 2] = i8;
                                            break L128
                                        }
                                    } while (0);
                                    HEAP32[12 + (i14 = 0 | HEAP32[(i13 = i1 + 8 | 0) >> 2]) >> 2] = i8, HEAP32[i13 >> 2] = i8, HEAP32[i8 + 8 >> 2] = i14, HEAP32[i8 + 12 >> 2] = i1, HEAP32[i8 + 24 >> 2] = 0
                                }
                            } while (0);
                            return STACKTOP = i15, 0 | i9 + 8
                        }
                    }
                } while (0);
                if ((i3 = 0 | HEAP32[5]) >>> 0 >= i10 >>> 0) return i1 = 0 | HEAP32[8], (i2 = i3 - i10 | 0) >>> 0 > 15 ? (HEAP32[8] = i14 = i1 + i10 | 0, HEAP32[5] = i2, HEAP32[i14 + 4 >> 2] = 1 | i2, HEAP32[i1 + i3 >> 2] = i2, HEAP32[i1 + 4 >> 2] = 3 | i10) : (HEAP32[5] = 0, HEAP32[8] = 0, HEAP32[i1 + 4 >> 2] = 3 | i3, HEAP32[(i14 = i1 + i3 + 4 | 0) >> 2] = 1 | HEAP32[i14 >> 2]), STACKTOP = i15, 0 | i1 + 8;
                if ((i6 = 0 | HEAP32[6]) >>> 0 > i10 >>> 0) return HEAP32[6] = i12 = i6 - i10 | 0, HEAP32[9] = i13 = (i14 = 0 | HEAP32[9]) + i10 | 0, HEAP32[i13 + 4 >> 2] = 1 | i12, HEAP32[i14 + 4 >> 2] = 3 | i10, STACKTOP = i15, 0 | i14 + 8;
                if (0 | HEAP32[121] ? i1 = 0 | HEAP32[123] : (HEAP32[123] = 4096, HEAP32[122] = 4096, HEAP32[124] = -1, HEAP32[125] = -1, HEAP32[126] = 0, HEAP32[114] = 0, HEAP32[121] = -16 & i13 ^ 1431655768, i1 = 4096), i7 = i10 + 48 | 0, (i9 = (i5 = i1 + (i8 = i10 + 47 | 0) | 0) & (i3 = 0 - i1 | 0)) >>> 0 <= i10 >>> 0) return STACKTOP = i15, 0;
                if (0 | (i1 = 0 | HEAP32[113]) && (i13 = (i12 = 0 | HEAP32[111]) + i9 | 0) >>> 0 <= i12 >>> 0 | i13 >>> 0 > i1 >>> 0) return STACKTOP = i15, 0;
                L178: do {
                    if (4 & HEAP32[114]) i1 = 0, i14 = 143;
                    else {
                        i2 = 0 | HEAP32[9];
                        L180: do {
                            if (i2) {
                                for (i4 = 460; !((i1 = 0 | HEAP32[i4 >> 2]) >>> 0 <= i2 >>> 0 && (i1 + (0 | HEAP32[i4 + 4 >> 2]) | 0) >>> 0 > i2 >>> 0);) {
                                    if (!(i1 = 0 | HEAP32[i4 + 8 >> 2])) {
                                        i14 = 128;
                                        break L180
                                    }
                                    i4 = i1
                                }
                                if ((i1 = i5 - i6 & i3) >>> 0 < 2147483647)
                                    if ((0 | (i2 = 0 | _sbrk(i1))) == ((0 | HEAP32[i4 >> 2]) + (0 | HEAP32[i4 + 4 >> 2]) | 0)) {
                                        if (-1 != (0 | i2)) {
                                            i6 = i2, i14 = 145;
                                            break L178
                                        }
                                    } else i4 = i2, i14 = 136;
                                else i1 = 0
                            } else i14 = 128
                        } while (0);
                        do {
                            if (128 == (0 | i14))
                                if (-1 == (0 | (i5 = 0 | _sbrk(0)))) i1 = 0;
                                else if (i4 = (i1 = (0 == ((i4 = (i2 = 0 | HEAP32[122]) - 1 | 0) & (i1 = i5) | 0) ? 0 : (i4 + i1 & 0 - i2) - i1 | 0) + i9 | 0) + (i2 = 0 | HEAP32[111]) | 0, i1 >>> 0 > i10 >>> 0 & i1 >>> 0 < 2147483647) {
                                if (0 | (i3 = 0 | HEAP32[113]) && i4 >>> 0 <= i2 >>> 0 | i4 >>> 0 > i3 >>> 0) {
                                    i1 = 0;
                                    break
                                }
                                if ((0 | (i2 = 0 | _sbrk(i1))) == (0 | i5)) {
                                    i6 = i5, i14 = 145;
                                    break L178
                                }
                                i4 = i2, i14 = 136
                            } else i1 = 0
                        } while (0);
                        do {
                            if (136 == (0 | i14)) {
                                if (i3 = 0 - i1 | 0, !(i7 >>> 0 > i1 >>> 0 & i1 >>> 0 < 2147483647 & -1 != (0 | i4))) {
                                    if (-1 == (0 | i4)) {
                                        i1 = 0;
                                        break
                                    }
                                    i6 = i4, i14 = 145;
                                    break L178
                                }
                                if ((i2 = i8 - i1 + (i2 = 0 | HEAP32[123]) & 0 - i2) >>> 0 >= 2147483647) {
                                    i6 = i4, i14 = 145;
                                    break L178
                                }
                                if (-1 == (0 | _sbrk(i2))) {
                                    _sbrk(i3), i1 = 0;
                                    break
                                }
                                i6 = i4, i1 = i2 + i1 | 0, i14 = 145;
                                break L178
                            }
                        } while (0);
                        HEAP32[114] = 4 | HEAP32[114], i14 = 143
                    }
                } while (0);
                if (143 == (0 | i14) && i9 >>> 0 < 2147483647 && (-1 == (0 | (i2 = 0 | _sbrk(i9))) | 1 ^ (i3 = (i4 = (i13 = 0 | _sbrk(0)) - i2 | 0) >>> 0 > (i10 + 40 | 0) >>> 0) | i2 >>> 0 < i13 >>> 0 & -1 != (0 | i2) & -1 != (0 | i13) ^ 1 || (i6 = i2, i1 = i3 ? i4 : i1, i14 = 145)), 145 == (0 | i14)) {
                    HEAP32[111] = i2 = (0 | HEAP32[111]) + i1 | 0, i2 >>> 0 > (0 | HEAP32[112]) >>> 0 && (HEAP32[112] = i2), i7 = 0 | HEAP32[9];
                    L215: do {
                        if (i7) {
                            i2 = 460;
                            do {
                                if ((0 | i6) == ((i3 = 0 | HEAP32[i2 >> 2]) + (i4 = 0 | HEAP32[i2 + 4 >> 2]) | 0)) {
                                    i14 = 154;
                                    break
                                }
                                i2 = 0 | HEAP32[i2 + 8 >> 2]
                            } while (0 != (0 | i2));
                            if (154 == (0 | i14) && (i5 = i2 + 4 | 0, !(8 & HEAP32[i2 + 12 >> 2]) && i6 >>> 0 > i7 >>> 0 & i3 >>> 0 <= i7 >>> 0)) {
                                HEAP32[i5 >> 2] = i4 + i1, i13 = i7 + (i12 = 0 == (7 & (i12 = i7 + 8 | 0) | 0) ? 0 : 0 - i12 & 7) | 0, i12 = (i14 = (0 | HEAP32[6]) + i1 | 0) - i12 | 0, HEAP32[9] = i13, HEAP32[6] = i12, HEAP32[i13 + 4 >> 2] = 1 | i12, HEAP32[i7 + i14 + 4 >> 2] = 40, HEAP32[10] = HEAP32[125];
                                break
                            }
                            i6 >>> 0 < (0 | HEAP32[7]) >>> 0 && (HEAP32[7] = i6), i3 = i6 + i1 | 0, i2 = 460;
                            do {
                                if ((0 | HEAP32[i2 >> 2]) == (0 | i3)) {
                                    i14 = 162;
                                    break
                                }
                                i2 = 0 | HEAP32[i2 + 8 >> 2]
                            } while (0 != (0 | i2));
                            if (162 == (0 | i14) && !(8 & HEAP32[i2 + 12 >> 2])) {
                                HEAP32[i2 >> 2] = i6, HEAP32[(i11 = i2 + 4 | 0) >> 2] = (0 | HEAP32[i11 >> 2]) + i1, i9 = (i11 = i6 + (0 == (7 & (i11 = i6 + 8 | 0) | 0) ? 0 : 0 - i11 & 7) | 0) + i10 | 0, i8 = (i1 = i3 + (0 == (7 & (i1 = i3 + 8 | 0) | 0) ? 0 : 0 - i1 & 7) | 0) - i11 - i10 | 0, HEAP32[i11 + 4 >> 2] = 3 | i10;
                                L238: do {
                                    if ((0 | i7) == (0 | i1)) HEAP32[6] = i14 = (0 | HEAP32[6]) + i8 | 0, HEAP32[9] = i9, HEAP32[i9 + 4 >> 2] = 1 | i14;
                                    else {
                                        if ((0 | HEAP32[8]) == (0 | i1)) {
                                            HEAP32[5] = i14 = (0 | HEAP32[5]) + i8 | 0, HEAP32[8] = i9, HEAP32[i9 + 4 >> 2] = 1 | i14, HEAP32[i9 + i14 >> 2] = i14;
                                            break
                                        }
                                        if (1 == (3 & (i2 = 0 | HEAP32[i1 + 4 >> 2]) | 0)) {
                                            i7 = -8 & i2, i4 = i2 >>> 3;
                                            L246: do {
                                                if (i2 >>> 0 < 256) {
                                                    if ((0 | (i3 = 0 | HEAP32[i1 + 12 >> 2])) == (0 | (i2 = 0 | HEAP32[i1 + 8 >> 2]))) {
                                                        HEAP32[3] = HEAP32[3] & ~(1 << i4);
                                                        break
                                                    }
                                                    HEAP32[i2 + 12 >> 2] = i3, HEAP32[i3 + 8 >> 2] = i2;
                                                    break
                                                }
                                                i6 = 0 | HEAP32[i1 + 24 >> 2], i2 = 0 | HEAP32[i1 + 12 >> 2];
                                                do {
                                                    if ((0 | i2) == (0 | i1)) {
                                                        if (!(i2 = 0 | HEAP32[(i3 = 4 + (i4 = i1 + 16 | 0) | 0) >> 2])) {
                                                            if (!(i2 = 0 | HEAP32[i4 >> 2])) {
                                                                i2 = 0;
                                                                break
                                                            }
                                                            i3 = i4
                                                        }
                                                        for (;;)
                                                            if (i4 = 0 | HEAP32[(i5 = i2 + 20 | 0) >> 2]) i2 = i4, i3 = i5;
                                                            else {
                                                                if (!(i4 = 0 | HEAP32[(i5 = i2 + 16 | 0) >> 2])) break;
                                                                i2 = i4, i3 = i5
                                                            } HEAP32[i3 >> 2] = 0
                                                    } else HEAP32[12 + (i14 = 0 | HEAP32[i1 + 8 >> 2]) >> 2] = i2, HEAP32[i2 + 8 >> 2] = i14
                                                } while (0);
                                                if (!i6) break;
                                                i4 = 316 + ((i3 = 0 | HEAP32[i1 + 28 >> 2]) << 2) | 0;
                                                do {
                                                    if ((0 | HEAP32[i4 >> 2]) == (0 | i1)) {
                                                        if (HEAP32[i4 >> 2] = i2, 0 | i2) break;
                                                        HEAP32[4] = HEAP32[4] & ~(1 << i3);
                                                        break L246
                                                    }
                                                    if (HEAP32[((0 | HEAP32[(i14 = i6 + 16 | 0) >> 2]) == (0 | i1) ? i14 : i6 + 20 | 0) >> 2] = i2, !i2) break L246
                                                } while (0);
                                                if (HEAP32[i2 + 24 >> 2] = i6, 0 | (i3 = 0 | HEAP32[(i4 = i1 + 16 | 0) >> 2]) && (HEAP32[i2 + 16 >> 2] = i3, HEAP32[i3 + 24 >> 2] = i2), !(i3 = 0 | HEAP32[i4 + 4 >> 2])) break;
                                                HEAP32[i2 + 20 >> 2] = i3, HEAP32[i3 + 24 >> 2] = i2
                                            } while (0);
                                            i1 = i1 + i7 | 0, i5 = i7 + i8 | 0
                                        } else i5 = i8;
                                        if (HEAP32[(i1 = i1 + 4 | 0) >> 2] = -2 & HEAP32[i1 >> 2], HEAP32[i9 + 4 >> 2] = 1 | i5, HEAP32[i9 + i5 >> 2] = i5, i1 = i5 >>> 3, i5 >>> 0 < 256) {
                                            i3 = 52 + (i1 << 1 << 2) | 0, (i2 = 0 | HEAP32[3]) & (i1 = 1 << i1) ? (i1 = i2 = i3 + 8 | 0, i2 = 0 | HEAP32[i2 >> 2]) : (HEAP32[3] = i2 | i1, i1 = i3 + 8 | 0, i2 = i3), HEAP32[i1 >> 2] = i9, HEAP32[i2 + 12 >> 2] = i9, HEAP32[i9 + 8 >> 2] = i2, HEAP32[i9 + 12 >> 2] = i3;
                                            break
                                        }
                                        i1 = i5 >>> 8;
                                        do {
                                            if (i1) {
                                                if (i5 >>> 0 > 16777215) {
                                                    i4 = 31;
                                                    break
                                                }
                                                i4 = i5 >>> (7 + (i4 = 14 - ((i12 = (520192 + (i14 = i1 << (i13 = (i1 + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | i13 | (i4 = (245760 + (i14 <<= i12) | 0) >>> 16 & 2)) + (i14 << i4 >>> 15) | 0) | 0) & 1 | i4 << 1
                                            } else i4 = 0
                                        } while (0);
                                        if (i2 = 316 + (i4 << 2) | 0, HEAP32[i9 + 28 >> 2] = i4, HEAP32[4 + (i1 = i9 + 16 | 0) >> 2] = 0, HEAP32[i1 >> 2] = 0, !((i1 = 0 | HEAP32[4]) & (i3 = 1 << i4))) {
                                            HEAP32[4] = i1 | i3, HEAP32[i2 >> 2] = i9, HEAP32[i9 + 24 >> 2] = i2, HEAP32[i9 + 12 >> 2] = i9, HEAP32[i9 + 8 >> 2] = i9;
                                            break
                                        }
                                        i1 = 0 | HEAP32[i2 >> 2];
                                        L291: do {
                                            if ((-8 & HEAP32[i1 + 4 >> 2] | 0) != (0 | i5)) {
                                                for (i4 = i5 << (31 == (0 | i4) ? 0 : 25 - (i4 >>> 1) | 0); i2 = 0 | HEAP32[(i3 = i1 + 16 + (i4 >>> 31 << 2) | 0) >> 2];) {
                                                    if ((-8 & HEAP32[i2 + 4 >> 2] | 0) == (0 | i5)) {
                                                        i1 = i2;
                                                        break L291
                                                    }
                                                    i4 <<= 1, i1 = i2
                                                }
                                                HEAP32[i3 >> 2] = i9, HEAP32[i9 + 24 >> 2] = i1, HEAP32[i9 + 12 >> 2] = i9, HEAP32[i9 + 8 >> 2] = i9;
                                                break L238
                                            }
                                        } while (0);
                                        HEAP32[12 + (i14 = 0 | HEAP32[(i13 = i1 + 8 | 0) >> 2]) >> 2] = i9, HEAP32[i13 >> 2] = i9, HEAP32[i9 + 8 >> 2] = i14, HEAP32[i9 + 12 >> 2] = i1, HEAP32[i9 + 24 >> 2] = 0
                                    }
                                } while (0);
                                return STACKTOP = i15, 0 | i11 + 8
                            }
                            for (i3 = 460; !((i2 = 0 | HEAP32[i3 >> 2]) >>> 0 <= i7 >>> 0 && (i2 = i2 + (0 | HEAP32[i3 + 4 >> 2]) | 0) >>> 0 > i7 >>> 0);) i3 = 0 | HEAP32[i3 + 8 >> 2];
                            i14 = (i3 = (i3 = (i5 = i2 + -47 | 0) + (0 == (7 & (i3 = i5 + 8 | 0) | 0) ? 0 : 0 - i3 & 7) | 0) >>> 0 < (i5 = i7 + 16 | 0) >>> 0 ? i7 : i3) + 8 | 0, i13 = i6 + (i12 = 0 == (7 & (i12 = i6 + 8 | 0) | 0) ? 0 : 0 - i12 & 7) | 0, i12 = (i4 = i1 + -40 | 0) - i12 | 0, HEAP32[9] = i13, HEAP32[6] = i12, HEAP32[i13 + 4 >> 2] = 1 | i12, HEAP32[i6 + i4 + 4 >> 2] = 40, HEAP32[10] = HEAP32[125], HEAP32[(i4 = i3 + 4 | 0) >> 2] = 27, HEAP32[i14 >> 2] = HEAP32[115], HEAP32[i14 + 4 >> 2] = HEAP32[116], HEAP32[i14 + 8 >> 2] = HEAP32[117], HEAP32[i14 + 12 >> 2] = HEAP32[118], HEAP32[115] = i6, HEAP32[116] = i1, HEAP32[118] = 0, HEAP32[117] = i14, i1 = i3 + 24 | 0;
                            do {
                                i14 = i1, HEAP32[(i1 = i1 + 4 | 0) >> 2] = 7
                            } while ((i14 + 8 | 0) >>> 0 < i2 >>> 0);
                            if ((0 | i3) != (0 | i7)) {
                                if (i6 = i3 - i7 | 0, HEAP32[i4 >> 2] = -2 & HEAP32[i4 >> 2], HEAP32[i7 + 4 >> 2] = 1 | i6, HEAP32[i3 >> 2] = i6, i1 = i6 >>> 3, i6 >>> 0 < 256) {
                                    i3 = 52 + (i1 << 1 << 2) | 0, (i2 = 0 | HEAP32[3]) & (i1 = 1 << i1) ? (i1 = i2 = i3 + 8 | 0, i2 = 0 | HEAP32[i2 >> 2]) : (HEAP32[3] = i2 | i1, i1 = i3 + 8 | 0, i2 = i3), HEAP32[i1 >> 2] = i7, HEAP32[i2 + 12 >> 2] = i7, HEAP32[i7 + 8 >> 2] = i2, HEAP32[i7 + 12 >> 2] = i3;
                                    break
                                }
                                if (i3 = 316 + ((i4 = (i1 = i6 >>> 8) ? i6 >>> 0 > 16777215 ? 31 : i6 >>> (7 + (i4 = 14 - ((i12 = (520192 + (i14 = i1 << (i13 = (i1 + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | i13 | (i4 = (245760 + (i14 <<= i12) | 0) >>> 16 & 2)) + (i14 << i4 >>> 15) | 0) | 0) & 1 | i4 << 1 : 0) << 2) | 0, HEAP32[i7 + 28 >> 2] = i4, HEAP32[i7 + 20 >> 2] = 0, HEAP32[i5 >> 2] = 0, !((i1 = 0 | HEAP32[4]) & (i2 = 1 << i4))) {
                                    HEAP32[4] = i1 | i2, HEAP32[i3 >> 2] = i7, HEAP32[i7 + 24 >> 2] = i3, HEAP32[i7 + 12 >> 2] = i7, HEAP32[i7 + 8 >> 2] = i7;
                                    break
                                }
                                i1 = 0 | HEAP32[i3 >> 2];
                                L325: do {
                                    if ((-8 & HEAP32[i1 + 4 >> 2] | 0) != (0 | i6)) {
                                        for (i4 = i6 << (31 == (0 | i4) ? 0 : 25 - (i4 >>> 1) | 0); i2 = 0 | HEAP32[(i3 = i1 + 16 + (i4 >>> 31 << 2) | 0) >> 2];) {
                                            if ((-8 & HEAP32[i2 + 4 >> 2] | 0) == (0 | i6)) {
                                                i1 = i2;
                                                break L325
                                            }
                                            i4 <<= 1, i1 = i2
                                        }
                                        HEAP32[i3 >> 2] = i7, HEAP32[i7 + 24 >> 2] = i1, HEAP32[i7 + 12 >> 2] = i7, HEAP32[i7 + 8 >> 2] = i7;
                                        break L215
                                    }
                                } while (0);
                                HEAP32[12 + (i14 = 0 | HEAP32[(i13 = i1 + 8 | 0) >> 2]) >> 2] = i7, HEAP32[i13 >> 2] = i7, HEAP32[i7 + 8 >> 2] = i14, HEAP32[i7 + 12 >> 2] = i1, HEAP32[i7 + 24 >> 2] = 0
                            }
                        } else 0 == (0 | (i14 = 0 | HEAP32[7])) | i6 >>> 0 < i14 >>> 0 && (HEAP32[7] = i6), HEAP32[115] = i6, HEAP32[116] = i1, HEAP32[118] = 0, HEAP32[12] = HEAP32[121], HEAP32[11] = -1, HEAP32[16] = 52, HEAP32[15] = 52, HEAP32[18] = 60, HEAP32[17] = 60, HEAP32[20] = 68, HEAP32[19] = 68, HEAP32[22] = 76, HEAP32[21] = 76, HEAP32[24] = 84, HEAP32[23] = 84, HEAP32[26] = 92, HEAP32[25] = 92, HEAP32[28] = 100, HEAP32[27] = 100, HEAP32[30] = 108, HEAP32[29] = 108, HEAP32[32] = 116, HEAP32[31] = 116, HEAP32[34] = 124, HEAP32[33] = 124, HEAP32[36] = 132, HEAP32[35] = 132, HEAP32[38] = 140, HEAP32[37] = 140, HEAP32[40] = 148, HEAP32[39] = 148, HEAP32[42] = 156, HEAP32[41] = 156, HEAP32[44] = 164, HEAP32[43] = 164, HEAP32[46] = 172, HEAP32[45] = 172, HEAP32[48] = 180, HEAP32[47] = 180, HEAP32[50] = 188, HEAP32[49] = 188, HEAP32[52] = 196, HEAP32[51] = 196, HEAP32[54] = 204, HEAP32[53] = 204, HEAP32[56] = 212, HEAP32[55] = 212, HEAP32[58] = 220, HEAP32[57] = 220, HEAP32[60] = 228, HEAP32[59] = 228, HEAP32[62] = 236, HEAP32[61] = 236, HEAP32[64] = 244, HEAP32[63] = 244, HEAP32[66] = 252, HEAP32[65] = 252, HEAP32[68] = 260, HEAP32[67] = 260, HEAP32[70] = 268, HEAP32[69] = 268, HEAP32[72] = 276, HEAP32[71] = 276, HEAP32[74] = 284, HEAP32[73] = 284, HEAP32[76] = 292, HEAP32[75] = 292, HEAP32[78] = 300, HEAP32[77] = 300, i13 = i6 + (i12 = 0 == (7 & (i12 = i6 + 8 | 0) | 0) ? 0 : 0 - i12 & 7) | 0, i12 = (i14 = i1 + -40 | 0) - i12 | 0, HEAP32[9] = i13, HEAP32[6] = i12, HEAP32[i13 + 4 >> 2] = 1 | i12, HEAP32[i6 + i14 + 4 >> 2] = 40, HEAP32[10] = HEAP32[125]
                    } while (0);
                    if ((i1 = 0 | HEAP32[6]) >>> 0 > i10 >>> 0) return HEAP32[6] = i12 = i1 - i10 | 0, HEAP32[9] = i13 = (i14 = 0 | HEAP32[9]) + i10 | 0, HEAP32[i13 + 4 >> 2] = 1 | i12, HEAP32[i14 + 4 >> 2] = 3 | i10, STACKTOP = i15, 0 | i14 + 8
                }
                return HEAP32[(0 | ___errno_location()) >> 2] = 12, STACKTOP = i15, 0
            }

            function _free(i1) {
                var i2 = 0,
                    i3 = 0,
                    i4 = 0,
                    i5 = 0,
                    i6 = 0,
                    i7 = 0,
                    i8 = 0,
                    i9 = 0,
                    i10 = 0;
                if (i1 |= 0) {
                    i4 = 0 | HEAP32[7], i10 = (i3 = i1 + -8 | 0) + (i2 = -8 & (i1 = 0 | HEAP32[i1 + -4 >> 2])) | 0;
                    do {
                        if (1 & i1) i8 = i3, i9 = i3;
                        else {
                            if (!(3 & i1)) return;
                            if (i7 = (i5 = 0 | HEAP32[i3 >> 2]) + i2 | 0, (i6 = i3 + (0 - i5) | 0) >>> 0 < i4 >>> 0) return;
                            if ((0 | HEAP32[8]) == (0 | i6)) {
                                if (3 != (3 & (i1 = 0 | HEAP32[(i2 = i10 + 4 | 0) >> 2]) | 0)) {
                                    i8 = i6, i9 = i6, i2 = i7;
                                    break
                                }
                                return HEAP32[5] = i7, HEAP32[i2 >> 2] = -2 & i1, HEAP32[i6 + 4 >> 2] = 1 | i7, void(HEAP32[i6 + i7 >> 2] = i7)
                            }
                            if (i3 = i5 >>> 3, i5 >>> 0 < 256) {
                                if ((0 | (i2 = 0 | HEAP32[i6 + 12 >> 2])) == (0 | (i1 = 0 | HEAP32[i6 + 8 >> 2]))) {
                                    HEAP32[3] = HEAP32[3] & ~(1 << i3), i8 = i6, i9 = i6, i2 = i7;
                                    break
                                }
                                HEAP32[i1 + 12 >> 2] = i2, HEAP32[i2 + 8 >> 2] = i1, i8 = i6, i9 = i6, i2 = i7;
                                break
                            }
                            i5 = 0 | HEAP32[i6 + 24 >> 2], i1 = 0 | HEAP32[i6 + 12 >> 2];
                            do {
                                if ((0 | i1) == (0 | i6)) {
                                    if (!(i1 = 0 | HEAP32[(i2 = 4 + (i3 = i6 + 16 | 0) | 0) >> 2])) {
                                        if (!(i1 = 0 | HEAP32[i3 >> 2])) {
                                            i3 = 0;
                                            break
                                        }
                                        i2 = i3
                                    }
                                    for (;;)
                                        if (i3 = 0 | HEAP32[(i4 = i1 + 20 | 0) >> 2]) i1 = i3, i2 = i4;
                                        else {
                                            if (!(i3 = 0 | HEAP32[(i4 = i1 + 16 | 0) >> 2])) break;
                                            i1 = i3, i2 = i4
                                        } HEAP32[i2 >> 2] = 0, i3 = i1
                                } else HEAP32[12 + (i3 = 0 | HEAP32[i6 + 8 >> 2]) >> 2] = i1, HEAP32[i1 + 8 >> 2] = i3, i3 = i1
                            } while (0);
                            if (i5) {
                                if ((0 | HEAP32[(i2 = 316 + ((i1 = 0 | HEAP32[i6 + 28 >> 2]) << 2) | 0) >> 2]) == (0 | i6)) {
                                    if (HEAP32[i2 >> 2] = i3, !i3) {
                                        HEAP32[4] = HEAP32[4] & ~(1 << i1), i8 = i6, i9 = i6, i2 = i7;
                                        break
                                    }
                                } else if (HEAP32[((0 | HEAP32[(i9 = i5 + 16 | 0) >> 2]) == (0 | i6) ? i9 : i5 + 20 | 0) >> 2] = i3, !i3) {
                                    i8 = i6, i9 = i6, i2 = i7;
                                    break
                                }
                                HEAP32[i3 + 24 >> 2] = i5, 0 | (i1 = 0 | HEAP32[(i2 = i6 + 16 | 0) >> 2]) && (HEAP32[i3 + 16 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3), (i1 = 0 | HEAP32[i2 + 4 >> 2]) ? (HEAP32[i3 + 20 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3, i8 = i6, i9 = i6, i2 = i7) : (i8 = i6, i9 = i6, i2 = i7)
                            } else i8 = i6, i9 = i6, i2 = i7
                        }
                    } while (0);
                    if (!(i8 >>> 0 >= i10 >>> 0) && 1 & (i3 = 0 | HEAP32[(i1 = i10 + 4 | 0) >> 2])) {
                        if (2 & i3) HEAP32[i1 >> 2] = -2 & i3, HEAP32[i9 + 4 >> 2] = 1 | i2, HEAP32[i8 + i2 >> 2] = i2, i5 = i2;
                        else {
                            if ((0 | HEAP32[9]) == (0 | i10)) {
                                if (HEAP32[6] = i10 = (0 | HEAP32[6]) + i2 | 0, HEAP32[9] = i9, HEAP32[i9 + 4 >> 2] = 1 | i10, (0 | i9) != (0 | HEAP32[8])) return;
                                return HEAP32[8] = 0, void(HEAP32[5] = 0)
                            }
                            if ((0 | HEAP32[8]) == (0 | i10)) return HEAP32[5] = i10 = (0 | HEAP32[5]) + i2 | 0, HEAP32[8] = i8, HEAP32[i9 + 4 >> 2] = 1 | i10, void(HEAP32[i8 + i10 >> 2] = i10);
                            i5 = (-8 & i3) + i2 | 0, i4 = i3 >>> 3;
                            do {
                                if (i3 >>> 0 < 256) {
                                    if ((0 | (i1 = 0 | HEAP32[i10 + 12 >> 2])) == (0 | (i2 = 0 | HEAP32[i10 + 8 >> 2]))) {
                                        HEAP32[3] = HEAP32[3] & ~(1 << i4);
                                        break
                                    }
                                    HEAP32[i2 + 12 >> 2] = i1, HEAP32[i1 + 8 >> 2] = i2;
                                    break
                                }
                                i6 = 0 | HEAP32[i10 + 24 >> 2], i1 = 0 | HEAP32[i10 + 12 >> 2];
                                do {
                                    if ((0 | i1) == (0 | i10)) {
                                        if (!(i1 = 0 | HEAP32[(i2 = 4 + (i3 = i10 + 16 | 0) | 0) >> 2])) {
                                            if (!(i1 = 0 | HEAP32[i3 >> 2])) {
                                                i3 = 0;
                                                break
                                            }
                                            i2 = i3
                                        }
                                        for (;;)
                                            if (i3 = 0 | HEAP32[(i4 = i1 + 20 | 0) >> 2]) i1 = i3, i2 = i4;
                                            else {
                                                if (!(i3 = 0 | HEAP32[(i4 = i1 + 16 | 0) >> 2])) break;
                                                i1 = i3, i2 = i4
                                            } HEAP32[i2 >> 2] = 0, i3 = i1
                                    } else HEAP32[12 + (i3 = 0 | HEAP32[i10 + 8 >> 2]) >> 2] = i1, HEAP32[i1 + 8 >> 2] = i3, i3 = i1
                                } while (0);
                                if (0 | i6) {
                                    if ((0 | HEAP32[(i2 = 316 + ((i1 = 0 | HEAP32[i10 + 28 >> 2]) << 2) | 0) >> 2]) == (0 | i10)) {
                                        if (HEAP32[i2 >> 2] = i3, !i3) {
                                            HEAP32[4] = HEAP32[4] & ~(1 << i1);
                                            break
                                        }
                                    } else if (HEAP32[((0 | HEAP32[(i7 = i6 + 16 | 0) >> 2]) == (0 | i10) ? i7 : i6 + 20 | 0) >> 2] = i3, !i3) break;
                                    HEAP32[i3 + 24 >> 2] = i6, 0 | (i1 = 0 | HEAP32[(i2 = i10 + 16 | 0) >> 2]) && (HEAP32[i3 + 16 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3), 0 | (i1 = 0 | HEAP32[i2 + 4 >> 2]) && (HEAP32[i3 + 20 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3)
                                }
                            } while (0);
                            if (HEAP32[i9 + 4 >> 2] = 1 | i5, HEAP32[i8 + i5 >> 2] = i5, (0 | i9) == (0 | HEAP32[8])) return void(HEAP32[5] = i5)
                        }
                        if (i1 = i5 >>> 3, i5 >>> 0 < 256) return i3 = 52 + (i1 << 1 << 2) | 0, (i2 = 0 | HEAP32[3]) & (i1 = 1 << i1) ? (i1 = i2 = i3 + 8 | 0, i2 = 0 | HEAP32[i2 >> 2]) : (HEAP32[3] = i2 | i1, i1 = i3 + 8 | 0, i2 = i3), HEAP32[i1 >> 2] = i9, HEAP32[i2 + 12 >> 2] = i9, HEAP32[i9 + 8 >> 2] = i2, void(HEAP32[i9 + 12 >> 2] = i3);
                        i2 = 316 + ((i4 = (i1 = i5 >>> 8) ? i5 >>> 0 > 16777215 ? 31 : i5 >>> (7 + (i4 = 14 - ((i7 = (520192 + (i10 = i1 << (i8 = (i1 + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | i8 | (i4 = (245760 + (i10 <<= i7) | 0) >>> 16 & 2)) + (i10 << i4 >>> 15) | 0) | 0) & 1 | i4 << 1 : 0) << 2) | 0, HEAP32[i9 + 28 >> 2] = i4, HEAP32[i9 + 20 >> 2] = 0, HEAP32[i9 + 16 >> 2] = 0, i1 = 0 | HEAP32[4], i3 = 1 << i4;
                        L112: do {
                            if (i1 & i3) {
                                i1 = 0 | HEAP32[i2 >> 2];
                                L115: do {
                                    if ((-8 & HEAP32[i1 + 4 >> 2] | 0) != (0 | i5)) {
                                        for (i4 = i5 << (31 == (0 | i4) ? 0 : 25 - (i4 >>> 1) | 0); i2 = 0 | HEAP32[(i3 = i1 + 16 + (i4 >>> 31 << 2) | 0) >> 2];) {
                                            if ((-8 & HEAP32[i2 + 4 >> 2] | 0) == (0 | i5)) {
                                                i1 = i2;
                                                break L115
                                            }
                                            i4 <<= 1, i1 = i2
                                        }
                                        HEAP32[i3 >> 2] = i9, HEAP32[i9 + 24 >> 2] = i1, HEAP32[i9 + 12 >> 2] = i9, HEAP32[i9 + 8 >> 2] = i9;
                                        break L112
                                    }
                                } while (0);
                                HEAP32[12 + (i10 = 0 | HEAP32[(i8 = i1 + 8 | 0) >> 2]) >> 2] = i9, HEAP32[i8 >> 2] = i9, HEAP32[i9 + 8 >> 2] = i10, HEAP32[i9 + 12 >> 2] = i1, HEAP32[i9 + 24 >> 2] = 0
                            } else HEAP32[4] = i1 | i3, HEAP32[i2 >> 2] = i9, HEAP32[i9 + 24 >> 2] = i2, HEAP32[i9 + 12 >> 2] = i9, HEAP32[i9 + 8 >> 2] = i9
                        } while (0);
                        if (HEAP32[11] = i10 = (0 | HEAP32[11]) - 1 | 0, !(0 | i10)) {
                            for (i1 = 468; i1 = 0 | HEAP32[i1 >> 2];) i1 = i1 + 8 | 0;
                            HEAP32[11] = -1
                        }
                    }
                }
            }

            function _dispose_chunk(i2, i3) {
                var i1 = 0,
                    i4 = 0,
                    i5 = 0,
                    i6 = 0,
                    i7 = 0,
                    i8 = 0,
                    i9 = 0;
                i9 = (i2 |= 0) + (i3 |= 0) | 0, i1 = 0 | HEAP32[i2 + 4 >> 2];
                do {
                    if (1 & i1) i8 = i2, i2 = i3;
                    else {
                        if (!(3 & i1)) return;
                        if (i7 = (i4 = 0 | HEAP32[i2 >> 2]) + i3 | 0, (0 | HEAP32[8]) == (0 | (i6 = i2 + (0 - i4) | 0))) {
                            if (3 != (3 & (i1 = 0 | HEAP32[(i2 = i9 + 4 | 0) >> 2]) | 0)) {
                                i8 = i6, i2 = i7;
                                break
                            }
                            return HEAP32[5] = i7, HEAP32[i2 >> 2] = -2 & i1, HEAP32[i6 + 4 >> 2] = 1 | i7, void(HEAP32[i9 >> 2] = i7)
                        }
                        if (i3 = i4 >>> 3, i4 >>> 0 < 256) {
                            if ((0 | (i2 = 0 | HEAP32[i6 + 12 >> 2])) == (0 | (i1 = 0 | HEAP32[i6 + 8 >> 2]))) {
                                HEAP32[3] = HEAP32[3] & ~(1 << i3), i8 = i6, i2 = i7;
                                break
                            }
                            HEAP32[i1 + 12 >> 2] = i2, HEAP32[i2 + 8 >> 2] = i1, i8 = i6, i2 = i7;
                            break
                        }
                        i5 = 0 | HEAP32[i6 + 24 >> 2], i1 = 0 | HEAP32[i6 + 12 >> 2];
                        do {
                            if ((0 | i1) == (0 | i6)) {
                                if (!(i1 = 0 | HEAP32[(i2 = 4 + (i3 = i6 + 16 | 0) | 0) >> 2])) {
                                    if (!(i1 = 0 | HEAP32[i3 >> 2])) {
                                        i3 = 0;
                                        break
                                    }
                                    i2 = i3
                                }
                                for (;;)
                                    if (i3 = 0 | HEAP32[(i4 = i1 + 20 | 0) >> 2]) i1 = i3, i2 = i4;
                                    else {
                                        if (!(i3 = 0 | HEAP32[(i4 = i1 + 16 | 0) >> 2])) break;
                                        i1 = i3, i2 = i4
                                    } HEAP32[i2 >> 2] = 0, i3 = i1
                            } else HEAP32[12 + (i3 = 0 | HEAP32[i6 + 8 >> 2]) >> 2] = i1, HEAP32[i1 + 8 >> 2] = i3, i3 = i1
                        } while (0);
                        if (i5) {
                            if ((0 | HEAP32[(i2 = 316 + ((i1 = 0 | HEAP32[i6 + 28 >> 2]) << 2) | 0) >> 2]) == (0 | i6)) {
                                if (HEAP32[i2 >> 2] = i3, !i3) {
                                    HEAP32[4] = HEAP32[4] & ~(1 << i1), i8 = i6, i2 = i7;
                                    break
                                }
                            } else if (HEAP32[((0 | HEAP32[(i8 = i5 + 16 | 0) >> 2]) == (0 | i6) ? i8 : i5 + 20 | 0) >> 2] = i3, !i3) {
                                i8 = i6, i2 = i7;
                                break
                            }
                            HEAP32[i3 + 24 >> 2] = i5, 0 | (i1 = 0 | HEAP32[(i2 = i6 + 16 | 0) >> 2]) && (HEAP32[i3 + 16 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3), (i1 = 0 | HEAP32[i2 + 4 >> 2]) ? (HEAP32[i3 + 20 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3, i8 = i6, i2 = i7) : (i8 = i6, i2 = i7)
                        } else i8 = i6, i2 = i7
                    }
                } while (0);
                if (2 & (i3 = 0 | HEAP32[(i1 = i9 + 4 | 0) >> 2])) HEAP32[i1 >> 2] = -2 & i3, HEAP32[i8 + 4 >> 2] = 1 | i2, HEAP32[i8 + i2 >> 2] = i2;
                else {
                    if ((0 | HEAP32[9]) == (0 | i9)) {
                        if (HEAP32[6] = i9 = (0 | HEAP32[6]) + i2 | 0, HEAP32[9] = i8, HEAP32[i8 + 4 >> 2] = 1 | i9, (0 | i8) != (0 | HEAP32[8])) return;
                        return HEAP32[8] = 0, void(HEAP32[5] = 0)
                    }
                    if ((0 | HEAP32[8]) == (0 | i9)) return HEAP32[5] = i9 = (0 | HEAP32[5]) + i2 | 0, HEAP32[8] = i8, HEAP32[i8 + 4 >> 2] = 1 | i9, void(HEAP32[i8 + i9 >> 2] = i9);
                    i6 = (-8 & i3) + i2 | 0, i4 = i3 >>> 3;
                    do {
                        if (i3 >>> 0 < 256) {
                            if ((0 | (i1 = 0 | HEAP32[i9 + 12 >> 2])) == (0 | (i2 = 0 | HEAP32[i9 + 8 >> 2]))) {
                                HEAP32[3] = HEAP32[3] & ~(1 << i4);
                                break
                            }
                            HEAP32[i2 + 12 >> 2] = i1, HEAP32[i1 + 8 >> 2] = i2;
                            break
                        }
                        i5 = 0 | HEAP32[i9 + 24 >> 2], i1 = 0 | HEAP32[i9 + 12 >> 2];
                        do {
                            if ((0 | i1) == (0 | i9)) {
                                if (!(i1 = 0 | HEAP32[(i2 = 4 + (i3 = i9 + 16 | 0) | 0) >> 2])) {
                                    if (!(i1 = 0 | HEAP32[i3 >> 2])) {
                                        i3 = 0;
                                        break
                                    }
                                    i2 = i3
                                }
                                for (;;)
                                    if (i3 = 0 | HEAP32[(i4 = i1 + 20 | 0) >> 2]) i1 = i3, i2 = i4;
                                    else {
                                        if (!(i3 = 0 | HEAP32[(i4 = i1 + 16 | 0) >> 2])) break;
                                        i1 = i3, i2 = i4
                                    } HEAP32[i2 >> 2] = 0, i3 = i1
                            } else HEAP32[12 + (i3 = 0 | HEAP32[i9 + 8 >> 2]) >> 2] = i1, HEAP32[i1 + 8 >> 2] = i3, i3 = i1
                        } while (0);
                        if (0 | i5) {
                            if ((0 | HEAP32[(i2 = 316 + ((i1 = 0 | HEAP32[i9 + 28 >> 2]) << 2) | 0) >> 2]) == (0 | i9)) {
                                if (HEAP32[i2 >> 2] = i3, !i3) {
                                    HEAP32[4] = HEAP32[4] & ~(1 << i1);
                                    break
                                }
                            } else if (HEAP32[((0 | HEAP32[(i7 = i5 + 16 | 0) >> 2]) == (0 | i9) ? i7 : i5 + 20 | 0) >> 2] = i3, !i3) break;
                            HEAP32[i3 + 24 >> 2] = i5, 0 | (i1 = 0 | HEAP32[(i2 = i9 + 16 | 0) >> 2]) && (HEAP32[i3 + 16 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3), 0 | (i1 = 0 | HEAP32[i2 + 4 >> 2]) && (HEAP32[i3 + 20 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3)
                        }
                    } while (0);
                    if (HEAP32[i8 + 4 >> 2] = 1 | i6, HEAP32[i8 + i6 >> 2] = i6, (0 | i8) == (0 | HEAP32[8])) return void(HEAP32[5] = i6);
                    i2 = i6
                }
                if (i1 = i2 >>> 3, i2 >>> 0 < 256) return i3 = 52 + (i1 << 1 << 2) | 0, (i2 = 0 | HEAP32[3]) & (i1 = 1 << i1) ? (i1 = i2 = i3 + 8 | 0, i2 = 0 | HEAP32[i2 >> 2]) : (HEAP32[3] = i2 | i1, i1 = i3 + 8 | 0, i2 = i3), HEAP32[i1 >> 2] = i8, HEAP32[i2 + 12 >> 2] = i8, HEAP32[i8 + 8 >> 2] = i2, void(HEAP32[i8 + 12 >> 2] = i3);
                if (i3 = 316 + ((i5 = (i1 = i2 >>> 8) ? i2 >>> 0 > 16777215 ? 31 : i2 >>> (7 + (i5 = 14 - ((i6 = (520192 + (i9 = i1 << (i7 = (i1 + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | i7 | (i5 = (245760 + (i9 <<= i6) | 0) >>> 16 & 2)) + (i9 << i5 >>> 15) | 0) | 0) & 1 | i5 << 1 : 0) << 2) | 0, HEAP32[i8 + 28 >> 2] = i5, HEAP32[i8 + 20 >> 2] = 0, HEAP32[i8 + 16 >> 2] = 0, !((i1 = 0 | HEAP32[4]) & (i4 = 1 << i5))) return HEAP32[4] = i1 | i4, HEAP32[i3 >> 2] = i8, HEAP32[i8 + 24 >> 2] = i3, HEAP32[i8 + 12 >> 2] = i8, void(HEAP32[i8 + 8 >> 2] = i8);
                i1 = 0 | HEAP32[i3 >> 2];
                L104: do {
                    if ((-8 & HEAP32[i1 + 4 >> 2] | 0) != (0 | i2)) {
                        for (i5 = i2 << (31 == (0 | i5) ? 0 : 25 - (i5 >>> 1) | 0); i3 = 0 | HEAP32[(i4 = i1 + 16 + (i5 >>> 31 << 2) | 0) >> 2];) {
                            if ((-8 & HEAP32[i3 + 4 >> 2] | 0) == (0 | i2)) {
                                i1 = i3;
                                break L104
                            }
                            i5 <<= 1, i1 = i3
                        }
                        return HEAP32[i4 >> 2] = i8, HEAP32[i8 + 24 >> 2] = i1, HEAP32[i8 + 12 >> 2] = i8, void(HEAP32[i8 + 8 >> 2] = i8)
                    }
                } while (0);
                HEAP32[12 + (i9 = 0 | HEAP32[(i7 = i1 + 8 | 0) >> 2]) >> 2] = i8, HEAP32[i7 >> 2] = i8, HEAP32[i8 + 8 >> 2] = i9, HEAP32[i8 + 12 >> 2] = i1, HEAP32[i8 + 24 >> 2] = 0
            }

            function _heapify_up(i6, i5) {
                i6 |= 0;
                var i1 = 0,
                    i2 = 0,
                    i3 = 0,
                    i4 = 0,
                    i7 = 0,
                    i8 = 0,
                    i9 = 0,
                    i10 = 0;
                if (0 | (i5 |= 0)) {
                    i1 = 0 | HEAP32[i5 >> 2], i3 = i5 + 8 | 0;
                    L3: do {
                        if (i1)
                            for (i4 = i6 + 4 | 0, i2 = i1;;) {
                                if (i1 = i2, !((i10 = 0 | HEAP32[(i8 = i3) + 4 >> 2]) >>> 0 < (i9 = 0 | HEAP32[4 + (i7 = 8 + (0 | HEAP32[(0 | HEAP32[i4 >> 2]) + ((i2 = (i2 + -1 | 0) >>> 1) << 2) >> 2]) | 0) >> 2]) >>> 0 | ((0 | i10) == (0 | i9) ? (0 | HEAP32[i8 >> 2]) >>> 0 < (0 | HEAP32[i7 >> 2]) >>> 0 : 0))) break L3;
                                if (_push(i6, i2, i1), !i2) {
                                    i1 = 0;
                                    break
                                }
                            } else i1 = 0
                    } while (0);
                    _dump(i6, i5, i1)
                }
            }

            function _pq_delete(i5, i4) {
                var i1, i3, i6, i2 = 0;
                return i1 = 0 | HEAP32[(i2 = 8 + (i4 |= 0) | 0) >> 2], i2 = 0 | HEAP32[i2 + 4 >> 2], _push(i5 |= 0, 0 | HEAP32[(i3 = 0 | HEAP32[(0 | HEAP32[i5 + 4 >> 2]) + ((0 | HEAP32[(i6 = i5 + 8 | 0) >> 2]) - 1 << 2) >> 2]) >> 2], 0 | HEAP32[i4 >> 2]),
                    function(i1, i3, i2) {
                        _free(i2 |= 0)
                    }(0, 0, i4), HEAP32[i6 >> 2] = (0 | HEAP32[i6 >> 2]) - 1, (0 | i3) != (0 | i4) && function(i10, i9) {
                        i10 |= 0;
                        var i1 = 0,
                            i2 = 0,
                            i3 = 0,
                            i4 = 0,
                            i5 = 0,
                            i6 = 0,
                            i7 = 0,
                            i8 = 0,
                            i11 = 0,
                            i12 = 0,
                            i13 = 0,
                            i14 = 0;
                        if (0 | (i9 |= 0)) {
                            i3 = (i1 = 0 | HEAP32[i9 >> 2]) << 1 | 1, i2 = 0 | HEAP32[(i8 = i10 + 8 | 0) >> 2];
                            L3: do {
                                if (i3 >>> 0 < i2 >>> 0)
                                    for (i7 = i10 + 4 | 0, i6 = i9 + 8 | 0;;) {
                                        if (i4 = (i4 = i3 + 2 | 0) >>> 0 > i2 >>> 0 ? i2 : i4, i5 = 0 | HEAP32[i7 >> 2], (i2 = i3 + 1 | 0) >>> 0 < i4 >>> 0) {
                                            do {
                                                i3 = (i14 = 0 | HEAP32[4 + (i12 = 8 + (0 | HEAP32[i5 + (i2 << 2) >> 2]) | 0) >> 2]) >>> 0 < (i13 = 0 | HEAP32[4 + (i11 = 8 + (0 | HEAP32[i5 + (i3 << 2) >> 2]) | 0) >> 2]) >>> 0 | ((0 | i14) == (0 | i13) ? (0 | HEAP32[i12 >> 2]) >>> 0 < (0 | HEAP32[i11 >> 2]) >>> 0 : 0) ? i2 : i3, i2 = i2 + 1 | 0
                                            } while (i2 >>> 0 < i4 >>> 0);
                                            i4 = i3
                                        } else i4 = i3;
                                        if (!((i11 = 0 | HEAP32[4 + (i13 = 8 + (0 | HEAP32[i5 + (i4 << 2) >> 2]) | 0) >> 2]) >>> 0 < (i12 = 0 | HEAP32[(i14 = i6) + 4 >> 2]) >>> 0 | ((0 | i11) == (0 | i12) ? (0 | HEAP32[i13 >> 2]) >>> 0 < (0 | HEAP32[i14 >> 2]) >>> 0 : 0))) break L3;
                                        if (_push(i10, i4, i1), (i3 = i4 << 1 | 1) >>> 0 >= (i2 = 0 | HEAP32[i8 >> 2]) >>> 0) {
                                            i1 = i4;
                                            break
                                        }
                                        i1 = i4
                                    }
                            } while (0);
                            _dump(i10, i9, i1)
                        }
                    }(i5, i3), setTempRet0(0 | i2), 0 | i1
            }

            function _push(i2, i3, i1) {
                var i4 = 0;
                (0 | (i3 |= 0)) == (0 | (i1 |= 0)) | (i4 = 0 | HEAP32[8 + (i2 |= 0) >> 2]) >>> 0 <= i1 >>> 0 | i4 >>> 0 <= i3 >>> 0 || (HEAP32[(i2 = 0 | HEAP32[(i4 = i2 + 4 | 0) >> 2]) + (i1 << 2) >> 2] = HEAP32[i2 + (i3 << 2) >> 2], HEAP32[HEAP32[(0 | HEAP32[i4 >> 2]) + (i1 << 2) >> 2] >> 2] = i1)
            }

            function _sbrk(i1) {
                i1 |= 0;
                var i2, i3 = 0;
                return i3 = 0 | function() {
                    return 528
                }(), (i1 = (i2 = 0 | HEAP32[i3 >> 2]) + i1 | 0) >>> 0 > (0 | _emscripten_get_heap_size()) >>> 0 && !(0 | function() {
                    ! function() {
                        ! function(what) {
                            throw Module.onAbort && Module.onAbort(what), out(what += ""), err(what), "abort(" + what + "). Build with -s ASSERTIONS=1 for more info."
                        }("OOM")
                    }()
                }()) ? (HEAP32[(0 | ___errno_location()) >> 2] = 12, 0 | (i3 = -1)) : (HEAP32[i3 >> 2] = i1, 0 | (i3 = i2))
            }

            function _calloc(i3, i1) {
                i1 |= 0;
                var i2 = 0;
                return (i3 |= 0) ? (i2 = 0 | Math_imul(i1, i3), (i1 | i3) >>> 0 > 65535 && (i2 = (0 | (i2 >>> 0) / (i3 >>> 0)) == (0 | i1) ? i2 : -1)) : i2 = 0, (i1 = 0 | _malloc(i2)) && 3 & HEAP32[i1 + -4 >> 2] ? (function(i5, i6, i4) {
                    var i3, i1 = 0,
                        i2 = 0,
                        i7 = 0;
                    if (i3 = (i5 |= 0) + (i4 |= 0) | 0, (0 | i4) >= 67) {
                        for (; 3 & i5;) HEAP8[i5 >> 0] = 0, i5 = i5 + 1 | 0;
                        for (i7 = 0, i2 = (i1 = -4 & i3 | 0) - 64 | 0;
                            (0 | i5) <= (0 | i2);) HEAP32[i5 >> 2] = i7, HEAP32[i5 + 4 >> 2] = i7, HEAP32[i5 + 8 >> 2] = i7, HEAP32[i5 + 12 >> 2] = i7, HEAP32[i5 + 16 >> 2] = i7, HEAP32[i5 + 20 >> 2] = i7, HEAP32[i5 + 24 >> 2] = i7, HEAP32[i5 + 28 >> 2] = i7, HEAP32[i5 + 32 >> 2] = i7, HEAP32[i5 + 36 >> 2] = i7, HEAP32[i5 + 40 >> 2] = i7, HEAP32[i5 + 44 >> 2] = i7, HEAP32[i5 + 48 >> 2] = i7, HEAP32[i5 + 52 >> 2] = i7, HEAP32[i5 + 56 >> 2] = i7, HEAP32[i5 + 60 >> 2] = i7, i5 = i5 + 64 | 0;
                        for (;
                            (0 | i5) < (0 | i1);) HEAP32[i5 >> 2] = i7, i5 = i5 + 4 | 0
                    }
                    for (;
                        (0 | i5) < (0 | i3);) HEAP8[i5 >> 0] = 0, i5 = i5 + 1 | 0
                }(0 | i1, 0, 0 | i2), 0 | i1) : 0 | i1
            }

            function _dump(i3, i2, i1) {
                HEAP32[(0 | HEAP32[4 + (i3 |= 0) >> 2]) + ((i1 |= 0) << 2) >> 2] = i2 |= 0, HEAP32[i2 >> 2] = i1
            }

            function _pq_empty(i1) {
                return 0 == (0 | HEAP32[8 + (i1 |= 0) >> 2]) | 0
            }

            function _pq_clear(i1) {
                HEAP32[8 + (i1 |= 0) >> 2] = 0
            }

            function ___errno_location() {
                return 8
            }
            return {
                _pq_clear: _pq_clear,
                _pq_create: function(i1) {
                    var i2;
                    return i1 |= 0, i2 = 0 | _calloc(1, 16), HEAP32[i2 + 12 >> 2] = 1, HEAP32[i2 + 4 >> 2] = 0 | _calloc(1, 4), HEAP32[i2 >> 2] = i1, 0 | i2
                },
                _pq_decrease_key: function(i4, i3, i1, i2) {
                    var i5;
                    i4 |= 0, i2 |= 0, HEAP32[(i5 = 8 + (i3 |= 0) | 0) >> 2] = i1 |= 0, HEAP32[i5 + 4 >> 2] = i2, _heapify_up(i4, i3)
                },
                _pq_delete: _pq_delete,
                _pq_delete_min: function(i1) {
                    return i1 = 0 | _pq_delete(i1 |= 0, 0 | HEAP32[HEAP32[i1 + 4 >> 2] >> 2]), setTempRet0(0 | getTempRet0()), 0 | i1
                },
                _pq_destroy: function(i1) {
                    _pq_clear(i1 |= 0), _free(0 | HEAP32[i1 + 4 >> 2]), _free(i1)
                },
                _pq_empty: _pq_empty,
                _pq_find_min: function(i1) {
                    return 0 | (0 | _pq_empty(i1 |= 0) ? 0 : 0 | HEAP32[HEAP32[i1 + 4 >> 2] >> 2])
                },
                _pq_get_item: function(i2, i1) {
                    return 4 + (i1 |= 0) | 0
                },
                _pq_get_key: function(i2, i1) {
                    return i2 |= 0, i2 = 0 | HEAP32[(i1 = 8 + (i1 |= 0) | 0) >> 2], setTempRet0(0 | HEAP32[i1 + 4 >> 2]), 0 | i2
                },
                _pq_get_size: function(i1) {
                    return 0 | HEAP32[8 + (i1 |= 0) >> 2]
                },
                _pq_insert: function(i5, i3, i1, i2) {
                    var i4;
                    return i3 |= 0, i1 |= 0, i2 |= 0, i4 = 0 | function(i1, i2) {
                        return 0 | _calloc(1, 0 | HEAP32[(0 | HEAP32[4 + (i1 |= 0) >> 2]) + ((i2 |= 0) << 2) >> 2])
                    }(0 | HEAP32[(i5 |= 0) >> 2], 0), HEAP32[i4 + 4 >> 2] = i3, HEAP32[(i3 = i4 + 8 | 0) >> 2] = i1, HEAP32[i3 + 4 >> 2] = i2, HEAP32[(i2 = i5 + 8 | 0) >> 2] = i3 = 1 + (i1 = 0 | HEAP32[i2 >> 2]) | 0, HEAP32[i4 >> 2] = i1, (0 | i3) == (0 | HEAP32[i5 + 12 >> 2]) && (function(i1) {
                        var i2, i3, i4;
                        if (i1 = 0 | function(i3, i2) {
                                i2 |= 0;
                                var i1 = 0,
                                    i4 = 0;
                                return (i3 |= 0) ? i2 >>> 0 > 4294967231 ? (HEAP32[(0 | ___errno_location()) >> 2] = 12, 0 | (i3 = 0)) : 0 | (i1 = 0 | function(i12, i11) {
                                    i11 |= 0;
                                    var i7, i9, i10, i1 = 0,
                                        i2 = 0,
                                        i3 = 0,
                                        i4 = 0,
                                        i5 = 0,
                                        i6 = 0,
                                        i8 = 0;
                                    if (i6 = (i12 |= 0) + (i1 = -8 & (i9 = 0 | HEAP32[(i10 = i12 + 4 | 0) >> 2])) | 0, !(3 & i9)) return i11 >>> 0 < 256 ? 0 | (i12 = 0) : i1 >>> 0 >= (i11 + 4 | 0) >>> 0 && (i1 - i11 | 0) >>> 0 <= HEAP32[123] << 1 >>> 0 ? 0 | i12 : 0 | (i12 = 0);
                                    if (i1 >>> 0 >= i11 >>> 0) return (i1 = i1 - i11 | 0) >>> 0 <= 15 ? 0 | i12 : (i8 = i12 + i11 | 0, HEAP32[i10 >> 2] = 1 & i9 | i11 | 2, HEAP32[i8 + 4 >> 2] = 3 | i1, HEAP32[(i11 = i6 + 4 | 0) >> 2] = 1 | HEAP32[i11 >> 2], _dispose_chunk(i8, i1), 0 | i12);
                                    if ((0 | HEAP32[9]) == (0 | i6)) return i2 = (i8 = (0 | HEAP32[6]) + i1 | 0) - i11 | 0, i1 = i12 + i11 | 0, i8 >>> 0 <= i11 >>> 0 ? 0 | (i12 = 0) : (HEAP32[i10 >> 2] = 1 & i9 | i11 | 2, HEAP32[i1 + 4 >> 2] = 1 | i2, HEAP32[9] = i1, HEAP32[6] = i2, 0 | i12);
                                    if ((0 | HEAP32[8]) == (0 | i6)) return (i2 = (0 | HEAP32[5]) + i1 | 0) >>> 0 < i11 >>> 0 ? 0 | (i12 = 0) : ((i1 = i2 - i11 | 0) >>> 0 > 15 ? (i8 = i12 + i11 | 0, i2 = i12 + i2 | 0, HEAP32[i10 >> 2] = 1 & i9 | i11 | 2, HEAP32[i8 + 4 >> 2] = 1 | i1, HEAP32[i2 >> 2] = i1, HEAP32[(i2 = i2 + 4 | 0) >> 2] = -2 & HEAP32[i2 >> 2], i2 = i8) : (HEAP32[i10 >> 2] = 1 & i9 | i2 | 2, HEAP32[(i2 = i12 + i2 + 4 | 0) >> 2] = 1 | HEAP32[i2 >> 2], i2 = 0, i1 = 0), HEAP32[5] = i1, HEAP32[8] = i2, 0 | i12);
                                    if (2 & (i2 = 0 | HEAP32[i6 + 4 >> 2]) | 0) return 0;
                                    if ((i7 = (-8 & i2) + i1 | 0) >>> 0 < i11 >>> 0) return 0;
                                    i8 = i7 - i11 | 0, i3 = i2 >>> 3;
                                    do {
                                        if (i2 >>> 0 < 256) {
                                            if ((0 | (i1 = 0 | HEAP32[i6 + 12 >> 2])) == (0 | (i2 = 0 | HEAP32[i6 + 8 >> 2]))) {
                                                HEAP32[3] = HEAP32[3] & ~(1 << i3);
                                                break
                                            }
                                            HEAP32[i2 + 12 >> 2] = i1, HEAP32[i1 + 8 >> 2] = i2;
                                            break
                                        }
                                        i5 = 0 | HEAP32[i6 + 24 >> 2], i1 = 0 | HEAP32[i6 + 12 >> 2];
                                        do {
                                            if ((0 | i1) == (0 | i6)) {
                                                if (!(i1 = 0 | HEAP32[(i2 = 4 + (i3 = i6 + 16 | 0) | 0) >> 2])) {
                                                    if (!(i1 = 0 | HEAP32[i3 >> 2])) {
                                                        i3 = 0;
                                                        break
                                                    }
                                                    i2 = i3
                                                }
                                                for (;;)
                                                    if (i3 = 0 | HEAP32[(i4 = i1 + 20 | 0) >> 2]) i1 = i3, i2 = i4;
                                                    else {
                                                        if (!(i3 = 0 | HEAP32[(i4 = i1 + 16 | 0) >> 2])) break;
                                                        i1 = i3, i2 = i4
                                                    } HEAP32[i2 >> 2] = 0, i3 = i1
                                            } else HEAP32[12 + (i3 = 0 | HEAP32[i6 + 8 >> 2]) >> 2] = i1, HEAP32[i1 + 8 >> 2] = i3, i3 = i1
                                        } while (0);
                                        if (0 | i5) {
                                            if ((0 | HEAP32[(i2 = 316 + ((i1 = 0 | HEAP32[i6 + 28 >> 2]) << 2) | 0) >> 2]) == (0 | i6)) {
                                                if (HEAP32[i2 >> 2] = i3, !i3) {
                                                    HEAP32[4] = HEAP32[4] & ~(1 << i1);
                                                    break
                                                }
                                            } else if (HEAP32[((0 | HEAP32[(i4 = i5 + 16 | 0) >> 2]) == (0 | i6) ? i4 : i5 + 20 | 0) >> 2] = i3, !i3) break;
                                            HEAP32[i3 + 24 >> 2] = i5, 0 | (i1 = 0 | HEAP32[(i2 = i6 + 16 | 0) >> 2]) && (HEAP32[i3 + 16 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3), 0 | (i1 = 0 | HEAP32[i2 + 4 >> 2]) && (HEAP32[i3 + 20 >> 2] = i1, HEAP32[i1 + 24 >> 2] = i3)
                                        }
                                    } while (0);
                                    return i8 >>> 0 < 16 ? (HEAP32[i10 >> 2] = 1 & i9 | i7 | 2, HEAP32[(i11 = i12 + i7 + 4 | 0) >> 2] = 1 | HEAP32[i11 >> 2], 0 | i12) : (i6 = i12 + i11 | 0, HEAP32[i10 >> 2] = 1 & i9 | i11 | 2, HEAP32[i6 + 4 >> 2] = 3 | i8, HEAP32[(i11 = i12 + i7 + 4 | 0) >> 2] = 1 | HEAP32[i11 >> 2], _dispose_chunk(i6, i8), 0 | i12)
                                }(i3 + -8 | 0, i2 >>> 0 < 11 ? 16 : i2 + 11 & -8)) ? 0 | (i3 = i1 + 8 | 0) : (i1 = 0 | _malloc(i2)) ? (function(i3, i6, i1) {
                                    i3 |= 0, i6 |= 0;
                                    var i4, i5, i2 = 0;
                                    if ((0 | (i1 |= 0)) >= 8192) return function(dest, src) {
                                        HEAPU8.set(HEAPU8.subarray(src, src + (0 | i1)), dest)
                                    }(0 | i3, 0 | i6), 0 | i3;
                                    if (i5 = 0 | i3, i4 = i3 + i1 | 0, (3 & i3) == (3 & i6)) {
                                        for (; 3 & i3;) {
                                            if (!i1) return 0 | i5;
                                            HEAP8[i3 >> 0] = 0 | HEAP8[i6 >> 0], i3 = i3 + 1 | 0, i6 = i6 + 1 | 0, i1 = i1 - 1 | 0
                                        }
                                        for (i2 = (i1 = -4 & i4 | 0) - 64 | 0;
                                            (0 | i3) <= (0 | i2);) HEAP32[i3 >> 2] = HEAP32[i6 >> 2], HEAP32[i3 + 4 >> 2] = HEAP32[i6 + 4 >> 2], HEAP32[i3 + 8 >> 2] = HEAP32[i6 + 8 >> 2], HEAP32[i3 + 12 >> 2] = HEAP32[i6 + 12 >> 2], HEAP32[i3 + 16 >> 2] = HEAP32[i6 + 16 >> 2], HEAP32[i3 + 20 >> 2] = HEAP32[i6 + 20 >> 2], HEAP32[i3 + 24 >> 2] = HEAP32[i6 + 24 >> 2], HEAP32[i3 + 28 >> 2] = HEAP32[i6 + 28 >> 2], HEAP32[i3 + 32 >> 2] = HEAP32[i6 + 32 >> 2], HEAP32[i3 + 36 >> 2] = HEAP32[i6 + 36 >> 2], HEAP32[i3 + 40 >> 2] = HEAP32[i6 + 40 >> 2], HEAP32[i3 + 44 >> 2] = HEAP32[i6 + 44 >> 2], HEAP32[i3 + 48 >> 2] = HEAP32[i6 + 48 >> 2], HEAP32[i3 + 52 >> 2] = HEAP32[i6 + 52 >> 2], HEAP32[i3 + 56 >> 2] = HEAP32[i6 + 56 >> 2], HEAP32[i3 + 60 >> 2] = HEAP32[i6 + 60 >> 2], i3 = i3 + 64 | 0, i6 = i6 + 64 | 0;
                                        for (;
                                            (0 | i3) < (0 | i1);) HEAP32[i3 >> 2] = HEAP32[i6 >> 2], i3 = i3 + 4 | 0, i6 = i6 + 4 | 0
                                    } else
                                        for (i1 = i4 - 4 | 0;
                                            (0 | i3) < (0 | i1);) HEAP8[i3 >> 0] = 0 | HEAP8[i6 >> 0], HEAP8[i3 + 1 >> 0] = 0 | HEAP8[i6 + 1 >> 0], HEAP8[i3 + 2 >> 0] = 0 | HEAP8[i6 + 2 >> 0], HEAP8[i3 + 3 >> 0] = 0 | HEAP8[i6 + 3 >> 0], i3 = i3 + 4 | 0, i6 = i6 + 4 | 0;
                                    for (;
                                        (0 | i3) < (0 | i4);) HEAP8[i3 >> 0] = 0 | HEAP8[i6 >> 0], i3 = i3 + 1 | 0, i6 = i6 + 1 | 0
                                }(0 | i1, 0 | i3, 0 | ((i4 = (-8 & (i4 = 0 | HEAP32[i3 + -4 >> 2])) - (0 == (3 & i4 | 0) ? 8 : 4) | 0) >>> 0 < i2 >>> 0 ? i4 : i2)), _free(i3), 0 | (i3 = i1)) : 0 | (i3 = 0) : 0 | (i3 = 0 | _malloc(i2))
                            }(0 | HEAP32[(i2 = 4 + (i1 |= 0) | 0) >> 2], (i3 = 0 | HEAP32[(i4 = i1 + 12 | 0) >> 2]) << 3)) return HEAP32[i4 >> 2] = i3 << 1, void(HEAP32[i2 >> 2] = i1);
                        ! function() {
                            exit(-1)
                        }()
                    }(i5), i1 = 0 | HEAP32[i4 >> 2]), HEAP32[(0 | HEAP32[i5 + 4 >> 2]) + (i1 << 2) >> 2] = i4, _heapify_up(i5, i4), 0 | i4
                }
            }
        }()
}();
