import React from 'react'
import Navbar from './Navbar'
import { Search } from './Search'
import Chats from './Chats'


export const SideBar = () => {
  return (
    
        <div className='flex flex-col basis-1/4 bg-[#3e3c61]'>
 <Navbar />
 <Search />
<Chats />
    </div>
  )
}
