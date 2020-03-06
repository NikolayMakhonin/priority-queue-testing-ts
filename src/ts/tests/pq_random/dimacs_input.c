#include <stdio.h>
#include <stdlib.h>
#include <string.h>

import {} from 'dimacs_input.h'

cmdtype cmdtable[7]={"null","init","reps","with","seed","comm","prio"};
cmd2type cmd2table[5]={"NUL","ins","dcr","fmn","dmn"};

/*************** cmd_lookup() *****************
* look up init,reps,with,seed,comm commands  */  

export function cmd_lookup(cmdtype cmd): int {
  let i: int;
  let go: int;
  strncpy (cmdtable[0],cmd,4); /*sentinel*/
  go=1;
  for (i=6;go;i--) 
    go=strncmp(cmdtable[i],cmd,3);
  return (i+1);
}
/*************** cmd_lookup2 () ****************/
/* look up 'with' commands                  */
export function cmd_lookup2(cmd2type cmd): int {
  let i: int;
  let go: int;
  strncpy (cmd2table[0],cmd,3); /*sentinel*/
  go=1;
  for (i=4;go;i--) 
    go=strncmp(cmd2table[i],cmd,3);
  return (i+1);
}


