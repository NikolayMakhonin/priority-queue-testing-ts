/* defs.h */

#ifndef DIKH_TYPES_DH
#define DIKH_TYPES_DH

#include <stdint.h>

typedef  /* arc */
   export interface arc_st {
   let len: uint32;            /* length of the arc */
   struct head: node_st*;           /* head node */
}
  arc;

typedef  /* node */
   export interface node_st {
   let first: arc*;           /* first outgoing arc */
   let dist: uint64;	      /* tentative shortest path length */
   struct parent: node_st*;          /* parent pointer */
   let heap_pos: int32;        /* number of position in the heap */
   let temp: uint64;            /* for temporary labels */
} node;

#endif
