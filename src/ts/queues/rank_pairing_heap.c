import {} from 'rank_pairing_heap.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

export function merge_roots( queue: rank_pairing_heap, a: rank_pairing_node,
    b: rank_pairing_node ): void ;
export function merge_lists( queue: rank_pairing_heap,
    a: rank_pairing_node, b: rank_pairing_node ): rank_pairing_node ;
export function pick_min( queue: rank_pairing_heap,
    a: rank_pairing_node, b: rank_pairing_node ): rank_pairing_node ;
export function join( queue: rank_pairing_heap, a: rank_pairing_node,
    b: rank_pairing_node ): rank_pairing_node ;
export function fix_roots( queue: rank_pairing_heap ): void ;
export function attempt_insert( queue: rank_pairing_heap, node: rank_pairing_node ): boolean ;
export function fix_min( queue: rank_pairing_heap ): void ;
export function propagate_ranks_t1( queue: rank_pairing_heap,
    node: rank_pairing_node ): void ;
export function propagate_ranks_t2( queue: rank_pairing_heap,
    node: rank_pairing_node ): void ;
export function sever_spine( queue: rank_pairing_heap,
    node: rank_pairing_node ): rank_pairing_node ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map ): rank_pairing_heap {
    let queue: rank_pairing_heap = new Array(1);
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: rank_pairing_heap ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: rank_pairing_heap ): void {
    mm_clear( queue.map );
    queue.minimum = null;
    memset( queue.roots, 0, MAXRANK * sizeof( rank_pairing_node ) );
    queue.largest_rank = 0;
    queue.size = 0;
}

export function pq_get_key( queue: rank_pairing_heap, node: rank_pairing_node ): key_type {
    return node.key;
}

export function pq_get_item( queue: rank_pairing_heap, node: rank_pairing_node ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: rank_pairing_heap ): uint32 {
    return queue.size;
}

export function pq_insert( queue: rank_pairing_heap, item: item_type,
    key: key_type ): rank_pairing_node {
    let wrapper: rank_pairing_node = pq_alloc_node( queue.map, 0 );
    wrapper.item = item;
    wrapper.key = key;
    wrapper.right = wrapper;
    queue.size++;
    merge_roots( queue, queue.minimum, wrapper );

    if ( ( queue.minimum == null ) || ( key < queue.minimum.key ) )
        queue.minimum = wrapper;

    return wrapper;
}

export function pq_find_min( queue: rank_pairing_heap ): rank_pairing_node {
    if ( pq_empty( queue ) )
        return null;
    return queue.minimum;
}

export function pq_delete_min( queue: rank_pairing_heap ): key_type {
    return pq_delete( queue, queue.minimum );
}

export function pq_delete( queue: rank_pairing_heap, node: rank_pairing_node ): key_type {
    let old_min: rank_pairing_node, left_list, right_list, full_list, current;
    let key: key_type = node.key;

    if ( node.parent != null )
    {
        if ( node.parent.right === node )
            node.parent.right = null;
        else
            node.parent.left = null;
    }
    else
    {
        current = node;
        while ( current.right !== node )
            current = current.right;
        current.right = node.right;
    }

    left_list = ( node.left != null ) ? sever_spine( queue, node.left ) : null;
    right_list = ( ( node.parent != null ) && ( node.right != null ) ) ?
        sever_spine( queue, node.right ) : null;
    merge_lists( queue, left_list, right_list );
    full_list = pick_min( queue, left_list, right_list );

    if ( queue.minimum === node )
        queue.minimum = ( node.right === node ) ? full_list : node.right;

    // in order to guarantee linking complies with analysis we save the
    // original minimum so that we perform a one-pass link on the new
    // trees before we do general multi-pass linking
    old_min = queue.minimum;
    merge_roots( queue, queue.minimum, full_list );
    queue.minimum = old_min;
    fix_roots( queue );

    pq_free_node( queue.map, 0, node );
    queue.size--;

    return key;
}

