import { useState } from 'react'
import { Link } from 'react-router-dom'
import { headerData } from '../data/headerData.js'
import coffeeLogo from '../images/coffeeLogo.svg'
import DropDownBtn from '../ui/DropDownBtn.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  const links = [
    ...headerData.filter((item) => item.path !== '/login'),
    ...(loading ? [] : user ? [{ title: 'Профиль', path: '/profile' }] : [
      { title: 'Войти', path: '/login' }, { title: 'Регистрация', path: '/signup' },
    ]),
  ]
  const items = links.map((item) => <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>{item.title}</Link>)
  const logoutButton = user && !loading && <button onClick={() => logout().catch(() => {})}>Выйти</button>

  return <header className="bg-yellow-300 px-5 py-5">
    <nav className={`relative grid grid-cols-[auto_1fr_auto] items-center bg-white px-4 lg:px-15 md:grid-cols-[1fr_auto_1fr] ${open ? 'rounded-t-4xl rounded-b-none' : 'rounded-4xl'}`}>
      <Link to="/" aria-label="Steppe Coffee"><img src={coffeeLogo} alt="Steppe Coffee" /></Link>
      <div className="hidden justify-center gap-x-4 pr-2 md:flex">{items}</div>
      <div className="hidden justify-end gap-x-3 md:flex"><DropDownBtn>рус</DropDownBtn>{logoutButton}</div>
      <button aria-label="Открыть меню" className="justify-self-end md:hidden" onClick={() => setOpen(!open)}>☰</button>
      {open && <div className="absolute left-0 top-full z-10 flex w-full flex-col gap-3 rounded-b-4xl bg-white pb-3 pl-4 md:hidden">
        <div className="flex flex-col">{items}</div>
        <div className="flex gap-x-4"><DropDownBtn>рус</DropDownBtn>{logoutButton}</div>
      </div>}
    </nav>
  </header>
}
