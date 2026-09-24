import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { Alert, Spinner } from "./components/ui.tsx";
import { canEdit, useApp } from "./store.tsx";
import { Login, Setup } from "./pages/Login.tsx";
import { Master } from "./pages/Master.tsx";
import { Report } from "./pages/Report.tsx";
import { ReportEditor } from "./pages/ReportEditor.tsx";
import { DataPage } from "./pages/Data.tsx";
import { ModelPage } from "./pages/Model.tsx";
import { UsersPage } from "./pages/Users.tsx";
import { Account } from "./pages/Account.tsx";

export function App() {
  const { boot, loading, error } = useApp();
  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner /></div>;
  if (error && !boot) return <div className="mx-auto max-w-lg p-8"><Alert kind="error">No se ha podido conectar: {error}</Alert></div>;
  if (boot?.needsSetup) return <Setup />;
  if (!boot?.user) return <Login />;
  const editor = canEdit(boot);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Master />} />
        <Route path="/informe/:id" element={<Report />} />
        <Route path="/informe/:id/editar" element={editor ? <ReportEditor /> : <Navigate to="/" />} />
        <Route path="/datos" element={editor ? <DataPage /> : <Navigate to="/" />} />
        <Route path="/modelo" element={editor ? <ModelPage /> : <Navigate to="/" />} />
        <Route path="/usuarios" element={boot.user.role === "admin" ? <UsersPage /> : <Navigate to="/" />} />
        <Route path="/cuenta" element={<Account />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
