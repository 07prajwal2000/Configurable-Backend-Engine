import { createBrowserRouter } from "react-router-dom";
import Editor from "./pages/editor";
import RoutesList from "./pages/routesList";
import Dashboard from "./pages/dashboard";
import AppConfig from "./pages/appconfig";
import DeploymentConfig from "./pages/deploymentConfig";

export const browserRoutes = createBrowserRouter([
  {
    path: "/editor/:routeId",
    Component: Editor,
  },
  {
    path: "/routes",
    Component: RoutesList,
  },
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/appconfig",
    Component: AppConfig,
  },
  {
    path: "/deploy-config",
    Component: DeploymentConfig,
  },
]);
