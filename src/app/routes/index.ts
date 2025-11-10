import express from "express";
import { userRoutes } from "../modules/user/user.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
