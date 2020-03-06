/**************************************************

  dimacs_input.h

  definitions and prototypes for formatted
  input to a DIMACS priority queue generator

**************************************************/
typedef cmdtype: char[5];
typedef cmd2type: char[3];
 
export const init_cmd = 1;
export const reps_cmd = 2;
export const with_cmd = 3;
export const seed_cmd = 4;
export const comm_cmd = 5;
export const prio_cmd = 6;
export const ins_cmd = 1;
export const dcr_cmd = 2;
export const dcr_min_cmd = 3;
export const fmn_cmd = 4;
export const dmn_cmd = 5;
