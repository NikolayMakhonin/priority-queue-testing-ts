/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly linked list of
 * siblings and has a pointer to it's first child.  If a node is the
 * first of its siblings, then its prev pointer points to their
 * collective parent.  The last child is marked by a null next pointer.
 */
import {item_type, key_type, uint32} from '../typedefs'

export interface pairing_node_t {
    //! First child of this node
    child: pairing_node_t;
    //! Next node in the list of this node's siblings
    next: pairing_node_t;
    //! Previous node in the list of this node's siblings
    prev: pairing_node_t;

    //! Pointer to a piece of client data
    item: item_type;
    //! Key for the item
    key: key_type;
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
    map: mem_map;
    //! The number of items held in the queue
    size: uint32;
    //! Pointer to the minimum node in the queue
    root: pairing_node;
};

export type pairing_heap = pairing_heap_t;
export type pq_type = pairing_heap;

/**
 * Creates a new, empty queue.
 *
 * @param map   Memory map to use for node allocation
 * @return      Pointer to the new queue
 */
export function pq_create( map: mem_map ): pairing_heap {
    return {
        map: map,
        root: null,
        size: 0,
    }
}

/**
 * Frees all the memory used by the queue.
 *
 * @param queue Queue to destroy
 */
export function pq_destroy( queue: pairing_heap ): void {
    // TODO remove this method
}

/**
 * Deletes all nodes, leaving the queue empty.
 *
 * @param queue Queue to clear
 */
export function pq_clear( queue: pairing_heap ): void {
    mm_clear( queue.map );
    queue.root = null;
    queue.size = 0;
}

/**
 * Returns the key associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's key
 */
export function pq_get_key( queue: pairing_heap, node: pairing_node ): key_type {
    return node.key;
}

/**
 * Returns the item associated with the queried node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Node's item
 */
export function pq_get_item( queue: pairing_heap, node: pairing_node ): item_type {
    return node.item;
}

/**
 * Returns the current size of the queue.
 *
 * @param queue Queue to query
 * @return      Size of queue
 */
export function pq_get_size( queue: pairing_heap ): uint32 {
    return queue.size;
}

/**
 * Takes an item-key pair to insert it into the queue and creates a new
 * corresponding node.  Merges the new node with the root of the queue.
 *
 * @param queue Queue to insert into
 * @param item  Item to insert
 * @param key   Key to use for node priority
 * @return      Pointer to corresponding node
 */
export function pq_insert( queue: pairing_heap, item: item_type, key: key_type ): pairing_node {
    let wrapper: pairing_node = pq_alloc_node( queue.map, 0 );
    wrapper.item = item;
    wrapper.key = key;
    queue.size++;

    queue.root = merge( queue, queue.root, wrapper );

    return wrapper;
}

/**
 * Returns the minimum item from the queue without modifying any data.
 *
 * @param queue Queue to query
 * @return      Node with minimum key
 */
export function pq_find_min( queue: pairing_heap ): pairing_node {
    if ( pq_empty( queue ) )
        return null;
    return queue.root;
}

/**
 * Deletes the minimum item from the queue and returns it, restructuring
 * the queue along the way to maintain the heap property.  Relies on the
 * @ref <pq_delete> method to delete the root of the tree.
 *
 * @param queue Queue to query
 * @return      Minimum key, corresponding to item deleted
 */
export function pq_delete_min( queue: pairing_heap ): key_type {
    return pq_delete( queue, queue.root );
}

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
export function pq_delete( queue: pairing_heap, node: pairing_node ): key_type {
    let key: key_type = node.key;

    if ( node === queue.root )
        queue.root = collapse( queue, node.child );
    else
    {
        if ( node.prev.child === node )
            node.prev.child = node.next;
        else
            node.prev.next = node.next;

        if ( node.next != null )
            node.next.prev = node.prev;

        queue.root = merge( queue, queue.root, collapse( queue, node.child ) );
    }

    pq_free_node( queue.map, 0, node );
    queue.size--;

    return key;
}

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
export function pq_decrease_key( queue: pairing_heap, node: pairing_node, new_key: key_type ): void {
    node.key = new_key;
    if ( node === queue.root )
        return;

    if ( node.prev.child === node )
        node.prev.child = node.next;
    else
        node.prev.next = node.next;

    if ( node.next != null )
        node.next.prev = node.prev;

    queue.root = merge( queue, queue.root, node );
}

/**
 * Determines whether the queue is empty, or if it holds some items.
 *
 * @param queue Queue to query
 * @return      True if queue holds nothing, false otherwise
 */
export function pq_empty( queue: pairing_heap ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Merges two nodes together, making the item of greater key the child
 * of the other.
 *
 * @param queue Queue in which to operate
 * @param a     First node
 * @param b     Second node
 * @return      Resulting tree root
 */
export function merge( queue: pairing_heap, a: pairing_node,
    b: pairing_node ): pairing_node {
    let parent: pairing_node, child;

    if ( a == null )
        return b;
    else if ( b == null )
        return a;
    else if ( a === b )
        return a;

    if ( b.key < a.key )
    {
        parent = b;
        child = a;
    }
    else
    {
        parent = a;
        child = b;
    }

    child.next = parent.child;
    if ( parent.child != null )
        parent.child.prev = child;
    child.prev = parent;
    parent.child = child;

    parent.next = null;
    parent.prev = null;

    return parent;
}

/**
 * Performs an iterative pairwise merging of a list of nodes until a
 * single tree remains.  Implements the two-pass method without using
 * explicit recursion (to prevent stack overflow with large lists).
 * Performs the first pass in place while maintaining only the minimal list
 * structure needed to iterate back through during the second pass.
 *
 * @param queue Queue in which to operate
 * @param node  Head of the list to collapse
 * @return      Root of the collapsed tree
 */
export function collapse( queue: pairing_heap, node: pairing_node ): pairing_node {
    let tail: pairing_node, a, b, next, result;

    if ( node == null )
        return null;

    next = node;
    tail = null;
    while ( next != null )
    {
        a = next;
        b = a.next;
        if ( b != null )
        {
            next = b.next;
            result = merge( queue, a, b );
            // tack the result onto the end of the temporary list
            result.prev = tail;
            tail = result;
        }
        else
        {
            a.prev = tail;
            tail = a;
            break;
        }
    }

    result = null;
    while ( tail != null )
    {
        // trace back through to merge the list
        next = tail.prev;
        result = merge( queue, result, tail );
        tail = next;
    }

    return result;
}
