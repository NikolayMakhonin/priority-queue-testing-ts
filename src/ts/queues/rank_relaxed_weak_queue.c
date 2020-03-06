import {} from 'rank_relaxed_weak_queue.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

static inline void register_node( queue: rank_relaxed_weak_queue*, type: int16,
    let node: rank_relaxed_weak_node* );
static inline void unregister_node( queue: rank_relaxed_weak_queue*, type: int16,
    let node: rank_relaxed_weak_node* );

export function insert_root( queue: rank_relaxed_weak_queue*,
    new_root: rank_relaxed_weak_node* ): void ;
export function restore_invariants( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): void ;
export function join( queue: rank_relaxed_weak_queue*,
    a: rank_relaxed_weak_node*, b: rank_relaxed_weak_node* ): rank_relaxed_weak_node* ;

export function swap_parent_with_right_child( queue: rank_relaxed_weak_queue*,
    parent: rank_relaxed_weak_node*, child: rank_relaxed_weak_node* ): void ;
export function swap_parent_with_left_child( queue: rank_relaxed_weak_queue*,
    parent: rank_relaxed_weak_node*, child: rank_relaxed_weak_node* ): void ;
export function swap_disconnected( queue: rank_relaxed_weak_queue*,
    a: rank_relaxed_weak_node*, b: rank_relaxed_weak_node* ): void ;

export function switch_node_ranks( queue: rank_relaxed_weak_queue*,
    a: rank_relaxed_weak_node*, b: rank_relaxed_weak_node* ): void ;
static inline void flip_subtree( node: rank_relaxed_weak_node* );
static inline void swap_subtrees( a: rank_relaxed_weak_node*,
    sub_a: rank_relaxed_weak_node*[], b: rank_relaxed_weak_node*,
    let sub_b: rank_relaxed_weak_node*[] );

export function sever_spine( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): void ;
export function replace_node( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node*, replacement: rank_relaxed_weak_node* ): void ;
export function fix_min( queue: rank_relaxed_weak_queue* ): void ;

