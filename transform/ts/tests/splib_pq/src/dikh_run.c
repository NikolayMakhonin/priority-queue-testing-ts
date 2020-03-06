/***********************************************************/
/*                                                         */
/*               Executor of SP codes                      */
/*               (for usual Dijkstra)                      */
/*                                                         */
/***********************************************************/
/*****THIS CODE HAS BEEN MODIFIED TO PRODUCE PRORITY QUEUE **/
/*****TRACES FOR DIMACS CHALLENGE 5. LOOK FOR challenge5   **/
/*****COMMENTS IN THE CODE.  C. McGeoch 7/96                */



#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>

/* statistical variables */
let n_scans: int32 = 0;
let n_impr: int32 = 0;

/* definitions of types: node & arc */

import {} from 'types_dh.h'

/* parser for getting extended DIMACS format input and transforming the
   data to the internal representation */

import {} from 'parser_dh.c'

/* function 'timer()' for mesuring processor time */

import {} from 'timer.c'

/* function for constructing shortest path tree */

import {} from 'dikh.c'


export function main(argc: int16, argv: string*): int16 {

let t: float;
let arp: arc*;
let ndp: node*, source, k;
let n: int32, m, nmin;
let name: char[21];
let sum_d: uint64 = 0;

let trace_file: int16 = open( argv[1], O_RDWR | O_CREAT | O_TRUNC, S_IRWXU );

 parse( &n, &m, &ndp, &arp, &source, &nmin, name );
/*
printf ( "%s\nn= %ld, m= %ld, nmin= %ld, source = %ld\n",
        name,
        n,m,nmin, (source-ndp)+nmin );

printf ("\nordered arcs:\n");
for ( k = ndp; k< ndp + n; k++ )
  { i = (k-ndp)+nmin;
    for ( ta=k . first; ta !== (k+1). first; ta++ )
      printf ( " %2ld %2ld %4ld\n",
               i, ((ta.head)-ndp)+nmin, ta.len
             );

  }
*/
t = timer();

dikh ( trace_file, n, ndp, source );

t = timer() - t;

for ( k= ndp; k< ndp + n; k++ )
  if ( k . parent !== (node*) null )
   sum_d += (uint64) (k . dist);

 
#define nd(ptr) (int16)(ptr-ndp+nmin)

close( trace_file );

return 0;

/*
for ( k=ndp; k< ndp+n; k++ )
printf (" %d %d %d\n", nd(k), nd(k.parent), k.dist);
*/
}

