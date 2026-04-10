import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/Layout";
import { Profile } from "../pages/Profile/Profile";
import { Home } from "../pages/Home/Home";
import { Notes } from "../pages/Notes/Notes";
import { Calendar } from "../pages/Calendar/Calendar";
import { Knowledge } from "../pages/Knowledge/Knowledge";
import { Career } from "../pages/Career/Career";
import { Planning } from "../pages/Planning/Planning";
import { Login } from "../pages/Auth/Login";
import { SignIn } from "../pages/Auth/SignIn";
import { Explore } from "../pages/Explore/Explore";
import { Community } from "../pages/Community/Community";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "profile", Component: Profile },
      { path: "planning", Component: Planning },
      { path: "career", Component: Career },
      { path: "notes", Component: Notes },
      { path: "calendar", Component: Calendar },
      { path: "knowledge", Component: Knowledge },
      { path: "explore", Component: Explore },
      { path: "community", Component: Community },
    ],
  },
]);