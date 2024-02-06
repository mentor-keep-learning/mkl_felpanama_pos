/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { getDataURLFromFile } from "@web/core/utils/urls";
import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";
import { useService } from "@web/core/utils/hooks";
import { Component, useState } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { PartnerDetailsEdit } from "@point_of_sale/app/screens/partner_list/partner_editor/partner_editor";

import { patch } from "@web/core/utils/patch";

patch(PartnerDetailsEdit.prototype, {
    setup() {
        this.popup = useService("popup");
        this.pos = usePos();
        this.intFields = ["country_id", "state_id", "property_product_pricelist"];
        const partner = this.props.partner;
        console.log("*partner", partner);
        console.log("*partner.dv:", partner.dv);
        this.changes = useState({
            name: partner.name || "",
            street: partner.street || "",
            city: partner.city || "",
            zip: partner.zip || "",
            state_id: partner.state_id && partner.state_id[0],
            country_id: partner.country_id && partner.country_id[0],
            lang: partner.lang || "",
            email: partner.email || "",
            phone: partner.phone || "",
            mobile: partner.mobile || "",
            barcode: partner.barcode || "",
            vat: partner.vat || "",
            dv: partner.dv || "",
            property_product_pricelist: this.setDefaultPricelist(partner),
        });
        Object.assign(this.props.imperativeHandle, {
            save: () => this.saveChanges(),
        });
    }
});