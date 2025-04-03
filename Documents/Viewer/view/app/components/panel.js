"use client";

import React from "react";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Modal from "antd/es/modal/Modal";
import { UserIcon } from "@heroicons/react/24/solid";
import { Picker } from 'emoji-mart';
import { useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { storage } from "@/firebase";
import { getDownloadURL, uploadString } from "firebase/storage";
import db from "../../firebase";

function Panel(){
    const [elements , setElements] = useState(false);
    const [ open , setOpen ] = useState(false);
    const [name , setName] = useState("");
    const [confirmLoading, setConfirmLoading] =  useState(false);
    const[brief , setBrief] = useState("");
    const fileref = useRef(null);
    const[pic ,setPic ] = useState(null);

    const addprofile =  async() => {
      const docref = await addDoc(collection(db,'profiles'),{
        name: name,
        description : brief,
        timestamp: serverTimestamp(),  
      });
      const imageRef = ref(storage,`profiles/${docref.id}/image`);
           if(pic){
            await uploadString(imageRef,pic,"data_url").then(async() => {
               const downloadURL = await getDownloadURL(imageRef); 

                 await updateDoc(doc(db,"profiles", docref.id ),{
                   image: downloadURL,
                 });
            });
           }
        setOpen(false);
        setPic(null);
    }

    const addpic = (e) => {
       const reader = new FileReader();
       if(e.target.files[0]){
         reader.readAsDataURL(e.target.files[0])
       }
       reader.onload = (readerEvent) => {
        setPic(readerEvent.target.result);
       };
    };

    return(
       <div>
          {open && 
            <Modal
              centered
              confirmLoading={confirmLoading}
              onCancel={ () => setOpen(false)}
              open = {open}
              footer={[
                <button key="create-button" onClick={addprofile} >
                    create 
                </button>
              ]}
            >
              {  pic ? (
                     <img
                       src={pic}
                       alt=""
                       className="rounded-2xl max-h-80 object-contain"
                     />
                  ) : (
                 <div onClick={() => fileref.current.click()}>
                  <UserIcon className="h-6 w-6" />
                 <input
                 type="file"
                 hidden
                 onChange={addpic}
                 ref={fileref}
                 />
                 </div>
                 ) }
               
          
            <form className="flex flex-col" >
                <input
                  type="text"
                  placeholder="person name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                  <input
                   type="text"
                   placeholder="Description"
                   value={brief}
                   onChange={(e) => setBrief(e.target.value)}
                  />
            </form>            
            </Modal>}
          <div className="p-10" >
          <button className="bg-black rounded p-3" onClick={() => setElements(true)}>
                Admin
          </button>
          </div>
          <div className="panel  y-overflow-scroll">
             
          </div>
          {elements && 
            <PlusCircleIcon className="h-6 w-6 text-black" onClick={() => setOpen(true)}/>
          }
       </div>
    )
}

export default Panel; 