/***********************************************************/
/*                                                         */
/*               Executor of SP codes                      */
/*               (for usual Dijkstra)                      */
/*                                                         */
/***********************************************************/


#include <stdio.h>
#include <stdlib.h>

/* statistical variables */
let n_scans: long = 0;
let n_impr: long = 0;

/* definitions of types: node & arc */

import {} from 'types_dh.h'

/* parser for getting extended DIMACS format input and transforming the
   data to the internal representation */

import {} from 'parser_dh.c'

/* function 'timer()' for mesuring processor time */

import {} from 'timer.c'

/* function for constructing shortest path tree */

import {} from 'dikh.c'


main ()

{

let t: float;
let arp: arc*, ta;
let ndp: node*, source, k;
let n: long, m, nmin, i;
let name: char[21];
let sum_d: double = 0;

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

dikh ( n, ndp, source );

t = timer() - t;

for ( k= ndp; k< ndp + n; k++ )
  if ( k . parent !== (node*) null )
   sum_d += (double) (k . dist);

printf ("\nDijkstra with heap . problem name: %s\n\n\
Nodes: %ld    Arcs: %ld\n\
Number of scans: %ld\n\
Number of improveness: %ld\n\
Sum of distances: %.0f\n\n\
Running time of SP computation: %.2f\n\n",
         name, n, m, n_scans, n_impr, sum_d, t ); 
 
#define nd(ptr) (int)(ptr-ndp+nmin)

/*
for ( k=ndp; k< ndp+n; k++ )
printf (" %d %d %d\n", nd(k), nd(k.parent), k.dist);
*/
}
