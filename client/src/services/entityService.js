import api from "./api";
import { apiConfig } from "../config/apiConfig";
import { mockApi } from "../mocks/mockApi";
const request = (method, url, data) =>
  api({ method, url, data }).then(({ data: response }) => response);

export const entityService = {
  list: (type) =>
    apiConfig.useMockApi ? mockApi.list(type) : request("get", `/${type}`),
  create: (type, data) =>
    apiConfig.useMockApi
      ? mockApi.create(type, data)
      : request("post", `/${type}`, data),
  get: (type, id) =>
    apiConfig.useMockApi
      ? mockApi.get(type, id)
      : request("get", `/${type}/${id}`),
  update: (type, id, data) =>
    apiConfig.useMockApi
      ? mockApi.update(type, id, data)
      : request("put", `/${type}/${id}`, data),
  remove: (type, id) =>
    apiConfig.useMockApi
      ? mockApi.remove(type, id)
      : request("delete", `/${type}/${id}`),
};
