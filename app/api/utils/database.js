import path from "path";

export const databaseRoute = (...endPoint) => {
  return path.join(process.cwd(), "database", ...endPoint);
};
