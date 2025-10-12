import { BrowserRouter, Route, Routes } from "react-router-dom";
import Editor from "./pages/editor";
import RoutesList from "./pages/routesList";
import Dashboard from "./pages/dashboard";
import AppConfig from "./pages/appconfig";
import IntegrationsLayout from "./components/layout/integrations";
import DatabaseIntegrationsLayout from "./components/layout/integrations/databaseIntegrationsLayout";
import PostgresDatabaseIntegration from "./pages/integrations/database/postgres";
import MongoDBDatabaseIntegration from "./pages/integrations/database/mongodb";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/editor/:routeId" element={<Editor />} />
        <Route path="/routes" element={<RoutesList />} />
        <Route path="/appconfig" element={<AppConfig />} />
        <Route path="/integrations" element={<IntegrationsLayout />}>
          <Route path="database" element={<DatabaseIntegrationsLayout />}>
            <Route path="postgres" element={<PostgresDatabaseIntegration />} />
            <Route path="mongodb" element={<MongoDBDatabaseIntegration />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
