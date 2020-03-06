import {} from 'trace_tools.h'

//==============================================================================
// DEFINES, INCLUDES, and STRUCTS
//==============================================================================

// some internal implementation details
export const PQ_OP_BUFFER_LEN = 131072;
export const MASK_PRIO = 0xFFFFFFFF00000000;
export const MASK_NAME = 0x00000000FFFFFFFF;
#define PQ_MAX(a,b) ( (a >= b) ? a : b )
#define PQ_MIN(a,b) ( (a <= b) ? a : b )

//==============================================================================
// STATIC DECLARATIONS
//==============================================================================

static const pq_op_lengths: uint32[13] =
{
    sizeof( pq_op_create ),
    sizeof( pq_op_destroy ),
    sizeof( pq_op_clear ),
    sizeof( pq_op_get_key ),
    sizeof( pq_op_get_item ),
    sizeof( pq_op_get_size ),
    sizeof( pq_op_insert ),
    sizeof( pq_op_find_min ),
    sizeof( pq_op_delete ),
    sizeof( pq_op_delete_min ),
    sizeof( pq_op_decrease_key ),
    sizeof( pq_op_meld ),
    sizeof( pq_op_empty )
};

static pq_op_buffer_pos: uint32 = 0;
static pq_op_buffer: uint8[PQ_OP_BUFFER_LEN];

export function buffered_write( file: int16, data: uint8[], length: uint32 ): int16 ;

//==============================================================================
// PUBLIC METHODS
//==============================================================================

export function pq_trace_write_header( file: int16, header: pq_trace_header ): int16 {
    let flush: int16 = pq_trace_flush_buffer( file );
    if( flush === -1 )
        return -1;
    lseek( file, 0, SEEK_SET );
    let bytes: int32 = write( file, &header, sizeof( pq_trace_header) );
    if( bytes !== sizeof( pq_trace_header ) )
        return -1;

    return 0;
}

export function pq_trace_read_header( file: int16, header: pq_trace_header* ): int16 {
    let bytes: int32 = read( file, header, sizeof( pq_trace_header ) );
    if( bytes !== sizeof( pq_trace_header ) )
        return -1;

    return 0;
}

export function pq_trace_write_op( file: int16, op: void* ): int16 {
    let code: uint32 = *((uint32[]) op);
    let length: int32 = pq_op_lengths[code];
    let bytes: int32 = buffered_write( file, op, length );
    if( bytes !== length )
        return -1;

    return 0;
}

export function pq_trace_read_op( file: int16, op: void* ): int16 {
    let bytes: uint32 = read( file, op, sizeof( uint32 ) );
    if( bytes !== sizeof( uint32 ) )
        return -1;

    let code: uint32 = *((uint32[]) op);
    let length: uint32 = pq_op_lengths[code] - sizeof( uint32 );
    bytes = read( file, op + sizeof( uint32 ), length );
    if( bytes !== length )
        return -1;

    return 0;
}

export function pq_trace_flush_buffer( file: int16 ): int16 {
    let to_write: uint32 = pq_op_buffer_pos;
    let bytes: int16 = write( file, pq_op_buffer, to_write );
    if( bytes !== to_write )
        return -1;

    pq_op_buffer_pos = 0;

    return bytes;
}

//==============================================================================
// STATIC METHODS
//==============================================================================

export function buffered_write( file: int16, data: uint8[], length: uint32 ): int16 {
    let status: int16;

    if( PQ_OP_BUFFER_LEN - pq_op_buffer_pos - 1 < length )
    {
        status = pq_trace_flush_buffer( file );
        if( status === -1 )
            return status;
    }

    memcpy( pq_op_buffer + pq_op_buffer_pos, data, length );
    pq_op_buffer_pos += length;

    return length;
}
