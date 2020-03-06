#ifndef RANKPAIRING_HEAP
#define RANKPAIRING_HEAP

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

import {} from 'queue_common.h'

/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Keeps track of rank, as well as pointers to parent and
 * left and right children.  In the case of a root, the right child
 * pointer points to the next root.
 */
export interface rank_pairing_node_t {
    //! Parent node
    struct parent: rank_pairing_node_t*;
    //! Left child
    struct left: rank_pairing_node_t*;
    //! Right child, or next root if this node is a root
    struct right: rank_pairing_node_t*;

    //! A proxy for tree size
    let rank: uint32;

    //! Pointer to a piece of client data
    let item: item_type;
    //! Key for the item
    let key: key_type;
};

export type rank_pairing_node = rank_pairing_node_t;
export type pq_node_type = rank_pairing_node;

/**
 * A mutable, meldable, rank-pairing heap.  Maintains a forest of half-trees
 * managed by rank.  Obeys the type-1 rank rule and utilizes restricted
 * multi-pass linking.
 */
export interface rank_pairing_heap_t {
    //! Memory map to use for node allocation
    let map: mem_map;
    //! The number of items held in the queue
    let size: uint32;
    //! Pointer to the minimum node in the queue
    let minimum: rank_pairing_node*;
    //! An array of roots of the queue, indexed by rank
    let roots: rank_pairing_node*[MAXRANK];
    //! Current largest rank in queue
    let largest_rank: uint32;
};

export type rank_pairing_heap = rank_pairing_heap_t;
export type pq_type = rank_pairing_heap;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new, empty queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map ): rank_pairing_heap* ;

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: rank_pairing_heap* ): void ;

/**
 * Deletes all nodes from the queue, leaving it empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: rank_pairing_heap* ): void ;

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: rank_pairing_heap*, node: rank_pairing_node* ): key_type ;

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: rank_pairing_heap*, node: rank_pairing_node* ): item_type* ;

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: rank_pairing_heap* ): uint32 ;

/**
 * Takes an item-key pair to insert it into the queue and creates a new
 * corresponding node.  Makes the new node a root.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: rank_pairing_heap*, item: item_type,
    key: key_type ): rank_pairing_node* ;

/**
 * Returns the minimum item from the queue.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: rank_pairing_heap* ): rank_pairing_node* ;

/**
 * Removes the minimum item from the queue and returns it.  Relies on
 * @ref <pq_delete> to remove the minimum item.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: rank_pairing_heap* ): key_type ;

/**
 * Removes an arbitrary item from the queue and modifies queue structure
 * to preserve heap properties.  Requires that the location of the
 * item's corresponding node is known.  Severs the right spine of both
 * the left and right children of the node in order to make each of
 * these nodes a new halftree root.  Merges all these new roots into
 * the list and then performs a one-pass linking step to reduce the
 * number of trees.
 *
 * @param queue Queue in which the node resides
 * @param node  Pointer to node corresponding to the item to remove
 * @return      Key of item removed
 */
export function pq_delete( queue: rank_pairing_heap*, node: rank_pairing_node* ): key_type ;

/**
 * If the item in the queue is modified in such a way to decrease the
 * key, then this function will update the queue to preserve heap
 * properties given a pointer to the corresponding node.  Cuts the node
 * from its parent and traverses the tree upwards to correct the rank
 * values.
 *
 * @param queue     Queue in which the node resides
 * @param node      Node to change
 * @param new_key   New key to use for the given node
 */
export function pq_decrease_key( queue: rank_pairing_heap*, node: rank_pairing_node*,
    new_key: key_type ): void ;

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: rank_pairing_heap* ): boolean ;

#endif

