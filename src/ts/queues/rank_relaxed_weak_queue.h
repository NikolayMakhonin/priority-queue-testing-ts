#ifndef RANK_RELAXED_WEAK_QUEUE
#define RANK_RELAXED_WEAK_QUEUE

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

export const ROOTS = 0;
export const MARKS = 1;

import {} from 'queue_common.h'

/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Keeps track of rank, as well as pointers to parent and
 * left and right children.  In the case of a root, the right child
 * pointer points to the next root.
 */
export interface rank_relaxed_weak_node_t {
    //! Parent node
    struct parent: rank_relaxed_weak_node_t*;
    //! Left child
    struct left: rank_relaxed_weak_node_t*;
    //! Right child, or next root if this node is a root
    struct right: rank_relaxed_weak_node_t*;

    //! A proxy for tree size
    let rank: uint32_t;
    //! Mark status
    let marked: uint32_t;

    //! Pointer to a piece of client data
    let item: item_type;
    //! Key for the item
    let key: key_type;
};

export type rank_relaxed_weak_node = rank_relaxed_weak_node_t;
export type pq_node_type = rank_relaxed_weak_node;

/**
 * A mutable, meldable, rank-relaxed weak queue.  Maintains a forest of
 * half-trees managed by rank.  Some operations will mark nodes.  After any
 * operation, there will be no two roots of the same rank, no two marked nodes
 * of the same rank, no marked node with a parent which is also marked, and no
 * marked node which is a left child.
 */
export interface rank_relaxed_weak_queue_t {
    //! Memory map to use for node allocation
    let map: mem_map*;
    //! The number of items held in the queue
    let size: uint32_t;
    //! Pointer to the minimum node in the queue
    let minimum: rank_relaxed_weak_node*;
    //! Arrays of roots and marked nodes in the queue, indexed by rank
    let nodes: rank_relaxed_weak_node*[2][MAXRANK];
    //! Bit vectors indicating which pointers
    let registry: uint64_t[2];
};

export type rank_relaxed_weak_queue = rank_relaxed_weak_queue_t;
export type pq_type = rank_relaxed_weak_queue;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new, empty queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map* ): rank_relaxed_weak_queue* ;

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: rank_relaxed_weak_queue* ): void ;

/**
 * Deletes all nodes from the queue, leaving it empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: rank_relaxed_weak_queue* ): void ;

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): key_type ;

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): item_type* ;

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: rank_relaxed_weak_queue* ): uint32_t ;

/**
 * Takes an item-key pair to insert it into the queue and creates a new
 * corresponding node.  Makes the new node a root, and proceeds to restore
 * structural invariants.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: rank_relaxed_weak_queue*,
    item: item_type, key: key_type ): rank_relaxed_weak_node* ;

/**
 * Returns the minimum item from the queue.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: rank_relaxed_weak_queue* ): rank_relaxed_weak_node* ;

/**
 * Removes the minimum item from the queue and modifies queue structure to
 * preserve queue properties.  Finds a replacement node by extracting the root
 * of the smallest tree.  Severs the left spine of this replacement node's right
 * subtree and makes all the resulting new trees roots, joining until rank
 * invariants are satisfied.  Walks down the left spine of the right subtree of
 * the node to delete, and then joins the replacement node recursively up this
 * list.  Glues the resulting tree in the place of the node to delete, marking
 * its root.  Releases the minimum node to garbage collection.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: rank_relaxed_weak_queue* ): key_type ;

/**
 * Removes an arbitrary item from the queue and returns it.  Relies on
 * @ref <pq_decrease_key> to make the item the minimum in the queue and then
 * uses @ref <pq_delete_min> to remove it.
 *
 * @param queue Queue in which the node resides
 * @param node  Pointer to node corresponding to the item to remove
 * @return      Key of item removed
 */
export function pq_delete( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): key_type ;

/**
 * If the item in the queue is modified in such a way to decrease the
 * key, then this function will mark the nodes and begin an upwards mark-removal
 * process.
 *
 * @param queue     Queue in which the node resides
 * @param node      Node to change
 * @param new_key   New key to use for the given node
 */
export function pq_decrease_key( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node*, new_key: key_type ): void ;

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: rank_relaxed_weak_queue* ): boolean ;

#endif

