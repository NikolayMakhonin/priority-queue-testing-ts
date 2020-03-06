import {} from 'quake_heap.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

export function make_root( queue: quake_heap, node: quake_node ): void ;
export function remove_from_roots( queue: quake_heap, node: quake_node ): void ;
export function cut( queue: quake_heap, node: quake_node ): void ;
export function join( queue: quake_heap, a: quake_node, b: quake_node ): quake_node ;
export function fix_roots( queue: quake_heap ): void ;
export function attempt_insert( queue: quake_heap, node: quake_node ): boolean ;
export function fix_min( queue: quake_heap ): void ;
export function fix_decay( queue: quake_heap ): void ;
export function check_decay( queue: quake_heap ): void ;
export function violation_exists( queue: quake_heap ): boolean ;
export function prune( queue: quake_heap, node: quake_node ): void ;
export function clone_node( queue: quake_heap, original: quake_node ): quake_node ;
export function is_root( queue: quake_heap, node: quake_node ): boolean ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map ): quake_heap {
    let queue: quake_heap = new Array(1);
    queue.map = map;
    
    return queue;
}

export function pq_destroy( queue: quake_heap ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: quake_heap ): void {
    mm_clear( queue.map );
    queue.minimum = null;
    memset( queue.roots, 0, MAXRANK * sizeof( quake_node ) );
    memset( queue.nodes, 0, MAXRANK * sizeof( uint32 ) );
    queue.highest_node = 0;
    queue.violation = 0;
    queue.size = 0;
}

export function pq_get_key( queue: quake_heap, node: quake_node ): key_type {
    return node.key;
}

export function pq_get_item( queue: quake_heap, node: quake_node ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: quake_heap ): uint32 {
    return queue.size;
}

export function pq_insert( queue: quake_heap, item: item_type, key: key_type ): quake_node {
    let wrapper: quake_node = pq_alloc_node( queue.map, 0 );
    wrapper.item = item;
    wrapper.key = key;
    wrapper.parent = wrapper;
    
    make_root( queue, wrapper );
    queue.size++;
    (queue.nodes[0])++;

    return wrapper;
}

export function pq_find_min( queue: quake_heap ): quake_node {
    if ( pq_empty( queue ) )
        return null;
    return queue.minimum;
}

export function pq_delete_min( queue: quake_heap ): key_type {
    return pq_delete( queue, queue.minimum );
}

export function pq_delete( queue: quake_heap, node: quake_node ): key_type {
    let key: key_type = node.key;
    cut( queue, node );

    fix_roots( queue );
    fix_decay( queue );

    queue.size--;

    return key;
}

export function pq_decrease_key( queue: quake_heap, node: quake_node, new_key: key_type ): void {
    node.key = new_key;
    if ( is_root( queue, node ) )
    {
        if ( node.key < queue.minimum.key )
            queue.minimum = node;
    }
    else
    {
        if ( node.parent.left === node )
            node.parent.left = null;
        else
            node.parent.right = null;

        make_root( queue, node );
    }
}

export function pq_meld( a: quake_heap, b: quake_heap ): quake_heap {
    let result: quake_heap, trash;
    let temp: quake_node;
    
    if( a.size >= b.size )
    {
        result = a;
        trash = b;
    }
    else
    {
        result = b;
        trash = a;
    }
        
    if( trash.minimum == null )
        return result;
    temp = result.minimum.parent;
    result.minimum.parent = trash.minimum.parent;
    trash.minimum.parent = temp;
    
    let k: int16;
    for( k = 0; k < result.highest_node; k++ )
        result.nodes[k] += trash.nodes[k];

    return result;
}

