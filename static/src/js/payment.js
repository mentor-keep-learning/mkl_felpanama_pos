/** @odoo-module **/

import { Order } from "@point_of_sale/app/store/models";
import { patch } from "@web/core/utils/patch";
import { TicketScreen } from "@point_of_sale/app/screens/ticket_screen/ticket_screen";
import { useService } from "@web/core/utils/hooks";
// import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { ReprintReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/reprint_receipt_screen";



// patch(PaymentScreen.prototype, {
//     setup() {
//         super.setup();
//         console.log("*Entre a setup() de PaymentScreen...");
//     },
//     async validateOrder(isForceValidate) {
//         console.log("*validateOrder()");
//         this.numberBuffer.capture();
//         if (this.pos.config.cash_rounding) {
//             if (!this.pos.get_order().check_paymentlines_rounding()) {
//                 this.popup.add(ErrorPopup, {
//                     title: _t("Rounding error in payment lines"),
//                     body: _t(
//                         "The amount of your payment lines must be rounded to validate the transaction."
//                     ),
//                 });
//                 return;
//             }
//         }
//         if (await this._isOrderValid(isForceValidate)) {
//             // remove pending payments before finalizing the validation
//             for (const line of this.paymentLines) {
//                 if (!line.is_done()) {
//                     this.currentOrder.remove_paymentline(line);
//                 }
//             }
//             await this._finalizeValidation();
//         }
//     }
// });


patch(ReprintReceiptScreen.prototype, {
    async setup() {
        super.setup();
        this.orm = useService('orm');

        var account_move_id = this.props.order.account_move;
        console.log("*account_move_id: ", account_move_id);

        const invoice_query = await this.orm.call('account.move', 'search_read', [
            [
              ['id', '=', account_move_id],
            ],
            []
          ]);
        const invoice_data = invoice_query[0];
        console.log("*invoice_data: ", invoice_data);

        const SelectedOrder = this.pos.get_order();
        SelectedOrder.cufe_fel = invoice_data.cufe_fel;
    }
});


patch(Order.prototype, {
    export_for_printing() {
        return {
            ...super.export_for_printing(...arguments),
            invoice_data: this.pos.selectedOrder.invoice_data,
            cufe_fel: this.pos.selectedOrder.cufe_fel,
        };
    },
});



// patch(Order.prototype, {
//     setup(_defaultObj, options) {
//         super.setup(...arguments);
        
//     },
//     export_for_printing() {
//         const result = super.export_for_printing(...arguments);
//         result.invoice_data = "XXXXXX";
//         this.get_invoice_data();
//         return result;
//     },
//     async get_invoice_data() {
//         const resPartner = await this.orm.call('res.partner','search_read',[[]]);
//         console.log("*resPartner ORDER: ", resPartner);
//     }
// });



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