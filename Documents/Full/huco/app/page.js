import Image from 'next/image'
import Link from 'next/link'
import Nav from './components/Nav'

export const metadata = {
  title: 'Huco',
  description: 'Learn more about Conscious Expanding and our mission to help people expand their consciousness.',
}

export default function Home() {
  return (
       <div className='bg-white h-screen  '>
        <Nav/>
        <h1 className='text-black' >
          hello
        </h1>
       </div>
  )
}
