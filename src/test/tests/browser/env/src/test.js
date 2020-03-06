/* eslint-disable no-shadow */
const x = {}
export const test = Array.from((Object.assign(x, {x: {y: [['test']]}}))?.x?.y)?.flatMap(o => o)?.[0]
