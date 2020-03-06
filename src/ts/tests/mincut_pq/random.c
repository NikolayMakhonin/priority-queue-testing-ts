import {} from 'random.h'
#include <stdio.h>

/*** This is a portable random number generator whose origins are
 *** unknown.  As far as can be told, this is public domain software.

/*** portable random number generator */

/*** Note that every variable used here must have at least 31 bits
 *** of precision, exclusive of sign.  Long integers should be enough.
 *** The generator is the congruential:  i = 7*[]5 * i mod (2^31-1).
 ***/

export const MULTIPLIER = 16807;
export const MODULUS = 2147483647;

#ifdef NDEBUG
static saved_seed: int32 = 123456; /*default seed*/
static no_seed: int16=0;
#else
static saved_seed: int32;
static no_seed: int16=1;
#endif


/*** set_random - initialize constants and seed */

void SetRandom(seed)
let seed: int32;
{
  saved_seed = seed;
  no_seed=0;
}


/*** random - generate a random integer in the interval [a,b] (b >= a >= 0) */

int32 Random(a, b)
let a: int32, b;
{
  register hi: int32, lo;

#ifndef NDEBUG
  if (no_seed)
    {
      fprintf(stderr,"error:no random seed set\n");
      exit(17);
    }
#endif

  hi = MULTIPLIER * (saved_seed >> 16);
  lo = MULTIPLIER * (saved_seed & 0xffff);
  hi += (lo>>16);
  lo &= 0xffff;
  lo += (hi>>15);
  hi &= 0x7fff;
  lo -= MODULUS;
  if ((saved_seed = (hi<<16) + lo) < 0)
    saved_seed += MODULUS;

  if (b <= a)
    return b;
  return a + saved_seed % (b - a + 1);
}

double DblUnitRandom()
{
  return Random((int32) 0,(int32)MODULUS-1)/((double)MODULUS-1);
}

void RandomPermute(rgi,iMac)
     let iMac: int16;
     int16 rgi[/*iMac*/];
{
  let j: int16,t;
  
  while(--iMac)
    {
      j = Random((int32)0,(int32)iMac);
      t = rgi[j];
      rgi[j] = rgi[iMac];
      rgi[iMac] = t;
    }

}
