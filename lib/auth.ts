import { db } from "./db";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
const key=()=>{
 const secret=process.env.SESSION_SECRET;
 if(!secret || secret.length<32)throw new Error("SESSION_SECRET must contain at least 32 characters");
 return new TextEncoder().encode(secret);
};
export async function setSession(id:string){const token=await new SignJWT({sub:id}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key());(await cookies()).set("meh_session",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800});}
export async function getSession(){const token=(await cookies()).get("meh_session")?.value;if(!token)return null;try{const {payload}=await jwtVerify(token,key());if(!payload.sub)return null;const user=await db.user.findUnique({where:{id:payload.sub},select:{id:true}});return user?.id || null;}catch{return null;}}
export async function clearSession(){(await cookies()).delete("meh_session");}