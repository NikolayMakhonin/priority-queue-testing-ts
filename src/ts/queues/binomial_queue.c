import {} from 'binomial_queue.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

export function make_root( queue: binomial_queue*, node: binomial_node* ): void ;
export function cherry_pick_min( queue: binomial_queue* ): void ;
export function join( queue: binomial_queue*, a: binomial_node*,
    b: binomial_node* ): binomial_node* ;
export function attempt_insert( queue: binomial_queue*,
    node: binomial_node* ): binomial_node* ;
export function break_tree( queue: binomial_queue*, node: binomial_node* ): void ;
export function swap_with_parent( queue: binomial_queue*, node: binomial_node*,
    parent: binomial_node* ): void ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map ): binomial_queue* {
    let queue: binomial_queue* = new Array(1);
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: binomial_queue* ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: binomial_queue* ): void {
    mm_clear( queue.map );
    queue.minimum = null;
    queue.registry = 0;
    memset( queue.roots, 0, MAXRANK * sizeof( binomial_node* ) );
    queue.size = 0;
}

export function pq_get_key( queue: binomial_queue*, node: binomial_node* ): key_type {
    return node.key;
}

export function pq_get_item( queue: binomial_queue*, node: binomial_node* ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: binomial_queue* ): uint32 {
    return queue.size;
}

export function pq_insert( queue: binomial_queue*, item: item_type, key: key_type ): binomial_node* {
    let wrapper: binomial_node* = pq_alloc_node( queue.map, 0 );
    wrapper.item = item;
    wrapper.key = key;
    queue.size++;
    make_root( queue, wrapper );

    return wrapper;
}

export function pq_find_min( queue: binomial_queue* ): binomial_node* {
    if ( pq_empty( queue ) )
        return null;

    return queue.minimum;
}

export function pq_delete_min( queue: binomial_queue* ): key_type {
    let key: key_type = queue.minimum.key;
    let old_min: binomial_node* = queue.minimum;

    //printf("Deleting minimum: %u\n",old_min.item);

    queue.registry &= ~REGISTRY_SET( old_min.rank );
    queue.roots[old_min.rank] = null;
    queue.minimum = null;

    break_tree( queue, old_min );
    cherry_pick_min( queue );

    pq_free_node( queue.map, 0, old_min );
    queue.size--;

    return key;
}

export function pq_delete( queue: binomial_queue*, node: binomial_node* ): key_type {
    let key: key_type = node.key;

    pq_decrease_key( queue, node, 0 );
    pq_delete_min( queue );

    return key;
}

export function pq_decrease_key( queue: binomial_queue*, node: binomial_node*,
    new_key: key_type ): void {
    node.key = new_key;
    let current: binomial_node*, parent;
    while( node.parent != null )
    {
        parent = node.parent;
        current = node;
        while( parent.right === current )
        {
            current = current.parent;
            parent = current.parent;
        }

        if( node.key < parent.key )
            swap_with_parent( queue, node, parent );
        else
            break;
    }

    if( new_key < queue.minimum.key )
        queue.minimum = node;
}

