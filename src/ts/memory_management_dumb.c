import {} from 'memory_management_dumb.h'
#include <stdio.h>

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function mm_create( types: uint32_t, sizes: uint32_t* ): mem_map* {
    let map: mem_map* = malloc( sizeof( mem_map ) );
    map.types = types;
    map.sizes = malloc( types * sizeof( uint32_t ) );

    return map;
}

export function mm_destroy( map: mem_map* ): void {
    free( map.sizes );
    free( map );
}

export function mm_clear( map: mem_map* ): void {
    return;
}

export function pq_alloc_node( map: mem_map*, type: uint32_t ): void* {
    let node: void* = new Array(1);

    return node;
}

export function pq_free_node( map: mem_map*, type: uint32_t, node: void* ): void {
    free( node );
}
