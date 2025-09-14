import { createBrowserRouter } from "react-router-dom";
import Editor from "./pages/editor";
import RoutesList from "./pages/routesList";

export const browserRoutes = createBrowserRouter([
  {
    path: "/editor/:routeId",
    Component: Editor,
  },
  {
    path: "/routes",
    Component: RoutesList,
  },
]);
