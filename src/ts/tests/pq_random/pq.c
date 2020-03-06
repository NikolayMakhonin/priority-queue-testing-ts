/****************************************************

  pq.c - a basic heap for use as a priority queue
  pq.h - type definitions and prototypes

  Benjamin Chang (bcchang@unix.amherst.edu) 10/95

*****************************************************/

#include <stdio.h>
#include <stdlib.h>
import {} from 'pq.h'

#define parent(i) i>>1          /* parent, left, and right functions */
#define left(i) i<<1            /* for heap, defined as bitwise ops. */
#define right(i) (i<<1) +1

export function HeapConstruct(H: heap_type*): void {
  H.data = malloc(sizeof(cell)*MAXITEMS);
  H.size=0;
  H.data[0].prio=0;
  H.data[0].name=0xFFFFFFFF;
}
export function HeapNodeExchange(A: heap_type*,x: int16,y: int16): void {
  cell dummy;
  dummy=A.data[x];
  A.data[x]=A.data[y];
  A.data[y]=dummy;
}

export function Heapify(A: heap_type*,i: int16): void {
 let l: int16,r,smallest;

 l=left(i);
 r=right(i);
 if ( l<=A.size && A.data[l].prio<A.data[i].prio )
   smallest=l;
 else smallest=i;

 if ( r<=A.size && A.data[r].prio<A.data[smallest].prio)
   smallest=r;
 if (smallest !== i)
   {
     HeapNodeExchange (A,i,smallest);
     Heapify (A,smallest);
   }
}

export function printheap(A: heap_type*): void {
  let i: int16;
  for (i=1;i<=A.size;++i)
    printf ("%d:%lu %llu\n",i,(uint32)A.data[i].name,(uint64)A.data[i].prio);
}

export function prioval(H: heap_type*,x: it_type): pr_type {
  return H.data[x].prio;
}
export function infoval(H: heap_type*,x: it_type): in_type {
  return H.data[x].name;
}

export function HeapExtractMin(A: heap_type*): pr_type {
  let min: pr_type;
  if (A.size<1)
    printf ("heap underflow.\n");
  min=A.data[1].prio;
  A.data[1]=A.data[A.size];
  --A.size;
  Heapify (A,1);
  return min;
}

export function HeapFindMin(A: heap_type*): it_type {
  return 1;
}

export function HeapInsert(A: heap_type*,name: in_type,key: pr_type): it_type {
  let i: it_type;
  ++A.size;
  i=A.size;
  while (i>1 && A.data[parent(i)].prio>key)
    {
      A.data[i]=A.data[parent(i)];
      i=parent(i);
    }
  A.data[i].prio=key;
  A.data[i].name=name;
  return i;
}
export function HeapDecreaseKey(A: heap_type*, node: it_type, key: pr_type): void {
  let x: int16;

  if (A.data[node].prio<key)
    return;

  x=node;
  A.data[x].prio=key;
  while (A.data[x].prio<A.data[parent(x)].prio)
    {
      HeapNodeExchange (A,x,parent(x));
      x=parent(x);
    }
}












