import {} from 'implicit_heap.h'

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

// export function push( queue: implicit_heap, src: uint32, dst: uint32 ): void ;
// export function dump( queue: implicit_heap, node: implicit_node, dst: uint32 ): void ;
// export function heapify_down( queue: implicit_heap, node: implicit_node ): uint32 ;
// export function heapify_up( queue: implicit_heap, node: implicit_node ): uint32 ;
// export function grow_heap( queue: implicit_heap ): void ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_create( map: mem_map* ): implicit_heap {
    let queue: implicit_heap = new Array(1);
#ifndef USE_EAGER
    queue.capacity = 1;
    queue.nodes = new Array(1);
#else
    queue.capacity = map.capacities[0];
    queue.nodes = new Array(queue.capacity);
#endif
    queue.map = map;

    return queue;
}

export function pq_destroy( queue: implicit_heap ): void {
    pq_clear( queue );
    free( queue.nodes );
    free( queue );
}

export function pq_clear( queue: implicit_heap ): void {
    mm_clear( queue.map );
    queue.size = 0;
}

export function pq_get_key( queue: implicit_heap, node: implicit_node ): key_type {
    return node.key;
}

export function pq_get_item( queue: implicit_heap, node: implicit_node ): item_type* {
    return (item_type*) &(node.item);
}

export function pq_get_size( queue: implicit_heap ): uint32 {
    return queue.size;
}

export function pq_insert( queue: implicit_heap, item: item_type, key: key_type ): implicit_node {
    let node: implicit_node = pq_alloc_node( queue.map, 0 );
    node.item = item;
    node.key = key;
    node.index = queue.size++;

#ifndef USE_EAGER
    if( queue.size === queue.capacity )
        grow_heap( queue );
#endif
    queue.nodes[node.index] = node;
    heapify_up( queue, node );

    return node;
}

export function pq_find_min( queue: implicit_heap ): implicit_node {
    if ( pq_empty( queue ) )
        return null;
    return queue.nodes[0];
}

export function pq_delete_min( queue: implicit_heap ): key_type {
    return pq_delete( queue, queue.nodes[0] );
}

export function pq_delete( queue: implicit_heap, node: implicit_node ): key_type {
    let key: key_type = node.key;
    let last_node: implicit_node = queue.nodes[queue.size - 1];
    push( queue, last_node.index, node.index );

    pq_free_node( queue.map, 0, node );
    queue.size--;

    if ( node !== last_node )
        heapify_down( queue, last_node );

    return key;
}

export function pq_decrease_key( queue: implicit_heap, node: implicit_node,
    new_key: key_type ): void {
    node.key = new_key;
    heapify_up( queue, node );
}

export function pq_empty( queue: implicit_heap ): boolean {
    return ( queue.size === 0 );
}

//==============================================================================
// STATIC METHODS
//==============================================================================

/**
 * Takes two node positions and pushes the src pointer into the second.
 * Essentially this is a single-sided swap, and produces a duplicate
 * record which is meant to be overwritten later.  A chain of these
 * operations will make up a heapify operation, and will be followed by
 * a @ref <dump> operation to finish the simulated "swapping" effect.
 *
 * @param queue Queue to which both nodes belong
 * @param src   Index of data to be duplicated
 * @param dst   Index of data to overwrite
 */
export function push( queue: implicit_heap, src: uint32, dst: uint32 ): void {
    if ( ( src >= queue.size ) || ( dst >= queue.size ) || ( src === dst ) )
        return;

    queue.nodes[dst] = queue.nodes[src];
    queue.nodes[dst].index = dst;
}

/**
 * Places a node in a certain location in the tree, updating both the
 * queue structure and the node record.
 *
 * @param queue Queue to which the node belongs
 * @param node  Pointer to node to be dumped
 * @param dst   Index of location to dump node
 */
export function dump( queue: implicit_heap, node: implicit_node, dst: uint32 ): void {
    queue.nodes[dst] = node;
    node.index = dst;
}

/**
 * Takes a node that is potentially at a higher position in the tree
 * than it should be, and pulls it up to the correct location.
 *
 * @param queue Queue to which node belongs
 * @param node  Potentially violating node
 */
export function heapify_down( queue: implicit_heap, node: implicit_node ): uint32 {
    if ( node == null )
        return -1;

    let sentinel: uint32, i, min;
    let base: uint32 = node.index;
    while( base * BRANCHING_FACTOR + 1 < queue.size )
    {
        i = base * BRANCHING_FACTOR + 1;
        sentinel = i + BRANCHING_FACTOR;
        if( sentinel > queue.size )
            sentinel = queue.size;

        min = i++;
        for( i = i; i < sentinel; i++ )
        {
            if( queue.nodes[i].key < queue.nodes[min].key )
                min = i;
        }

        if ( queue.nodes[min].key < node.key )
            push( queue, min, base );
        else
            break;

        base = min;
    }

    dump( queue, node, base );

    return node.index;
}

/**
 * Takes a node that is potentially at a lower position in the tree
 * than it should be, and pulls it up to the correct location.
 *
 * @param queue Queue to which node belongs
 * @param node  Potentially violating node
 */
export function heapify_up( queue: implicit_heap, node: implicit_node ): uint32 {
    if ( node == null )
        return -1;

    let i: uint32;
    for( i = node.index; i > 0; i = (i-1)/BRANCHING_FACTOR|0 )
    {
        if ( node.key < queue.nodes[(i-1)/BRANCHING_FACTOR|0].key )
            push( queue, (i-1)/BRANCHING_FACTOR|0, i );
        else
            break;
    }
    dump( queue, node, i );

    return node.index;
}

export function grow_heap( queue: implicit_heap ): void {
    let new_capacity: uint32 = queue.capacity * 2;
    let new_array: implicit_node[] = realloc( queue.nodes, new_capacity *
        sizeof( implicit_node ) );

    if( new_array == null )
        exit( -1 );

    queue.capacity = new_capacity;
    queue.nodes = new_array;
}