export function transformation_cleaning(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* ;
export function transformation_pair(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* ;
export function transformation_parent(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* ;
export function transformation_sibling(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* ;
export function transformation_zigzag(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map* ): rank_relaxed_weak_queue* {
    let queue: rank_relaxed_weak_queue* = new Array(1);
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: rank_relaxed_weak_queue* ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: rank_relaxed_weak_queue* ): void {
    mm_clear( queue.map );
    queue.size = 0;
    queue.minimum = null;
    memset( queue.nodes[ROOTS], 0, MAXRANK * sizeof( rank_relaxed_weak_node* ) );
    memset( queue.nodes[MARKS], 0, MAXRANK * sizeof( rank_relaxed_weak_node* ) );
    queue.registry[ROOTS] = 0;
    queue.registry[MARKS] = 0;
}

export function pq_get_key( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): key_type {
    return node.key;
}

export function pq_get_item( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: rank_relaxed_weak_queue* ): uint32 {
    return queue.size;
}

export function pq_insert( queue: rank_relaxed_weak_queue*,
    item: item_type, key: key_type ): rank_relaxed_weak_node* {
    let wrapper: rank_relaxed_weak_node* = pq_alloc_node( queue.map, 0 );
    wrapper.item = item;
    wrapper.key = key;
    queue.size++;
    insert_root( queue, wrapper );

    if ( ( queue.minimum == null ) || ( key < queue.minimum.key ) )
        queue.minimum = wrapper;

    return wrapper;
}

export function pq_find_min( queue: rank_relaxed_weak_queue* ): rank_relaxed_weak_node* {
    if ( pq_empty( queue ) )
        return null;
    return queue.minimum;
}

export function pq_delete_min( queue: rank_relaxed_weak_queue* ): key_type {
    let old_min: rank_relaxed_weak_node* = queue.minimum;
    let min_key: key_type = old_min.key;

    let replacement_rank: uint32;
    let replacement: rank_relaxed_weak_node* = old_min;
    if( old_min.parent != null )
    {
        replacement_rank = REGISTRY_LEADER( queue.registry[ROOTS] );
        replacement = queue.nodes[ROOTS][replacement_rank];
    }

    // unregister old root so we don't join it into something again
    unregister_node( queue, ROOTS, old_min );
    unregister_node( queue, MARKS, old_min );

    unregister_node( queue, ROOTS, replacement );
    unregister_node( queue, MARKS, replacement );
    replacement.marked = 0;

    sever_spine( queue, replacement.right );
    replacement.parent = null;
    replacement.left = null;
    replacement.right = null;
    replacement.rank = 0;

    if( old_min !== replacement )
        replace_node( queue, old_min, replacement );

    fix_min( queue );

    pq_free_node( queue.map, 0, old_min );
    queue.size--;

    return min_key;
}

export function pq_delete( queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): key_type {
    pq_decrease_key( queue, node, 0 );
    let min_key: key_type = pq_delete_min( queue );

    return min_key;
}

export function pq_decrease_key( queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node*,
    new_key: key_type ): void {
    node.key = new_key;
    if( node.parent != null )
    {
        if( !node.marked )
            node.marked = 1;
        restore_invariants( queue, node );
    }

    if( node.key <= queue.minimum.key )
        queue.minimum = node;
}

export function pq_empty( queue: rank_relaxed_weak_queue* ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Insert a node into the specified registry if the rank is not already
 * occupied.
 *
 * @param queue Queue in which to operate
 * @param type  ROOTS or MARKS specifies which registry alter
 * @param node  Node to insert
 */
static inline void register_node( queue: rank_relaxed_weak_queue*, type: int16,
    node: rank_relaxed_weak_node* )
{
    if( !OCCUPIED( queue.registry[type], node.rank ) )
    {
        REGISTRY_SET( queue.registry[type], node.rank );
        queue.nodes[type][node.rank] = node;
    }
}

/**
 * Remove a node from the specified registry.  If the node isn't currently
 * registered, this will do nothing.
 *
 * @param queue Queue in which to operate
 * @param type  ROOTS or MARKS specifies which registry alter
 * @param node  Node to remove
 */
static inline void unregister_node( queue: rank_relaxed_weak_queue*, type: int16,
    node: rank_relaxed_weak_node* )
{
    if( queue.nodes[type][node.rank] === node )
    {
        REGISTRY_UNSET( queue.registry[type], node.rank );
        queue.nodes[type][node.rank] = null;
    }
}

/**
 * Inserts a new root into the queue.  If a root with the same rank already
 * exists, the new and old roots are joined, and the process repeated until
 * there is is an empty rank in which the new root can be inserted.
 *
 * @param queue     Queue in which to operate
 * @param new_root  New root to insert
 */
export function insert_root( queue: rank_relaxed_weak_queue*,
    new_root: rank_relaxed_weak_node* ): void {
    let tree: rank_relaxed_weak_node* = new_root;
    let rank: uint32 = tree.rank;
    while( OCCUPIED( queue.registry[ROOTS], rank ) )
    {
        tree = join( queue, tree, queue.nodes[ROOTS][rank] );
        rank++;
    }

    register_node( queue, ROOTS, tree );
}

/**
 * Restores the mark invariants.  Begins from the specified node and proceeds
 * upward through the tree, ensuring that:
 *
 * 1) All marked nodes are right children.
 * 2) There is only one marked node of each rank.
 * 3) Each marked node has an unmarked parent.
 *
 * These invariants are fixed through the application of several auxiliary
 * transformations.
 *
 * @param queue Queue in which to operate
 * @param node  Most recently marked node
 */
export function restore_invariants( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): void {
    let new_mark: rank_relaxed_weak_node* = node;

    unregister_node( queue, MARKS, node );
    new_mark.marked = 1;

    // make sure children aren't marked
    if( new_mark.right != null && new_mark.right.marked )
        new_mark = transformation_parent( queue, new_mark.right );

    while( 1 )
    {
        if( new_mark == null )
            break;

        // check if node is a root
        if( new_mark.parent == null )
        {
            unregister_node( queue, MARKS, new_mark );
            new_mark.marked = 0;
            new_mark = null;

            break;
        }
        else if( new_mark.parent.parent == null )
        {
            new_mark = transformation_parent( queue, new_mark );
            if( new_mark != null )
            {
                unregister_node( queue, MARKS, new_mark );
                new_mark.marked = 0;
                new_mark = null;
            }

            break;
        }

        if( new_mark.parent.left === new_mark )
        {
            // check if node's sibling is marked
            if( new_mark.parent.right != null &&
                new_mark.parent.right.marked )
            {
                new_mark = transformation_sibling( queue, new_mark );

                continue;
            }

            // node is a left child and parent marked
            else if( new_mark.parent.left === new_mark && new_mark.parent.marked )
            {
                new_mark = transformation_zigzag( queue, new_mark );
                if( new_mark != null )
                    continue;

                break;
            }

            // node is a left child and all neighbors unmarked
            else
                new_mark = transformation_cleaning( queue, new_mark );
        }

        // node is a right child and parent marked
        if( new_mark.parent.right === new_mark && new_mark.parent.marked )
        {
            new_mark = transformation_parent( queue, new_mark );

            continue;
        }

        // node is a right child and parent unmarked
        else if( new_mark.parent.right === new_mark && !new_mark.parent.marked )
        {
            if( OCCUPIED( queue.registry[MARKS], new_mark.rank ) )
            {
                new_mark = transformation_pair( queue, new_mark );

                continue;
            }

            break;
        }


        break;
    }

    if( new_mark != null && new_mark.marked )
        register_node( queue, MARKS, new_mark );
}

/**
 * Joins two trees of the same rank to produce a tree of rank one greater.  The
 * root of lesser key is made the parent of the other.
 *
 * @param queue Queue in which to operate
 * @param a     First tree
 * @param b     Second tree
 * @return      Pointer to new tree
 */
export function join( queue: rank_relaxed_weak_queue*,
    a: rank_relaxed_weak_node*, b: rank_relaxed_weak_node* ): rank_relaxed_weak_node* {
    let parent: rank_relaxed_weak_node*, child;
    if( a.key <= b.key )
    {
        parent = a;
        child = b;
    }
    else
    {
        parent = b;
        child = a;
    }

    unregister_node( queue, ROOTS, parent );
    unregister_node( queue, ROOTS, child );
    unregister_node( queue, MARKS, parent );
    unregister_node( queue, MARKS, child );
    if( child.marked )
        child.marked = 0;

    /*if( child.left != null )
    {
        parent.left = child.left;
        parent.left.parent = parent;
    }*/
    child.left = parent.right;
    parent.right = child;
    child.parent = parent;

    if( child.left != null )
    {
        child.left.parent = child;
        if( child.left.marked )
        {
            if( child.right.marked )
                transformation_sibling( queue, child.left );
            else
                transformation_cleaning( queue, child.left );
        }
    }

    parent.rank++;

    if( queue.minimum === child )
        queue.minimum = parent;

    return parent;
}

/**
 * Swap a node with it's right child.
 *
 * @param queue     Queue in which to operate
 * @param parent    Parent node
 * @param child     Right child node
 */
export function swap_parent_with_right_child( queue: rank_relaxed_weak_queue*,
    parent: rank_relaxed_weak_node*, child: rank_relaxed_weak_node* ): void {
    let parent_parent: rank_relaxed_weak_node* = parent.parent;
    let parent_left: rank_relaxed_weak_node* = parent.left;
    let child_left: rank_relaxed_weak_node* = child.left;
    let child_right: rank_relaxed_weak_node* = child.right;

    parent.parent = child;
    child.right = parent;

    child.parent = parent_parent;
    if( parent_parent != null )
    {
        if( parent_parent.left === parent )
            parent_parent.left = child;
        else
            parent_parent.right = child;
    }

    child.left = parent_left;
    if( parent_left != null )
        parent_left.parent = child;

    parent.left = child_left;
    if( child_left != null )
        child_left.parent = parent;

    parent.right = child_right;
    if( child_right != null )
        child_right.parent = parent;

    switch_node_ranks( queue, parent, child );
}

/**
 * Swap a node with it's left child.
 *
 * @param queue     Queue in which to operate
 * @param parent    Parent node
 * @param child     Left child node
 */
export function swap_parent_with_left_child( queue: rank_relaxed_weak_queue*,
    parent: rank_relaxed_weak_node*, child: rank_relaxed_weak_node* ): void {
    let parent_parent: rank_relaxed_weak_node* = parent.parent;
    let parent_right: rank_relaxed_weak_node* = parent.right;
    let child_left: rank_relaxed_weak_node* = child.left;
    let child_right: rank_relaxed_weak_node* = child.right;

    parent.parent = child;
    child.left = parent;

    child.parent = parent_parent;
    if( parent_parent != null )
    {
        if( parent_parent.left === parent )
            parent_parent.left = child;
        else
            parent_parent.right = child;
    }

    child.right = parent_right;
    if( parent_right != null )
        parent_right.parent = child;

    parent.left = child_left;
    if( child_left != null )
        child_left.parent = parent;

    parent.right = child_right;
    if( child_right != null )
        child_right.parent = parent;

    switch_node_ranks( queue, parent, child );
}

/**
 * Swap two nodes not in a parent-child relationship.
 *
 * @param queue Queue in which to operate
 * @param a     First node
 * @param b     Second node
 */
export function swap_disconnected( queue: rank_relaxed_weak_queue*,
    a: rank_relaxed_weak_node*, b: rank_relaxed_weak_node* ): void {
    let a_parent: rank_relaxed_weak_node* = a.parent;
    let a_left: rank_relaxed_weak_node* = a.left;
    let a_right: rank_relaxed_weak_node* = a.right;
    let b_parent: rank_relaxed_weak_node* = b.parent;
    let b_left: rank_relaxed_weak_node* = b.left;
    let b_right: rank_relaxed_weak_node* = b.right;

    a.parent = b_parent;
    if( b_parent != null )
    {
        if( b_parent.left === b )
            b_parent.left = a;
        else
            b_parent.right = a;
    }

    b.parent = a_parent;
    if( a_parent != null )
    {
        if( a_parent.left === a )
            a_parent.left = b;
        else
            a_parent.right = b;
    }

    a.left = b_left;
    if( b_left != null )
        b_left.parent = a;

    b.left = a_left;
    if( a_left != null )
        a_left.parent = b;

    a.right = b_right;
    if( b_right != null )
        b_right.parent = a;

    b.right = a_right;
    if( a_right != null )
        a_right.parent = b;

    switch_node_ranks( queue, a, b );
}

/**
 * Switch the ranks of two nodes.  If the nodes are in the root registry, then
 * the registry entry is swapped to reflect the positional change.  The nodes
 * are simply removed from the mark registry if they are there.  This is fixed
 * later in the invariant restoration.
 *
 * @param queue     Queue in which to operate
 * @param parent    Parent node
 * @param child     Right child node
 */
export function switch_node_ranks( queue: rank_relaxed_weak_queue*,
    a: rank_relaxed_weak_node*, b: rank_relaxed_weak_node* ): void {
    int16 a_unrooted = ( queue.nodes[ROOTS][a.rank] === a );
    int16 b_unrooted = ( queue.nodes[ROOTS][b.rank] === b );

    if( a_unrooted )
        unregister_node( queue, ROOTS, a );
    if( b_unrooted )
        unregister_node( queue, ROOTS, b );
    if( a.marked )
        unregister_node( queue, MARKS, a );
    if( b.marked )
        unregister_node( queue, MARKS, b );

    let temp_rank: uint32 = a.rank;
    a.rank = b.rank;
    b.rank = temp_rank;

    if( a_unrooted )
        register_node( queue, ROOTS, b );
    if( b_unrooted )
        register_node( queue, ROOTS, a );
}

/**
 * Flips a subtree, making the left subtree the right and vice versa.
 *
 * @param node  Node whose subtree to flip
 */
static inline void flip_subtree( node: rank_relaxed_weak_node* )
{
    if( node.parent == null )
        return;
    let temp: rank_relaxed_weak_node* = node.left;
    node.left = node.right;
    node.right = temp;
}

/**
 * Swap two arbitrary subtrees between their corresponding parents.  Takes
 * pointers to the entries for the subtrees (e.g. &(node.left)) and updates
 * them in place to reflect the swap.
 *
 * @param a     First parent node
 * @param sub_a Pointer to the first subtree
 * @param b     Second parent node
 * @param sub_b Pointer to the second subtree
 */
static inline void swap_subtrees( a: rank_relaxed_weak_node*,
    sub_a: rank_relaxed_weak_node*[], b: rank_relaxed_weak_node*,
    sub_b: rank_relaxed_weak_node*[] )
{
    let temp: rank_relaxed_weak_node* = *sub_a;
    *sub_a = *sub_b;
    *sub_b = temp;

    if( *sub_a != null )
        (*sub_a).parent = a;
    if( *sub_b != null )
        (*sub_b).parent = b;
}

/**
 * Breaks apart the path from the specified node to the leftmost leaf, creating
 * a number of new perfect weak heaps.  Inserts these new heaps as roots,
 * managing them by rank.
 *
 * @param queue Queue in which to operate
 * @param node  Top node in the spine
 */
export function sever_spine( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node* ): void {
    let next: rank_relaxed_weak_node*;
    let current: rank_relaxed_weak_node* = node;
    while( current != null )
    {
        next = current.left;

        if( current.marked )
        {
            unregister_node( queue, MARKS, current );
            current.marked = 0;
        }
        current.left = null;
        current.parent = null;
        insert_root( queue, current );

        current = next;
    }
}

/**
 * Replace a node which is to be deleted, making it a singleton.  Takes a
 * singleton node as a replacement.  Walks down the left spine of the right
 * subtree of the node to be replaced, then rejoins recursively starting with
 * the replacement and the leftmost leaf until a tree of equal rank has been
 * built.  The root of the tree is then marked, and this tree is glued in place
 * of the original node, and the node has been safely removed.  Finally, an
 * invariant restoration process is triggered from the newly marked node.
 *
 * @param queue         Queue in which to operate
 * @param node          Node to remove
 * @param replacement   Replacement node
 */
export function replace_node( queue: rank_relaxed_weak_queue*,
    node: rank_relaxed_weak_node*, replacement: rank_relaxed_weak_node* ): void {
    let current: rank_relaxed_weak_node*, next;
    let result: rank_relaxed_weak_node* = replacement;

    if( node.right != null )
    {
        current = node.right;
        while( current.left != null )
            current = current.left;

        while( current !== node )
        {
            next = current.parent;
            if( current.marked )
            {
                unregister_node( queue, MARKS, current );
                current.marked = 0;
            }
            current.parent = null;
            current.left = null;
            result = join( queue, result, current );

            current = next;
        }
    }

    result.parent = node.parent;
    if( result.parent != null )
        result.parent.right = result;
    result.left = node.left;
    if( result.left != null )
        result.left.parent = result;

    result.marked = 1;
    register_node( queue, MARKS, result );
    restore_invariants( queue, result );

    if( result.parent == null )
        register_node( queue, ROOTS, result );
}

/**
 * Find and set the new minimum by searching among the roots and marked nodes.
 *
 * @param queue     Queue in which to operate
 */
export function fix_min( queue: rank_relaxed_weak_queue* ): void {
    let i: int16;
    let rank: uint32;
    let current: rank_relaxed_weak_node*;
    let min: rank_relaxed_weak_node* = null;

    let search_registry: uint64;
    let search_list: rank_relaxed_weak_node*[];
    for( i = 0; i < 2; i++ )
    {
        search_registry = queue.registry[i];
        search_list = queue.nodes[i];

        while( search_registry )
        {
            rank = REGISTRY_LEADER( search_registry );
            current = search_list[rank];
            if( min == null || current.key <= min.key )
                min = current;
            REGISTRY_UNSET( search_registry, rank );
        }
    }

    queue.minimum = min;
}

/**
 * Make a marked left child into a marked right child.  Swap subtrees as
 * necessary.
 *
 * @param queue Queue in which to operate
 * @param node  Node to relocate
 * @return      Pointer to marked node
 */
export function transformation_cleaning(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* {
    let sibling: rank_relaxed_weak_node* = node.parent.right;
    flip_subtree( node.parent );
    swap_subtrees( node, &(node.left), sibling, &(sibling.left) );

    return node;
}

/**
 * Take two marked nodes of the same rank and unmark one, promoting the other to
 * a rank one higher.  Of these two marked nodes, the one with the lesser-keyed
 * parent is identified.  This node is then swapped with the parent of the other
 * and subtrees are rearranged as necessary.  Finally, the two marked nodes are
 * compared and potentially swapped, with the eventual child becoming unmarked.
 *
 * @param queue     Queue in which to operate
 * @param parent    One of the two equal-ranked nodes
 * @return          Pointer to the still-marked node
 */
export function transformation_pair(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* {
    let primary: rank_relaxed_weak_node* = node;
    let extra: rank_relaxed_weak_node* = queue.nodes[MARKS][primary.rank];

    let tmp: rank_relaxed_weak_node* = primary;
    if( extra.parent.key < primary.parent.key )
    {
        primary = extra;
        extra = tmp;
    }

    let extra_parent: rank_relaxed_weak_node* = extra.parent;
    let primary_parent: rank_relaxed_weak_node* = primary.parent;

    unregister_node( queue, MARKS, extra );

    swap_disconnected( queue, primary, extra_parent );
    swap_subtrees( extra_parent, &(extra_parent.right), extra, &(extra.left) );

    if( extra_parent.key < primary_parent.key )
    {
        swap_parent_with_right_child( queue, primary_parent, extra_parent );
        flip_subtree( primary_parent );
    }

    let result: rank_relaxed_weak_node* = primary;
    let unmarked: rank_relaxed_weak_node* = extra;
    if( extra.key < primary.key )
    {
        swap_parent_with_right_child( queue, primary, extra );
        flip_subtree( primary );
        result = extra;
        unmarked = primary;
    }
    unregister_node( queue, MARKS, unmarked );
    unmarked.marked = 0;

    return result;
}

/**
 * Compare a marked node with its parent.  Swap if necessary and unmark the
 * resulting child node.
 *
 * @param queue Queue in which to operate
 * @param node  Node to repair
 * @return      Pointer to remaining marked node, otherwise null
 */
export function transformation_parent(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* {
    let parent: rank_relaxed_weak_node* = node.parent;
    let result: rank_relaxed_weak_node* = parent;
    let unmarked: rank_relaxed_weak_node* = node;

    if( parent.marked )
        unregister_node( queue, MARKS, parent );
    unregister_node( queue, MARKS, node );

    if( node.key < parent.key )
    {
        swap_parent_with_right_child( queue, parent, node );
        flip_subtree( parent );
        result = node;
        unmarked = parent;
    }
    unregister_node( queue, MARKS, unmarked );
    unmarked.marked = 0;

    if( !result.marked )
        result = null;

    return result;
}

/**
 * Take two marked siblings, and swap the left with the parent.  If this node
 * has a greater key than the marked right sibling, swap them.  Unmark the right
 * resulting right child.
 *
 * @param queue Queue in which to operate
 * @param node  Left child node
 * @return      Pointer to resulting marked parent node
 */
export function transformation_sibling(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* {
    let parent: rank_relaxed_weak_node* = node.parent;
    let sibling: rank_relaxed_weak_node* = parent.right;
    let result: rank_relaxed_weak_node* = node;
    let unmarked: rank_relaxed_weak_node* = sibling;

    unregister_node( queue, MARKS, sibling );

    swap_parent_with_left_child( queue, parent, node );
    swap_subtrees( parent, &(parent.right), sibling, &(sibling.left) );

    if( sibling.key < node.key )
    {
        swap_parent_with_right_child( queue, node, sibling );
        flip_subtree( node );
        result = sibling;
        unmarked = node;
    }
    unregister_node( queue, MARKS, unmarked );
    unmarked.marked = 0;

    return result;
}

/**
 * Takes a pointer to a marked left node whose parent is also marked (and a
 * right child).  If the marked left node has a lesser key than its grandparent,
 * swap these two nodes, otherwise unmark the node.  Return a pointer to the
 * remaining lesser-ranked marked node.
 *
 * @param queue Queue in which to operate
 * @param node  Marked left child node
 * @return      Pointer to lesser-ranked marked node
 */
export function transformation_zigzag(
    queue: rank_relaxed_weak_queue*, node: rank_relaxed_weak_node* ): rank_relaxed_weak_node* {
    let parent: rank_relaxed_weak_node* = node.parent;
    let grand: rank_relaxed_weak_node* = parent.parent;

    if( grand.key < node.key )
        node.marked = 0;
    else
    {
        swap_disconnected( queue, grand, node );
        flip_subtree( grand );
    }

    unregister_node( queue, MARKS, parent );

    return parent;
}
