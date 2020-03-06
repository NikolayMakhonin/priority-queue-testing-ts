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
    //! number of each type of node
    capacities: uint32[];

    data: uint8[][];
    free: uint8[][][];

    index_data: uint32[];
    index_free: uint32[];
}

/**
 * Creates a new memory map for the specified node sizes
 *
 * @param types         The number of different types of nodes to manage
 * @param sizes         Sizes of a single node of each type
 * @param capacities    The number of nodes of each type to allocate
 * @return              Pointer to the new memory map
 */
export function mm_create( types: uint32, sizes: uint32[], capacities: uint32[] ): mem_map {
    let i: int16;

    let map: mem_map = {
        types: types,
        sizes: new Array<uint32>(types),
        capacities: new Array<uint32>(types),
        data: new Array<uint8[]>(types),
        free: new Array<uint8[][]>(types),
        index_data: new Array(types),
        index_free: new Array(types),
    }

    for (i = 0; i < types; i++) {
        map.sizes[i] = sizes[i];
        map.capacities[i] = capacities[i];

        map.data[i] = new Array(PQ_MEM_WIDTH);
        map.free[i] = new Array(PQ_MEM_WIDTH);

        map.data[i] = new Array(map.capacities[i]);
        map.free[i] = new Array(map.capacities[i]);
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
    // TODO:

    let node: any;
    if ( map.index_free[type] === 0 ) {
        // create node
        node = map.data[type][map.sizes[type] * map.index_data[type]++];
    } else {
        // get node from pool
        node = map.free[type][--(map.index_free[type])];
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
    map.free[type][(map.index_free[type])++] = node;
}
