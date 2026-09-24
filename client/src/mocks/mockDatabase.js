import { users } from "./data/users";
import { projects } from "./data/projects";
import { clients } from "./data/clients";
import { packages } from "./data/packages";
import { services } from "./data/services";

export const mockDatabase = {
  users: [...users],
  projects: [...projects],
  clients: [...clients],
  packages: [...packages],
  services: [...services],
};
