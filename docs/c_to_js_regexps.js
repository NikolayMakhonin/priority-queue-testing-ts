function addRule(search, replace) {
	new RegExp(search, 'sgm')
}

const primitives = `(?:\\b(?:u?int(?:_least|_fast)?(?:8|16|32|64)_t|size_t|(?:(?:un)?signed +)?(?:char|double|float|bool|(?:long|short)(?: +int)?))\\b)`

// import
addRule(
	`#include\\s+["']([^'"]+)['"];?`,
	`import \{\} from '$1'`,
)

// ->
addRule(
	`->`,
	`.`,
)

// function
addRule(
	`^(static\\s+)?([\\w<>]+)((\\*+) +| +(\\*+))([\\w<>]+)\\s*(\\([^\\)\\{;]+\\))\\s*(;|\\{)`,
	`export function $6$7: $2$4$5 $8`,
)

// calloc -> new Array<>
addRule(
	`\\(\\s*([\\w<>]+)\\**\\s*\\)\\s*calloc\\s*\\(\\s*([^;]+?)\\s*,[^;,]+;`,
	`new Array<$1>($2);`,
)

// calloc -> new Array
addRule(
	`\\bcalloc\\s*\\(\\s*([^;]+?)\\s*,[^;,]+;`,
	`new Array($1);`,
)

// malloc -> new Array<>
addRule(
	`\\bmalloc\\s*\\(\\s*([^;\\*]+?)\\s* +\\* +sizeof\\s*\\(\\s*([^\\);]+?)\\s*\\)\\s*\\)\\s*;`,
	`new Array<$2>($1);`,
)

// malloc -> new object
addRule(
	`\\bmalloc\\s*\\(\\s*sizeof\\s*\\(\\s*([^\\);]+?)\\s*\\)\\s*\\)\\s*;`,
	`new $1\\(\\)`,
)

// malloc -> new Array
// addRule(
// 	`\\bmalloc\\s*\\(\\s*([^;\\*]+?)\\s* +\\* +[^;,]+;`,
// 	`new Array($1);`,
// )

// null
addRule(
	`\\bNULL\\b`,
	`null`,
)

// ===
addRule(
	`([^=])([!=]=)([^=])`,
	`$1$2=$3`,
)

// == null
addRule(
	`([!=]=)=(\\s*null)`,
	`$1$2`,
)

// null ==
addRule(
	`(null\\s*)([!=]=)=`,
	`$1$2`,
)

// variables or arguments declarations
addRule(
	`\\b(?:([\\w+]+)(?:(\\*+) +| +(\\*+))|([\\w+]+_[\\w+]+|${primitives}) +)(\\w+)((?:\\[\\w*\\])+)?(\\s*)([;,\\)]|=[^=;]+;)`,
	`$5: $1$2$3$4$6$7$8`,
)

// add let to variables declarations
addRule(
	`^(\\s*)(\\w+:\\s*\\w+[^;\\}\\{:]+;)`,
	`$1let $2`,
)

// fix variables declarations
addRule(
	`(,\\s*)\\*+(\\w+)`,
	`$1$2`,
)

// typedef
addRule(
	`typedef(\\s+struct)?\\s+([\\w]+)\\s*:\\s*([\\w\\[\\]]+)\\s*;`,
	`export type $2 = $3;`,
)

// delete pointer*
addRule(
	`(\\w)\\*+`,
	`$1`,
)

// define const
addRule(
	`#define +(\\w+) +([\\w\\.]+)`,
	`export const $1 = $2;`,
)

// typedef struct
addRule(
	`typedef\\s+\\bstruct +([\\w<>]+)\\s*(\\{[^\\}]+\\})\\s*(\\w+)\\s*;{`,
	`export interface $3 $2`,
)

// struct
addRule(
	`\\bstruct +([\\w<>]+)\\s*\\{`,
	`export interface $1 \\{`,
)

// struct align
addRule(
	`\\s*__attribute__ *\\(+ *aligned\\(+\\w+\\)+\\s*;`,
	`;`,
)

// char* to string
addRule(
	`\\bchar\\*`,
	`string`,
)

// primitive* to array
// ((?:\b(?:u?int(?:_least|_fast)?(?:8|16|32|64)_t|size_t|(?:(?:un)?signed +)?(?:char|double|float|bool|(?:long|short)(?: +int)?))\b))\*
addRule(
	`(${primitives})\\*`,
	`$1\\[\\]`,
)

// **** to *[][][]
addRule(
	`(\\w\\*)\\*\\*\\*([^\\*/])`,
	`$1\\[\\]\\[\\]\\[\\]$2`,
)

// *** to *[][]
addRule(
	`(\\w\\*)\\*\\*([^\\*/])`,
	`$1\\[\\]\\[\\]$2`,
)

// ** to *[]
addRule(
	`(\\w\\*)\\*([^\\*/])`,
	`$1\\[\\]$2`,
)

// bool to boolean
addRule(
	`\\bbool\\b`,
	`boolean`,
)

// int
addRule(
	`\\b(u?int)(?:_least|_fast)?(8|16|32|64)_t\\b`,
	`$1$2`,
)

// int
addRule(`\\b(long +long +unsigned +int|unsigned +long +long( +int)?)\\b`, `uint64`)
addRule(`\\b(long +long +signed +int|(signed +)?long +long( +int)?)\\b`, `int64`)
addRule(`\\b(long +unsigned +int|unsigned +long( +int)?)\\b`, `uint32`)
addRule(`\\b(long +signed +int|(signed +)?long( +int)?)\\b`, `int32`)
addRule(`\\b(short +unsigned +int|unsigned +(short( +int)?|int))\\b`, `uint16`)
addRule(`\\b(short +signed +int|(signed +)?(short( +int)?|int))\\b`, `int16`)
addRule(`\\b(unsigned +char)\\b`, `uint8`)
addRule(`\\b(signed +char)\\b`, `int8`)

// size
addRule(`\\bsize_t\\b`, `uint32`)
addRule(`\\bssize_t\\b`, `int32`)

// region specific

// #define ITEM_ASSIGN(a,b) ( a = b )
addRule(
	`\\bITEM_ASSIGN\\s*\\(\\s*([^,]+?)\\s*,\\s*([^\\)]+?)\\s*\\)\\s*;`,
	`$1 = $2;`,
)

// struct as object
addRule(
	`\b(implicit_heap|implicit_node|mem_map)\\*`,
	`$1`,
)

// endregion

/* manually:
[^/=*\.]/[^/=*\.]
add convert to int for div: (a/b)|0


 */