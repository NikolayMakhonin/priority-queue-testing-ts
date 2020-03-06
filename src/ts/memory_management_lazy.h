#ifndef PQ_MEMORY_MANAGEMENT
#define PQ_MEMORY_MANAGEMENT

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

#include <stdint.h>
#include <stdlib.h>
#include <string.h>

export const PQ_MEM_WIDTH = 32;

/**
 * Basic memory pool to use for node allocation.  Memory maps can be shared
 * between multiple queues for the purpose of melding.  The size of the pool is
 * doubled when the current capacity is exceeded.
 */

export interface mem_map {
    //! number of different node types
    let types: uint32_t;
    //! sizes of single nodes
    let sizes: uint32_t*;

    let data: uint8_t*[][];
    let free: uint8_t*[][][];

    let chunk_data: uint32_t*;
    let chunk_free: uint32_t*;

    let index_data: uint32_t*;
    let index_free: uint32_t*;
}

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new memory map for the specified node sizes
 *
 * @param types The number of different types of nodes to manage
 * @param size  Sizes of a single node of each type
 * @return      Pointer to the new memory map
 */
export function mm_create( types: uint32_t, sizes: uint32_t* ): mem_map* ;

/**
 * Releases all allocated memory associated with the map.
 *
 * @param map   Map to deallocate
 */
export function mm_destroy( map: mem_map* ): void ;

/**
 * Resets map to initial state.  Does not deallocate memory.
 *
 * @param map   Map to reset
 */
export function mm_clear( map: mem_map* ): void ;

/**
 * Allocates a single node from the memory pool.  First attempts to recycle old
 * data from the free list.  If there is nothing to recycle, then it takes a new
 * node off the allocated list.  Zeroes the memory of the allocated node.
 *
 * @param map   Map from which to allocate
 * @param type  Type of node to allocate
 * @return      Pointer to allocated node
 */
export function pq_alloc_node( map: mem_map*, type: uint32_t ): void* ;

/**
 * Takes a previously allocated node and adds it to the free list to be
 * recycled with further allocation requests.
 *
 * @param map   Map to which the node belongs
 * @param type  Type of node to free
 * @param node  Node to free
 */
export function pq_free_node( map: mem_map*, type: uint32_t, node: void* ): void ;

#endif
