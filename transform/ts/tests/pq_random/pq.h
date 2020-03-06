export const MAXITEMS = 160000000;
export const MAXNAMES = 160000000;

#include <stdint.h>

export type it_type = uint32;
export type pr_type = uint64;
export type in_type = uint32;

typedef struct {
  let name: in_type;
  let prio: pr_type;
} cell;

typedef struct {
  let size: int32;
  let data: cell*;
} heap_type;

typedef pq_ptr: heap_type*;


export function HeapExtractMin(heap_type *): pr_type ;
export function prioval(heap_type *,it_type): pr_type ;
export function infoval(heap_type *,it_type): in_type ;
export function HeapConstruct(H: heap_type*): void ;
export function HeapNodeExchange(A: heap_type*,x: int16,y: int16): void ;
export function Heapify(A: heap_type*,i: int16): void ;
export function printheap(A: heap_type*): void ;
export function HeapInsert(A: heap_type*,name: in_type,key: pr_type): it_type ;
export function HeapDecreaseKey(A: heap_type*, node: it_type, key: pr_type): void ;
export function HeapFindMin(A: heap_type*): it_type ;
