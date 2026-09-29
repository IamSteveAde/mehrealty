import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
const key=()=>new TextEncoder().encode(process.env.SESSION_SECRET || "development-only-secret-change-before-production-123456");
export async function setSession(id:string){const token=await new SignJWT({sub:id}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key());(await cookies()).set("meh_session",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800});}
export async function getSession(){const token=(await cookies()).get("meh_session")?.value;if(!token)return null;try{const {payload}=await jwtVerify(token,key());return payload.sub || null;}catch{return null;}}
export async function clearSession(){(await cookies()).delete("meh_session");}