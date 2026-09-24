import api from "./api";
import { apiConfig } from "../config/apiConfig";
import { mockApi } from "../mocks/mockApi";

const matches = (project, filters) => {
  const [start, end] = filters.dateRange || [];
  const date = project.eventDate;
  return (
    (!filters.status || project.status === filters.status) &&
    (!filters.paymentStatus ||
      project.paymentStatus === filters.paymentStatus) &&
    (!filters.clientId || project.clientId === filters.clientId) &&
    (!filters.packageId || project.packageId === filters.packageId) &&
    (!filters.projectType || project.projectType === filters.projectType) &&
    (!start || date >= start) &&
    (!end || date <= end)
  );
};

export const reportService = {
  async getProjectReport(filters = {}) {
    if (!apiConfig.useMockApi)
      return (await api.get("/reports/projects", { params: filters })).data;
    const projects = await mockApi.list("projects");
    return projects.filter((project) => matches(project, filters));
  },
  projects(filters) {
    return this.getProjectReport(filters);
  },
};
