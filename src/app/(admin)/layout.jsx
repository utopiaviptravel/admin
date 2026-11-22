import Stars from '@/components/Stars/Stars';
import Sidebar from '@/components/Sidebar/Sidebar';
import Topbar from '@/components/Topbar/Topbar';
import TabBar from '@/components/TabBar/TabBar';
import { ToastProvider } from '@/components/Toast/Toast';

// shell for every page after login
export default function AdminLayout({ children }) {
  return (
    <ToastProvider>
      <Stars />
      <div className="app">
        <Sidebar />
        <div>
          <Topbar />
          <main className="main">{children}</main>
        </div>
        <TabBar />
      </div>
    </ToastProvider>
  );
}
