import { Outlet } from "react-router-dom";
import { Topbar } from "@/components/layout/Topbar";
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Topbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}