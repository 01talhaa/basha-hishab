import mongoose from 'mongoose';
import {User,Flat,Tenant,Invoice,Payment,Expense,Settings,Utility,Sharing} from '../src/models';
async function main(){
 if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI required');
 await mongoose.connect(process.env.MONGODB_URI,{autoIndex:false});
 try{
  const collections=[Flat,Tenant,Invoice,Payment,Expense,Settings,Utility,Sharing];
  const legacy=await Promise.all(collections.map(m=>m.countDocuments({ownerId:null})));
  const owners=await User.find({role:'Owner'});
  if(legacy.some(Boolean)||await User.exists({role:'Administrator',ownerId:null})){
   if(owners.length!==1)throw new Error('Legacy records require exactly one existing Owner. Resolve ownership manually before migration; no records changed.');
   const ownerId=owners[0]._id;
   for(const model of collections)await model.collection.updateMany({ownerId:null},{$set:{ownerId}});
   await User.updateMany({role:'Administrator',ownerId:null},{$set:{ownerId}});
   console.log('Legacy records assigned to the existing owner.');
  }
  // Create the replacements first. Remove only the two obsolete global unique indexes.
  await Flat.collection.createIndex({ownerId:1,number:1},{unique:true});
  await Settings.collection.createIndex({ownerId:1,key:1},{unique:true});
  for(const [model,field] of [[Flat,'number'],[Settings,'key']] as const){
   let indexes;try{indexes=await model.collection.indexes()}catch{continue}
   for(const index of indexes)if(index.unique&&Object.keys(index.key).length===1&&index.key[field]===1&&index.name)await model.collection.dropIndex(index.name);
  }
  console.log('Owner isolation indexes ready.');
 }finally{await mongoose.disconnect()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
