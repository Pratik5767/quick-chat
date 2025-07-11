import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

    const { getUsers, users, selectedUser, setSelectedUser, unSeenMessages, setUnSeenMessages } = useContext(ChatContext);
    const navigate = useNavigate();
    const { logOut, onlineUsers } = useContext(AuthContext);
    const [input, setInput] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const filteredUsers = input ?
        users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 770);
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        if (isMobile) {
            setShowMenu(!showMenu);
        }
    }

    return (
        <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
            <div className='pb-5'>
                <div className='flex justify-between items-center'>
                    <img className='max-w-40' src={assets.logo} alt='logo' />

                    <div className='relative py-2 group'>
                        <div onClick={toggleMenu}>
                            <img className='max-h-5 cursor-pointer' src={assets.menu_icon} alt='menu' />
                        </div>

                        <div className={`absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 ${isMobile ? (showMenu ? 'block' : 'hidden') : 'hidden group-hover:block'}`}>
                            <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>
                                Edit Profile
                            </p>
                            <hr className='my-2 border-t border-gray-500' />

                            <p onClick={() => logOut()} className='cursor-pointer text-sm'>Logout</p>
                        </div>
                    </div>
                </div>

                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                    <img className='w-3' src={assets.search_icon} alt='search' />

                    <input
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                        className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
                        placeholder='Seach User...'
                    />
                </div>
            </div>

            <div className='flex flex-col'>
                {
                    filteredUsers.map((user, index) => (
                        <div
                            onClick={() => {
                                setSelectedUser(user);
                                setUnSeenMessages(prev => ({ ...prev, [user._id]: 0 }))
                            }}
                            key={index}
                            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}
                        >
                            <img className='w-[35px] aspect-[1/1] rounded-full' src={user?.profilePic || assets.avatar_icon} alt='' />

                            <div className='flex flex-col leading-5'>
                                <p>{user.fullName}</p>

                                {
                                    onlineUsers.includes(user._id) ? <span className='text-green-400 text-xs'>
                                        Online
                                    </span> : <span className='text-neutral-400 text-xs'>
                                        Offline
                                    </span>
                                }
                            </div>

                            {
                                unSeenMessages?.[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unSeenMessages[user._id]}</p>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar