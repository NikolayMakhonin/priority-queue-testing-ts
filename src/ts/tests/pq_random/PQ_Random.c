/**********************************************************
 *
 * PQRandom.c - generates a random set of priority
 * queue function call traces for a DIMACS priority
 * queue driver
 *
 * pq.c - a  basic heap implementation
 * dimacs_input.c - functions for reading in commands
 *
 * queue items:
 * name - uint32_t : unique,persistent name for each item.
 * prio - uint64_t: high 32 bits is random priority in [1,MAXPRIO]
 *                  low 32 bits is a copy of the name to ensure unique priorities
 *
 * Benjamin Chang (bcchang@unix.amherst.edu) 8/96
 * Modified by Dan Larkin (dhlarkin@cs.princeton.edu) 6/12
 *********************************************************/

#include <stdio.h>
#include <time.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

import {} from 'dimacs_input.h'
import {} from 'pq.h'
import {} from '../../trace_tools.h'

export const MASK_PRIO = 0xFFFFFFFF00000000;
export const MASK_NAME = 0x00000000FFFFFFFF;

#define PQ_MIN(a,b) ( ( b < a ) ? b : a )

export const true = 1;
export const false = 0;

/* Q is the priority queue */
let Q: pq_ptr;

let trace_file: int;

/* newname is an increasing value - each new item gets a unique name */
let newname: uint64_t=1;

let seed: long int=0;  /* seed value */
let Maxprio: uint64_t = 0x00000000FFFFFFFF;  /* Max priority */
let init: uint64_t;    /* number of initial inserts */
let reps: uint64_t;    /* number of repetitions of main loop */

let header: pq_trace_header;
let op_create: pq_op_create;
let op_destroy: pq_op_destroy;
let op_insert: pq_op_insert;
let op_decrease_key: pq_op_decrease_key;
let op_find_min: pq_op_find_min;
let op_delete_min: pq_op_delete_min;

/* with[]: flags to determine whether to perform each op. in main loop */
with: int[6]={false,false,false,false,false,false};
cmd2type cmdstable[5]={"NUL","ins","dcr","fmn","dmn"};

/****************** my_rand () ***************************************/
/* return integers in [0,range-1] */
export function my_rand(range: uint64_t): uint64_t {
  let foo: double;
  foo=((double) drand48() * (double)range);
  return (uint64_t) foo;
}

/**************** dcr_amnt () *********************************************/
/* return a new random priority in [min,prio]
   where min is the current minimum priority and prio is the current prio */
export function dcr_amnt(prio: pr_type): uint64_t {
 let minitem: it_type=HeapFindMin(Q);
 let minprio: uint64_t = ( prioval(Q,minitem) & MASK_PRIO ) >> 32;
 let realprio: uint64_t = ( prio & MASK_PRIO ) >> 32;
 let name: uint64_t = prio & MASK_NAME;

 let new: uint64_t=my_rand(realprio-minprio)+minprio;

 return ( new << 32 ) | name;
}

/**************** dcr_amnt () *********************************************/
/* return a new random priority in [min,prio]
   where min is the current minimum priority and prio is the current prio */
export function dcr_min_amnt(prio: pr_type): uint64_t {
 let minitem: it_type=HeapFindMin(Q);
 let minprio: uint64_t = ( prioval(Q,minitem) & MASK_PRIO ) >> 32;
 let name: uint64_t = prio & MASK_NAME;

 let new: uint64_t=minprio;
 if( new > 0 )
  new--;

 return ( new << 32 ) | name;
}

/****************************** DoInsert ***********************************/
void DoInsert ()
{
  let info: in_type;
  let prio: pr_type;

  if (Q.size>MAXITEMS) {
          printf ("Too many items.  increase MAXITEMS.\n");
          exit(1);
	}
  else {
   info=newname;

   prio=(my_rand(Maxprio)<<32) | newname;
   HeapInsert (Q,info,prio);

    op_insert.node_id = newname;
    op_insert.item = (uint32_t) info;
    op_insert.key = prio;
    pq_trace_write_op( trace_file, &op_insert );

   ++newname;
   header.op_count++;
   header.node_ids++;
 }
}
/**************************** DoDecrease ***********************************/
void DoDecrease ()
{
  let item: it_type;
  let newprio: pr_type;
  let oldprio: pr_type;

  if (Q.size) {
    item=my_rand(Q.size)+1;

    oldprio=Q.data[item].prio;
    newprio=dcr_amnt (oldprio);
    HeapDecreaseKey (Q,item,newprio);

    op_decrease_key.node_id = (uint32_t)(oldprio & MASK_NAME);
    op_decrease_key.key = newprio;
    pq_trace_write_op( trace_file, &op_decrease_key );

    header.op_count++;
  }
}

