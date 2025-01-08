import { ArrowCircleRightIcon, ArrowLeftIcon, ArrowRightIcon, FolderIcon, PaperAirplaneIcon, PlusCircleIcon ,PlusIcon  } from "@heroicons/react/solid";
import { Popover } from "@nextui-org/react";
import { useRef, useState , useEffect } from "react";
import { db  } from '../../firebase';
import { addDoc , collection , serverTimestamp , onSnapshot, orderBy ,  query ,doc , updateDoc } from "firebase/firestore";
import { useSession  } from "next-auth/react";
import Tip from "./Tip";
import {useRouter} from "next/navigation";
import { Modal,Button } from "antd";


function SystemInput(){
    const router =  useRouter();
    const [hasOpened, setHasOpened] = useState(false);
    const { data: session } = useSession();
    const [inat, setInat]  = useState('');
    const [ open,setOpen ] = useState(false);
    const [chat, setChat] = useState(false);
    const [input, setInput] = useState('');
    const [intip, setIntip ] = useState('');
    const tipRef = useRef(null);
    const [tips, setTips] = useState([]);
    const [showIcon, setShowIcon] = useState(true);
    const [showSegment, setShowSegment ] = useState(true);
    const [count, setCount] = useState(1);
    const [newName, setNewName] = useState(''); 
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [confirmLoading, setConfirmLoading] =  useState(false);
    const [modalText, setModalText] = useState('Name a System');

   const showchat = () => {
     setChat(true);
     setShowSegment(false);
   } 

   const modelen = (e) => {
      setInput(e.target.value);
      setOpen(true);
     if(hasOpened){
      setOpen(false);
     } else {
      setHasOpened(true);
     }
   }


    const createsystem =  async () => {
      if (collectionName) {
        await addDoc(collection(db, collectionName), {
          // Add the data you want to store in the collection
        });
      }
      {
        setModalText('creating...');
        setConfirmLoading(true);
        setTimeout(() => {
          setOpen(false);
          setConfirmLoading(false);
        }, 2000);
      setCount(count);
    }}

    const sendsystem =  () => {
      setShowSegment(false);
      }
  
      useEffect(() => {
        if (collectionName) {
          const q = query(collection(db, collectionName), orderBy("timestamp", "asc"));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            setTips(snapshot.docs);
          });
      
          return () => {
            unsubscribe();
          };
        }
      }, [collectionName]);
      


    const scrollToBottom = (e) => {
        tipRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    };
    const sendUser = async () => {
        const docRef = await addDoc(collection(db, collectionName),{
            usertip : input,
            email: session?.user?.email,
            timestamp: serverTimestamp(),     
        }); 
           }
    const sendMe = async () => {
      const docRef = await addDoc(collection(db, collectionName),{
        Mytip : input,
        email: session?.user?.email,
        timestamp: serverTimestamp(),     
    });
       } 
   
       const sendMessage = async () => {
        try {
            const url =  ' http://127.0.0.1:8000/api/chatbot';
            const data = { message: message, collection: collectionName };
            console.log("Sending message to server:", data);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonResponse = await response.json();
            console.log("Server response:", jsonResponse);
            setResponse(jsonResponse.response);

            await addDoc(collection(db, 'chat'), {
                user: message,
                system: jsonResponse.response,
                email: session?.user?.email,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

       const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
      
    return(
      <>
      <Modal
        centered
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        open={open}
        footer={[
                    <button 
                           className="bg-black text-white rounded-full px-4
                          py-1.5 font-bold shadow-md hover:bg-black 
                          disabled:hover:bg-grey disabled:opacity-50
                          disabled:cursor-default"
                          disabled={!input.trim()}
                          onClick={createsystem}
                        >
                            Proceed
                        </button>
        ]}
      >
        <p>{modalText}</p>
        <form>
           <input
             value={collectionName}
             onChange={(e) => setCollectionName(e.target.value)}
             />
        </form>
        
      </Modal>
        <div className="flex flex-col h-screen">
          <header className="flex items-center justify-between space-x-5 border-b border-gray-800 p-4 mt-1">
          {showIcon && (
            <div className=" flex space-x-5 " >
            {[...Array(count)].map((_, index) => (
             <FolderIcon key={index}  onClick={showchat}
             className="h-6 w-6  text-[#b1afaf] disabled:text-[#40444b] hover:text-white "
              disabled = {!showSegment}
             />
             ))}
             <PlusIcon onClick={createsystem} className="h-6 w-6 text-[#b1afaf] " />
             </div>
             )}
           
          
          </header>
       
        {showSegment && (
          <>
        <main className="flex-grow overflow-y-scroll scrollbar-hide">
            <div>
        {tips.map((tip) => (
            <Tip key={tip.id} id={tip.id} tip={tip.data()} />
            ))} 
            <div ref={tipRef} className="pb-16"/>
            </div>
        </main>
        
        <div className="flex  items-center p-2.5 fixed bottom-0 left-30 w-3/4 bg-[#40444b] py-4 mx-5 mb-7 rounded-lg ">
             <form className="flex-grow">
                <input
                      value={input} 
                      onChange={modelen}
                className="bg-transparent focus:outline-none flex-1 flex-grow w-full  font-20px
                disabled:cursor-not-allowed  disabled:text-white-300 text-white" 
                type="text"
                 placeholder="create"
                 />
             </form>
             <ArrowLeftIcon className="h-6 w-6 text-[#b1afaf]   mr-2" onClick={sendUser}/>
             <ArrowRightIcon className="h-6 w-6 text-[#b1afaf]   mr-2" onClick={sendMe}/>
        </div>
      
        </>
        )}
        {chat &&(
          <>
          <main className="flex-grow overflow-y-scroll scrollbar-hide" >
            <p className="text-white">{response}</p>
          </main>
          <div className="flex items-center p-2.5 bg-[#40444b] mx-5 mb-7 rounded-lg object-contain">
             <form className=" flex-grow "  >
                <input
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                className="bg-transparent focus:outline-none flex-1 flex-grow w-full  font-20px
                disabled:cursor-not-allowed  disabled:text-white-300 text-white" 
                type="text"
                 placeholder="chat"
                 />
             </form>
             <div>
             <PaperAirplaneIcon onClick={sendMessage} 
               className="h-6 w-6 navbtn" />
               </div>
          </div>
          </>
        )}
        </div>
        </>
    );
}
export default SystemInput;