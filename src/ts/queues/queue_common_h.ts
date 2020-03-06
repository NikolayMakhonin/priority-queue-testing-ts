#ifdef USE_EAGER
    import {} from '../memory_management_eager.h'
#elif USE_LAZY
    import {} from '../memory_management_lazy.h'
#else
    import {} from '../memory_management_dumb.h'
#endif

import {__builtin_ctzll, uint32, uint64, uint8} from '../typedefs'

export const FALSE = 0;
export const TRUE = 1;
export const LEFT = 0;
export const MAXRANK = 64;
export const ALPHA = 0.75;
export const INFINITY = 0xFFFFFFFF;

export const MAX_KEY = 0xFFFFFFFFFFFFFFFF;

export function OCCUPIED(a,b) { return a & ( (1 as uint64) << b ) }
export function REGISTRY_SET(a,b) { return (1 as uint64) << b }
export function REGISTRY_LEADER(a) { return __builtin_ctzll( a ) as uint32 }
