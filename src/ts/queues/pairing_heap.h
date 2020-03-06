#ifndef PAIRING_HEAP
#define PAIRING_HEAP

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

import {} from 'queue_common.h'

/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly linked list of
 * siblings and has a pointer to it's first child.  If a node is the
 * first of its siblings, then its prev pointer points to their
 * collective parent.  The last child is marked by a null next pointer.
 */
export interface pairing_node_t {
    //! First child of this node
    struct child: pairing_node_t*;
    //! Next node in the list of this node's siblings
    struct next: pairing_node_t*;
    //! Previous node in the list of this node's siblings
    struct prev: pairing_node_t*;

    //! Pointer to a piece of client data
    let item: item_type;
    //! Key for the item
    let key: key_type;
};

export type pairing_node = pairing_node_t;
export type pq_node_type = pairing_node;
    
/**
 * A mutable, meldable, two-pass Pairing heap.  Maintains a single multiary tree
 * with no structural constraints other than the standard heap invariant.
 * Handles most operations through cutting and pairwise merging.  Primarily uses
 * iteration for merging rather than the standard recursion methods (due to
 * concerns for stackframe overhead).
 */
export interface pairing_heap_t {
    //! Memory map to use for node allocation
    let map: mem_map;
    //! The number of items held in the queue
    let size: uint32;
    //! Pointer to the minimum node in the queue
    let root: pairing_node*;
};

export type pairing_heap = pairing_heap_t;
export type pq_type = pairing_heap;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Creates a new, empty queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map ): pairing_heap* ;

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: pairing_heap* ): void ;

/**
 * Deletes all nodes, leaving the queue empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: pairing_heap* ): void ;

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: pairing_heap*, node: pairing_node* ): key_type ;

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: pairing_heap*, node: pairing_node* ): item_type* ;

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: pairing_heap* ): uint32 ;

/**
 * Takes an item-key pair to insert it into the queue and creates a new
 * corresponding node.  Merges the new node with the root of the queue.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: pairing_heap*, item: item_type, key: key_type ): pairing_node* ;

/**
 * Returns the minimum item from the queue without modifying any data.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: pairing_heap* ): pairing_node* ;

/**
 * Deletes the minimum item from the queue and returns it, restructuring
 * the queue along the way to maintain the heap property.  Relies on the
 * @ref <pq_delete> method to delete the root of the tree.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: pairing_heap* ): key_type ;

/**
 * Deletes an arbitrary item from the queue and modifies queue structure
 * to preserve the heap invariant.  Requires that the location of the
 * item's corresponding node is known.  Removes the node from its list
 * of siblings, then merges all its children into a new tree and
 * subsequently merges that tree with the root.
 *
 * @param queue Queue in which the node resides
 * @param node  Pointer to node corresponding to the item to delete
 * @return      Key of item deleted
 */
export function pq_delete( queue: pairing_heap*, node: pairing_node* ): key_type ;

/**
 * If the item in the queue is modified in such a way to decrease the
 * key, then this function will update the queue to preserve queue
 * properties given a pointer to the corresponding node.  Cuts the node
 * from its list of siblings and merges it with the root.
 *
 * @param queue     Queue in which the node resides
 * @param node      Node to change
 * @param new_key   New key to use for the given node
 */
export function pq_decrease_key( queue: pairing_heap*, node: pairing_node*,
    new_key: key_type ): void ;

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: pairing_heap* ): boolean ;

#endif
