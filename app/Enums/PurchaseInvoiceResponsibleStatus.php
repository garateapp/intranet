<?php

namespace App\Enums;

enum PurchaseInvoiceResponsibleStatus: string
{
    case Pending = 'PENDIENTE';
    case Approved = 'APROBADO';
    case Objected = 'OBJETADO';
}
