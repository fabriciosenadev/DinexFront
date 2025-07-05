// src/features/operation/operation.service.ts
import { api } from "../../shared/services/api";
import type {
    OperationDTO,
    CreateOperationCommand,
    UpdateOperationCommand,
} from "./operation.model";

// GET /v1/Operations/{id}
export function getOperation(id: string) {
    return api.get<OperationDTO>(`Operations/${id}`);
}

// GET /v1/Operations/wallet/{walletId}
export function getOperationsByWallet(walletId: string) {
    return api.get<OperationDTO[]>(`Operations/wallet/${walletId}`);
}

// POST /v1/Operations
export function createOperation(data: CreateOperationCommand) {
    return api.post<string>("Operations", data);
}

// PUT /v1/Operations/{id}
export function updateOperation(data: UpdateOperationCommand) {
    return api.put<string>(`Operations/${data.id}`, data);
}

// DELETE /v1/Operations/{id}
export function deleteOperation(id: string) {
    return api.delete<string>(`Operations/${id}`);
}
