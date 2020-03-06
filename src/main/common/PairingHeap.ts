/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly linked list of
 * siblings and has a pointer to it's first child.  If a node is the
 * first of its siblings, then its prev pointer points to their
 * collective parent.  The last child is marked by a null next pointer.
 */
export type uint32 = number
export type uint64 = number
export type key_type = uint64
export type item_type = uint32

export interface PairingNode {
	// ! First child of this node
	child: PairingNode
	// ! Next node in the list of this node's siblings
	next: PairingNode
	// ! Previous node in the list of this node's siblings
	prev: PairingNode

	// ! Pointer to a piece of client data
	item: item_type
	// ! Key for the item
	key: key_type
}

/**
 * A mutable, meldable, two-pass Pairing heap.  Maintains a single multiary tree
 * with no structural constraints other than the standard heap invariant.
 * Handles most operations through cutting and pairwise merging.  Primarily uses
 * iteration for merging rather than the standard recursion methods (due to
 * concerns for stackframe overhead).
 */
export class PairingHeap {
	// ! Memory map to use for node allocation
	private map: mem_map
	// ! The number of items held in the queue
	private size: uint32 = 0
	// ! Pointer to the minimum node in the queue
	private root: PairingNode = null

	/**
	 * Creates a new, empty queue.
	 *
	 * @param map   Memory map to use for node allocation
	 */
	constructor( map?: mem_map ) {
		this.map = map
	}

	/**
	 * Deletes all nodes, leaving the queue empty.
	 */
	public pq_clear(): void {
		mm_clear( this.map )
		this.root = null
		this.size = 0
	}

	/**
	 * Returns the key associated with the queried node.
	 *
	 * @param node  Node to query
	 * @return      Node's key
	 */
	public pq_get_key( node: PairingNode ): key_type {
		return node.key
	}

	/**
	 * Returns the item associated with the queried node.
	 *
	 * @param node  Node to query
	 * @return      Node's item
	 */
	public pq_get_item( node: PairingNode ): item_type {
		return node.item
	}

	/**
	 * Returns the current size of the queue.
	 *
	 * @return      Size of queue
	 */
	public pq_get_size(): uint32 {
		return this.size
	}

	/**
	 * Takes an item-key pair to insert it into the queue and creates a new
	 * corresponding node.  Merges the new node with the root of the queue.
	 *
	 * @param item  Item to insert
	 * @param key   Key to use for node priority
	 * @return      Pointer to corresponding node
	 */
	public pq_insert( item: item_type, key: key_type ): PairingNode {
		const wrapper: PairingNode = pq_alloc_node( this.map, 0 )
		wrapper.item = item
		wrapper.key = key
		this.size++

		this.root = this.merge( this.root, wrapper )

		return wrapper
	}

	/**
	 * Returns the minimum item from the queue without modifying any data.
	 *
	 * @return      Node with minimum key
	 */
	public pq_find_min(): PairingNode {
		if ( this.pq_empty() ) {
			return null
		}
		return this.root
	}

	/**
	 * Deletes the minimum item from the queue and returns it, restructuring
	 * the queue along the way to maintain the heap property.  Relies on the
	 * @ref <pq_delete> method to delete the root of the tree.
	 *
	 * @return      Minimum key, corresponding to item deleted
	 */
	public pq_delete_min(): key_type {
		return this.pq_delete(this.root )
	}

	/**
	 * Deletes an arbitrary item from the queue and modifies queue structure
	 * to preserve the heap invariant.  Requires that the location of the
	 * item's corresponding node is known.  Removes the node from its list
	 * of siblings, then merges all its children into a new tree and
	 * subsequently merges that tree with the root.
	 *
	 * @param node  Pointer to node corresponding to the item to delete
	 * @return      Key of item deleted
	 */
	public pq_delete( node: PairingNode ): key_type {
		const key: key_type = node.key

		if ( node === this.root ) {
			this.root = this.collapse( node.child )
		} else
		{
			if ( node.prev.child === node ) {
				node.prev.child = node.next
			} else {
				node.prev.next = node.next
			}

			if ( node.next != null ) {
				node.next.prev = node.prev
			}

			this.root = this.merge( this.root, this.collapse( node.child ) )
		}

		pq_free_node( this.map, 0, node )
		this.size--

		return key
	}

	/**
	 * If the item in the queue is modified in such a way to decrease the
	 * key, then this function will update the queue to preserve queue
	 * properties given a pointer to the corresponding node.  Cuts the node
	 * from its list of siblings and merges it with the root.
	 *
	 * @param node      Node to change
	 * @param new_key   New key to use for the given node
	 */
	public pq_decrease_key( node: PairingNode, new_key: key_type ): void {
		node.key = new_key
		if ( node === this.root ) {
			return
		}

		if ( node.prev.child === node ) {
			node.prev.child = node.next
		} else {
			node.prev.next = node.next
		}

		if ( node.next != null ) {
			node.next.prev = node.prev
		}

		this.root = this.merge( this.root, node )
	}

	/**
	 * Determines whether the queue is empty, or if it holds some items.
	 *
	 * @return      True if queue holds nothing, false otherwise
	 */
	public pq_empty(): boolean {
		return ( this.size === 0 )
	}

	// ==============================================================================
	// STATIC METHODS
	// ==============================================================================

	/**
	 * Merges two nodes together, making the item of greater key the child
	 * of the other.
	 *
	 * @param a     First node
	 * @param b     Second node
	 * @return      Resulting tree root
	 */
	public merge( a: PairingNode, b: PairingNode ): PairingNode {
		let parent: PairingNode
		let child: PairingNode

		if ( a == null ) {
			return b
		} else if ( b == null ) {
			return a
		} else if ( a === b ) {
			return a
		}

		if ( b.key < a.key )
		{
			parent = b
			child = a
		} else
		{
			parent = a
			child = b
		}

		child.next = parent.child
		if ( parent.child != null ) {
			parent.child.prev = child
		}
		child.prev = parent
		parent.child = child

		parent.next = null
		parent.prev = null

		return parent
	}

	/**
	 * Performs an iterative pairwise merging of a list of nodes until a
	 * single tree remains.  Implements the two-pass method without using
	 * explicit recursion (to prevent stack overflow with large lists).
	 * Performs the first pass in place while maintaining only the minimal list
	 * structure needed to iterate back through during the second pass.
	 *
	 * @param node  Head of the list to collapse
	 * @return      Root of the collapsed tree
	 */
	public collapse( node: PairingNode ): PairingNode {
		let tail: PairingNode
		let a: PairingNode
		let b: PairingNode
		let next: PairingNode
		let result: PairingNode

		if ( node == null ) {
			return null
		}

		next = node
		tail = null
		while ( next != null )
		{
			a = next
			b = a.next
			if ( b != null )
			{
				next = b.next
				result = this.merge( a, b )
				// tack the result onto the end of the temporary list
				result.prev = tail
				tail = result
			} else
			{
				a.prev = tail
				tail = a
				break
			}
		}

		result = null
		while ( tail != null )
		{
			// trace back through to merge the list
			next = tail.prev
			result = this.merge( result, tail )
			tail = next
		}

		return result
	}
}
