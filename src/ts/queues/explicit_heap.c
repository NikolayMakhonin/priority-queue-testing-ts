import {} from 'explicit_heap.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

export function swap( queue: explicit_heap*, a: explicit_node*, b: explicit_node* ): void ;
export function swap_connected( queue: explicit_heap*, parent: explicit_node*,
    child: explicit_node* ): void ;
export function swap_disconnected( queue: explicit_heap*, a: explicit_node*,
    b: explicit_node* ): void ;
export function fill_back_pointers( queue: explicit_heap*, a: explicit_node*,
    b: explicit_node* ): void ;
export function heapify_down( queue: explicit_heap*, node: explicit_node* ): void ;
export function heapify_up( queue: explicit_heap*, node: explicit_node* ): void ;
export function find_last_node( queue: explicit_heap* ): explicit_node* ;
export function find_insertion_point( queue: explicit_heap* ): explicit_node* ;
export function find_node( queue: explicit_heap*, n: uint32_t ): explicit_node* ;
export function int_log2( n: uint32_t ): uint32_t ;
export function is_leaf( queue: explicit_heap*, node: explicit_node* ): boolean ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map* ): explicit_heap* {
    let queue: explicit_heap* = new Array<explicit_heap>(1);
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: explicit_heap* ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: explicit_heap* ): void {
    mm_clear( queue.map );
    queue.root = null;
    queue.size = 0;
}

export function pq_get_key( queue: explicit_heap*, node: explicit_node* ): key_type {
    return node.key;
}

export function pq_get_item( queue: explicit_heap*, node: explicit_node* ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: explicit_heap* ): uint32_t {
    return queue.size;
}

export function pq_insert( queue: explicit_heap*, item: item_type, key: key_type ): explicit_node* {
    let i: int;
    let parent: explicit_node*;
    let node: explicit_node* = pq_alloc_node( queue.map, 0 );
    node.item = item;
    node.key = key;

    if ( queue.root == null )
        queue.root = node;
    else
    {
        parent = find_insertion_point( queue );

        for( i = 0; i < BRANCHING_FACTOR; i++ )
        {
            if ( parent.children[i] == null )
            {
                parent.children[i] = node;
                break;
            }
        }

        node.parent = parent;
    }

    queue.size++;
    heapify_up( queue, node );

    return node;
}

export function pq_find_min( queue: explicit_heap* ): explicit_node* {
    if ( pq_empty( queue ) )
        return null;
    return queue.root;
}

export function pq_delete_min( queue: explicit_heap* ): key_type {
    return pq_delete( queue, queue.root );
}

export function pq_delete( queue: explicit_heap*, node: explicit_node* ): key_type {
    let i: int;
    let key: key_type = node.key;
    let last_node: explicit_node* = find_last_node( queue );
    swap( queue, node, last_node);

    // figure out which child this node is and clear reference from parent
    if ( node.parent != null )
    {
        for( i = 0; i < BRANCHING_FACTOR; i++ )
        {
            if ( node.parent.children[i] === node )
                node.parent.children[i] = null;
        }
    }

    pq_free_node( queue.map, 0, node );
    queue.size--;

    if ( pq_empty( queue ) )
        queue.root = null;
    else if ( node !== last_node)
        heapify_down( queue, last_node );

    return key;
}

export function pq_decrease_key( queue: explicit_heap*, node: explicit_node*,
    new_key: key_type ): void {
    node.key = new_key;
    heapify_up( queue, node );
}

