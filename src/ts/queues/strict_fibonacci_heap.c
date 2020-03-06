import {} from 'strict_fibonacci_heap.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

//--------------------------------------
// BASIC NODE FUNCTIONS
//--------------------------------------

static inline int16 is_active( queue: strict_fibonacci_heap*,
    let node: strict_fibonacci_node* );
static inline void choose_order_pair( a: strict_fibonacci_node*,
    b: strict_fibonacci_node*, parent: strict_fibonacci_node*[],
    let child: strict_fibonacci_node*[] );
static inline void choose_order_triple( a: strict_fibonacci_node*,
    b: strict_fibonacci_node*, c: strict_fibonacci_node*,
    grand: strict_fibonacci_node*[], parent: strict_fibonacci_node*[],
    let child: strict_fibonacci_node*[] );
static inline void remove_from_siblings( queue: strict_fibonacci_heap*,
    let node: strict_fibonacci_node* );
export function link( queue: strict_fibonacci_heap*, parent: strict_fibonacci_node*,
    child: strict_fibonacci_node* ): void ;
export function select_new_root( queue: strict_fibonacci_heap* ): strict_fibonacci_node* ;

//--------------------------------------
// QUEUE MANAGEMENT
//--------------------------------------

export function enqueue_node( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function dequeue_node( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function consume_node( queue: strict_fibonacci_heap* ): strict_fibonacci_node* ;

//--------------------------------------
// ACTIVE NODE MANAGEMENT
//--------------------------------------

export function increase_rank( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function decrease_rank( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function increase_loss( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function decrease_loss( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function switch_node_rank( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node*, new_rank: rank_record* ): void ;
export function insert_fix_node( queue: strict_fibonacci_heap*, fix: fix_node*,
    type: int16 ): void ;
export function remove_fix_node( queue: strict_fibonacci_heap*, fix: fix_node*,
    type: int16 ): void ;
export function check_rank( queue: strict_fibonacci_heap*, rank: rank_record*,
    type: int16 ): void ;
export function move_rank( queue: strict_fibonacci_heap*, rank: rank_record*,
    type: int16, direction: int16 ): void ;

//--------------------------------------
// NODE TYPE CONVERSIONS
//--------------------------------------

export function convert_active_to_root( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function convert_active_to_loss( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function convert_root_to_active( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function convert_loss_to_active( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function convert_passive_to_active( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function convert_to_passive( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;

//--------------------------------------
// REDUCTIONS
//--------------------------------------

export function reduce_active_roots( queue: strict_fibonacci_heap* ): int16 ;
export function reduce_root_degree( queue: strict_fibonacci_heap* ): int16 ;
export function reduce_loss( queue: strict_fibonacci_heap* ): int16 ;
export function post_meld_reduction( queue: strict_fibonacci_heap* ): void ;
export function post_delete_min_reduction( queue: strict_fibonacci_heap* ): void ;
export function post_decrease_key_reduction( queue: strict_fibonacci_heap* ): void ;

//--------------------------------------
// GARBAGE COLLECTION & ALLOCATION
//--------------------------------------

export function create_rank_record( queue: strict_fibonacci_heap*,
    rank: uint32, pred: rank_record* ): rank_record* ;
export function release_active_record( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function release_rank_record( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void ;
export function release_to_garbage_collector( queue: strict_fibonacci_heap*,
    garbage_queue: strict_fibonacci_heap* ): void ;
export function garbage_collection( queue: strict_fibonacci_heap* ): void ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map* ): strict_fibonacci_heap* {
    let queue: strict_fibonacci_heap* = new Array<strict_fibonacci_heap>(1);
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: strict_fibonacci_heap* ): void {
    pq_clear( queue );
    free( queue );
}

export function pq_clear( queue: strict_fibonacci_heap* ): void {
    mm_clear( queue.map );
    queue.size = 0;

    queue.root = null;
    queue.q_head = null;

    queue.active = null;
    queue.rank_list = null;
    queue.fix_list[0] = null;
    queue.fix_list[1] = null;
}

export function pq_get_key( queue: strict_fibonacci_heap*, node: strict_fibonacci_node* ): key_type {
    return node.key;
}

export function pq_get_item( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: strict_fibonacci_heap* ): uint32 {
    return queue.size;
}

export function pq_insert( queue: strict_fibonacci_heap*, item: item_type,
    key: key_type ): strict_fibonacci_node* {
    let wrapper: strict_fibonacci_node* = pq_alloc_node( queue.map,
        STRICT_NODE_FIB );
    wrapper.item = item;
    wrapper.key = key;
    wrapper.right = wrapper;
    wrapper.left = wrapper;
    wrapper.q_next = wrapper;
    wrapper.q_prev = wrapper;

    let parent: strict_fibonacci_node*, child;
    if( queue.root == null )
        queue.root = wrapper;
    else
    {
        choose_order_pair( wrapper, queue.root, &parent, &child );
        link( queue, parent, child );
        queue.root = parent;
        enqueue_node( queue, child );

        post_meld_reduction( queue );
    }

    queue.size++;
    garbage_collection( queue );

    return wrapper;
}

export function pq_find_min( queue: strict_fibonacci_heap* ): strict_fibonacci_node* {
    if ( pq_empty( queue ) )
        return null;
    return queue.root;
}

export function pq_delete_min( queue: strict_fibonacci_heap* ): key_type {
    if( pq_empty( queue ) )
        return 0;

    let key: key_type = queue.root.key;
    let current: strict_fibonacci_node*, new_root, old_root;
    let i: int16, j;

    old_root = queue.root;

    if( old_root.left_child == null )
    {
        old_root = queue.root;
        if( is_active( queue, old_root ) )
            convert_to_passive( queue, old_root );
        queue.root = null;
    }
    else
    {
        new_root = select_new_root( queue );
        remove_from_siblings( queue, new_root );
        dequeue_node( queue, new_root );
        queue.root = new_root;

        if( is_active( queue, new_root ) )
            convert_to_passive( queue, new_root );
        if( is_active( queue, old_root ) )
            convert_to_passive( queue, old_root );

        while( old_root.left_child != null )
            link( queue, new_root, old_root.left_child );

        for( i = 0; i < 2; i++ )
        {
            current = consume_node( queue );
            if( current != null )
            {
                for( j = 0; j < 2; j++ )
                {
                    if( current.left_child != null &&
                            !is_active( queue, current.left_child.left ) )
                        link( queue, new_root, current.left_child.left );
                    else
                        break;
                }
            }
        }
    }

    pq_free_node( queue.map, STRICT_NODE_FIB, old_root );

    post_delete_min_reduction( queue );
    garbage_collection( queue );

    queue.size--;

    return key;
}

export function pq_delete( queue: strict_fibonacci_heap*, node: strict_fibonacci_node* ): key_type {
    let key: key_type = node.key;

    pq_decrease_key( queue, node, 0 );
    pq_delete_min( queue );

    return key;
}

export function pq_decrease_key( queue: strict_fibonacci_heap*, node: strict_fibonacci_node*,
    new_key: key_type ): void {
    let old_parent: strict_fibonacci_node* = node.parent;

    node.key = new_key;

    if( old_parent == null || node.key > old_parent.key)
        return;

    let parent: strict_fibonacci_node*, child;
    choose_order_pair( node, queue.root, &parent, &child );

    link( queue, parent, child );
    queue.root = parent;
    queue.root.parent = null;

    if( parent === node )
    {
        dequeue_node( queue, parent );
        enqueue_node( queue, child );
    }

    if( is_active( queue, node ) )
    {
        if( is_active( queue, old_parent ) )
            decrease_rank( queue, old_parent );
        if( node.type !== STRICT_TYPE_ROOT )
            convert_active_to_root( queue, node );
    }
    if( is_active( queue, old_parent ) && old_parent.type !== STRICT_TYPE_ROOT )
        increase_loss( queue, old_parent );

    post_decrease_key_reduction( queue );
    garbage_collection( queue );
}

export function pq_meld( a: strict_fibonacci_heap*,
    b: strict_fibonacci_heap* ): strict_fibonacci_heap* {
    let new_heap: strict_fibonacci_heap* = pq_create( a.map );
    let big: strict_fibonacci_heap*, small;

    let big_head: strict_fibonacci_node*, big_tail, small_head, small_tail;
    let parent: strict_fibonacci_node*, child;

    // pick which heap to preserve
    if( a.size < b.size )
    {
        big = b;
        small = a;
    }
    else
    {
        big = a;
        small = b;
    }

    // set heap fields
    new_heap.size = big.size + small.size;
    new_heap.q_head = big.q_head;
    new_heap.active = big.active;
    new_heap.rank_list = big.rank_list;
    new_heap.fix_list[0] = big.fix_list[0];
    new_heap.fix_list[1] = big.fix_list[1];

    if( small.active != null )
        small.active.flag = 0;

    // merge the queues
    big_head = big.q_head;
    big_tail = big_head.q_prev;
    small_head = small.q_head;
    small_tail = small_head.q_prev;

    big_head.q_prev = small_tail;
    small_tail.q_next = big_head;
    small_head.q_prev = big_tail;
    big_tail.q_next = small_head;

    // actually link the two trees
    choose_order_pair( big.root, small.root, &parent, &child );
    link( new_heap, parent, child );
    new_heap.root = parent;
    enqueue_node( new_heap, child );

    // take care of some garbage collection
    release_to_garbage_collector( new_heap, small );
    free( small );
    free( big );
    garbage_collection( new_heap );

    return new_heap;
}

export function pq_empty( queue: strict_fibonacci_heap* ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

//--------------------------------------
// BASIC NODE FUNCTIONS
//--------------------------------------

/**
 * Determines if a given node is active.  If a passive node was previously
 * active, any record references are released.
 *
 * @param queue Queue in which to operate
 * @param node  Node to check
 * @return      1 if active, 0 otherwise
 */
static inline int16 is_active( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* )
{
    if( node.active == null )
        return 0;

    if( !node.active.flag )
    {
        release_active_record( queue, node );
        release_rank_record( queue, node );
        if( node.fix != null )
            node.fix = null;
        node.type = STRICT_TYPE_PASSIVE;

        return 0;
    }

    return 1;
}

/**
 * Takes a pair of nodes and compares their keys, writing the appropriate values
 * to the parent and child pointers.
 *
 * @param a         First node to compare
 * @param b         Second node to compare
 * @param parent    Destination pointer for the node of lesser key
 * @param child     Destination pointer for the node of greater key
 */
static inline void choose_order_pair( a: strict_fibonacci_node*,
    b: strict_fibonacci_node*, parent: strict_fibonacci_node*[],
    child: strict_fibonacci_node*[] )
{
    if( a.key <= b.key )
    {
        *parent = a;
        *child = b;
    }
    else
    {
        *parent = b;
        *child = a;
    }
}

/**
 * Takes a trio of nodes and compares their keys, writing the appropriate values
 * to the grand, parent and child pointers.
 *
 * @param a         First node to compare
 * @param b         Second node to compare
 * @param c         Third node to compare
 * @param grand     Destination pointer for the node of least key
 * @param parent    Destination pointer for the node of middle key
 * @param child     Destination pointer for the node of greatest key
 */
static inline void choose_order_triple( a: strict_fibonacci_node*,
    b: strict_fibonacci_node*, c: strict_fibonacci_node*,
    grand: strict_fibonacci_node*[], parent: strict_fibonacci_node*[],
    child: strict_fibonacci_node*[] )
{
    if( a.key < b.key )
    {
        if( b.key < c.key )
        {
            *grand = a;
            *parent = b;
            *child = c;
        }
        else if( a.key < c.key )
        {
            *grand = a;
            *parent = c;
            *child = b;
        }
        else
        {
            *grand = c;
            *parent = a;
            *child = b;
        }
    }
    else
    {
        if( a.key < c.key )
        {
            *grand = b;
            *parent = a;
            *child = c;
        }
        else if( b.key < c.key )
        {
            *grand = b;
            *parent = c;
            *child = a;
        }
        else
        {
            *grand = c;
            *parent = b;
            *child = a;
        }
    }
}

/**
 * Removes a node from its list of siblings.
 *
 * @param queue Queue in which to operate
 * @param node  Node to remove
 */
static inline void remove_from_siblings( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* )
{
    if( node.parent == null )
        return;

    let next: strict_fibonacci_node* = node.right;
    let prev: strict_fibonacci_node*;

    if( next === node )
    {
        node.parent.left_child = null;
    }
    else
    {
        prev = node.left;
        next.left = prev;
        prev.right = next;
        if( node.parent.left_child === node )
            node.parent.left_child = next;
    }

    node.right = node;
    node.left = node;
    node.parent = null;
}

/**
 * Links two trees.  The parent node is assumed to have lesser key than the
 * child.  The child is made the leftmost node of the parent.
 *
 * @param queue     Queue in which to operate
 * @param parent    Parent node
 * @param child     New child node
 */
export function link( queue: strict_fibonacci_heap*, parent: strict_fibonacci_node*,
    child: strict_fibonacci_node* ): void {
    if( parent === child.parent )
        return;

    if( child === queue.root )
        remove_from_siblings( queue, parent );
    else
        remove_from_siblings( queue, child );

    let next: strict_fibonacci_node* = parent.left_child;
    let prev: strict_fibonacci_node*;

    if( parent.left_child == null )
        parent.left_child = child;
    else
    {
        prev = next.left;
        child.right = next;
        child.left = prev;
        prev.right = child;
        next.left = child;

        if( is_active( queue, child ) )
            parent.left_child = child;
    }

    child.parent = parent;
}

/**
 * Searches through the old root's children to find the new minimum.
 *
 * @param queue Queue in which to operate
 * @return      Pointer to the new root of the heap
 */
export function select_new_root( queue: strict_fibonacci_heap* ): strict_fibonacci_node* {
    let old_root: strict_fibonacci_node* = queue.root;
    let new_root: strict_fibonacci_node* = old_root.left_child;

    let current: strict_fibonacci_node* = new_root.right;
    while( current !== old_root.left_child )
    {
        if( current.key < new_root.key )
            new_root = current;
        current = current.right;
    }

    return new_root;
}

//--------------------------------------
// QUEUE MANAGEMENT
//--------------------------------------

/**
 * Enqueues a node at the tail.
 *
 * @param queue Queue in which to operate
 * @param node  Node to enqueue
 */
export function enqueue_node( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    let next: strict_fibonacci_node*, prev;

    if( queue.q_head != null )
    {
        next = queue.q_head;
        prev = next.q_prev;

        node.q_next = next;
        node.q_prev = prev;
        next.q_prev = node;
        prev.q_next = node;
    }

    queue.q_head = node.q_next;
}

/**
 * Dequeues an arbitrary node
 *
 * @param queue Queue in which to operate
 * @param node  Node to dequeue
 */
export function dequeue_node( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    let prev: strict_fibonacci_node*;
    let next: strict_fibonacci_node* = node.q_next;
    if( next === node )
        queue.q_head = null;
    else
    {
        prev = node.q_prev;

        next.q_prev = prev;
        prev.q_next = next;

        node.q_next = node;
        node.q_prev = node;

        queue.q_head = next;
    }
}

/**
 * Consumes a node.  Effectively it extracts the first node in the queue and
 * reinserts it at the tail.
 *
 * @param queue Queue in which to operate
 */
export function consume_node( queue: strict_fibonacci_heap* ): strict_fibonacci_node* {
    if( queue.q_head == null )
        return null;

    let target: strict_fibonacci_node* = queue.q_head;
    queue.q_head = target.q_next;

    return target;
}

//--------------------------------------
// ACTIVE NODE MANAGEMENT
//--------------------------------------

/**
 * Increases the rank of the specified node by 1.  Allocates a new rank record
 * if necessary.  Rearranges fix list appropriately.
 *
 * @param queue Queue in which to operate
 * @param node  Node to alter
 */
export function increase_rank( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    let new_rank: rank_record* = node.rank.inc;
    let target_rank: uint32 = node.rank.rank + 1;
    if( new_rank.rank !== target_rank )
        new_rank = create_rank_record( queue, target_rank, new_rank );

    switch_node_rank( queue, node, new_rank );
}

/**
 * Decreases the rank of the specified node by 1.  Allocates a new rank record
 * if necessary.  Rearranges fix list appropriately.
 *
 * @param queue Queue in which to operate
 * @param node  Node to alter
 */
export function decrease_rank( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    let new_rank: rank_record* = node.rank.dec;
    let target_rank: uint32 = node.rank.rank - 1;
    if( new_rank.rank !== target_rank )
        new_rank = create_rank_record( queue, target_rank, node.rank );

    switch_node_rank( queue, node, new_rank );
}

/**
 * Increases the loss of the specified node by 1.  Rearranges fix list
 * appropriately.
 *
 * @param queue Queue in which to operate
 * @param node  Node to alter
 */
export function increase_loss( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    node.loss++;
    if( node.loss === 1 )
        convert_active_to_loss( queue, node );
}

/**
 * Decreases the loss of the specified node to 0.  Rearranges fix list
 * appropriately.
 *
 * @param queue Queue in which to operate
 * @param node  Node to alter
 */
export function decrease_loss( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    node.loss = 0;
    convert_loss_to_active( queue, node );
}

/**
 * Switches the rank of a node, and rearranges the fix lists accordingly.
 * Releases reference to old rank, possibly triggering garbage collection.
 *
 * @param queue     Queue in which to operate
 * @param node      Node to alter
 * @param new_rank  New rank for the node
 */
export function switch_node_rank( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node*, new_rank: rank_record* ): void {
    int16 type = ( node.type === STRICT_TYPE_ROOT ) ? STRICT_FIX_ROOT :
        STRICT_FIX_LOSS;

    let fix: fix_node* = node.fix;
    if( fix != null )
        remove_fix_node( queue, fix, type );

    release_rank_record( queue, node );
    node.rank = new_rank;
    new_rank.ref_count++;

    if( fix != null )
    {
        fix.rank = new_rank;
        insert_fix_node( queue, fix, type );
    }
}

/**
 * Inserts a fix node into the appropriate list.
 *
 * @param queue Queue in which to operate
 * @param fix   Fix node to insert
 * @param type  Which list to alter
 */
export function insert_fix_node( queue: strict_fibonacci_heap*, fix: fix_node*,
    type: int16 ): void {
    let rank: rank_record* = fix.rank;

    if( rank.head[type] == null )
    {
        rank.head[type] = fix;
        rank.tail[type] = fix;

        if( queue.fix_list[type] == null )
        {
            fix.right = fix;
            fix.left = fix;
            queue.fix_list[type] = fix;
            return;
        }
        else
        {
            fix.right = queue.fix_list[type];
            fix.left = fix.right.left;
            fix.right.left = fix;
            fix.left.right = fix;
        }
    }
    else
    {
        fix.right = rank.head[type];
        fix.left = fix.right.left;
        fix.right.left = fix;
        fix.left.right = fix;

        if( queue.fix_list[type] === rank.head[type] )
            queue.fix_list[type] = fix;
        rank.head[type] = fix;
    }

    check_rank( queue, rank, type );
}

/**
 * Removes a specified fix node from the appropriate list
 *
 * @param queue Queue in which to operate
 * @param fix   Fix node to remove
 * @param type  Which list to alter
 */
export function remove_fix_node( queue: strict_fibonacci_heap*, fix: fix_node*,
    type: int16 ): void {
    let rank: rank_record* = fix.rank;

    if( queue.fix_list[type] === fix )
    {
        if( fix.right === fix )
            queue.fix_list[type] = null;
        else
            queue.fix_list[type] = fix.right;
    }

    if( rank.head[type] === fix )
    {
        if( rank.tail[type] === fix )
        {
            rank.head[type] = null;
            rank.tail[type] = null;
        }
        else
            rank.head[type] = fix.right;
    }
    else if( rank.tail[type] === fix )
        rank.tail[type] = fix.left;

    let next: fix_node* = fix.right;
    let prev: fix_node* = fix.left;

    next.left = prev;
    prev.right = next;

    check_rank( queue, rank, type );
}

/**
 * Check a specified rank to see if it needs to be pro- or demoted within the
 * specified fix list.
 *
 * @param queue Queue in which to operate
 * @param rank  Rank to check
 * @param type  Which list to alter
 */
export function check_rank( queue: strict_fibonacci_heap*, rank: rank_record*,
    type: int16 ): void {
    if( rank.head[type] == null )
        return;

    int16 status = ( rank.head[type] !== rank.tail[type] ||
        rank.head[type].node.loss > 1 );

    if( rank.transformable[type] && !status )
        move_rank( queue, rank, type, STRICT_DIR_DEMOTE );
    else if( !rank.transformable[type] && status )
        move_rank( queue, rank, type, STRICT_DIR_PROMOTE );
}

/**
 * Move a specified rank within the fix list
 *
 * @param queue     Queue in which to operate
 * @param rank      Rank to move
 * @param type      Which list to alter
 * @param direction STRICT_DIR_PROMOTE or STRICT_DIR_DEMOTE
 */
export function move_rank( queue: strict_fibonacci_heap*, rank: rank_record*,
    type: int16, direction: int16 ): void {
    let head: fix_node* = rank.head[type];
    let tail: fix_node* = rank.tail[type];
    let pred: fix_node* = head.left;
    let succ: fix_node* = tail.right;

    rank.transformable[type] = direction;

    if( pred === tail )
        return;

    if( queue.fix_list[type] === head && direction === STRICT_DIR_PROMOTE )
        return;

    if( queue.fix_list[type] === succ && direction === STRICT_DIR_DEMOTE )
        return;

    if( queue.fix_list[type] === succ && direction === STRICT_DIR_PROMOTE )
    {
        queue.fix_list[type] = head;
        return;
    }

    if( queue.fix_list[type] === head )
        queue.fix_list[type] = succ;

    pred.right = succ;
    succ.left = pred;

    succ = queue.fix_list[type];
    pred = succ.left;

    succ.left = tail;
    pred.right = head;
    head.left = pred;
    tail.right = succ;

    if( direction === STRICT_DIR_PROMOTE )
        queue.fix_list[type] = rank.head[type];
}

//--------------------------------------
// NODE TYPE CONVERSIONS
//--------------------------------------

/**
 * Convert an active node to an active root.  Assign it a fix node and insert it
 * accordingly.
 *
 * @param queue Queue in which to operate
 * @param node  Node to convert
 */
export function convert_active_to_root( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    if( is_active( queue, node ) && node.type === STRICT_TYPE_LOSS )
        convert_loss_to_active( queue, node );

    let fix: fix_node* = pq_alloc_node( queue.map, STRICT_NODE_FIX );
    fix.node = node;
    fix.rank = node.rank;
    node.fix = fix;
    node.type = STRICT_TYPE_ROOT;

    insert_fix_node( queue, fix, STRICT_FIX_ROOT );
}

/**
 * Convert an active node to a loss node.  Assign it a fix node and insert it
 * accordingly.
 *
 * @param queue Queue in which to operate
 * @param node  Node to convert
 */
export function convert_active_to_loss( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    let fix: fix_node* = pq_alloc_node( queue.map, STRICT_NODE_FIX );
    fix.node = node;
    fix.rank = node.rank;
    node.fix = fix;
    node.type = STRICT_TYPE_LOSS;

    insert_fix_node( queue, fix, STRICT_FIX_LOSS );
}

/**
 * Convert an active root to an active node.  Remove it from the fix list and
 * free the fix node.
 *
 * @param queue Queue in which to operate
 * @param node  Node to convert
 */
export function convert_root_to_active( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    remove_fix_node( queue, node.fix, STRICT_FIX_ROOT );
    pq_free_node( queue.map, STRICT_NODE_FIX, node.fix );
    node.fix = null;
    node.type = STRICT_TYPE_ACTIVE;
}

/**
 * Convert a loss node to an active node.  Remove it from the fix list and
 * free the fix node.
 *
 * @param queue Queue in which to operate
 * @param node  Node to convert
 */
export function convert_loss_to_active( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    remove_fix_node( queue, node.fix, STRICT_FIX_LOSS );
    pq_free_node( queue.map, STRICT_NODE_FIX, node.fix );
    node.fix = null;
    node.type = STRICT_TYPE_ACTIVE;
}

/**
 * Convert a passive node to an active node.  Assign it the proper active record
 * and rank record.  Move it to the left end of its sibling list.
 *
 * @param queue Queue in which to operate
 * @param node  Node to convert
 */
export function convert_passive_to_active( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    if( queue.active == null )
    {
        queue.active = pq_alloc_node( queue.map, STRICT_NODE_ACTIVE );
        queue.active.flag = 1;
    }
    node.active = queue.active;
    queue.active.ref_count++;

    let rank: rank_record* = queue.rank_list;
    if( rank == null || rank.rank !== 0 )
        rank = create_rank_record( queue, 0, queue.rank_list );
    node.rank = rank;
    rank.ref_count++;
    node.type = STRICT_TYPE_ACTIVE;

    node.parent.left_child = node;
}

/**
 * Convert an active node to a passive one.  Release all fix nodes, active and
 * rank records.
 *
 * @param queue Queue in which to operate
 * @param node  Node to convert
 */
export function convert_to_passive( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    if( node.fix != null )
    {
        remove_fix_node( queue, node.fix, ( node.type === STRICT_TYPE_ROOT ) ?
            STRICT_FIX_ROOT : STRICT_FIX_LOSS );
        pq_free_node( queue.map, STRICT_NODE_FIX, node.fix );
        node.fix = null;
    }

    release_rank_record( queue, node );
    release_active_record( queue, node );
    node.type = STRICT_TYPE_PASSIVE;

    if( node.parent != null )
        link( queue, node.parent, node );

    if( node.left_child == null )
        return;

    let current: strict_fibonacci_node* = node.left_child;
    if( is_active( queue, current ) && current.type === STRICT_TYPE_ACTIVE )
        convert_active_to_root( queue, current );
    current = current.right;
    while( current !== node.left_child )
    {
        if( is_active( queue, current ) && current.type === STRICT_TYPE_ACTIVE )
            convert_active_to_root( queue, current );
        current = current.right;
    }
}

//--------------------------------------
// REDUCTIONS
//--------------------------------------

/**
 * Reduce the number of active roots by linking two roots of equal rank.  If the
 * rightmost child of the link's loser is passive, link it to the root.
 *
 * @param queue Queue in which to operate
 */
export function reduce_active_roots( queue: strict_fibonacci_heap* ): int16 {
    let head: fix_node* = queue.fix_list[STRICT_FIX_ROOT];
    if( head == null )
        return 0;

    let rank: rank_record* = head.rank;
    if( head === rank.tail[STRICT_FIX_ROOT] )
        return 0;

    let next: fix_node* = head.right;
    let parent: strict_fibonacci_node*, child;
    choose_order_pair( head.node, next.node, &parent, &child );

    link( queue, parent, child );
    convert_root_to_active( queue, child );
    increase_rank( queue, parent );

    let extra: strict_fibonacci_node* = parent.left_child.left;
    if( !is_active( queue, extra ) )
        link( queue, queue.root, extra );

    return 1;
}

/**
 * Reduce the root's degree by linking it's three rightmost passive nodes.
 *
 * @param queue Queue in which to operate
 */
export function reduce_root_degree( queue: strict_fibonacci_heap* ): int16 {
    if( queue.root == null || queue.root.left_child == null )
        return 0;

    let x: strict_fibonacci_node* = queue.root.left_child.left;
    if( x === queue.root.left_child || is_active( queue, x ) )
        return 0;

    let y: strict_fibonacci_node* = x.left;
    if( y === queue.root.left_child || is_active( queue, y ) )
        return 0;

    let z: strict_fibonacci_node* = y.left;
    if( z === queue.root.left_child || is_active( queue, z ) )
        return 0;

    let grand: strict_fibonacci_node*, parent, child;
    choose_order_triple( x, y, z, &grand, &parent, &child );

    convert_passive_to_active( queue, parent );
    convert_passive_to_active( queue, grand );
    increase_rank( queue, grand );
    if( !is_active( queue, queue.root ) )
        convert_active_to_root( queue, grand );

    link( queue, parent, child );
    link( queue, grand, parent );

    return 1;
}

/**
 * Reduce loss in the heap.  If there is a node with loss at least 2, perform a
 * one-node loss reduction, otherwise perform a two-node loss reduction.
 *
 * @param queue Queue in which to operate
 */
export function reduce_loss( queue: strict_fibonacci_heap* ): int16 {
    let reduction: int16 = 2;
    let head: fix_node* = queue.fix_list[STRICT_FIX_LOSS];
    if( head == null )
        return 0;

    let rank: rank_record* = head.rank;
    if( head === rank.tail[STRICT_FIX_LOSS] && head.node.loss < 2 )
        return 0;

    let single: fix_node*;
    let next: fix_node* = head.right;
    let child: strict_fibonacci_node*, parent, old_parent;
    if( head.node.loss > 1 )
    {
        reduction = 1;
        single = head;
    }
    else if( next.node.loss > 1 )
    {
        reduction = 1;
        single = next;
    }

    if( reduction === 1 )
    {
        child = single.node;
        parent = queue.root;
        old_parent = child.parent;

        if( child !== parent )
            link( queue, parent, child );

        decrease_loss( queue, child );

        if( !is_active( queue, parent ) )
            convert_active_to_root( queue, child );
    }
    else
    {
        choose_order_pair( head.node, next.node, &parent, &child );
        old_parent = child.parent;

        link( queue, parent, child );

        decrease_loss( queue, child );
        decrease_loss( queue, parent );
        increase_rank( queue, parent );
    }

    if( old_parent != null && is_active( queue, old_parent ) )
    {
        decrease_rank( queue, old_parent );
        if( is_active( queue, old_parent ) &&
                old_parent.type !== STRICT_TYPE_ROOT )
            increase_loss( queue, old_parent );
    }

    return 1;
}

/**
 * A sequence of reductions to execute after melds and insertions.  Attempts to
 * perform a loss reduction, then an active root and root degree reduction to
 * the extent possible.
 *
 * @param queue Queue in which to operate
 */
export function post_meld_reduction( queue: strict_fibonacci_heap* ): void {
    let count_root: int16 = 0;
    let count_degree: int16 = 0;

    reduce_loss( queue );

    while( count_root < 1 && count_degree < 1 )
    {
        if( count_root < 1 && reduce_active_roots( queue ) )
            count_root++;
        else if( count_degree < 1 && reduce_root_degree( queue ) )
            count_degree++;
        else
            break;
    }
}

/**
 * A sequence of reductions to execute after deletions.  Reduces active roots
 * and root degree to the extent possible.
 *
 * @param queue Queue in which to operate
 */
export function post_delete_min_reduction( queue: strict_fibonacci_heap* ): void {
    while( 1 )
    {
        if( reduce_active_roots( queue ) )
            continue;
        else if( reduce_root_degree( queue ) )
            continue;
        else
            break;
    }
}

/**
 * A sequence of reductions to execute after a decrease key operation.  Attempts
 * to reduce loss, then perform 6 active root reductions and 4 root degree
 * reductions to the extent possible.
 *
 * @param queue Queue in which to operate
 */
export function post_decrease_key_reduction( queue: strict_fibonacci_heap* ): void {
    let count_root: int16 = 0;
    let count_degree: int16 = 0;

    reduce_loss( queue );

    while( count_root < 6 && count_degree < 4 )
    {
        if( count_root < 6 && reduce_active_roots( queue ) )
            count_root++;
        else if( count_degree < 4 && reduce_root_degree( queue ) )
            count_degree++;
        else
            break;
    }
}

//--------------------------------------
// GARBAGE COLLECTION & ALLOCATION
//--------------------------------------

/**
 * Creates a new rank record with the specified rank.  Inserts it in the rank
 * list before the specified successor.
 *
 * @param queue Queue in which to operate
 * @param rank  Rank for the new record
 * @param succ  Next greatest rank in the list
 */
export function create_rank_record( queue: strict_fibonacci_heap*,
    rank: uint32, succ: rank_record* ): rank_record* {
    let pred: rank_record*;
    let new_rank: rank_record* = pq_alloc_node( queue.map, STRICT_NODE_RANK );
    new_rank.rank = rank;
    new_rank.inc = new_rank;
    new_rank.dec = new_rank;

    if( succ == null )
        queue.rank_list = new_rank;
    else
    {
        pred = succ.dec;

        new_rank.inc = succ;
        new_rank.dec = pred;

        succ.dec = new_rank;
        pred.inc = new_rank;
    }

    return new_rank;
}

/**
 * Releases a reference to an active record, and releases the record for garbage
 * collection if it was the last reference.
 *
 * @param queue Queue in which to operate
 * @param node  Node containing active record reference
 */
export function release_active_record( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    node.active.ref_count--;
    if( node.active.ref_count === 0 )
    {
        if( node.active === queue.active )
            queue.active = null;
        pq_free_node( queue.map, STRICT_NODE_ACTIVE, node.active );
    }
    node.active = null;
}

/**
 * Releases a reference to an active record, and releases the record for garbage
 * collection if it was the last reference.
 *
 * @param queue Queue in which to operate
 * @param node  Node containing rank record reference
 */
export function release_rank_record( queue: strict_fibonacci_heap*,
    node: strict_fibonacci_node* ): void {
    let rank: rank_record* = node.rank;
    rank.ref_count--;
    if( rank.ref_count === 0 )
    {
        if( rank.inc === rank )
        {
            if( queue.rank_list === rank )
                queue.rank_list = null;
        }
        else
        {
            if( queue.rank_list === rank )
                queue.rank_list = rank.inc;

            rank.inc.dec = rank.dec;
            rank.dec.inc = rank.inc;
        }

        pq_free_node( queue.map, STRICT_NODE_RANK, rank );
    }
    node.rank = null;
}

/**
 * Releases a queue to the garbage collector.  Appends the fix and rank lists to
 * the collecting queue's garbage lists.
 *
 * @param queue         Queue which which will not be deleted
 * @param garbage_queue Queue to release for garbage collection
 */
export function release_to_garbage_collector( queue: strict_fibonacci_heap*,
    garbage_queue: strict_fibonacci_heap* ): void {
    let i: int16;
    let tail: fix_node*, head, g_tail, g_head;

    for( i = 0; i < 2; i++ )
    {
        if( garbage_queue.fix_list[i] != null )
        {
            if( queue.garbage_fix == null )
                queue.garbage_fix = garbage_queue.fix_list[i];
            else
            {
                head = queue.garbage_fix;
                tail = head.left;
                g_head = garbage_queue.fix_list[i];
                g_tail = g_head.left;

                head.left = g_tail;
                tail.right = g_head;
                g_tail.right = head;
                g_head.left = tail;
            }
        }
    }
}

/**
 * Properly removes a previously released fix and/or rank node.
 *
 * @param queue Queue in which to operate
 */
export function garbage_collection( queue: strict_fibonacci_heap* ): void {
    let fix: fix_node*;

    if( queue.garbage_fix != null )
    {
        fix = queue.garbage_fix;
        if( fix.right === fix )
            queue.garbage_fix = null;
        else
        {
            queue.garbage_fix = fix.right;
            fix.right.left = fix.left;
            fix.left.right = fix.right;
        }
    }
}
