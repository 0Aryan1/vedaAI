export const routes = {
  home: "/",
  dashboard: "/dashboard",
  createAssignment: "/assignments/create",
  assignment: (id: string) => `/assignments/${id}`,
  output: (id: string) => `/output/${id}`,
};
