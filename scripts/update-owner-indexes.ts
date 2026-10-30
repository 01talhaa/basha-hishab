import mongoose from 'mongoose';
import {Flat,Settings} from '../src/models';
async function main(){if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI required');await mongoose.connect(process.env.MONGODB_URI,{autoIndex:false});try{
 for(const [model,field] of [[Flat,'number'],[Settings,'key']] as const){
  await model.collection.createIndex({ownerId:1,[field]:1},{unique:true});
  for(const index of await model.collection.indexes())if(index.unique&&Object.keys(index.key).length===1&&index.key[field]===1&&index.name){await model.collection.dropIndex(index.name);console.log(`Updated ${model.collection.name}: owner-specific ${field} uniqueness.`)}
 }
 console.log('Both indexes ready. No records changed.');
}finally{await mongoose.disconnect()}}
main().catch(()=>{console.error('Index update failed. No financial records were modified.');process.exitCode=1});
