#ifndef FIBONACCI_HEAP
#define FIBONACCI_HEAP

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

import {} from 'queue_common.h'

/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly-linked circular list
 * of its siblings.  Additionally, each node has a pointer to its parent
 * and its first child.
 */
export interface fibonacci_node_t {
    //! Parent of this node
    struct parent: fibonacci_node_t*;
    //! "First" child of this node
    struct first_child: fibonacci_node_t*;
    //! Next node in the list of this node's siblings
    struct next_sibling: fibonacci_node_t*;
    //! Previous node in the list of this node's siblings
    struct prev_sibling: fibonacci_node_t*;

    //! The "height" of a node, i.e. bound on log of subtree size
    let rank: uint32;
    //! Denotes if a non-root node has lost a child or not
    let marked: boolean;
    //! Pointer to a piece of client data
    let item: item_type;
    //! Key for the item
    let key: key_type;
};

export type fibonacci_node = fibonacci_node_t;
export type pq_node_type = fibonacci_node;

/**
 * A mutable, meldable, Fibonacci heap.  Maintains a forest of (partial)
 * binomial trees, resulting from rank-wise paired merging.  Uses an array to
 * index trees by rank.  Imposes standard queue variant, as well as requiring
 * that there remains at most one tree of any given rank after a minimum
 * deletion (managed by merging).  Furthermore, a series of ("cascading") cuts
 * is performed after a key decrease or non-minimum deletion if the parent loses
 * it's second child.
 */
export interface fibonacci_heap_t {
    //! Memory map to use for node allocation
    let map: mem_map;
    //! The number of items held in the queue
    let size: uint32;
    //! Pointer to the minimum node in the queue
    let minimum: fibonacci_node;
    //! An array of roots of the queue, indexed by rank
    let roots: fibonacci_node[MAXRANK];
    //! Current largest rank in queue
    let largest_rank: uint32;
};

export type fibonacci_heap = fibonacci_heap_t;
export type pq_type = fibonacci_heap;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new, empty queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map ): fibonacci_heap ;

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: fibonacci_heap ): void ;

/**
 * Deletes all nodes in the queue, leaving it empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: fibonacci_heap ): void ;

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: fibonacci_heap, node: fibonacci_node ): key_type ;

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: fibonacci_heap, node: fibonacci_node ): item_type* ;

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: fibonacci_heap ): uint32 ;

/**
 * Takes an item-key pair to insert it into the queue and creates a new
 * corresponding node.  inserts the node as a new root.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: fibonacci_heap, item: item_type, key: key_type ): fibonacci_node ;

/**
 * Returns the minimum item from the queue without modifying the queue.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: fibonacci_heap ): fibonacci_node ;

/**
 * Removes the minimum item from the queue and returns it.   After removing the
 * node, makes its children new roots in the queue.  Iteratively merges trees
 * of the same rank such that no two of the same rank remain afterward.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: fibonacci_heap ): key_type ;

/**
 * Removes an arbitrary item from the queue.  Requires that the location
 * of the item's corresponding node is known.  After removing the node,
 * makes its children new roots in the queue.   May initiate sequence of
 * cascading cuts from node's parent.
 *
 * @param queue Queue in which the node resides
 * @param node  Pointer to node corresponding to the item to remove
 * @return      Key of item removed
 */
export function pq_delete( queue: fibonacci_heap, node: fibonacci_node ): key_type ;

/**
 * If the item in the queue is modified in such a way to decrease the
 * key, then this function will restructure the queue to repair any
 * potential structural violations.  Cuts the node from its parent and
 * makes it a new root, and potentially performs a series of cascading
 * cuts.
 *
 * @param queue     Queue in which the node resides
 * @param node      Node to change
 * @param new_key   New key to use for the given node
 */
export function pq_decrease_key( queue: fibonacci_heap, node: fibonacci_node,
    new_key: key_type ): void ;

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: fibonacci_heap ): boolean ;

#endif
