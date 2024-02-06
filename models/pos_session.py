# -*- coding: utf-8 -*-
import logging
_logger = logging.getLogger(__name__)

from odoo import api, fields, models, tools, _
from odoo.exceptions import ValidationError, UserError

class PosSession(models.Model):
    _inherit = "pos.session"
    
    def _loader_params_res_partner(self):
        return {
            'search_params': {
                'domain': self._get_partners_domain(),
                'fields': [
                    'name', 'street', 'city', 'state_id', 'country_id', 'vat', 'dv', 'tipo_receptor', 'tipo_ruc', 'lang', 'phone', 'zip', 'mobile', 'email',
                    'barcode', 'write_date', 'property_account_position_id', 'property_product_pricelist', 'parent_name'
                ],
            },
        }