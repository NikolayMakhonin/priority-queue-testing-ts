import {} from 'violation_heap.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

export function merge_into_roots( queue: violation_heap*, list: violation_node* ): void ;
export function triple_join( queue: violation_heap*, a: violation_node*,
    b: violation_node*, c: violation_node* ): violation_node* ;
export function join( queue: violation_heap*, parent: violation_node*,
    child1: violation_node*, child2: violation_node* ): violation_node* ;
export function fix_roots( queue: violation_heap* ): void ;
export function attempt_insert( queue: violation_heap*, node: violation_node* ): boolean ;
export function set_min( queue: violation_heap* ): void ;
export function find_prev_root( queue: violation_heap*, node: violation_node* ): violation_node* ;
export function propagate_ranks( queue: violation_heap*, node: violation_node* ): void ;
export function strip_list( queue: violation_heap*, node: violation_node* ): void ;
export function is_active( queue: violation_heap*, node: violation_node* ): boolean ;
export function get_parent( queue: violation_heap*, node: violation_node* ): violation_node* ;
export function is_root( queue: violation_heap*, node: violation_node* ): int16 ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map ): violation_heap* {
    let queue: violation_heap* = new Array(1);
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: violation_heap* ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: violation_heap* ): void {
    mm_clear( queue.map );
    queue.minimum = null;
    memset( queue.roots, 0, 2 * MAXRANK * sizeof( violation_node* ) );
    queue.largest_rank = 0;
    queue.size = 0;
}

export function pq_get_key( queue: violation_heap*, node: violation_node* ): key_type {
    return node.key;
}

export function pq_get_item( queue: violation_heap*, node: violation_node* ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: violation_heap* ): uint32 {
    return queue.size;
}

export function pq_insert( queue: violation_heap*, item: item_type, key: key_type ): violation_node* {
    let wrapper: violation_node* = pq_alloc_node( queue.map, 0 );
    wrapper.item = item;
    wrapper.key = key;
    wrapper.next = wrapper;
    queue.size++;

    merge_into_roots( queue, wrapper );

    if ( ( queue.minimum == null ) || ( key < queue.minimum.key ) )
        queue.minimum = wrapper;

    return wrapper;
}

export function pq_find_min( queue: violation_heap* ): violation_node* {
    if ( pq_empty( queue ) )
        return null;
    return queue.minimum;
}

export function pq_delete_min( queue: violation_heap* ): key_type {
    return pq_delete( queue, queue.minimum );
}

export function pq_delete( queue: violation_heap*, node: violation_node* ): key_type {
    let key: key_type = node.key;
    let prev: violation_node*;

    if ( is_root( queue, node ) )
    {
        prev = find_prev_root( queue, node );
        prev.next = node.next;
    }
    else
    {
        if ( node.next.child === node )
            node.next.child = node.prev;
        else
            node.next.prev = node.prev;

        if ( node.prev != null )
            node.prev.next = node.next;
    }

    if ( queue.minimum === node )
    {
        if ( node.next !== node )
            queue.minimum = node.next;
        else
            queue.minimum = node.child;
    }

    if ( node.child != null )
    {
        strip_list( queue, node.child );
        merge_into_roots( queue, node.child );
    }
    fix_roots( queue );

    pq_free_node( queue.map, 0, node );
    queue.size--;

    return key;
}

export function pq_decrease_key( queue: violation_heap*, node: violation_node*,
    new_key: key_type ): void {
    node.key = new_key;
    let parent: violation_node* = null;
    let first_child: violation_node*, second_child, replacement;

    if( is_root( queue, node ) )
    {
        if ( node.key < queue.minimum.key )
            queue.minimum = node;
        return;
    }
    else
    {
        if ( is_active( queue, node ) )
        {
            parent = get_parent( queue, node );
            if ( !( node.key < parent.key ) )
                return;
        }
        first_child = node.child;
        if( first_child != null )
        {
            // determine active child of greater rank
            second_child = first_child.prev;
            if ( second_child == null )
            {
                node.child = null;
                replacement = first_child;
            }
            else
            {
                if ( second_child.rank > first_child.rank )
                {
                    if ( second_child.prev != null )
                        second_child.prev.next = first_child;
                    first_child.prev = second_child.prev;
                    replacement = second_child;
                }
                else
                {
                    node.child = second_child;
                    second_child.next = node;
                    replacement = first_child;
                }
            }

            // swap child into place of this node
            replacement.next = node.next;
            replacement.prev = node.prev;
            if ( replacement.next != null )
            {
                if ( replacement.next.child === node )
                    replacement.next.child = replacement;
                else
                    replacement.next.prev = replacement;
            }
            if ( replacement.prev != null )
                replacement.prev.next = replacement;

            if ( parent != null && is_active( queue, parent ) )
                propagate_ranks( queue, parent );
        }
        else
        {
            if ( node.next.child === node )
                node.next.child = node.prev;
            else
                node.next.prev = node.prev;

            if ( node.prev != null )
                node.prev.next = node.next;

            if ( is_active( queue, node.next ) )
                propagate_ranks( queue, node.next );
        }

        // make node a root
        node.next = node;
        node.prev = null;
        merge_into_roots( queue, node );
    }
}

