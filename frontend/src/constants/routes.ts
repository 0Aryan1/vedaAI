export const routes = {
  home: "/",
  dashboard: "/dashboard",
  groups: "/dashboard/groups",
  assignments: "/dashboard/assignments",
  toolkit: "/dashboard/toolkit",
  library: "/dashboard/library",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",
  createAssignment: "/dashboard/assignments/create",
  assignment: (id: string) => `/dashboard/assignments/${id}`,
  output: (id: string) => `/dashboard/output/${id}`,
} as const
