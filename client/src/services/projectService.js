import api from "./api";
import { apiConfig } from "../config/apiConfig";
import { mockApi } from "../mocks/mockApi";

const request = (method, url, data) =>
  api({ method, url, data }).then(({ data: response }) => response);

export const projectService = {
  getProjects: () =>
    apiConfig.useMockApi
      ? mockApi.list("projects")
      : request("get", "/projects"),
  getProject: (id) =>
    apiConfig.useMockApi
      ? mockApi.get("projects", id)
      : request("get", `/projects/${id}`),
  createProject: (data) =>
    apiConfig.useMockApi
      ? mockApi.create("projects", data)
      : request("post", "/projects", data),
  updateProject: (id, data) =>
    apiConfig.useMockApi
      ? mockApi.update("projects", id, data)
      : request("put", `/projects/${id}`, data),
  deleteProject: (id) =>
    apiConfig.useMockApi
      ? mockApi.remove("projects", id)
      : request("delete", `/projects/${id}`),
  list: () => projectService.getProjects(),
  create: (data) => projectService.createProject(data),
  update: (id, data) => projectService.updateProject(id, data),
  remove: (id) => projectService.deleteProject(id),
};
