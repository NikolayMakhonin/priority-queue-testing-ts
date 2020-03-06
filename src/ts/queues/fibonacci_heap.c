import {} from 'fibonacci_heap.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

export function merge_and_fix_roots( queue: fibonacci_heap, a: fibonacci_node,
    b: fibonacci_node ): void ;
export function link( queue: fibonacci_heap, a: fibonacci_node,
    b: fibonacci_node ): fibonacci_node ;
export function cut_from_parent( queue: fibonacci_heap, node: fibonacci_node ): void ;
export function append_lists( queue: fibonacci_heap, a: fibonacci_node,
    b: fibonacci_node ): fibonacci_node ;
export function attempt_insert( queue: fibonacci_heap, node: fibonacci_node ): boolean ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map ): fibonacci_heap {
    let queue: fibonacci_heap = new Array<fibonacci_heap>(1);
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: fibonacci_heap ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: fibonacci_heap ): void {
    mm_clear( queue.map );
    queue.minimum = null;
    memset( queue.roots, 0, MAXRANK * sizeof( fibonacci_node ) );
    queue.largest_rank = 0;
    queue.size = 0;
}

export function pq_get_key( queue: fibonacci_heap, node: fibonacci_node ): key_type {
    return node.key;
}

export function pq_get_item( queue: fibonacci_heap, node: fibonacci_node ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: fibonacci_heap ): uint32 {
    return queue.size;
}

export function pq_insert( queue: fibonacci_heap, item: item_type, key: key_type ): fibonacci_node {
    let wrapper: fibonacci_node = pq_alloc_node( queue.map, 0 );
    wrapper.item = item;
    wrapper.key = key;
    wrapper.next_sibling = wrapper;
    wrapper.prev_sibling = wrapper;
    queue.size++;

    queue.minimum = append_lists( queue, queue.minimum, wrapper );

    return wrapper;
}

export function pq_find_min( queue: fibonacci_heap ): fibonacci_node {
    if ( pq_empty( queue ) )
        return null;
    return queue.minimum;
}

export function pq_delete_min( queue: fibonacci_heap ): key_type {
    let node: fibonacci_node = queue.minimum;
    let key: key_type = node.key;
    let child: fibonacci_node = node.first_child;

    // remove from sibling list
    node.next_sibling.prev_sibling = node.prev_sibling;
    node.prev_sibling.next_sibling = node.next_sibling;

    // find new temporary minimum
    if ( node.next_sibling !== node )
        queue.minimum = node.next_sibling;
    else
        queue.minimum = child;

    pq_free_node( queue.map, 0, node );
    queue.size--;

    merge_and_fix_roots( queue, queue.minimum, child );

    return key;
}

export function pq_delete( queue: fibonacci_heap, node: fibonacci_node ): key_type {
    if( node === queue.minimum )
        return pq_delete_min( queue );

    let key: key_type = node.key;
    let child: fibonacci_node = node.first_child;

    // remove from sibling list
    node.next_sibling.prev_sibling = node.prev_sibling;
    node.prev_sibling.next_sibling = node.next_sibling;

    if ( node.parent != null )
    {
        node.parent.rank--;
        // if not a root, see if we need to update parent's first child
        if ( node.parent.first_child === node )
        {
            if ( node.parent.rank === 0 )
                node.parent.first_child = null;
            else
                node.parent.first_child = node.next_sibling;
        }
        if ( node.parent.marked === FALSE )
            node.parent.marked = TRUE;
        else
            cut_from_parent( queue, node.parent );
    }

    pq_free_node( queue.map, 0, node );
    queue.size--;

    append_lists( queue, queue.minimum, child );
    
    return key;
}

export function pq_decrease_key( queue: fibonacci_heap, node: fibonacci_node,
    new_key: key_type ): void {
    node.key = new_key;
    cut_from_parent( queue, node );
}

