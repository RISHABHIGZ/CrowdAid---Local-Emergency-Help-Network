import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'
import clsx from 'clsx'

export default function AppLayout() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main content */}
      <div className={clsx(
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        open ? 'lg:ml-64' : 'lg:ml-16'
      )}>
        <Topbar onMenuClick={() => setOpen(v => !v)} sidebarOpen={open} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
