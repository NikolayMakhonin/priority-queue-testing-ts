#ifndef EXPLICIT_HEAP
#define EXPLICIT_HEAP

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

#ifdef BRANCH_16
    export const BRANCHING_FACTOR = 16;
    export const BRANCHING_POWER = 4;
#elif defined BRANCH_8
    export const BRANCHING_FACTOR = 8;
    export const BRANCHING_POWER = 3;
#elif defined BRANCH_4
    export const BRANCHING_FACTOR = 4;
    export const BRANCHING_POWER = 2;
#else
    export const BRANCHING_FACTOR = 2;
    export const BRANCHING_POWER = 1;
#endif

import {} from 'queue_common.h'

/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node has a pointer to its parent and its left and
 * right siblings.
 */
export interface explicit_node_t {
    //! Pointer to parent node
    struct parent: explicit_node_t*;
    //! Pointers to children
    struct children: explicit_node_t*[BRANCHING_FACTOR];

    //! Pointer to a piece of client data
    let item: item_type;
    //! Key for the item
    let key: key_type;
};

export type explicit_node = explicit_node_t;
export type pq_node_type = explicit_node;

/**
 * A mutable, meldable, node-based d-ary heap.  Maintains a single, complete
 * d-ary tree.  Imposes the standard queue invariant.
 */
export interface explicit_heap_t {
    //! Memory map to use for node allocation
    let map: mem_map*;
    //! The root of the d-ary tree representing the queue
    let root: explicit_node*;
    //! The number of items held in the queue
    let size: uint32_t;
};

export type explicit_heap = explicit_heap_t;
export type pq_type = explicit_heap;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new, empty priority queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map* ): explicit_heap* ;

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: explicit_heap* ): void ;

/**
 * Deletes all nodes from the queue, leaving it empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: explicit_heap* ): void ;

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: explicit_heap*, node: explicit_node* ): key_type ;

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: explicit_heap*, node: explicit_node* ): item_type* ;

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: explicit_heap* ): uint32_t ;

/**
 * Takes a item-key pair to insert into the queue and creates a new
 * corresponding node.  Inserts the node at the base of the tree in the
 * next open spot and reorders to preserve the heap invariant.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: explicit_heap*, item: item_type, key: key_type ): explicit_node* ;

/**
 * Returns the minimum item from the queue without modifying anything.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: explicit_heap* ): explicit_node* ;

/**
 * Removes the minimum item from the queue and returns it.  Relies on
 * @ref <pq_delete> to remove the root node of the tree, containing the
 * minimum element.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: explicit_heap* ): key_type ;

/**
 * Removes an arbitrary item from the queue.  Requires that the location
 * of the item's corresponding node is known.  First swaps target node
 * with last item in the tree, removes target item node, then pushes
 * down the swapped node (previously last) to it's proper place in
 * the tree to maintain queue properties.
 *
 * @param queue Queue in which the node resides
 * @param node  Pointer to node corresponding to the target item
 * @return      Key of item removed
 */
export function pq_delete( queue: explicit_heap*, node: explicit_node* ): key_type ;

/**
 * If an item in the queue is modified in such a way to decrease the
 * key, then this function will update the queue to preserve invariants
 * given a pointer to the corresponding node.
 *
 * @param queue     Queue in which the node resides
 * @param node      Node to change
 * @param new_key   New key to use for the given node
 */
export function pq_decrease_key( queue: explicit_heap*, node: explicit_node*,
    new_key: key_type ): void ;

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: explicit_heap* ): boolean ;

#endif
