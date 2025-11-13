import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";

const router = express.Router();

interface Route {
  path: string;
  route: express.Router;
}

const moduleRoutes: Route[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
