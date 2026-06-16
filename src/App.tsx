import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/store/AppContext";
import { UIProvider } from "@/store/UIContext";
import { ToastProvider } from "@/store/ToastContext";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { LoginPage } from "@/pages/LoginPage";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { AgendaPage } from "@/pages/AgendaPage";
import { PatientsPage } from "@/pages/PatientsPage";
import { PatientDetailPage } from "@/pages/PatientDetailPage";
import { TreatmentsPage } from "@/pages/TreatmentsPage";
import { CashPage } from "@/pages/CashPage";
import { SettlementsPage } from "@/pages/SettlementsPage";
import { ExpensesPage } from "@/pages/ExpensesPage";
import { InventoryPage } from "@/pages/InventoryPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { GuidePage } from "@/pages/GuidePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function ProtectedApp() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  return (
    <AppProvider>
      <UIProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="pacientes" element={<PatientsPage />} />
            <Route path="pacientes/:id" element={<PatientDetailPage />} />
            <Route path="tratamientos" element={<TreatmentsPage />} />
            <Route path="caja" element={<CashPage />} />
            <Route path="liquidaciones" element={<SettlementsPage />} />
            <Route path="egresos" element={<ExpensesPage />} />
            <Route path="inventario" element={<InventoryPage />} />
            <Route path="reportes" element={<ReportsPage />} />
            <Route path="guia" element={<GuidePage />} />
            <Route path="configuracion" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </UIProvider>
    </AppProvider>
  );
}

function LoginRoute() {
  const { session } = useAuth();
  if (session) return <Navigate to="/" replace />;
  return <LoginPage />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}