export function pq_empty( queue: fibonacci_heap ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Merges two node lists into one to update the root system of the queue.
 * Iteratively links the roots such that no two roots of the same rank
 * remain.  Assumes that the roots array is empty to begin with, and clears out
 * this array before completing execution.  Breaks list of roots to simplify
 * insertion and linking, and rebuilds the circular list at the end.
 *
 * @param queue Queue to which the two lists belong
 * @param a     First node list
 * @param b     Second node list
 */
export function merge_and_fix_roots( queue: fibonacci_heap, a: fibonacci_node,
    b: fibonacci_node ): void {
    let start: fibonacci_node = append_lists( queue, a, b );
    let current: fibonacci_node, next;
    let i: int32, rank;

    if ( start == null )
        return;

    // break the circular list
    start.prev_sibling.next_sibling = null;
    start.prev_sibling = null;
    // insert an initial node
    queue.roots[start.rank] = start;
    queue.largest_rank = start.rank;
    start.parent = null;
    current = start.next_sibling;

    // insert the rest of the nodes
    while( current != null )
    {
        // extract from the list
        next = current.next_sibling;
        if( next != null )
            next.prev_sibling = null;
        current.next_sibling = null;
        current.parent = null;

        // insert into the registry
        while ( !attempt_insert( queue, current ) )
        {
            rank = current.rank;
            current = link( queue, current, queue.roots[rank] );
            queue.roots[rank] = null;
        }
        current = next;
    }

    // pick the largest tree out of the registry to start reforming the list
    start = queue.roots[queue.largest_rank];
    queue.roots[queue.largest_rank] = null;
    queue.minimum = start;

    current = start;
    // pull the rest out and clear the registry for later use
    for ( i = queue.largest_rank - 1; i >= 0; i-- )
    {
        if( queue.roots[i] != null )
        {
            if( queue.roots[i].key < queue.minimum.key )
                queue.minimum = queue.roots[i];
            current.prev_sibling = queue.roots[i];
            queue.roots[i].next_sibling = current;
            current = queue.roots[i];
            queue.roots[i] = null;
        }
    }
    current.prev_sibling = start;
    start.next_sibling = current;
    queue.largest_rank = 0;
}

/**
 * Links two trees, making the item with lesser key the parent, breaking
 * ties arbitrarily.
 *
 * @param queue Queue to which roots belong
 * @param a     First root
 * @param b     Second root
 * @return      The resulting merged tree
 */
export function link( queue: fibonacci_heap, a: fibonacci_node,
    b: fibonacci_node ): fibonacci_node {
    let parent: fibonacci_node, child;
    if ( b.key < a.key ) {
        parent = b;
        child = a;
    }
    else {
        parent = a;
        child = b;
    }

    // roots are automatically unmarked
    child.marked = FALSE;
    child.parent = parent;
    child.next_sibling = child;
    child.prev_sibling = child;
    parent.first_child = append_lists( queue, parent.first_child, child );
    parent.rank++;

    return parent;
}

/**
 * Recurses up the tree to make a series of cascading cuts.  Cuts each
 * node that has lost two children from its parent.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to cut
 */
export function cut_from_parent( queue: fibonacci_heap, node: fibonacci_node ): void {
    let next: fibonacci_node, prev;
    if ( node.parent != null ) {
        next = node.next_sibling;
        prev = node.prev_sibling;

        next.prev_sibling = node.prev_sibling;
        prev.next_sibling = node.next_sibling;

        node.next_sibling = node;
        node.prev_sibling = node;

        node.parent.rank--;
        if ( node.parent.first_child === node )
        {
            if ( node.parent.rank === 0 )
                node.parent.first_child = null;
            else
                node.parent.first_child = next;
        }
        if ( node.parent.marked === FALSE )
            node.parent.marked = TRUE;
        else
            cut_from_parent( queue, node.parent );

        queue.minimum = append_lists( queue, node, queue.minimum );
        node.parent = null;
    }
    else
    {
        if( node.key < queue.minimum.key )
            queue.minimum = node;
    }
}

/**
 * Appends two linked lists such that the head of the second comes directly
 * after the head from the first.  Returns a pointer to the list head of lesser
 * key.  This provides the convenience of automatically selecting the minimum of
 * two heaps which are being melded, provided that their respetive minimums are
 * passed in as the heads.
 *
 * @param queue Queue to which lists belong
 * @param a     First head
 * @param b     Second head
 * @return      Pointer to merged list, starting with head of lesser key
 */
export function append_lists( queue: fibonacci_heap, a: fibonacci_node,
    b: fibonacci_node ): fibonacci_node {
    let list: fibonacci_node, a_prev, b_prev;

    if ( a == null )
        list = b;
    else if ( ( b == null ) || ( a === b ) )
        list = a;
    else
    {
        a_prev = a.prev_sibling;
        b_prev = b.prev_sibling;

        a_prev.next_sibling = b;
        b_prev.next_sibling = a;

        a.prev_sibling = b_prev;
        b.prev_sibling = a_prev;

        list = ( a.key <= b.key ) ? a : b;
    }

    return list;
}

/**
 * Attempt to insert a tree in the rank-indexed array.  Inserts if the
 * correct spot is empty, reports failure if it is occupied.
 *
 * @param queue Queue to insert into
 * @param node  Node to insert
 * @return      True if inserted, false if not
 */
export function attempt_insert( queue: fibonacci_heap, node: fibonacci_node ): boolean {
    let rank: uint32 = node.rank;
    let occupant: fibonacci_node = queue.roots[rank];
    if ( ( occupant != null ) && ( occupant !== node ) )
        return FALSE;

    queue.roots[rank] = node;
    if ( rank > queue.largest_rank )
        queue.largest_rank = rank;

    return TRUE;
}
