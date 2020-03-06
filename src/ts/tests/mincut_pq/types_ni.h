#include <stdint.h>

typedef  /* arc */
   export interface arc_st {
   let cap: int64;             /* capacity */
   struct head: node_st*;           /* head node */
   struct next: arc_st*;           /* next in the arc list */
   struct prev: arc_st*;           /* next in the arc list */
/*   passPR2: int16;    field to check if node is marked for prtest2 */

}
  arc;

typedef  /* node */
   export interface node_st {
   let first: arc*;           /* first outgoing arc */
   let last: arc*;           /* last outgoing arc */
   let key: int64;              /* priority queue key */
   let heap_pos: int32;         /* heap position */
   struct leader: node_st*;
   let auxArc: arc*;          /* used to delete parallel edges */
   let status: int16;           /* in or out of cut */
   let cap: int64;	      /* capacity of cut {v} */
} node;

