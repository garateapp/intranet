<?php

namespace App\Enums;

enum PurchaseInvoiceResponsibleSource: string
{
    case SapOwner = 'SAP_OWNER';
    case Manual = 'MANUAL';
    case Substitute = 'SUPLENTE';
}
