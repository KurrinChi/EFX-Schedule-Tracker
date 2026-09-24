import { entityService } from "./entityService";
export const clientService = {
  getClients: () => entityService.list("clients"),
  getClient: (id) => entityService.get("clients", id),
  createClient: (data) => entityService.create("clients", data),
  updateClient: (id, data) => entityService.update("clients", id, data),
  deleteClient: (id) => entityService.remove("clients", id),
  list: () => clientService.getClients(),
  create: (data) => clientService.createClient(data),
};