export function pq_empty( queue: violation_heap* ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Merges a new node list into the root list.
 *
 * @param queue Queue to merge list into
 * @param list  List to merge
 */
export function merge_into_roots( queue: violation_heap*, list: violation_node* ): void {
    let temp: violation_node*;
    if ( queue.minimum == null )
        queue.minimum = list;
    else if ( ( list != null ) && ( queue.minimum !== list ) )
    {
        temp = queue.minimum.next;
        queue.minimum.next = list.next;
        list.next = temp;

        if ( list.key < queue.minimum.key )
            queue.minimum = list;
    }
}

/**
 * Links three trees, making the smallest-keyed item the parent.
 *
 * @param queue Queue to which nodes belong
 * @param a     First node
 * @param b     Second node
 * @param c     Third node
 * @return      Returns the resulting tree
 */
export function triple_join( queue: violation_heap*, a: violation_node*,
    b: violation_node*, c: violation_node* ): violation_node* {
    let parent: violation_node*, child1, child2;

    if ( a.key < b.key )
    {
        if ( a.key < c.key )
        {
            parent = a;
            child1 = ( b.rank >= c.rank ) ? b : c;
            child2 = ( b.rank >= c.rank ) ? c : b;
        }
        else
        {
            parent = c;
            child1 = ( a.rank >= b.rank ) ? a : b;
            child2 = ( a.rank >= b.rank ) ? b : a;
        }
    }
    else
    {
        if ( b.key < c.key )
        {
            parent = b;
            child1 = ( a.rank >= c.rank ) ? a : c;
            child2 = ( a.rank >= c.rank ) ? c : a;
        }
        else
        {
            parent = c;
            child1 = ( a.rank >= b.rank ) ? a : b;
            child2 = ( a.rank >= b.rank ) ? b : a;
        }
    }

    return join( queue, parent, child1, child2 );
}

/**
 * Makes two nodes the last two children of a third parent node.
 *
 * @param queue     Queue to which nodes belong
 * @param parent    Parent node
 * @param child1    Child of greater rank
 * @param child2    Child of lesser rank
 * @return          Root of new tree
 */
export function join( queue: violation_heap*, parent: violation_node*,
    child1: violation_node*, child2: violation_node* ): violation_node* {
    let active1: violation_node*, active2;
    let rank1: uint32, rank2;

    if ( parent.child != null )
    {
        active1 = parent.child;
        active2 = parent.child.prev;
        if ( active2 != null )
        {
            rank1 = active1.rank;
            rank2 = active2.rank;
            if ( rank1 < rank2 )
            {
                active1.prev = active2.prev;
                if ( active1.prev != null )
                    active1.prev.next = active1;
                active2.next = parent;
                active1.next = active2;
                active2.prev = active1;
                parent.child = active2;
            }
        }
    }

    child1.next = parent;
    child1.prev = child2;
    child2.next = child1;
    child2.prev = parent.child;

    if ( parent.child != null )
        parent.child.next = child2;
    parent.child = child1;

    parent.rank++;

    return parent;
}

/**
 * Iterates through roots and three-way joins trees of the same rank
 * until no three trees remain with the same rank.
 *
 * @param queue Queue whose roots to fix
 */
export function fix_roots( queue: violation_heap* ): void {
    let current: violation_node*, next, head, tail;
    let i: int16;
    let rank: int32;

    for ( i = 0; i <= queue.largest_rank; i++ )
    {
        queue.roots[i][0] = null;
        queue.roots[i][1] = null;
    }

    if ( queue.minimum == null )
        return;

    head = queue.minimum.next;
    queue.minimum.next = null;
    tail = queue.minimum;
    current = head;
    while ( current != null )
    {
        next = current.next;
        current.next = null;
        if ( !attempt_insert( queue, current ) )
        {
            rank = current.rank;
            tail.next = triple_join( queue, current, queue.roots[rank][0],
                queue.roots[rank][1] );
            if ( tail === current )
                next = tail.next;
            tail = tail.next;
            queue.roots[rank][0] = null;
            queue.roots[rank][1] = null;
        }
        current = next;
    }

    head = null;
    tail = null;
    for ( i = 0; i <= queue.largest_rank; i++ )
    {
        if ( queue.roots[i][0] != null )
        {
            if ( head == null )
                head = queue.roots[i][0];
            else
                tail.next = queue.roots[i][0];
            tail = queue.roots[i][0];
        }
        if ( queue.roots[i][1] != null )
        {
            if ( head == null )
                head = queue.roots[i][1];
            else
                tail.next = queue.roots[i][1];
            tail = queue.roots[i][1];
        }
    }

    tail.next = head;

    set_min( queue );
}

/**
 * Attempt to insert a tree in the rank-indexed array.  Inserts if the
 * correct spot is empty, reports failure if it is occupied.
 *
 * @param queue Queue to insert into
 * @param node  Node to insert
 * @return      True if inserted, false if not
 */
export function attempt_insert( queue: violation_heap*, node: violation_node* ): boolean {
    let rank: int32 = node.rank;
    if ( ( queue.roots[rank][0] != null ) && ( queue.roots[rank][0] !== node ) )
    {
        if ( ( queue.roots[rank][1] != null ) && ( queue.roots[rank][1] !==
                node ) )
            return FALSE;
        else
            queue.roots[rank][1] = node;
    }
    else
        queue.roots[rank][0] = node;

    if ( rank > queue.largest_rank )
        queue.largest_rank = rank;

    return TRUE;
}

/**
 * Scans through the roots array to find the tree with the minimum-value
 * root.
 *
 * @param queue Queue to fix
 */
export function set_min( queue: violation_heap* ): void {
    let i: int16;
    queue.minimum = null;
    for ( i = 0; i <= queue.largest_rank; i++ )
    {
        if ( queue.roots[i][0] != null )
        {
            if ( queue.minimum == null )
                queue.minimum = queue.roots[i][0];
            else if ( queue.roots[i][0].key < queue.minimum.key )
                queue.minimum = queue.roots[i][0];
        }
        if ( queue.roots[i][1] != null )
        {
            if ( queue.minimum == null )
                queue.minimum = queue.roots[i][1];
            else if ( queue.roots[i][1].key < queue.minimum.key )
                queue.minimum = queue.roots[i][1];
        }
    }
}

/**
 * Loops around a singly-linked list of roots to find the root prior to
 * the specified node.
 *
 * @param queue The queue in which the node resides
 * @param node  The specified node to start from
 * @return      The node prior to the start
 */
export function find_prev_root( queue: violation_heap*,
    node: violation_node* ): violation_node* {
    let prev: violation_node* = node.next;
    while ( prev.next !== node )
        prev = prev.next;

    return prev;
}

/**
 * Propagates rank changes upward from the initial node.
 *
 * @param queue Queue in which node resides
 * @param node  Initial node to begin updating from.
 */
export function propagate_ranks( queue: violation_heap*, node: violation_node* ): void {
    let rank1: int32 = -1;
    let rank2: int32 = -1;
    let new_rank: int32, total;
    let updated: boolean;
    let parent: violation_node*;

    if ( node.child != null )
    {
        rank1 = node.child.rank;
        if ( node.child.prev != null )
            rank2 = node.child.prev.rank;
    }

    total = rank1 + rank2;
    if ( total === -2 )
        new_rank = 0;
    else if ( total === -1 )
        new_rank = 1;
    else
        new_rank = ( ( total / 2 ) + ( total % 2 ) + 1 );
    updated = new_rank < node.rank;
    node.rank = new_rank;

    if ( updated && is_active( queue, node ) )
    {
        parent = get_parent( queue, node );
        if( parent != null )
            propagate_ranks( queue, parent );
    }
}

/**
 * Converts a doubly-linked list into a circular singly-linked list.
 *
 * @param queue Queue in which node resides
 * @param node  Last node in the list
 */
export function strip_list( queue: violation_heap*, node: violation_node* ): void {
    let current: violation_node* = node;
    let prev: violation_node*;
    while ( current.prev != null )
    {
        prev = current.prev;
        current.prev = null;
        current = prev;
    }
    node.next = current;
}

/**
 * Determines whether this node is active, meaning it is one of
 * the last two children of its parent.
 *
 * @param queue Queue in which node resides
 * @param node  Node to query
 * @return      True if active, false if not
 */
export function is_active( queue: violation_heap*, node: violation_node* ): boolean {
    if ( is_root( queue, node ) )
        return TRUE;
    else
    {
        if ( node.next.child === node )
            return TRUE;
        else
        {
            if ( node.next.next.child === node.next )
                return TRUE;
            else
                return FALSE;
        }
    }
}

/**
 * Returns the parent of the current node.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      Parent of the queried node, null if root
 */
export function get_parent( queue: violation_heap*, node: violation_node* ): violation_node* {
    if ( node.next.child === node )
        return node.next;
    else if ( ( node.prev == null ) && ( node.next.prev == null ) )
        return null;
    else
        return ( get_parent( queue, node.next ) );
}

/**
 * Tells whether the current node is a root.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      TRUE if a root, FALSE otherwise
 */
export function is_root( queue: violation_heap*, node: violation_node* ): int16 {
    return ( ( node.prev == null ) && ( node.next.prev == null ) &&
        ( node.next.child !== node ) );
}
