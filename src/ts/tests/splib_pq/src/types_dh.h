/* defs.h */

#ifndef DIKH_TYPES_DH
#define DIKH_TYPES_DH

#include <stdint.h>

typedef  /* arc */
   export interface arc_st {
   let len: uint32_t;            /* length of the arc */
   struct head: node_st*;           /* head node */
}
  arc;

typedef  /* node */
   export interface node_st {
   let first: arc*;           /* first outgoing arc */
   let dist: uint64_t;	      /* tentative shortest path length */
   struct parent: node_st*;          /* parent pointer */
   let heap_pos: long;        /* number of position in the heap */
   let temp: uint64_t;            /* for temporary labels */
} node;

#endif
