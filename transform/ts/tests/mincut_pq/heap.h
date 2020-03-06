export interface heap {
   let size: int32;          /* the number of the last heap element */
   let node: node*[];         /* heap of the pointers to nodes       */
}

let h_current_pos: int32,
     h_new_pos,
     h_pos,
     h_last_pos;

let node_j: node*,
     node_k;

let key_k: double,
       key_min;

