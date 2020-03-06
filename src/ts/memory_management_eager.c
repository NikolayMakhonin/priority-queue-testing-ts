import {} from 'memory_management_eager.h'
#include <stdio.h>

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function mm_create( types: uint32_t, sizes: uint32_t*, capacities: uint32_t* ): mem_map* {
    let i: int;

    let map: mem_map* = malloc( sizeof( mem_map ) );
    map.types = types;
    map.sizes = malloc( types * sizeof( uint32_t ) );
    map.capacities = malloc( types * sizeof( uint32_t ) );
    map.data = malloc( types * sizeof( uint8_t* ) );
    map.free = malloc( types * sizeof( uint8_t*[] ) );
    map.index_data = new Array(types);
    map.index_free = new Array(types);


    for( i = 0; i < types; i++ )
    {
        map.sizes[i] = sizes[i];
        map.capacities[i] = capacities[i];

        map.data[i] = new Array(PQ_MEM_WIDTH);
        map.free[i] = new Array(PQ_MEM_WIDTH);

        map.data[i] = malloc( map.sizes[i] * map.capacities[i] );
        map.free[i] = malloc( sizeof( uint8_t* ) * map.capacities[i] );
    }

    return map;
}

export function mm_destroy( map: mem_map* ): void {
    let i: int;
    for( i = 0; i < map.types; i++ )
    {
        free( map.data[i] );
        free( map.free[i] );
    }

    free( map.data );
    free( map.free );
    free( map.capacities );
    free( map.sizes );

    free( map );
}

export function mm_clear( map: mem_map* ): void {
    let i: int;
    for( i = 0; i < map.types; i++ )
    {
        map.index_data[i] = 0;
        map.index_free[i] = 0;
    }
}

export function pq_alloc_node( map: mem_map*, type: uint32_t ): void* {
    let node: void*;
    if ( map.index_free[type] === 0 )
        node = ( map.data[type] + ( map.sizes[type] *
            (map.index_data[type])++ ) );
    else
        node = map.free[type][--(map.index_free[type])];

    memset( node, 0, map.sizes[type] );

    return node;
}

export function pq_free_node( map: mem_map*, type: uint32_t, node: void* ): void {
    map.free[type][(map.index_free[type])++] = node;
}