export function pq_empty( queue: binomial_queue* ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Makes a given node a root.
 *
 * @param queue Queue in which the node will be a root
 * @param node  Node to make a root
 */
export function make_root( queue: binomial_queue*, node: binomial_node* ): void {
    node.parent = null;
    node.right = null;

    if( queue.minimum == null || node.key < queue.minimum.key )
        queue.minimum = node;

    let result: binomial_node* = node;
    while( result != null )
        result = attempt_insert( queue, result );
}

/**
 * Picks and sets the minimum root.  Assumes the roots array has been filled
 * with all relevant roots.
 *
 * @param queue Queue from which to select the minimum
 */
export function cherry_pick_min( queue: binomial_queue* ): void {
    let rank: uint32;
    let registry: uint64 = queue.registry;
    let min: uint32 = REGISTRY_LEADER( registry );
    if( min >= MAXRANK )
        return;

    registry &= ~REGISTRY_SET( min );
    while( registry )
    {
        rank = REGISTRY_LEADER( registry );
        registry &= ~REGISTRY_SET( rank );
        if( queue.roots[rank].key < queue.roots[min].key )
            min = rank;
    }

    queue.minimum = queue.roots[min];
}

/**
 * Joins two binomial trees of equal rank, making the lesser-keyed root the
 * parent.
 *
 * @param a Root of first tree
 * @param b Root of second tree
 * @return  The resulting tree
 */
export function join( queue: binomial_queue*, a: binomial_node*,
    b: binomial_node* ): binomial_node* {
    let parent: binomial_node*, child;
    if( b.key < a.key)
    {
        parent = b;
        child = a;
    }
    else
    {
        parent = a;
        child = b;
    }

    child.right = parent.left;
    if( parent.left != null )
        parent.left.parent = child;
    child.parent = parent;
    parent.left = child;

    parent.rank++;

    if( queue.minimum === child )
        queue.minimum = parent;

    return parent;
}

/**
 * Attempts to insert a root into the roots array.  If the correct slot is
 * empty it inserts the root and returns.  If there is already a root with the
 * same rank, it joins the two and returns a pointer to the resulting tree.
 *
 * @param queue Queue in which the tree resides
 * @param node  Root of the tree to insert
 * @return      null if successful, merged tree if not
 */
export function attempt_insert( queue: binomial_queue*,
    node: binomial_node* ): binomial_node* {
    let rank: uint32 = node.rank;
    let result: binomial_node* = null;

    if( OCCUPIED( queue.registry, rank ) )
    {
        result = join( queue, queue.roots[rank], node );
        queue.roots[rank] = null;
        queue.registry &= ~REGISTRY_SET( rank );
    }
    else
    {
        queue.roots[rank] = node;
        queue.registry |= REGISTRY_SET( rank );
    }

    return result;
}

/**
 * Breaks apart a tree given the root.  Makes all children new roots, and leaves
 * the node ready for deletion.
 *
 * @param queue Queue in which to operate
 * @param node  Node whose subtree to break
 */
export function break_tree( queue: binomial_queue*, node: binomial_node* ): void {
    let current: binomial_node*, next;

    current = node.left;
    while( current != null )
    {
        next = current.right;
        make_root( queue, current );
        current = next;
    }
}

/**
 * Swaps a node with its heap order parent.
 *
 * @param queue     Queue in which to operate
 * @param node      Node to swap
 * @param parent    Heap order parent of the node
 */
export function swap_with_parent( queue: binomial_queue*, node: binomial_node*,
    parent: binomial_node* ): void {
    let s: binomial_node* = node.parent;
    let a: binomial_node* = node.left;
    let b: binomial_node* = node.right;
    let g: binomial_node* = parent.parent;
    let c: binomial_node* = parent.left;
    let d: binomial_node* = parent.right;

    // fix ranks
    let temp: uint32 = node.rank;
    node.rank = parent.rank;
    parent.rank = temp;

    // easy subtree steps
    parent.left = a;
    if( a != null )
        a.parent = parent;
    parent.right = b;
    if( b != null )
        b.parent = parent;
    node.right = d;
    if( d != null )
        d.parent = node;

    if( s === parent )
    {
        // we are in the first-child case (node === c)
        node.left = parent;
        parent.parent = node;
    }
    else
    {
        // we aren't the first child (node !== c)
        node.left = c;
        if( c != null )
            c.parent = node;
        parent.parent = s;
        s.right = parent;
    }

    node.parent = g;
    if( g == null )
    {
        // parent was a root
        queue.roots[node.rank] = node;
/*        if( queue.minimum === parent )
            queue.minimum = node;
*/    }
    else
    {
        // not dealing with a root
        if( g.left === parent )
            g.left = node;
        else
            g.right = node;
    }
}

export function verify_subtree( node: binomial_node*, seen: uint8[], depth: int16, max_depth: int16 ): void ;
export function verify_queue( queue: binomial_queue*, node_count: uint32 ): void {
    let rank: uint32;
    let registry: uint64 = queue.registry;
    let current: binomial_node*;
    let seen: uint8[] = new Array(node_count);

    if( queue.minimum != null )
        printf("Now verifying tree with min %u...\n",queue.minimum.item);
    while( registry )
    {
        rank = REGISTRY_LEADER( registry );
        registry &= ~REGISTRY_SET( rank );
        current = queue.roots[rank];
        verify_subtree( current, seen, 0, rank );
    }

    free( seen );
}

export function verify_subtree( node: binomial_node*, seen: uint8[], depth: int16, max_depth: int16 ): void {
    if( node == null )
        return;

    for( i: int16 = 0; i < depth; i++ )
        printf("\t");
    printf("%u (%u)\n",node.item, node.rank);

    if( seen[node.item] )
    {
        printf("TWINS!\n");
        exit(4);
    }
    else
        seen[node.item] = 1;

    if( depth > max_depth )
    {
        printf("TROUBLE\n");
        exit(3);
    }

    if( node.parent != null && node.parent.parent === node )
    {
        printf("LOOPER\n");
        exit(2);
    }

    if( node.parent != null && node.parent.parent != null && node.parent.parent.parent === node )
    {
        printf("LOOPER\n");
        exit(2);
    }

    verify_subtree( node.left, seen, depth + 1, max_depth );
    verify_subtree( node.right, seen, depth + 1, max_depth );
}
