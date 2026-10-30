import {Flat,Tenant,Invoice,Payment,Expense,Settings,Utility,Sharing} from '@/models';
import type {Model} from 'mongoose';
// All owner-owned access goes through this boundary; incoming ownerId is ignored.
function scope<T extends Model<any>>(model:T,ownerId:string):T{
 const filter=(value:Record<string,unknown>={})=>({...value,ownerId});
 const stamp=(value:Record<string,unknown>)=>({...value,ownerId});
 return new Proxy(model,{get(target,key){
  if(key==='findById')return (id:unknown,...rest:unknown[])=>target.findOne(filter({_id:id}),...rest as []);
  if(key==='create')return (values:any,...rest:any[])=>Reflect.apply(target.create,target,[Array.isArray(values)?values.map(stamp):stamp(values),...rest]);
  if(key==='insertMany')return (values:any[],...rest:any[])=>Reflect.apply(target.insertMany,target,[values.map(stamp),...rest]);
  if(['find','findOne','exists','countDocuments','deleteOne','deleteMany','updateOne','updateMany','findOneAndUpdate','findOneAndDelete'].includes(String(key)))return (query:Record<string,unknown>,...rest:unknown[])=>Reflect.apply(Reflect.get(target,key) as Function,target,[filter(query),...rest]);
  const value=Reflect.get(target,key);return typeof value==='function'?value.bind(target):value;
 }});
}
export function ownerModels(ownerId:string){return {Flat:scope(Flat,ownerId),Tenant:scope(Tenant,ownerId),Invoice:scope(Invoice,ownerId),Payment:scope(Payment,ownerId),Expense:scope(Expense,ownerId),Settings:scope(Settings,ownerId),Utility:scope(Utility,ownerId),Sharing:scope(Sharing,ownerId)}}
export function ownerCollections(ownerId:string){const m=ownerModels(ownerId);return {flats:m.Flat,tenants:m.Tenant,invoices:m.Invoice,payments:m.Payment,expenses:m.Expense,settings:m.Settings,utilities:m.Utility,shares:m.Sharing}}
