<?php

namespace App\Enums;

enum PurchaseInvoiceAssociationStatus: string
{
    case SapPurchaseOrder = 'CON_OC_SAP';
    case WithoutPurchaseOrder = 'SIN_OC';
    case ManuallyAssignedPurchaseOrder = 'OC_ASIGNADA_MANUALMENTE';
}
