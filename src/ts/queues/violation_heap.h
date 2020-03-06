#ifndef VIOLATION_HEAP
#define VIOLATION_HEAP

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

import {} from 'queue_common.h'

/**
* Holds an inserted element, as well as pointers to maintain tree
* structure.  Acts as a handle to clients for the purpose of
* mutability.  Tracks rank of node as well as pointers to this node's
* first child and the next and previous nodes in the list of siblings.
* The last node in the list of siblings will have a null prev pointer
* and the first node's next pointer will point to their parent.
*/
export interface violation_node_t {
    //! Last child of this node
    struct child: violation_node_t*;
    //! Next node in the list of this node's siblings
    struct next: violation_node_t*;
    //! Previous node in the list of this node's siblings
    struct prev: violation_node_t*;

    //! The number of children this node has
    let rank: int32;

    //! Pointer to a piece of client data
    let item: item_type;
    //! Key for the item
    let key: key_type;
};

export type violation_node = violation_node_t;
export type pq_node_type = violation_node;

/**
 * A mutable, meldable, violation queue.  Maintains a forest of trees indexed by
 * rank.  At most two trees of each rank remain after a @ref <pq_delete> or @ref
 * <pq_delete_min> operation.
 */
export interface violation_heap_t {
    //! Memory map to use for node allocation
    let map: mem_map;
    //! The number of items held in the queue
    let size: uint32;
    //! Pointer to the minimum node in the queue
    let minimum: violation_node*;
    //! An array of roots of the queue, indexed by rank
    let roots: violation_node*[MAXRANK][2];
    //! Current largest rank in queue
    let largest_rank: uint32;
};

export type violation_heap = violation_heap_t;
export type pq_type = violation_heap;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new, empty queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map ): violation_heap* ;

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: violation_heap* ): void ;

/**
 * Deletes all items in the queue, leaving it empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: violation_heap* ): void ;

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: violation_heap*, node: violation_node* ): key_type ;

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: violation_heap*, node: violation_node* ): item_type* ;

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: violation_heap* ): uint32 ;

/**
 * Takes an item-key pair to insert into the queue and creates a new
 * corresponding node.  Makes the new node a root.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: violation_heap*, item: item_type, key: key_type ): violation_node* ;

/**
 * Returns the minimum item from the queue.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: violation_heap* ): violation_node* ;

/**
 * Removes the minimum item from the queue and returns it.  Relies on
 * @ref <pq_delete> to remove the minimum item.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: violation_heap* ): key_type ;

/**
 * Removes an arbitrary item from the queue and modifies queue structure
 * to preserve queue properties.  Requires that the location of the
 * item's corresponding node is known.  Merges the node's children with
 * the root list.  Merges roots such that no more than two roots have
 * the same rank.
 *
 * @param queue Queue in which the node resides
 * @param node  Pointer to node corresponding to the item to remove
 * @return      Key of item removed
 */
export function pq_delete( queue: violation_heap*, node: violation_node* ): key_type ;

/**
 * If the item in the queue is modified in such a way to decrease the
 * key, then this function will update the queue to preserve queue
 * properties given a pointer to the corresponding node.  Replaces
 * the subtree rooted at the given node with its active subtree of
 * larger rank and then relocates the rest of the tree as a new root.
 *
 * @param queue     Queue in which the node resides
 * @param node      Node to change
 * @param new_key   New key to use for the given node
 */
export function pq_decrease_key( queue: violation_heap*, node: violation_node*,
    new_key: key_type ): void ;

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: violation_heap* ): boolean ;

#endif
