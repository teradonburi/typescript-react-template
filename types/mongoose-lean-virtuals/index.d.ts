import { Schema } from 'mongoose'

// moongoose-lean-virtualsライブラリの型定義がないので書く
declare function mongooseLeanVirtuals(schema: Schema): void;
export = mongooseLeanVirtuals;
