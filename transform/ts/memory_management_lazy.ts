import {int16, uint32, uint8} from './typedefs'

export const PQ_MEM_WIDTH = 32;

/**
 * Basic memory pool to use for node allocation.  Memory maps can be shared
 * between multiple queues for the purpose of melding.  The size of the pool is
 * doubled when the current capacity is exceeded.
 */

export interface mem_map {
    //! number of different node types
    types: uint32;
    //! sizes of single nodes
    sizes: uint32[];

    data: uint8[][][];
    free: uint8[][][][];

    chunk_data: uint32[];
    chunk_free: uint32[];

    index_data: uint32[];
    index_free: uint32[];
}

const mm_sizes: uint32[] = [
    0x00000001, 0x00000002, 0x00000004, 0x00000008,
    0x00000010, 0x00000020, 0x00000040, 0x00000080,
    0x00000100, 0x00000200, 0x00000400, 0x00000800,
    0x00001000, 0x00002000, 0x00004000, 0x00008000,
    0x00010000, 0x00020000, 0x00040000, 0x00080000,
    0x00100000, 0x00200000, 0x00400000, 0x00800000,
    0x01000000, 0x02000000, 0x04000000, 0x08000000,
    0x10000000, 0x20000000, 0x40000000, 0x80000000
];

/**
 * Creates a new memory map for the specified node sizes
 *
 * @param types The number of different types of nodes to manage
 * @param sizes Sizes of a single node of each type
 * @return      Pointer to the new memory map
 */
export function mm_create( types: uint32, sizes: uint32[] ): mem_map {
    let i: int16;

    let map: mem_map = {
        types: types,
        sizes: new Array<uint32>(types),
        data: new Array<uint8[][]>(types),
        free: new Array<uint8[][][]>(types),
        chunk_data: new Array(types),
        chunk_free: new Array(types),
        index_data: new Array(types),
        index_free: new Array(types),
    }

    for( i = 0; i < types; i++ )
    {
        map.sizes[i] = sizes[i];

        map.data[i] = new Array(PQ_MEM_WIDTH);
        map.free[i] = new Array(PQ_MEM_WIDTH);

        map.data[i][0] = malloc( map.sizes[i] );
        map.free[i][0] = new Array<uint8[]>()
    }

    return map;
}

/**
 * Releases all allocated memory associated with the map.
 *
 * @param map   Map to deallocate
 */
export function mm_destroy( map: mem_map ): void {
    // TODO remove this method
}

/**
 * Resets map to initial state.  Does not deallocate memory.
 *
 * @param map   Map to reset
 */
export function mm_clear( map: mem_map ): void {
    let i: int16;
    for( i = 0; i < map.types; i++ )
    {
        map.chunk_data[i] = 0;
        map.chunk_free[i] = 0;
        map.index_data[i] = 0;
        map.index_free[i] = 0;
    }
}

/**
 * Allocates a single node from the memory pool.  First attempts to recycle old
 * data from the free list.  If there is nothing to recycle, then it takes a new
 * node off the allocated list.  Zeroes the memory of the allocated node.
 *
 * @param map   Map from which to allocate
 * @param type  Type of node to allocate
 * @return      Pointer to allocated node
 */
export function pq_alloc_node( map: mem_map, type: uint32 ): any {
    let node: any;
    if ( map.chunk_free[type] === 0 && map.index_free[type] === 0 )
    {
        // create node
        if( map.index_data[type] === mm_sizes[map.chunk_data[type]] )
            mm_grow_data( map, type );

        node = map.data[type][map.chunk_data[type]][map.sizes[type] * map.index_data[type]++];
    }
    else
    {
        // get node from pool
        if( map.index_free[type] === 0 )
            map.index_free[type] = mm_sizes[--(map.chunk_free[type])];

        node =
            map.free[type][map.chunk_free[type]][--(map.index_free[type])];
    }

    // clear node
    memset( node, 0, map.sizes[type] );

    return node;
}

/**
 * Takes a previously allocated node and adds it to the free list to be
 * recycled with further allocation requests.
 *
 * @param map   Map to which the node belongs
 * @param type  Type of node to free
 * @param node  Node to free
 */
export function pq_free_node( map: mem_map, type: uint32, node: any ): void {
    if( map.index_free[type] === mm_sizes[map.chunk_free[type]] )
        mm_grow_free( map, type );

    map.free[type][map.chunk_free[type]][(map.index_free[type])++] = node;
}

//==============================================================================
// STATIC METHODS
//==============================================================================

export function mm_grow_data( map: mem_map, type: uint32 ): void {
    let chunk: uint32 = ++(map.chunk_data[type]);
    map.index_data[type] = 0;

    if( map.data[type][chunk] == null )
        map.data[type][chunk] = malloc( map.sizes[type] * mm_sizes[chunk] );
}

export function mm_grow_free( map: mem_map, type: uint32 ): void {
    let chunk: uint32 = ++(map.chunk_free[type]);
    map.index_free[type] = 0;

    if( map.free[type][chunk] == null )
        map.free[type][chunk] = malloc( map.sizes[type] * mm_sizes[chunk] );
}

