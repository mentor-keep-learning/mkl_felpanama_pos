/** @odoo-module **/

import { Order } from "@point_of_sale/app/store/models";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";


import { _t } from "@web/core/l10n/translation";
import { parseFloat } from "@web/views/fields/parsers";
import { useErrorHandlers, useAsyncLockedMethod } from "@point_of_sale/app/utils/hooks";
import { registry } from "@web/core/registry";

import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";
import { NumberPopup } from "@point_of_sale/app/utils/input_popups/number_popup";
import { DatePickerPopup } from "@point_of_sale/app/utils/date_picker_popup/date_picker_popup";
import { ConfirmPopup } from "@point_of_sale/app/utils/confirm_popup/confirm_popup";
import { ConnectionLostError } from "@web/core/network/rpc_service";

import { PaymentScreenPaymentLines } from "@point_of_sale/app/screens/payment_screen/payment_lines/payment_lines";
import { PaymentScreenStatus } from "@point_of_sale/app/screens/payment_screen/payment_status/payment_status";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { Component, useState, onMounted } from "@odoo/owl";
import { Numpad } from "@point_of_sale/app/generic_components/numpad/numpad";
import { floatIsZero } from "@web/core/utils/numbers";
import { OrderReceipt } from "@point_of_sale/app/screens/receipt_screen/receipt/order_receipt";

patch(PaymentScreen.prototype, {
    setup() {
        super.setup();
        console.log("*Entre a setup() de PaymentScreen...");
    },
    async validateOrder(isForceValidate) {
        console.log("*validateOrder()");
        this.numberBuffer.capture();
        if (this.pos.config.cash_rounding) {
            if (!this.pos.get_order().check_paymentlines_rounding()) {
                this.popup.add(ErrorPopup, {
                    title: _t("Rounding error in payment lines"),
                    body: _t(
                        "The amount of your payment lines must be rounded to validate the transaction."
                    ),
                });
                return;
            }
        }
        if (await this._isOrderValid(isForceValidate)) {
            // remove pending payments before finalizing the validation
            for (const line of this.paymentLines) {
                if (!line.is_done()) {
                    this.currentOrder.remove_paymentline(line);
                }
            }
            await this._finalizeValidation();
        }
    }
});

/*patch(Order.prototype, {
    setup(_defaultObj, options) {
        super.setup(...arguments);
        this.orm = useService("orm");
        this.rpc = this.env.services.rpc;
    },
    export_for_printing() {
        const result = super.export_for_printing(...arguments);
        result.invoice_data = "XXXXXX";
        this.get_invoice_data();
        return result;
    },
    async get_invoice_data() {
        // var rpc = this.pos.orm.rpc;
        // const user_name = await this.rpc({
        //     model: "res.users",
        //     method: "read",
        //     args: [[], ["name"]],
        //   });
        console.log("*this.rpc: ", this.rpc);
    }
});*/



// patch(Order.prototype, {
//     async setup(_defaultObj, options) {
//         super.setup(...arguments);
//         console.log("**Entre en setup...");
//         var self = this;
//         console.log("*self: ", self);
//         var account_move_id = self.account_move;
//         console.log("*account_move_id: ", account_move_id);
//         const { models } = await this.env.models;
//         const accountMove = await models.account_move.browse(account_move_id);
//         console.log("*accountMove: ",accountMove);
//     },
//     export_for_printing() {
//         const result = super.export_for_printing(...arguments);
//         result.client = this.get_partner();
//         result.invoice_data = this.get_invoice_data();;
//         console.log("***result.invoice_data: ", result.invoice_data);
//         return result;
//     },
//     async get_invoice_data() {
//         var self = this;
//         console.log("*self: ", self);
//         var account_move_id = self.account_move;
//         console.log("*account_move_id: ", account_move_id);
//         const { models } = await this.env.models;
//         const accountMove = await models.account_move.browse(account_move_id);
//         console.log("*accountMove: ",accountMove);
//         //HERE GET DATA FROM A account.move ID = account_move_id for RETURN INVOICE DATA
//         return;
//     }
// });