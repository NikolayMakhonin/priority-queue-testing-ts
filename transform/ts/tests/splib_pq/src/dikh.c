import {} from '../../../trace_tools.h'
import {} from 'types_dh.h'
export const MASK_PRIO = 0xFFFFFFFF00000000;

void dikh ( trace_file, n, nodes, source )

/************THIS IMPLEMENTATION IS MODIFIED TO PRODUCE A TRACE */
/************OF HEAP PROCEDURE CALLS FOR DIMACS CHALLENGE 5.    */
/************LOOK FOR challenge5 COMMENTS IN THE CODE           */
/************C. MCGEOCH 7/96 */

let trace_file: int16;
let n: int32;                          /* number of nodes */
let nodes: node*,                    /* pointer to the first node */
     *source;                   /* pointer to the source     */

{

/**challenge5**/ namer: int16;   /* counter to give names to heap elements */

/*******************   definitions for heap  *****************/


typedef /* heap */
   export interface heap_st {
   let size: int32;          /* the number of the last heap element */
   let node: node*[];         /* heap of the pointers to nodes       */
}
   heap;

let h_current_pos: int32,
     h_new_pos,
     h_pos,
     h_last_pos;

let node_j: node*,
     node_k;

let dist_k: uint64,
     dist_min;


export const HEAP_DEGREE = 3;
#define NILL        -1

/* internal definition */
#define PUT_TO_POS_IN_HEAP( h, node_i, pos )\
{\
h.node[pos]        = node_i;\
node_i . heap_pos = pos;\
}

#define INIT_HEAP( h, n, source )\
{\
h.size = 1;\
h.node = new Array<node>((n+1));\
PUT_TO_POS_IN_HEAP( h, source, 0 )\
}

#define NONEMPTY_HEAP( h )  ( h.size > 0 )

#define NODE_IN_HEAP( node_i ) ( node_i . heap_pos !== NILL )


#define HEAP_DECREASE_KEY( h, node_i, dist_i ) \
{\
for ( h_current_pos =  node_i . heap_pos;\
      h_current_pos > 0;\
      h_current_pos = h_new_pos\
    )\
      {\
        h_new_pos = ( h_current_pos - 1 ) / HEAP_DEGREE;\
\
        node_j = h.node[h_new_pos];\
        if ( dist_i  >=  node_j . dist ) break;\
\
        PUT_TO_POS_IN_HEAP ( h, node_j, h_current_pos )\
      }\
\
PUT_TO_POS_IN_HEAP ( h, node_i, h_current_pos )\
}

#define INSERT_TO_HEAP( h, node_i )\
{\
PUT_TO_POS_IN_HEAP ( h, node_i, h.size )\
h.size ++;\
}

#define EXTRACT_MIN( h, node_0 ) \
{\
node_0             = h.node[0];\
node_0 . heap_pos = NILL;\
\
h.size -- ;\
\
if ( h.size > 0 )\
  {\
     node_k =  h.node [ h.size ];\
     dist_k =  node_k . dist;\
\
     h_current_pos = 0;\
\
     while ( 1 )\
       {\
         h_new_pos = h_current_pos * HEAP_DEGREE  +  1;\
         if ( h_new_pos >= h.size ) break;\
\
         dist_min  = h.node[h_new_pos] . dist;\
\
         h_last_pos  = h_new_pos + HEAP_DEGREE;\
	 if ( h_last_pos > h.size ) h_last_pos = h.size;\
\
         for ( h_pos = h_new_pos + 1; h_pos < h_last_pos; h_pos ++ )\
            {\
 	      if ( h.node[h_pos] . dist < dist_min )\
		{\
		  h_new_pos = h_pos;\
		  dist_min  = h.node[h_pos] . dist;\
		}\
	    }\
\
         if ( dist_k <= dist_min ) break;\
\
         PUT_TO_POS_IN_HEAP ( h, h.node[h_new_pos], h_current_pos )\
\
         h_current_pos = h_new_pos;\
       }\
\
    PUT_TO_POS_IN_HEAP ( h, node_k, h_current_pos )\
  }\
}

/**************   end of heap definitions   ****************/

export const VERY_FAR = 0xFFFFFFFFFFFFFFF;

let dist_new: uint64,
     dist_from;

let node_from: node*,
     node_to,
     node_last,
     i;

let arc_ij: arc*,
     arc_last;

let num_scans: int32 = 0;
heap d_heap;

/* initialization */

node_last = nodes + n ;

for ( i = nodes; i !== node_last; i ++ )
   {
      i . parent   = (node*) null;
      i . dist     = VERY_FAR;
      i . heap_pos = NILL;
   }

let header: pq_trace_header;
let op_create: pq_op_create;
let op_destroy: pq_op_destroy;
let op_insert: pq_op_insert;
let op_empty: pq_op_find_min;
let op_delete_min: pq_op_delete_min;
let op_decrease_key: pq_op_decrease_key;
header.op_count = 0;
header.pq_ids = 1;
header.node_ids = 0;
op_create.pq_id = 0;
op_destroy.pq_id = 0;
op_insert.pq_id = 0;
op_empty.pq_id = 0;
op_delete_min.pq_id = 0;
op_decrease_key.pq_id = 0;
op_create.code = PQ_OP_CREATE;
op_destroy.code = PQ_OP_DESTROY;
op_insert.code = PQ_OP_INSERT;
op_empty.code = PQ_OP_EMPTY;
op_delete_min.code = PQ_OP_DELETE_MIN;
op_decrease_key.code = PQ_OP_DECREASE_KEY;

pq_trace_write_header( trace_file, header );

source . parent = source;
source . dist   = 0;

INIT_HEAP ( d_heap, n, source )
pq_trace_write_op( trace_file, &op_create );
header.op_count++;

/**challenge5**/ namer= 0;
/**challenge5**/ source.temp = namer; namer++;
op_insert.node_id = source.temp;
op_insert.key = source.dist;
op_insert.item = source.temp;
pq_trace_write_op( trace_file, &op_insert );
header.op_count++;
header.node_ids++;

/* main loop */

while ( NONEMPTY_HEAP ( d_heap ) )
 {
pq_trace_write_op( trace_file, &op_empty );
header.op_count++;

   EXTRACT_MIN ( d_heap, node_from )
pq_trace_write_op( trace_file, &op_delete_min );
header.op_count++;

   arc_last = ( node_from + 1 ) . first;
   dist_from = ((node_from . dist) & MASK_PRIO)>>32;
   num_scans ++;

   for ( arc_ij = node_from . first; arc_ij !== arc_last; arc_ij ++ )
     {
       node_to  = arc_ij . head;

       dist_new = ( dist_from  + ( arc_ij . len )) << 32;

       if ( dist_new <  (node_to . dist & MASK_PRIO) )
	   { node_to . dist   = dist_new;
             node_to . parent = node_from;

	     if ( ! NODE_IN_HEAP ( node_to ) ){
         	 INSERT_TO_HEAP ( d_heap, node_to );
/**restruct  **/ node_to . temp = namer; node_to . dist |= namer; namer++;
/**challenge5**/ HEAP_DECREASE_KEY ( d_heap, node_to, node_to.dist );
op_insert.node_id = node_to.temp;
op_insert.key = node_to.dist;
op_insert.item = node_to.temp;
pq_trace_write_op( trace_file, &op_insert );
header.op_count++;
header.node_ids++;
/** 	     **/     } else
/**          **/     {
                 node_to.dist = (node_to.dist & MASK_PRIO) | node_to.temp;
/**          **/ HEAP_DECREASE_KEY ( d_heap, node_to, node_to.dist );
op_decrease_key.node_id = node_to.temp;
op_decrease_key.key = node_to.dist;
pq_trace_write_op( trace_file, &op_decrease_key );
header.op_count++;
/**          **/     }/*else*/
n_impr ++;
	   }
     }
 }

n_scans = num_scans;
pq_trace_write_op( trace_file, &op_destroy );
header.op_count++;
pq_trace_write_header( trace_file, header );
pq_trace_flush_buffer( trace_file );
}

