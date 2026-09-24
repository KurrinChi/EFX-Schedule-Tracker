import { mockDatabase } from "./mockDatabase";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 250));
const idFor = (resource) => `${resource.slice(0, 3)}-${Date.now()}`;

export const mockApi = {
  async list(resource) {
    return delay([...mockDatabase[resource]]);
  },
  async get(resource, id) {
    return delay(mockDatabase[resource].find((item) => item.id === id) || null);
  },
  async create(resource, data) {
    const item = {
      ...data,
      id: idFor(resource),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDatabase[resource].unshift(item);
    return delay(item);
  },
  async update(resource, id, data) {
    const index = mockDatabase[resource].findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Record not found.");
    mockDatabase[resource][index] = {
      ...mockDatabase[resource][index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return delay(mockDatabase[resource][index]);
  },
  async remove(resource, id) {
    const index = mockDatabase[resource].findIndex((item) => item.id === id);
    if (index >= 0) mockDatabase[resource].splice(index, 1);
    return delay(true);
  },
};