export function pq_empty( queue: quake_heap ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Joins a node with the list of roots.
 *
 * @param queue Queue in which to operate
 * @param node  Node to make a new root
 */
export function make_root( queue: quake_heap, node: quake_node ): void {
    if ( node == null )
        return;

    if ( queue.minimum == null )
    {
         queue.minimum = node;
         node.parent = node;
    }
    else
    {
        node.parent = queue.minimum.parent;
        queue.minimum.parent = node;
        if ( node.key < queue.minimum.key )
            queue.minimum = node;
    }
}

/**
 * Removes a node from the list of roots.
 *
 * @param queue Queue the node belongs to
 * @param node  Node to remove
 */
export function remove_from_roots( queue: quake_heap, node: quake_node ): void {
    let current: quake_node = node.parent;
    while ( current.parent !== node )
        current = current.parent;
    if ( current === node )
        queue.minimum = null;
    else
    {
        current.parent = node.parent;
        if ( queue.minimum === node )
            queue.minimum = current;
    }
}

/**
 * Removes the node from the structure.  Recurses down through the left
 * child, which contains the same item, separating the right subtrees, making
 * the right child a new root.
 *
 * @param queue Queue the node belongs to
 * @param node  Node to remove
 */
export function cut( queue: quake_heap, node: quake_node ): void {
    if ( node == null )
        return;

    if ( is_root( queue, node ) )
        remove_from_roots( queue, node );
    else
    {
        if ( node.parent.left === node )
            node.parent.left = null;
        else if ( node.parent.right === node )
            node.parent.right = null;
    }
        
    cut( queue, node.left );
    make_root( queue, node.right );

    (queue.nodes[node.height])--;
    pq_free_node( queue.map, 0, node );
}

/**
 * Links two trees, making the larger-key tree the child of the lesser.
 * Creates a duplicate node to take the larger-key root's place.
 * Promotes the larger-key root as the new root of the joined tree.
 *
 * @param queue Queue in which to operate
 * @param a     First node
 * @param b     Second node
 * @return      Returns the resulting tree
 */
export function join( queue: quake_heap, a: quake_node, b: quake_node ): quake_node {
    let parent: quake_node, child, duplicate;

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

    duplicate = clone_node( queue, parent );
    if ( duplicate.left != null )
        duplicate.left.parent = duplicate;
    if ( duplicate.right != null )
        duplicate.right.parent = duplicate;

    duplicate.parent = parent;
    child.parent = parent;

    parent.parent = null;
    parent.left = duplicate;
    parent.right = child;

    parent.height++;
    (queue.nodes[parent.height])++;

    return parent;
}

/**
 * Performs an iterative linking on the list of roots until no two trees
 * of the same height remain.
 *
 * @param queue Queue whose roots to fix
 */
export function fix_roots( queue: quake_heap ): void {
    let current: quake_node, next, tail, head, joined;
    let i: uint32, height;

    if ( queue.minimum == null )
        return;

    for ( i = 0; i <= queue.highest_node; i++ )
        queue.roots[i] = null;
    queue.highest_node = 0;

    current = queue.minimum.parent;
    tail = queue.minimum;
    queue.minimum.parent = null;

    while ( current != null )
    {
        next = current.parent;
        current.parent = null;
        if ( !attempt_insert( queue, current ) )
        {
            height = current.height;
            joined = join( queue, current, queue.roots[height] );
            if ( current === tail )
            {
                tail = joined; 
                next = tail;
            }
            else
            {
                tail.parent = joined;
                tail = tail.parent;
            }
            queue.roots[height] = null;
        }
        current = next;
    }

    head = null;
    tail = null;
    for ( i = 0; i <= queue.highest_node; i++ )
    {
        if ( queue.roots[i] != null )
        {
            if ( head == null )
            {
                head = queue.roots[i];
                tail = queue.roots[i];
            }
            else
            {
                tail.parent = queue.roots[i];
                tail = tail.parent;
            }
        }
    }
    tail.parent = head;

    queue.minimum = head;
    fix_min( queue );
}

/**
 * Attempt to insert a tree in the height-indexed array.  Inserts if the
 * correct spot is empty or already contains the current node, reports
 * failure if it is occupied.
 *
 * @param queue Queue to insert into
 * @param node  Node to insert
 * @return      True if inserted, false if not
 */
export function attempt_insert( queue: quake_heap, node: quake_node ): boolean {
    let height: uint32 = node.height;
    if ( ( queue.roots[height] != null ) && ( queue.roots[height] !== node ) )
        return FALSE;

    if ( height > queue.highest_node )
        queue.highest_node = height;
    queue.roots[height] = node;

    return TRUE;
}

/**
 * Scans through the roots list starting from the current, potentially
 * inaccurate, minimum to find the tree with the minimum-value
 * root.
 * 
 * @param queue Queue to fix
 */
export function fix_min( queue: quake_heap ): void {
    let start: quake_node = queue.minimum;
    let current: quake_node = queue.minimum.parent;
    while ( current !== start )
    {
        if ( current.key < queue.minimum.key )
            queue.minimum = current;
        current = current.parent;
    }
}

/**
 * If a decay violation exists, this will remove all nodes of height
 * greater than or equal to the first violation.
 * 
 * @param queue Queue to fix
 */
export function fix_decay( queue: quake_heap ): void {
    let i: uint32;
    check_decay( queue );
    if ( violation_exists( queue ) )
    {
        for ( i = queue.violation; i < MAXRANK; i++ )
        {
            if ( queue.roots[i] != null )
                prune( queue, queue.roots[i] );
        }
    }
}

/**
 * Searches for a decay violation and saves its location if it exists.
 * 
 * @param queue Queue to check
 */
export function check_decay( queue: quake_heap ): void {
    let i: uint32;
    for ( i = 1; i <= queue.highest_node; i++ )
    {
        if ( ( (float) queue.nodes[i] ) > ( (float) ( ALPHA *
                (float) queue.nodes[i-1] ) ) )
            break;
    }
    queue.violation = i;
}

/**
 * Checks if a decay violation was found.
 *
 * @param queue Queue to check
 * @return      True if exists, false otherwise
 */
export function violation_exists( queue: quake_heap ): boolean {
    return ( queue.violation < MAXRANK );
}

/**
 * If the current node is higher than the violation, this function
 * rotates the current node down into the place of it's duplicate, and
 * deletes the duplicate.  Then it recurses on itself and its old
 * non-duplicate child.
 *
 * @param queue Queue to fix
 * @param node  Node to check and prune
 */
export function prune( queue: quake_heap, node: quake_node ): void {
    let duplicate: quake_node, child;

    if ( node == null )
        return;

    if ( node.height < queue.violation )
    {
        if ( !is_root( queue, node ) )
            make_root( queue, node );
            
        return;
    }

    duplicate = node.left;
    child = node.right;

    prune( queue, child );        

    node.left = duplicate.left;
    if ( node.left != null )
        node.left.parent = node;
    node.right = duplicate.right;
    if ( node.right != null )
        node.right.parent = node;
    (queue.nodes[node.height])--;
    node.height--;
    pq_free_node( queue.map, 0, duplicate );

    prune( queue, node );
}

/**
 * Copies internal data of another node for purposes of tournament resolution.
 *
 * @param queue     Queue to which node belongs
 * @param original  Node to copy data from
 * @return          Copy of the new node
 */
export function clone_node( queue: quake_heap, original: quake_node ): quake_node {
    let clone: quake_node = pq_alloc_node( queue.map, 0 );
        
    clone.item = original.item;
    clone.key = original.key;
    clone.height = original.height;
    clone.left = original.left;
    clone.right = original.right;

    return clone;
}

/**
 * Determines whether this node is a root
 *
 * @param queue Queue in which node resides
 * @param node  Node to query
 * @return      True if root, false otherwise
 */
export function is_root( queue: quake_heap, node: quake_node ): boolean {
    return ( ( node.parent.left !== node ) &&
        ( node.parent.right !== node ) );
}
