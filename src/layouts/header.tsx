import { useState, useEffect, useRef } from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { FaGoogle, FaFacebook, FaYoutube, FaClock, FaSteam, FaEnvelope } from "react-icons/fa";

const style = {
    'flex-center': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        gap: '20px'
    }
}

const Header = () => {
    const [time, setTime] = useState('')
    const searchInput = useRef<HTMLInputElement>(null)

    const pad = (n: number) => n < 10 ? `0${n}` : n

    const realTime = () => {
        const date = new Date()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()

        setTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
    }

    useEffect(() => {
        searchInput.current?.focus()

        // add event listener on keydown for search input ctrl + space
        const searchInputKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.code === 'Space') {
                searchInput.current?.focus()
            }
        }
        window.addEventListener('keydown', searchInputKeyDown)

        const interval = setInterval(realTime, 1000)
        return () => {
            clearInterval(interval)
            window.removeEventListener('keydown', searchInputKeyDown)
        }
    }, [])

    return (
        <header>
            <div className="header">
                <div style={style['flex-center']}>
                    <div className="logo">
                        <MdOutlineDashboard />
                        Kanban Apps
                    </div>
                    <form className='search' action='https://google.com/search' method='get'>
                        <input ref={searchInput} type="text" placeholder="Search" name="q" />
                    </form>
                </div>

                <div style={style['flex-center']}>
                    {/* Apps */}
                    <div className='apps'>
                        {/* Google */}
                        <a href='https://google.com' className='red'>
                            <FaGoogle />
                        </a>

                        {/* Gmail */}
                        <a href='https://mail.google.com/mail/u/0/#inbox' className='green'>
                            <FaEnvelope />
                        </a>

                        {/* Facebook */}
                        <a href='https://facebook.com' className='blue'>
                            <FaFacebook />
                        </a>
                        {/* Youtube */}
                        <a href='https://youtube.com' className='red'>
                            <FaYoutube />
                        </a>
                        {/* Steam */}
                        <a href='https://store.steampowered.com/' className='blue'>
                            <FaSteam />
                        </a>
                    </div>

                    {/* Time */}
                    <div className='time' style={{ width: '100px' }}><FaClock /> {time !== '' ? time : '00:00:00'}</div>
                </div>
            </div>
        </header>
    )
}

export default Header