export function pq_decrease_key( queue: rank_pairing_heap, node: rank_pairing_node,
    new_key: key_type ): void {
    node.key = new_key;
    if ( node.parent != null )
    {
        if ( node.parent.right === node )
            node.parent.right = node.right;
        else
            node.parent.left = node.right;
        if ( node.right != null )
        {
            node.right.parent = node.parent;
            node.right = null;
        }

#ifdef USE_TYPE_1
        propagate_ranks_t1( queue, node );
#else
        propagate_ranks_t2( queue, node );
#endif
        node.parent = null;
        node.right = node;
        merge_roots( queue, queue.minimum, node );
    }
    else
    {
        if ( node.key < queue.minimum.key )
            queue.minimum = node;
    }
}

export function pq_empty( queue: rank_pairing_heap ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Merges two node lists into one and finds the minimum.  Expects node lists to
 * be passed by a pointer to the minimum in each list.
 *
 * @param queue Queue the two lists belong to
 * @param a     First node list
 * @param b     Second node list
 */
export function merge_roots( queue: rank_pairing_heap, a: rank_pairing_node,
    b: rank_pairing_node ): void {
    merge_lists( queue, a, b );
    queue.minimum = pick_min( queue, a, b );
}

/**
 * Merges two node lists into one and returns a pointer into the new list.
 *
 * @param queue Queue to which both nodes belong
 * @param a     First node list
 * @param b     Second node list
 * @return      An arbitrary node in the list
 */
export function merge_lists( queue: rank_pairing_heap,
    a: rank_pairing_node, b: rank_pairing_node ): rank_pairing_node {
    let temp: rank_pairing_node, list;
    if ( a == null )
        list = b;
    else if ( b == null )
        list = a;
    else if ( a === b )
        list = a;
    else
    {
        temp = a.right;
        a.right = b.right;
        b.right = temp;
        list = a;
    }

    return list;
}

/**
 * Picks and returns the minimum between two nodes.
 *
 * @param queue Queue to which both nodes belong
 * @param a     First node
 * @param b     Second node
 * @return      Minimum of the two nodes
 */
export function pick_min( queue: rank_pairing_heap,
    a: rank_pairing_node, b: rank_pairing_node ): rank_pairing_node {
    if ( a == null )
        return b;
    else if ( b == null )
        return a;
    else if ( a === b )
        return a;
    else
    {
        if ( b.key < a.key )
            return b;
        else
            return a;
    }
}

/**
 * Links two trees, making the larger-key tree the child of the lesser.
 *
 * @param queue Queue to which both nodes belong
 * @param a     First node
 * @param b     Second node
 * @return      Returns the resulting tree
 */
export function join( queue: rank_pairing_heap, a: rank_pairing_node,
    b: rank_pairing_node ): rank_pairing_node {
    let parent: rank_pairing_node, child;

    if ( b.key < a.key ) {
        parent = b;
        child = a;
    }
    else {
        parent = a;
        child = b;
    }

    child.right = parent.left;
    if ( child.right != null )
        child.right.parent = child;
    parent.left = child;
    child.parent = parent;
    parent.rank++;

    return parent;
}

/**
 * Performs a one-pass linking run through the list of roots.  Links
 * trees of equal ranks.
 *
 * @param queue Queue whose roots to fix
 */
export function fix_roots( queue: rank_pairing_heap ): void {
    let output_head: rank_pairing_node = null;
    let output_tail: rank_pairing_node = null;
    let current: rank_pairing_node, next, joined;
    let i: uint32, rank;

    if ( queue.minimum == null )
        return;

    queue.largest_rank = 0;

    current = queue.minimum.right;
    queue.minimum.right = null;
    while ( current != null ) {
        next = current.right;
        if ( !attempt_insert( queue, current ) )
        {
            rank = current.rank;
            // keep a running list of joined trees
            joined = join( queue, current, queue.roots[rank] );
            if ( output_head == null )
                output_head = joined;
            else
                output_tail.right = joined;
            output_tail = joined;
            queue.roots[rank] = null;
        }
        current = next;
    }

    // move the untouched trees to the list and repair pointers
    for ( i = 0; i <= queue.largest_rank; i++ )
    {
        if ( queue.roots[i] != null )
        {
            if ( output_head == null )
                output_head = queue.roots[i];
            else
                output_tail.right = queue.roots[i];
            output_tail = queue.roots[i];
            queue.roots[i] = null;
        }
    }

    output_tail.right = output_head;

    queue.minimum = output_head;
    fix_min( queue );
}

/**
 * Attempt to insert a tree in the rank-indexed array.  Inserts if the
 * correct spot is empty, reports failure if it is occupied.
 *
 * @param queue Queue to insert into
 * @param node  Node to insert
 * @return      True if inserted, false if not
 */
export function attempt_insert( queue: rank_pairing_heap, node: rank_pairing_node ): boolean {
    let rank: uint32 = node.rank;
    if ( ( queue.roots[rank] != null ) && ( queue.roots[rank] !== node ) )
        return FALSE;
    queue.roots[rank] = node;

    if ( rank > queue.largest_rank )
        queue.largest_rank = rank;

    return TRUE;
}

/**
 * Scans through the roots list starting from the current, potentially
 * inaccurate, minimum to find the tree with the minimum-value
 * root.
 *
 * @param queue Queue to fix
 */
export function fix_min( queue: rank_pairing_heap ): void {
    if ( queue.minimum == null )
        return;
    let start: rank_pairing_node = queue.minimum;
    let current: rank_pairing_node = queue.minimum.right;
    while ( current !== start )
    {
        if ( current.key < queue.minimum.key )
            queue.minimum = current;
        current = current.right;
    }
}

/**
 * Propagates rank corrections upward from the initial node using the type-1
 * rank rule.
 *
 * @param queue Queue to update
 * @param node  Initial node to begin updating from.
 */
export function propagate_ranks_t1( queue: rank_pairing_heap,
    node: rank_pairing_node ): void {
    let k: int32 = 0;
    let u: int32 = -1;
    let v: int32 = -1;

    if ( node == null )
        return;

    if ( ( node.parent != null ) && ( node.left != null ) )
        k = node.left.rank + 1;
    else
    {
        if ( node.left != null )
            u = node.left.rank;
        if ( node.right != null )
            v = node.right.rank;

        if( u > v )
            k = u;
        else if( v > u )
            k = v;
        else
            k = u + 1;
    }

    if ( node.rank > k )
    {
        node.rank = k;
        propagate_ranks_t1( queue, node.parent );
    }
}

/**
 * Propagates rank corrections upward from the initial node using the type-2
 * rank rule.
 *
 * @param queue Queue to update
 * @param node  Initial node to begin updating from.
 */
export function propagate_ranks_t2( queue: rank_pairing_heap,
    node: rank_pairing_node ): void {
    let k: int32 = 0;
    let u: int32 = -1;
    let v: int32 = -1;

    if ( node == null )
        return;

    if ( ( node.parent != null ) && ( node.left != null ) )
        k = node.left.rank + 1;
    else
    {
        if ( node.left != null )
            u = node.left.rank;
        if ( node.right != null )
            v = node.right.rank;

        if( u > v + 1 )
            k = u;
        else if( v > u + 1 )
            k = v;
        else
            k = ( u >= v ) ? u + 1 : v + 1;
    }

    if ( node.rank > k )
    {
        node.rank = k;
        propagate_ranks_t2( queue, node.parent );
    }
}

/**
 * Converts the given node and its right spine to a singly-linked circular list
 * of roots.
 *
 * @param queue Queue in which the node resides
 * @param node  Root of the spine
 */
export function sever_spine( queue: rank_pairing_heap,
    node: rank_pairing_node ): rank_pairing_node {
    let current: rank_pairing_node = node;
    while ( current.right != null )
    {
        current.parent = null;
        current = current.right;
    }
    current.parent = null;
    current.right = node;

    return node;
}
