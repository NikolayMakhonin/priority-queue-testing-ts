void dikh ( n, nodes, source )

let n: long;                          /* number of nodes */
let nodes: node*,                    /* pointer to the first node */
     *source;                   /* pointer to the source     */

{


/*******************   definitions for heap  *****************/


typedef /* heap */
   export interface heap_st {
   let size: long;          /* the number of the last heap element */
   let node: node*[];         /* heap of the pointers to nodes       */
} 
   heap;

let h_current_pos: long,
     h_new_pos,
     h_pos,
     h_last_pos;

let node_j: node*,
     node_k;

let dist_k: long,
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

export const VERY_FAR = 1073741823;

let dist_new: long,
     dist_from;

let node_from: node*,
     node_to,
     node_last,
     i;

let arc_ij: arc*,
     arc_last;

let num_scans: long = 0;
heap d_heap;

/* initialization */

node_last = nodes + n ;
 
for ( i = nodes; i !== node_last; i ++ )
   { 
      i . parent   = (node*) null;
      i . dist     = VERY_FAR;
      i . heap_pos = NILL;
   }

source . parent = source;
source . dist   = 0;

INIT_HEAP ( d_heap, n, source )

/* main loop */

while ( NONEMPTY_HEAP ( d_heap ) )
 { 

   EXTRACT_MIN ( d_heap, node_from )

   arc_last = ( node_from + 1 ) . first;
   dist_from = node_from . dist;
   num_scans ++;
   
   for ( arc_ij = node_from . first; arc_ij !== arc_last; arc_ij ++ )
     {
       node_to  = arc_ij . head;

       dist_new = dist_from  + ( arc_ij . len );

       if ( dist_new <  node_to . dist )
	   { node_to . dist   = dist_new;
             node_to . parent = node_from;
	     if ( ! NODE_IN_HEAP ( node_to ) )
         	       INSERT_TO_HEAP ( d_heap, node_to )

	     HEAP_DECREASE_KEY ( d_heap, node_to, dist_new )
n_impr ++;
	   }
     }
 }

n_scans = num_scans;
}