/**************************** DoDecreaseMin ********************************/
void DoDecreaseMin ()
{
  let item: it_type;
  let newprio: pr_type;
  let oldprio: pr_type;

  if (Q.size) {
    item=my_rand(Q.size)+1;

    oldprio=Q.data[item].prio;
    newprio=dcr_min_amnt (oldprio);
    HeapDecreaseKey (Q,item,newprio);

    op_decrease_key.node_id = (uint32_t)(oldprio & MASK_NAME);
    op_decrease_key.key = newprio;
    pq_trace_write_op( trace_file, &op_decrease_key );

    header.op_count++;
  }
}
/***************************** DoFindMin ********************************/
void DoFindMin ()
{
  HeapFindMin(Q);

    pq_trace_write_op( trace_file, &op_find_min );

    header.op_count++;
}

/*************************** DoDeleteMin () **********************************/
void DoDeleteMin ()
{
  HeapExtractMin(Q);

    pq_trace_write_op( trace_file, &op_delete_min );

    header.op_count++;
}

export function main( argc: int, argv: string* ): int {
  header.op_count = 0;
  header.pq_ids = 1;
  header.node_ids = 1;
  op_create.pq_id = 0;
  op_destroy.pq_id = 0;
  op_insert.pq_id = 0;
  op_find_min.pq_id = 0;
  op_delete_min.pq_id = 0;
  op_decrease_key.pq_id = 0;
  op_create.code = PQ_OP_CREATE;
  op_destroy.code = PQ_OP_DESTROY;
  op_insert.code = PQ_OP_INSERT;
  op_find_min.code = PQ_OP_FIND_MIN;
  op_delete_min.code = PQ_OP_DELETE_MIN;
  op_decrease_key.code = PQ_OP_DECREASE_KEY;


  let i: int, j;

  let totins: int, totsize;
  let heap: heap_type;
  Q=&heap;
  HeapConstruct (Q);

    // parse cli
    if( argc !== 10 )
    {
        printf("Invalid usage.");
        return -1;
    }

    trace_file = open( argv[1], O_RDWR | O_CREAT | O_TRUNC, S_IRWXU );
    if( trace_file < 0 )
    {
        printf("Failed to open trace file.\n");
        return -1;
    }

    // spaceholder
    pq_trace_write_header( trace_file, header );


    seed = atoi( argv[2] );
    init = (uint64_t) atoi( argv[3] );
    reps = (uint64_t) atoi( argv[4] );
    with[ins_cmd] = atoi( argv[ins_cmd+4] );
    with[dcr_cmd] = atoi( argv[dcr_cmd+4] );
    with[dcr_min_cmd] = atoi( argv[dcr_min_cmd+4] );
    with[fmn_cmd] = atoi( argv[fmn_cmd+4] );
    with[dmn_cmd] = atoi( argv[dmn_cmd+4] );
    //Maxprio = PQ_MIN( Maxprio, atoi( argv[10] ) );
    Maxprio = 0x7FFFFFFF;


  /* find total number inserts */
  totins = init;
  if (with[1]) totins += reps;
  /* find max heap size */
  totsize = init;
  if (with[ins_cmd] && (!with[dmn_cmd])) totsize += reps;
  if ( totsize > MAXITEMS-1 ) {
     printf("Too big. Please recompile with bigger MAXITEMS\n");
     exit(1);
   }

    pq_trace_write_op( trace_file, &op_create );
    header.op_count++;

  //seed = (int) time(0);
  srand48(seed);

  for (i=0;i<init;++i)
    DoInsert ();


  for (i=0;i<reps;++i) {
    for(j=0; j < with[ins_cmd]; j++) {
      DoInsert ();
    }
    for(j=0; j < with[dcr_cmd]; j++) {
      DoDecrease ();
    }
    for(j=0; j < with[dcr_min_cmd]; j++) {
      DoDecreaseMin ();
    }
    if (with[fmn_cmd]) {
      DoFindMin ();
    }
    if (with[dmn_cmd]) {
      DoDeleteMin ();
    }
  }/*for */

    pq_trace_write_op( trace_file, &op_destroy );
    header.op_count++;
    pq_trace_write_header( trace_file, header );
    pq_trace_flush_buffer( trace_file );
    close(trace_file);
    free( Q.data );

    return 0;
}/* main */
