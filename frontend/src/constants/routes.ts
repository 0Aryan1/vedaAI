export const routes = {
  home: "/",
  dashboard: "/dashboard",
  groups: "/dashboard/groups",
  assignments: "/dashboard/assignments",
  toolkit: "/dashboard/toolkit",
  library: "/dashboard/library",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",
  createAssignment: "/assignments/create",
  assignment: (id: string) => `/assignments/${id}`,
  output: (id: string) => `/output/${id}`,
} as const
