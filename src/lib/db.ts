import mongoose from 'mongoose';
let connection:Promise<typeof mongoose>|undefined;
export async function db(){if(!process.env.MONGODB_URI)throw new Error('প্রথমে MongoDB সংযোগ সেট করুন।');connection??=mongoose.connect(process.env.MONGODB_URI).catch(e=>{connection=undefined;throw e});return connection}