export function pq_empty( queue: explicit_heap* ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Takes two nodes and switches their positions in the tree.  Does not
 * make any assumptions about null pointers or relative locations in
 * tree, and thus checks all edge cases to be safe.
 *
 * @param queue Queue to which both nodes belong
 * @param a     First node to switch
 * @param b     Second node to switch
 */
export function swap( queue: explicit_heap*, a: explicit_node*, b: explicit_node* ): void {
    if ( ( a == null ) || ( b == null ) || ( a === b ) )
        return;

    if ( a.parent === b )
        swap_connected( queue, b, a );
    else if ( b.parent === a )
        swap_connected( queue, a, b );
    else
        swap_disconnected( queue, a, b );

    if ( queue.root === a )
        queue.root = b;
    else if ( queue.root === b )
        queue.root = a;
}

/**
 * Takes two nodes known to be in a parent-child relationship and swaps
 * their positions in the tree.
 *
 * @param queue     Queue to which both nodes belong
 * @param parent    Parent node
 * @param child     Child node
 */
export function swap_connected( queue: explicit_heap*, parent: explicit_node*,
    child: explicit_node* ): void {
    let temp: explicit_node*;

    child.parent = parent.parent;
    parent.parent = child;

    let i: int;
    for( i = 0; i < BRANCHING_FACTOR; i++ )
    {
        if( parent.children[i] === child )
        {
            parent.children[i] = child.children[i];
            child.children[i] = parent;
        }
        else
        {
            temp = parent.children[i];
            parent.children[i] = child.children[i];
            child.children[i] = temp;
        }
    }

    fill_back_pointers( queue, parent, child );
}

/**
 * Takes two nodes known not to be in a parent-child relationship and
 * swaps their positions in the tree.
 *
 * @param queue Queue to which both nodes belong
 * @param a     First node
 * @param b     Second node
 */
export function swap_disconnected( queue: explicit_heap*, a: explicit_node*,
    b: explicit_node* ): void {
    let temp: explicit_node*[BRANCHING_FACTOR];

    temp[0] = a.parent;
    a.parent = b.parent;
    b.parent = temp[0];

    memcpy( temp, a.children, BRANCHING_FACTOR * sizeof( explicit_node* ) );
    memcpy( a.children, b.children, BRANCHING_FACTOR *
        sizeof( explicit_node* ) );
    memcpy( b.children, temp, BRANCHING_FACTOR * sizeof( explicit_node* ) );

    fill_back_pointers( queue, a, b );
}

/**
 * Takes two nodes which have recently had their internal pointers
 * swapped, and updates surrounding nodes to point to the correct nodes.
 *
 * @param queue Queue to which both nodes belong
 * @param a First node
 * @param b Second node
 */
export function fill_back_pointers( queue: explicit_heap*, a: explicit_node*,
    b: explicit_node* ): void {
    let i: int;

    if ( a.parent != null )
    {
        for( i = 0; i < BRANCHING_FACTOR; i++ )
        {
            if( a.parent.children[i] === a || a.parent.children[i] === b )
            {
                a.parent.children[i] = a;
                break;
            }
        }
    }

    if ( b.parent != null )
    {
        for( i = 0; i < BRANCHING_FACTOR; i++ )
        {
            if( b.parent.children[i] === a || b.parent.children[i] === b )
            {
                b.parent.children[i] = b;
                break;
            }
        }
    }

    for( i = 0; i < BRANCHING_FACTOR; i++ )
    {
        if( a.children[i] != null )
            a.children[i].parent = a;
        if( b.children[i] != null )
            b.children[i].parent = b;
    }
}

/**
 * Takes a node that is potentially at a higher position in the tree
 * than it should be, and pushes it down to the correct location.
 *
 * @param queue Queue to which the node belongs
 * @param node  Potentially violating node
 */
export function heapify_down( queue: explicit_heap*, node: explicit_node* ): void {
    if ( node == null )
        return;

    // repeatedly swap with smallest child if node violates queue order
    let smallest_child: explicit_node*;
    let k: int, min_k;
    while ( !is_leaf( queue, node ) )
    {
        min_k = 0;
        for( k = 1; k < BRANCHING_FACTOR; k++ )
        {
            if( node.children[k] == null )
                break;
            if( node.children[k].key < node.children[min_k].key )
                min_k = k;
        }
        smallest_child = node.children[min_k];

        if ( smallest_child.key < node.key )
            swap( queue, smallest_child, node );
        else
            break;
    }
}

/**
 * Takes a node that is potentially at a lower position in the tree
 * than it should be, and pulls it up to the correct location.
 *
 * @param queue Queue to which node belongs
 * @param node  Potentially violating node
 */
export function heapify_up( queue: explicit_heap*, node: explicit_node* ): void {
    if ( node == null )
        return;

    while ( node.parent != null )
    {
        if ( node.key < node.parent.key )
            swap( queue, node, node.parent );
        else
            break;
    }
}

/**
 * Finds the last node in the tree and returns a pointer to its
 * location.
 *
 * @param queue Queue to query
 * @return      Pointer to the last node in the tree
 */
export function find_last_node( queue: explicit_heap* ): explicit_node* {
    return find_node( queue, queue.size - 1 );
}

/**
 * Retrieves the proper parent for a newly inserted node.  Exploits
 * properties of complete binary trees and current node count.
 *
 * @param queue Queue to query
 * @return      Node which will be the parent of a new insertion
 */
export function find_insertion_point( queue: explicit_heap* ): explicit_node* {
    return find_node( queue, queue.size );
}

/**
 * Finds an arbitrary node based on an integer index corresponding to
 * a level-order traversal of the tree.  The root corresponds to 0, its
 * first child 1, second child 2, and so on.
 *
 * @param queue Queue to query
 * @param n     Index of node to find
 * @return      Located node
 */
export function find_node( queue: explicit_heap*, n: uint32_t ): explicit_node* {
    let log: uint32_t, path, i;
    let mask: uint32_t = BRANCHING_FACTOR - 1;
    let current: explicit_node*, next;
    let location: uint32_t = ( n - 1 );

    if( n === 0 )
        return queue.root;

    log = int_log2(n-1) / BRANCHING_POWER;
    current = queue.root;
    // i < log is used instead of i >= 0 because i is uint32_t
    // it will loop around to MAX_INT after it passes 0
    for ( i = log; i <= log; i-- )
    {
        path = ( ( location & ( mask << ( ( i * BRANCHING_POWER ) ) ) ) >>
            ( ( i * BRANCHING_POWER ) ) );
        next = current.children[path];

        if ( next == null )
            break;
        else
            current = next;
    }

    return current;
}

/**
 * Finds the floor of the base-2 logarithm of a uint32_t integer using GCC's
 * built-in method for counting leading zeros.  Should be supported quickly by
 * most x86* machines.
 *
 * @param n Integer to find log of
 * @return  Log of n
 */
export function int_log2( n: uint32_t ): uint32_t {
    if ( n === 0 )
        return 0;
    return ( 31 - __builtin_clz( n ) );
}

/**
 * Determines whether this node is a leaf based on child pointers.
 *
 * @param queue Queue to which node belongs
 * @param node  Node to query
 * @return      True if leaf, false otherwise
 */
export function is_leaf( queue: explicit_heap*, node: explicit_node* ): boolean {
    return ( node.children[0] == null );
}
