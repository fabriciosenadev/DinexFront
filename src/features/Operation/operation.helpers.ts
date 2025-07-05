import { OPERATION_TYPE_OPTIONS, type OperationType } from "./operation.model";

// Converte number para label amigável ("Compra" / "Venda")
export function operationTypeToLabel(value: number | string): string {
    // Se vier do backend como string
    if (typeof value === "string") {
        return OPERATION_TYPE_OPTIONS.find(opt => opt.backend === value)?.label ?? value;
    }
    // Se vier como número
    return OPERATION_TYPE_OPTIONS.find(opt => opt.value === value)?.label ?? String(value);
}

// Converte label para number (1 ou 2), útil ao editar operação
export function labelToOperationType(label: string): OperationType {
    return (OPERATION_TYPE_OPTIONS.find(opt => opt.label === label)?.value ?? 1) as OperationType;
}
