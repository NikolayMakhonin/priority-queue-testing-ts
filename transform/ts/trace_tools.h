#ifndef PQ_TRACE_TOOLS
#define PQ_TRACE_TOOLS

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

#include <unistd.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>
import {} from 'typedefs.h'

// operation codes for identification
export const PQ_OP_CREATE = 0;
export const PQ_OP_DESTROY = 1;
export const PQ_OP_CLEAR = 2;
export const PQ_OP_GET_KEY = 3;
export const PQ_OP_GET_ITEM = 4;
export const PQ_OP_GET_SIZE = 5;
export const PQ_OP_INSERT = 6;
export const PQ_OP_FIND_MIN = 7;
export const PQ_OP_DELETE = 8;
export const PQ_OP_DELETE_MIN = 9;
export const PQ_OP_DECREASE_KEY = 10;
export const PQ_OP_MELD = 11;
export const PQ_OP_EMPTY = 12;

/**
 * Contains info about the trace file.  pq_ids and node_ids are the number of
 * unique IDs for the respective pointer types.  Valid IDs are in the 0-(n-1)
 * range, since IDs are used to index into arrays.
 */
export interface pq_trace_header {
    let op_count: uint64;
    let pq_ids: uint32;
    let node_ids: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_create {
    let code: uint32;
    //! specified destination for created pointer
    let pq_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_destroy {
    let code: uint32;
    let pq_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_clear {
    let code: uint32;
    let pq_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_get_key {
    let code: uint32;
    let pq_id: uint32;
    let node_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_get_item {
    let code: uint32;
    let pq_id: uint32;
    let node_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_get_size {
    let code: uint32;
    let pq_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_insert {
    let code: uint32;
    //! queue into which to insert
    let pq_id: uint32;
    //! specified destination for created pointer
    let node_id: uint32;
    //! unique key; ex. actual key in high 32 bits, node_id in low 32 bits
    let key: key_type;
    //! typically the same as node_id
    let item: item_type;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_find_min {
    let code: uint32;
    let pq_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_delete {
    let code: uint32;
    let pq_id: uint32;
    let node_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_delete_min {
    let code: uint32;
    let pq_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_decrease_key {
    let code: uint32;
    let pq_id: uint32;
    let node_id: uint32;
    let key: key_type;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_meld {
    let code: uint32;
    let pq_src1_id: uint32;
    let pq_src2_id: uint32;
    //! id to use for the newly generated heap, i.e. where to store the pointer
    let pq_dst_id: uint32;
} __attribute__ ((packed, aligned(4)));

export interface pq_op_empty {
    let code: uint32;
    let pq_id: uint32;
} __attribute__ ((packed, aligned(4)));

export type pq_trace_header = pq_trace_header;
export type pq_op_create = pq_op_create;
export type pq_op_destroy = pq_op_destroy;
export type pq_op_clear = pq_op_clear;
export type pq_op_get_key = pq_op_get_key;
export type pq_op_get_item = pq_op_get_item;
export type pq_op_get_size = pq_op_get_size;
export type pq_op_insert = pq_op_insert;
export type pq_op_find_min = pq_op_find_min;
export type pq_op_delete = pq_op_delete;
export type pq_op_delete_min = pq_op_delete_min;
export type pq_op_decrease_key = pq_op_decrease_key;
export type pq_op_meld = pq_op_meld;
export type pq_op_empty = pq_op_empty;

/**
 * Dummy struct.  Primarily for use as a placeholder for allocation and to
 * determine op type via the code field.  Should be large enough to encompass
 * any other op struct.
 */
export type pq_op_blank = pq_op_insert;

//==============================================================================
// PUBLIC DECLARATIONS
//==============================================================================

/**
 * Writes a proper trace header with the information specified in the input.
 * Rewinds the file to the beginning before writing.  Recommended use pattern is
 * to write a blank struct at the beginning of trace generation, write all the
 * operations, and then write the actual header.
 *
 * @param file      File to write header to
 * @param header    Header to write
 * @return          0 on success, -1 on error
 */
export function pq_trace_write_header( file: int16, header: pq_trace_header ): int16 ;

/**
 * Reads header from the specified file and writes to passed struct.  Assumes
 * file is currently at beginning.
 *
 * @param file      File to read from.
 * @param header    Address of struct to write header info to
 * @return          0 on success, -1 on error
 */
export function pq_trace_read_header( file: int16, header: pq_trace_header* ): int16 ;

/**
 * Takes any priority queue operation struct and writes to the current position
 * in the input file.  Detects operation type based on code field.
 *
 * @param file  File to write to
 * @param op    Operation to write out
 * @return      0 on success, -1 on error
 */
export function pq_trace_write_op( file: int16, op: void* ): int16 ;

/**
 * Reads an operation from the input file.  Writes to address specified by op.
 * For memory safety, it must be at least as int32 as the longest operation
 * struct.  For any practical key and item types, this will be pq_op_insert.
 *
 * @param file  File to read from
 * @param op    Operation to write out
 * @return      0 on success, -1 on error
 */
export function pq_trace_read_op( file: int16, op: void* ): int16 ;

/**
 * Flushes any outstanding writes to the trace file.  Must be called before
 * closing the file.
 *
 * @param file  File to write to
 */
export function pq_trace_flush_buffer( file: int16 ): int16 ;

#endif
