export type int8 = number
export type int16 = number
export type int32 = number
export type int64 = number
export type uint8 = number
export type uint16 = number
export type uint32 = number
export type uint64 = number
export type float = number
export type double = number

export type key_type = uint64;
export type item_type = uint32;

/*
Returns the number of trailing 0-bits in x, starting at the least significant bit position. If x is 0, the result is undefined.
 */
export function __builtin_ctzll(o: uint64): uint8 {
    if (o === 0) {
        throw new Error('o === 0')
    }

    let count = 0
    while((o & 1) === 0) {
        count++
    }
    return count
}
