import {} from 'pairing_heap.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

export function merge( queue: pairing_heap*, a: pairing_node*,
    b: pairing_node* ): pairing_node* ;
export function collapse( queue: pairing_heap*, node: pairing_node* ): pairing_node* ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map* ): pairing_heap* {
    let queue: pairing_heap* = new Array(1);
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: pairing_heap* ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: pairing_heap* ): void {
    mm_clear( queue.map );
    queue.root = null;
    queue.size = 0;
}

export function pq_get_key( queue: pairing_heap*, node: pairing_node* ): key_type {
    return node.key;
}

export function pq_get_item( queue: pairing_heap*, node: pairing_node* ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: pairing_heap* ): uint32_t {
    return queue.size;
}

export function pq_insert( queue: pairing_heap*, item: item_type, key: key_type ): pairing_node* {
    let wrapper: pairing_node* = pq_alloc_node( queue.map, 0 );
    wrapper.item = item;
    wrapper.key = key;
    queue.size++;

    queue.root = merge( queue, queue.root, wrapper );

    return wrapper;
}

export function pq_find_min( queue: pairing_heap* ): pairing_node* {
    if ( pq_empty( queue ) )
        return null;
    return queue.root;
}

export function pq_delete_min( queue: pairing_heap* ): key_type {
    return pq_delete( queue, queue.root );
}

export function pq_delete( queue: pairing_heap*, node: pairing_node* ): key_type {
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

export function pq_decrease_key( queue: pairing_heap*, node: pairing_node*, new_key: key_type ): void {
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

export function pq_empty( queue: pairing_heap* ): boolean {
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
export function merge( queue: pairing_heap*, a: pairing_node*,
    b: pairing_node* ): pairing_node* {
    let parent: pairing_node*, child;

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
export function collapse( queue: pairing_heap*, node: pairing_node* ): pairing_node* {
    let tail: pairing_node*, a, b, next, result;

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
