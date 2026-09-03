<?php

namespace App\Enums;

enum PurchaseInvoiceHistoryEvent: string
{
    case CreatedFromSap = 'CREADO_DESDE_SAP';
    case UpdatedFromSap = 'ACTUALIZADO_DESDE_SAP';
    case Approved = 'APROBADO';
    case Objected = 'OBJETADO';
    case DocumentCancelledSap = 'DOCUMENTO_CANCELADO_SAP';
    case ResponsibleAssigned = 'RESPONSABLE_ASIGNADO';
    case ResponsibleChanged = 'RESPONSABLE_CAMBIADO';
    case NotificationSent = 'NOTIFICACION_ENVIADA';
    case ReminderSent = 'RECORDATORIO_ENVIADO';
    case ReceivedWithoutPurchaseOrder = 'FACTURA_RECIBIDA_SIN_OC';
    case ResponsibleManuallyAssigned = 'RESPONSABLE_ASIGNADO_MANUALMENTE';
    case ManualResponsibleChanged = 'RESPONSABLE_MANUAL_CAMBIADO';
    case PurchaseOrderManuallyAssigned = 'OC_ASIGNADA_MANUALMENTE';
    case ManualPurchaseOrderChanged = 'OC_MANUAL_CAMBIADA';
    case SapPurchaseOrderDetectedLater = 'OC_SAP_DETECTADA_POSTERIORMENTE';
    case AssociationReconciled = 'ASOCIACION_RECONCILIADA';
    case SubstituteAssigned = 'SUPLENTE_ASIGNADO';
    case SubstituteChanged = 'SUPLENTE_CAMBIADO';
    case ApprovalAttachmentAdded = 'RESPALDO_APROBACION_ADJUNTADO';
}
