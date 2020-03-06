function addRule(search, replace) {
	new RegExp(search, 'sgm')
}

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
	`\\b(([\\w+]+)((\\*+) +| +(\\*+))|([\\w+]+_[\\w+]+|\\b((un)?signed +)?(char|double|float|bool|long +int|short +int|long|short|int)\\b) +)(\\w+)((\\[\\w*\\])+)?(\\s*)([;,\\)]|=[^=;]+;)`,
	`$10: $2$4$5$6$11$13$14`,
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
addRule(
	`\\b((un)?signed +)?(char|double|float|bool|long +int|short +int|long|short|int)\\b\\*`,
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

// region specific

// #define ITEM_ASSIGN(a,b) ( a = b )
addRule(
	`\\bITEM_ASSIGN\\s*\\(\\s*([^,]+?)\\s*,\\s*([^\\)]+?)\\s*\\)\\s*;`,
	`$1 = $2;`,
)

// struct as object
addRule(
	`(implicit_heap|implicit_node)\\*`,
	`$1`,
)

// endregion

/* manually:
[^/=*\.]/[^/=*\.]
add convert to int for div: (a/b)|0


 */