import { entityService } from "./entityService";
export const serviceService = {
  getServices: () => entityService.list("services"),
  getService: (id) => entityService.get("services", id),
  createService: (data) => entityService.create("services", data),
  updateService: (id, data) => entityService.update("services", id, data),
  deleteService: (id) => entityService.remove("services", id),
  list: () => serviceService.getServices(),
  create: (data) => serviceService.createService(data),
};
