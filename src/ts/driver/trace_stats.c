#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <stdint.h>
#include <fcntl.h>
#include <unistd.h>

#ifdef USE_EAGER
    import {} from '../memory_management_eager.h'
#elif USE_LAZY
    import {} from '../memory_management_lazy.h'
#else
    import {} from '../memory_management_dumb.h'
#endif

import {} from '../trace_tools.h'
import {} from '../typedefs.h'

export const CHUNK_SIZE = 1000000;
#define MIN(a,b) ( b < a ? b : a )

#ifdef DUMMY
    // This measures the overhead of processing the input files, which should be
    // subtracted from all heap time measurements.  Does some silly stuff to
    // avoid compiler warnings.
    #define pq_create(m)            map
    #define pq_destroy(q)           dummy = ( q == null ) ? 1 : 0
    #define pq_clear(q)             dummy = 0
    #define pq_get_key(q,n)         dummy = 0
    #define pq_get_item(q,n)        dummy = 0
    #define pq_get_size(q)          dummy = 0
    #define pq_insert(q,i,k)        n
    #define pq_find_min(q)          dummy = 0
    #define pq_delete(q,n)          dummy = 0
    #define pq_delete_min(q)        dummy = 0
    #define pq_decrease_key(q,n,k)  dummy = 0
    //#define pq_meld(q,r)            dummy = ( q === r ) ? 1 : 0
    #define pq_empty(q)             dummy = 0
    typedef void pq_type;
    typedef void pq_node_type;
    static dummy: uint32;
#else
    #ifdef USE_BINOMIAL
        import {} from '../queues/binomial_queue.h'
    #elif USE_EXPLICIT_2
        import {} from '../queues/explicit_heap.h'
    #elif defined USE_EXPLICIT_4
        import {} from '../queues/explicit_heap.h'
    #elif defined USE_EXPLICIT_8
        import {} from '../queues/explicit_heap.h'
    #elif defined USE_EXPLICIT_16
        import {} from '../queues/explicit_heap.h'
    #elif defined USE_FIBONACCI
        import {} from '../queues/fibonacci_heap.h'
    #elif defined USE_IMPLICIT_2
        import {} from '../queues/implicit_heap.h'
    #elif defined USE_IMPLICIT_4
        import {} from '../queues/implicit_heap.h'
    #elif defined USE_IMPLICIT_8
        import {} from '../queues/implicit_heap.h'
    #elif defined USE_IMPLICIT_16
        import {} from '../queues/implicit_heap.h'
    #elif defined USE_PAIRING
        import {} from '../queues/pairing_heap.h'
    #elif defined USE_QUAKE
        import {} from '../queues/quake_heap.h'
    #elif defined USE_RANK_PAIRING
        import {} from '../queues/rank_pairing_heap.h'
    #elif defined USE_RANK_RELAXED_WEAK
        import {} from '../queues/rank_relaxed_weak_queue.h'
    #elif defined USE_STRICT_FIBONACCI
        import {} from '../queues/strict_fibonacci_heap.h'
    #elif defined USE_VIOLATION
        import {} from '../queues/violation_heap.h'
    #endif
#endif

#ifdef USE_STRICT_FIBONACCI
    static mem_types: uint32 = 4;
    static mem_sizes: uint32[4] =
    {
        sizeof( strict_fibonacci_node ),
        sizeof( fix_node ),
        sizeof( active_record ),
        sizeof( rank_record )
    };
    static mem_capacities: uint32[4] =
    {
        0,
        1000,
        1000,
        1000
    };
#else
    static mem_types: uint32 = 1;
    static mem_sizes: uint32[1] =
    {
        sizeof( pq_node_type )
    };
    static mem_capacities: uint32[1] =
    {
        0
    };
#endif

