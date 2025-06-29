import { api } from "../../shared/services/api";

export interface BrokerDTO {
  id: string;
  name: string;
  cnpj: string;
  website?: string;
}

export interface CreateBrokerCommand {
  name: string;
  cnpj: string;
  website?: string;
}

export interface UpdateBrokerCommand {
  id: string;
  name: string;
  cnpj: string;
  website?: string;
}

// GET /v1/Brokers
export function getBrokers() {
  return api.get<BrokerDTO[]>("Brokers");
}

// GET /v1/Brokers/{id}
export function getBroker(id: string) {
  return api.get<BrokerDTO>(`Brokers/${id}`);
}

// POST /v1/Brokers
export function createBroker(data: CreateBrokerCommand) {
  return api.post<string>("Brokers", data);
}

// PUT /v1/Brokers/{id}
export function updateBroker(data: UpdateBrokerCommand) {
  return api.put<string>(`Brokers/${data.id}`, data);
}

// DELETE /v1/Brokers/{id}
export function deleteBroker(id: string) {
  return api.delete<string>(`Brokers/${id}`);
}
