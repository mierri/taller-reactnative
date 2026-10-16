import React from "react";
import { formatCurrency } from "../../../utils/detail-formatters";
import {
  AdvancePaymentMethod,
  PaymentFormSheet,
} from "./PaymentFormSheet";

export interface RegisterPaymentSheetProps {
  visible: boolean;
  onClose: () => void;
  orderFolio?: string;
  vehicleName?: string;
  pendingBalance: number;
  onSavePayment: (
    amount: number,
    method: AdvancePaymentMethod,
    commissionPercent: number,
    netAmount: number,
  ) => void;
}

export const RegisterPaymentSheet: React.FC<RegisterPaymentSheetProps> = ({
  visible,
  onClose,
  orderFolio = "OT-1049",
  vehicleName = "Nissan Versa",
  pendingBalance = 700,
  onSavePayment,
}) => {
  return (
    <PaymentFormSheet
      visible={visible}
      onClose={onClose}
      title="Cobrar orden"
      orderFolio={orderFolio}
      vehicleName={vehicleName}
      badgeText={formatCurrency(pendingBalance)}
      initialAmount={pendingBalance}
      submitLabel="Registrar cobro y liquidar"
      onSave={onSavePayment}
    />
  );
};
