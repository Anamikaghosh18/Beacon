import { Sidebar } from "./Sidebar"
import { TopNavbar } from "./TopNavbar"

export function Layout({ children }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-textPrimary selection:bg-primary/20">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
