import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavigation } from "./MobileNavigation";
import { NewIncomeWizard } from "@/components/treatments/NewIncomeWizard";

export function AppLayout() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-clip bg-surface-muted">
      <Sidebar />
      <MobileSidebar open={mobileMenu} onClose={() => setMobileMenu(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setMobileMenu(true)} />
        <main className="min-w-0 flex-1 overflow-x-clip px-4 pb-24 pt-5 sm:px-6 lg:pb-8">
          <div className="mx-auto w-full max-w-[1400px] min-w-0 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNavigation onMore={() => setMobileMenu(true)} />
      <NewIncomeWizard />
    </div>
  );
}
