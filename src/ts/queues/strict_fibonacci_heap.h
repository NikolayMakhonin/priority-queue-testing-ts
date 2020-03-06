#ifndef STRICT_FIBONACCI_HEAP
#define STRICT_FIBONACCI_HEAP

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

// passive, active non-root with 0 loss, active root, positive loss
export const STRICT_TYPE_PASSIVE = 0;
export const STRICT_TYPE_ACTIVE = 1;
export const STRICT_TYPE_ROOT = 2;
export const STRICT_TYPE_LOSS = 3;

// node types for memory map allocation
export const STRICT_NODE_FIB = 0;
export const STRICT_NODE_FIX = 1;
export const STRICT_NODE_ACTIVE = 2;
export const STRICT_NODE_RANK = 3;

// modes for fix list operations
export const STRICT_FIX_ROOT = 0;
export const STRICT_FIX_LOSS = 1;

// directions for rank moves
export const STRICT_DIR_DEMOTE = 0;
export const STRICT_DIR_PROMOTE = 1;

import {} from 'queue_common.h'

// forward declares for pointer resolution
struct strict_fibonacci_node_t;
struct fix_node_t;

export type strict_item = strict_item_t;

/**
 * All active nodes in a single heap will point to the same active record.
 * Setting the flag to passive will render an entire heap passive for the
 * purpose of melding.
 */
export interface active_record_t {
    //! 1 if active, 0 otherwise
    let flag: uint32;
    //! Number of nodes currently pointing to it.  If 0, free record.
    let ref_count: uint32;
};

export type active_record = active_record_t;

/**
 * List of nodes representing rank.  Used to group active nodes for
 * restructuring.
 */
export interface rank_record_t {
    let rank: uint32;
    //! rank one higher if exists
    struct inc: rank_record_t*;
    //! rank one lower if exists
    struct dec: rank_record_t*;
    //! flags of last known transformability status
    let transformable: int16[2];
    //! pointers to fix nodes of the current rank
    struct head: fix_node_t*[2];
    struct tail: fix_node_t*[2];
    //! number of nodes pointing to it, free record if 0
    let ref_count: uint32;
};

export type rank_record = rank_record_t;

/**
 * A node in a doubly-linked circular list.  Holds a pointer to an active node
 * and a corresponding rank.
 */
export interface fix_node_t {
    struct node: strict_fibonacci_node_t*;
    struct left: fix_node_t*;
    struct right: fix_node_t*;
    let rank: rank_record*;
};

export type fix_node = fix_node_t;

/**
 * The main structural element of the heap.  Each node stores an item-key pair
 * and  is contained in a doubly-linked circular list of its siblings.
 * Additionally, each node has a pointer to its parent and its leftmost child.
 * The node has pointers to the next and previous nodes in the queue as well as
 * to rank and active records if it is active.  The last known type of the node
 * is stored so that a change in type can easily be detected and unnecessary
 * restructuring can be avoided.  Finally, active nodes may also have positive
 * loss and a reference to a node in the fix list.
 */
export interface strict_fibonacci_node_t {
    let item: item_type;
    let key: key_type;

    struct parent: strict_fibonacci_node_t*;
    struct left: strict_fibonacci_node_t*;
    struct right: strict_fibonacci_node_t*;
    struct left_child: strict_fibonacci_node_t*;

    struct q_prev: strict_fibonacci_node_t*;
    struct q_next: strict_fibonacci_node_t*;

    let type: uint32;
    let active: active_record*;
    let rank: rank_record*;
    let fix: fix_node*;
    let loss: uint32;
};

export type strict_fibonacci_node = strict_fibonacci_node_t;
export type pq_node_type = strict_fibonacci_node;

/**
 * A mutable, meldable, strict Fibonacci heap.  Maintains a single tree with
 * an auxiliary queue and a fix list.  Entirely pointer-based.
 */
export interface strict_fibonacci_heap_t {
    let map: mem_map;
    let size: uint32;

    let root: strict_fibonacci_node*;
    let q_head: strict_fibonacci_node*;

    let active: active_record*;
    let rank_list: rank_record*;
    let fix_list: fix_node*[2];

    let garbage_fix: fix_node*;
};

export type strict_fibonacci_heap = strict_fibonacci_heap_t;
export type pq_type = strict_fibonacci_heap;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new, empty queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map ): strict_fibonacci_heap* ;

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: strict_fibonacci_heap* ): void ;

/**
 * Deletes all nodes in the queue, leaving it empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: strict_fibonacci_heap* ): void ;

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): key_type ;

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): item_type* ;

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: strict_fibonacci_heap* ): uint32 ;

/**
 * Takes an item-key pair to insert it into the queue and creates a new
 * corresponding node.  inserts the node as a new root.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: strict_fibonacci_heap*, item: item_type,
    key: key_type ): strict_fibonacci_node* ;

/**
 * Returns the minimum item from the queue without modifying the queue.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: strict_fibonacci_heap* ): strict_fibonacci_node* ;

/**
 * Removes the minimum item from the queue and returns it.  Relies on
 * @ref <pq_delete> to remove the node.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: strict_fibonacci_heap* ): key_type ;

/**
 * Removes an arbitrary item from the queue.  Requires that the location
 * of the item's corresponding node is known.  After removing the node,
 * makes its children new roots in the queue.  Iteratively merges trees
 * of the same rank such that no two of the same rank remain afterward.
 * May initiate sequence of cascading cuts from node's parent.
 *
 * @param queue Queue in which the node resides
 * @param node  Pointer to node corresponding to the item to remove
 * @return      Key of item removed
 */
export function pq_delete( queue: strict_fibonacci_heap*, node: strict_fibonacci_node* ): key_type ;

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
export function pq_decrease_key( queue: strict_fibonacci_heap*, node: strict_fibonacci_node*,
    new_key: key_type ): void ;

/**
 * Combines two different item-disjoint queues which share a memory map.
 * Returns a pointer to the resulting queue.
 *
 * @param a First queue
 * @param b Second queue
 * @return  Resulting merged queue
 */
export function pq_meld( a: strict_fibonacci_heap*,
    b: strict_fibonacci_heap* ): strict_fibonacci_heap* ;

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: strict_fibonacci_heap* ): boolean ;

#endif
