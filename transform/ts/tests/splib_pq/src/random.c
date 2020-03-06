/*********************************************************************/
/*                                                                   */
/* current processor time in seconds                                 */
/* difference between two calls is processor time spent by your code */
/* needs: <sys/types.h>, <sys/times.h>                               */
/* depends on compiler and OS                                        */
/*                                                                   */
/*********************************************************************/

#include <sys/types.h>
#include <sys/times.h>

float timer()
   { struct tms hold;

        times(&hold);
        return  (float)(hold.tms_utime) / 60.0;
   }


/*********************************************************************/
/*                                                                   */
/*            Family of random number generators                     */
/*                                                                   */
/*  Initialisation:                                                  */
/*            void init_rand ( seed );                               */
/*                 int32 seed     - any positive number               */
/*                                 if seed<=0 init_rand takes time   */
/*                                 from timer instead of seed        */
/*                                                                   */
/*  Whole number uniformly distributed on [0,n):                     */
/*            int32 nrand (n);                                        */
/*                 int32 n                                            */
/*                                                                   */
/*  Real number uniformly distributed on [0,1]                       */
/*            double rand01();                                       */
/*                                                                   */
/*  Real number with Gauss(0,1) disitribution:                       */
/*            double randg01();                                      */
/*                                                                   */
/*  Algorithm:                                                       */
/*            x(n+1) = (x(n) * 5^13) mod 2^31                        */
/*                                                                   */
/*********************************************************************/

let internal_seed: uint32;

void init_rand ( init_seed )

let init_seed: int32;

{ internal_seed = ( init_seed > 0 )
                 ? (uint32) init_seed
                 : (uint32) timer();
                

  /* only odd numbers are acceptable */
  if ( internal_seed % 2 === 0 ) internal_seed --;
}

/*********************************************************************/
/*                                                                   */
/* Internal function  irand  may depend on OS and compiler           */
/*                                                                   */
/* irand assumption:                                                 */
/* i: uint32,j;                                                */
/*   if i*j > max(uint32)                                     */
/*           1. No overflow interruption                             */
/*           2. i*j = i*j mod max(uint32)                     */
/*                                                                   */
/* This assumption is true for a lot of computers.                   */
/* If your computer fails:                                           */
/*   rename: irand <--. xrand                                       */
/*                                                                   */
/*********************************************************************/
 
export const A = 1220703125;
export const B = 2147483647;
export const BF = 2147483647.;

static int32 irand ()

{ internal_seed = ( internal_seed * A ) & B;
  return (int32) internal_seed ;
}

/*********************************************************************/
/*                                                                   */
/*              computer independent variant of  irand               */
/*                                                                   */
/*********************************************************************/


export const T15 = 32768;
export const T16 = 65536;
export const A1 = 37252;
export const A2 = 29589;

static int32 xrand()

{ is1: uint32, is2;

  is1 = internal_seed / T15;
  is2 = internal_seed % T15;

  internal_seed = ( (((is2 * A1) + (is1 * A2))% T16 )* T15 + (is2 * A2) ) & B;
  return (int32) ( internal_seed ) ;
}


/*********************************************************************/


double rand01()

{ return  (double) irand() / BF ;
}
  
/*********************************************************************/

export const NK = 12;

double randg01()

{ i: int16;
  let sum: double = 0;

  for ( i = 0; i < NK; i++ ) sum += rand01();
  return sum - 6.;

  /* if   NK !== 12  then you must return (12/NK)*sum - (NK/2) */
}

#undef NK
     
  
/*********************************************************************/

int32 nrand ( n )

let n: int32;

{ return (int32) ( rand01() * (double) n );
}

/*********************************************************************/

#undef A
#undef A1
#undef A2
#undef B
#undef BF
#undef T15
#undef T16