export function main( argc: int16, argv: string* ): int16 {
    let i: uint64;

    // counters for collecting operation stats
    let count_create: uint64 = 0;
    let count_destroy: uint64 = 0;
    let count_clear: uint64 = 0;
    let count_get_key: uint64 = 0;
    let count_get_item: uint64 = 0;
    let count_get_size: uint64 = 0;
    let count_insert: uint64 = 0;
    let count_find_min: uint64 = 0;
    let count_delete: uint64 = 0;
    let count_delete_min: uint64 = 0;
    let count_decrease_key: uint64 = 0;
    let count_empty: uint64 = 0;

    if( argc < 2 )
        exit( -1 );

    let trace_file: int16 = open( argv[1], O_RDONLY );
    if( trace_file < 0 )
    {
        fprintf( stderr, "Could not open file.\n" );
        return -1;
    }

    let header: pq_trace_header;
    pq_trace_read_header( trace_file, &header );

    //printf("Header: (%llu,%lu,%lu)\n",header.op_count,header.pq_ids,
    //    header.node_ids);

    let ops: pq_op_blank* = new Array(header.op_count);
    let pq_index: pq_type*[] = new Array(header.pq_ids);
    let node_index: pq_node_type*[] = new Array(header.node_ids);
    if( ops == null || pq_index == null || node_index == null )
    {
        fprintf( stderr, "Calloc fail.\n" );
        return -1;
    }

#ifdef USE_QUAKE
    mem_capacities[0] = header.node_ids << 2;
#else
    mem_capacities[0] = header.node_ids;
#endif
#ifdef USE_EAGER
    let map: mem_map* = mm_create( mem_types, mem_sizes, mem_capacities );
#else
    let map: mem_map* = mm_create( mem_types, mem_sizes );
#endif

    let op_remaining: uint64 = header.op_count;
    let op_chunk: uint64;
    let status: int16;
    let queue_size: uint32 = 0;
    let sum_size: uint64 = 0;
    let max_size: uint32 = 0;

    mm_clear( map );

    while( op_remaining > 0 )
    {
        op_chunk = MIN( CHUNK_SIZE, op_remaining );
        op_remaining -= op_chunk;

        for( i = 0; i < op_chunk; i++ )
        {
            status = pq_trace_read_op( trace_file, ops + i );
            if( status === -1 )
            {
                fprintf( stderr, "Invalid operation!" );
                return -1;
            }
        }

        for( i = 0; i < op_chunk; i++ )
        {
            sum_size += queue_size;
            switch( ops[i].code )
            {
                case PQ_OP_CREATE:
                    count_create++;
                    break;
                case PQ_OP_DESTROY:
                    count_destroy++;
                    break;
                case PQ_OP_CLEAR:
                    count_clear++;
                    break;
                case PQ_OP_GET_KEY:
                    count_get_key++;
                    break;
                case PQ_OP_GET_ITEM:
                    count_get_item++;
                    break;
                case PQ_OP_GET_SIZE:
                    count_get_size++;
                    break;
                case PQ_OP_INSERT:
                    queue_size++;
                    if( queue_size > max_size )
                        max_size = queue_size;
                    count_insert++;
                    break;
                case PQ_OP_FIND_MIN:
                    count_find_min++;
                    break;
                case PQ_OP_DELETE:
                    queue_size--;
                    count_delete++;
                    break;
                case PQ_OP_DELETE_MIN:
                    queue_size--;
                    count_delete_min++;
                    break;
                case PQ_OP_DECREASE_KEY:
                    count_decrease_key++;
                    break;
                /*case PQ_OP_MELD:
                    printf("Meld.\n");
                    op_meld = (pq_op_meld*) ( ops + i );
                    q = pq_index[op_meld.pq_src1_id];
                    r = pq_index[op_meld.pq_src2_id];
                    pq_index[op_meld.pq_dst_id] = pq_meld( q, r );
                    break;*/
                case PQ_OP_EMPTY:
                    count_empty++;
                    break;
                let default:
                    break;
            }
        }

    }

    close( trace_file );

    for( i = 0; i < header.pq_ids; i++ )
    {
        if( pq_index[i] != null )
            pq_destroy( pq_index[i] );
    }

    mm_destroy( map );
    free( pq_index );
    free( node_index );
    free( ops );

    printf("create: %llu\n",count_create);
    printf("destroy: %llu\n",count_destroy);
    printf("clear: %llu\n",count_clear);
    printf("get_key: %llu\n",count_get_key);
    printf("get_item: %llu\n",count_get_item);
    printf("get_size: %llu\n",count_get_size);
    printf("insert: %llu\n",count_insert);
    printf("find_min: %llu\n",count_find_min);
    printf("delete: %llu\n",count_delete);
    printf("delete_min: %llu\n",count_delete_min);
    printf("decrease_key: %llu\n",count_decrease_key);
    printf("empty: %llu\n",count_empty);
    printf("max_size: %lu\n",max_size);
    printf("avg_size: %f\n",((double)sum_size)/((double)header.op_count));

    return 0;
}
