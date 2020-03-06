#ifndef QUAKE_HEAP
#define QUAKE_HEAP

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

import {} from 'queue_common.h'

/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Keeps track of the height of the node as well as pointer
 * to the node's parent, left child (duplicate), and right child.
 */
export interface quake_node_t {
    //! Parent node
    struct parent: quake_node_t*;
    //! Left child
    struct left: quake_node_t*;
    //! Right child, or next root if this node is a root
    struct right: quake_node_t*;

    //! The height of this node
    let height: uint8;

    //! Pointer to a piece of client data
    let item: item_type;
    //! Key for the item
    let key: key_type;
};

export type quake_node = quake_node_t;
export type pq_node_type = quake_node;

/**
 * A mutable, meldable, Quake heap.  Maintains a forest of (binary) tournament
 * trees of unique height.  Maintains standard heap invariant and guarantees
 * exponential decay in node height.
 */
export interface quake_heap_t {
    //! Memory map to use for node allocation
    let map: mem_map*;
    //! The number of items held in the queue
    let size: uint32;
    //! Pointer to the minimum node in the queue
    let minimum: quake_node*;
    //! An array of roots of the queue, indexed by height
    let roots: quake_node*[MAXRANK];
    //! An array of counters corresponding to the number of nodes at height
    //! equal to the index
    let nodes: uint32[MAXRANK];
    //! Current height of highest node in queue
    let highest_node: uint32;
    //! Index at which first decay violation occurs, MAXRANK if none
    let violation: uint32;
};

export type quake_heap = quake_heap_t;
export type pq_type = quake_heap;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new, empty queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map* ): quake_heap* ;

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: quake_heap* ): void ;

/**
 * Deletes all nodes, leaving the queue empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: quake_heap* ): void ;

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: quake_heap*, node: quake_node* ): key_type ;

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: quake_heap*, node: quake_node* ): item_type* ;

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: quake_heap* ): uint32 ;

/**
 * Takes an item-key pair to insert it into the queue and creates a new
 * corresponding node.  Inserts the node as a new root in the queue.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: quake_heap*, item: item_type, key: key_type ): quake_node* ;

/**
 * Returns the minimum item from the queue.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: quake_heap* ): quake_node* ;

/**
 * Removes the minimum item from the queue and returns it, restructuring
 * the queue along the way to maintain the queue property.  Relies on
 * @ref <pq_delete> to extract the minimum.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: quake_heap* ): key_type ;

/**
 * Removes an arbitrary item from the queue and modifies queue structure
 * to preserve heap properties.  Requires that the location of the
 * item's corresponding node is known.  Merges roots so that no two
 * roots of the same height remain.  Checks to make sure that the
 * exponential decay invariant is maintained, and corrects if not.
 *
 * @param queue Queue in which the node resides
 * @param node  Pointer to node corresponding to the item to remove
 * @return      Key of item removed
 */
export function pq_delete( queue: quake_heap*, node: quake_node* ): key_type ;

/**
 * If the item in the queue is modified in such a way to decrease the
 * key, then this function will update the queue to preserve queue
 * properties given a pointer to the corresponding node.  Removes the
 * subtree rooted at the given node and makes it a new tree in the queue.
 *
 * @param queue     Queue in which the node resides
 * @param node      Node to change
 * @param new_key   New key to use for the given node
 */
export function pq_decrease_key( queue: quake_heap*, node: quake_node*, new_key: key_type ): void ;

/**
 * Combines two different item-disjoint queues which share a memory map.
 * Merges node lists and adds the rank lists.  Returns a pointer to the
 * resulting queue.
 *
 * @param a First queue
 * @param b Second queue
 * @return  Resulting merged queue
 */
export function pq_meld( a: quake_heap*, b: quake_heap* ): quake_heap* ;

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: quake_heap* ): boolean ;

#endif

