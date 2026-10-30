import {connect,disconnect} from 'mongoose';
import {hash} from 'bcryptjs';
import {User} from '../src/models';
import {createInterface} from 'node:readline/promises';
// Run with node --env-file=.env.local --import tsx scripts/create-owner.ts
async function main(){
const rl=createInterface({input:process.stdin,output:process.stdout});
try{if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI required');const email=await rl.question('Owner email: ');const password=await rl.question('New password (visible; use a private terminal, at least 12 characters): ');if(password.length<12)throw new Error('Password too short');await connect(process.env.MONGODB_URI);if(await User.exists({email:email.toLowerCase().trim()}))throw new Error('Owner already exists');await User.create({email:email.toLowerCase().trim(),password:await hash(password,12),role:'Owner'});console.log('Owner created')}finally{rl.close();await disconnect()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
