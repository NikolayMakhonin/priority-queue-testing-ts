import {} from 'memory_management_lazy.h'
#include <stdio.h>

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

static const mm_sizes: uint32_t[PQ_MEM_WIDTH] =
{
    0x00000001, 0x00000002, 0x00000004, 0x00000008,
    0x00000010, 0x00000020, 0x00000040, 0x00000080,
    0x00000100, 0x00000200, 0x00000400, 0x00000800,
    0x00001000, 0x00002000, 0x00004000, 0x00008000,
    0x00010000, 0x00020000, 0x00040000, 0x00080000,
    0x00100000, 0x00200000, 0x00400000, 0x00800000,
    0x01000000, 0x02000000, 0x04000000, 0x08000000,
    0x10000000, 0x20000000, 0x40000000, 0x80000000
};

export function mm_grow_data( map: mem_map*, type: uint32_t ): void ;
export function mm_grow_free( map: mem_map*, type: uint32_t ): void ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function mm_create( types: uint32_t, sizes: uint32_t* ): mem_map* {
    let i: int;

    let map: mem_map* = malloc( sizeof( mem_map ) );
    map.types = types;
    map.sizes = malloc( types * sizeof( uint32_t ) );
    map.data = malloc( types * sizeof( uint8_t* ) );
    map.free = malloc( types * sizeof( uint8_t*[] ) );
    map.chunk_data = new Array(types);
    map.chunk_free = new Array(types);
    map.index_data = new Array(types);
    map.index_free = new Array(types);


    for( i = 0; i < types; i++ )
    {
        map.sizes[i] = sizes[i];

        map.data[i] = new Array(PQ_MEM_WIDTH);
        map.free[i] = new Array(PQ_MEM_WIDTH);

        map.data[i][0] = malloc( map.sizes[i] );
        map.free[i][0] = malloc( sizeof( uint8_t* ) );
    }

    return map;
}

export function mm_destroy( map: mem_map* ): void {
    let i: int, j;
    for( i = 0; i < map.types; i++ )
    {
        for( j = 0; j < PQ_MEM_WIDTH; j++ )
        {
            if( map.data[i][j] != null )
                free( map.data[i][j] );
            if( map.free[i][j] != null )
                free( map.free[i][j] );
        }

        free( map.data[i] );
        free( map.free[i] );
    }

    free( map.data );
    free( map.free );
    free( map.sizes );
    free( map.chunk_data );
    free( map.chunk_free );
    free( map.index_data );
    free( map.index_free );

    free( map );
}

export function mm_clear( map: mem_map* ): void {
    let i: int;
    for( i = 0; i < map.types; i++ )
    {
        map.chunk_data[i] = 0;
        map.chunk_free[i] = 0;
        map.index_data[i] = 0;
        map.index_free[i] = 0;
    }
}

export function pq_alloc_node( map: mem_map*, type: uint32_t ): void* {
    let node: void*;
    if ( map.chunk_free[type] === 0 && map.index_free[type] === 0 )
    {
        if( map.index_data[type] === mm_sizes[map.chunk_data[type]] )
            mm_grow_data( map, type );

        node = ( map.data[type][map.chunk_data[type]] + ( map.sizes[type] *
            (map.index_data[type])++ ) );
    }
    else
    {
        if( map.index_free[type] === 0 )
            map.index_free[type] = mm_sizes[--(map.chunk_free[type])];

        node =
            map.free[type][map.chunk_free[type]][--(map.index_free[type])];
    }

    memset( node, 0, map.sizes[type] );

    return node;
}

export function pq_free_node( map: mem_map*, type: uint32_t, node: void* ): void {
    if( map.index_free[type] === mm_sizes[map.chunk_free[type]] )
        mm_grow_free( map, type );

    map.free[type][map.chunk_free[type]][(map.index_free[type])++] = node;
}

//==============================================================================
// STATIC METHODS
//==============================================================================

export function mm_grow_data( map: mem_map*, type: uint32_t ): void {
    let chunk: uint32_t = ++(map.chunk_data[type]);
    map.index_data[type] = 0;

    if( map.data[type][chunk] == null )
        map.data[type][chunk] = malloc( map.sizes[type] * mm_sizes[chunk] );
}

export function mm_grow_free( map: mem_map*, type: uint32_t ): void {
    let chunk: uint32_t = ++(map.chunk_free[type]);
    map.index_free[type] = 0;

    if( map.free[type][chunk] == null )
        map.free[type][chunk] = malloc( map.sizes[type] * mm_sizes[chunk] );
}

