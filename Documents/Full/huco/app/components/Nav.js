"use client";

import { UserIcon } from "@heroicons/react/solid";
import { signIn , useSession } from "next-auth/react";

function Nav(){

    

    return(
       <div className="bg-white text-black p-10" >
        <h1 classname="text-black fixed ">
            Huco
        </h1>

        <UserIcon className="h-6 w-6 fixed top-10 right-10" onClick={signIn} />
       </div>
    )
}

export default Nav;