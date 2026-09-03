<?php

namespace App\Enums;

enum PurchaseInvoiceApprovalStatus: string
{
    case Pending = 'PENDIENTE';
    case Approved = 'APROBADO';
    case Objected = 'OBJETADO';
    case CancelledSap = 'CANCELADO_SAP';
    case WithoutResponsible = 'SIN_RESPONSABLE';
    case PendingAssignment = 'PENDIENTE_ASIGNACION';
}
