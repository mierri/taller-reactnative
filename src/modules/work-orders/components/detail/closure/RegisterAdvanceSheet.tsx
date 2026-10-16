import React from "react";
import {
  AdvancePaymentMethod,
  PaymentFormSheet,
} from "./PaymentFormSheet";

export interface RegisterAdvanceSheetProps {
  visible: boolean;
  onClose: () => void;
  orderFolio?: string;
  vehicleName?: string;
  onSaveAdvance: (
    amount: number,
    method: AdvancePaymentMethod,
    commissionPercent?: number,
    netAmount?: number,
    reference?: string,
  ) => void;
}

export const RegisterAdvanceSheet: React.FC<RegisterAdvanceSheetProps> = ({
  visible,
  onClose,
  orderFolio = "OT-1049",
  vehicleName = "Nissan Versa",
  onSaveAdvance,
}) => {
  return (
    <PaymentFormSheet
      visible={visible}
      onClose={onClose}
      title="Registrar anticipo"
      orderFolio={orderFolio}
      vehicleName={vehicleName}
      badgeText="Anticipo"
      submitLabel="Registrar cobro →"
      onSave={(amount, method, commissionPercent, netAmount) =>
        onSaveAdvance(amount, method, commissionPercent, netAmount)
      }
    />
  );
};
