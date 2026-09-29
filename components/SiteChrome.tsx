"use client";
import {usePathname} from "next/navigation";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import Concierge from "./Concierge";
export default function SiteChrome({children}:{children:React.ReactNode}){
 const isAdmin=usePathname().startsWith("/admin");
 return <>{!isAdmin&&<SiteHeader/>}{children}{!isAdmin&&<><Footer/><Concierge/></>}</>;
}
