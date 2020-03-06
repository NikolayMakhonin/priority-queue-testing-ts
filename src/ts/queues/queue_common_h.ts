#ifndef QUEUE_COMMON
#define QUEUE_COMMON

//==============================================================================
// DEFINES AND INCLUDES
//==============================================================================

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <float.h>

#ifdef USE_EAGER
    import {} from '../memory_management_eager.h'
#elif USE_LAZY
    import {} from '../memory_management_lazy.h'
#else
    import {} from '../memory_management_dumb.h'
#endif

import {} from '../typedefs_h'

#ifndef DEF_VALUES
    #define DEF_VALUES
    export const FALSE = 0;
    export const TRUE = 1;
    export const LEFT = 0;
    export const MAXRANK = 64;
    export const ALPHA = 0.75;
    export const INFINITY = 0xFFFFFFFF;
#endif

#ifndef __cplusplus
export type boolean = uint32;
#endif

#define ITEM_ASSIGN(a,b) ( a = b )

export const MAX_KEY = 0xFFFFFFFFFFFFFFFF;

#define OCCUPIED(a,b)       ( a & ( ( (uint64) 1 ) << b ) )
#define REGISTRY_SET(a,b)   ( a |= ( ( (uint64) 1 ) << b ) )
#define REGISTRY_UNSET(a,b) ( a &= ~( ( (uint64) 1 ) << b ) )
#define REGISTRY_LEADER(a)  ( (uint32) __builtin_ctzll( a ) )

#endif
