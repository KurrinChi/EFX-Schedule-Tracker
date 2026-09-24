import { entityService } from "./entityService";
export const packageService = {
  getPackages: () => entityService.list("packages"),
  getPackage: (id) => entityService.get("packages", id),
  createPackage: (data) => entityService.create("packages", data),
  updatePackage: (id, data) => entityService.update("packages", id, data),
  deletePackage: (id) => entityService.remove("packages", id),
  list: () => packageService.getPackages(),
  create: (data) => packageService.createPackage(data),
};
