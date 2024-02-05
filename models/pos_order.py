# -*- coding: utf-8 -*-
import logging
_logger = logging.getLogger(__name__)

from odoo import api, fields, models, tools, _
from odoo.exceptions import ValidationError, UserError

class PosOrder(models.Model):
    _inherit = "pos.order"
    
    def _create_invoice(self, move_vals):
        new_move = super(PosOrder, self)._create_invoice(move_vals)
        new_move.crear_folio_fel()
        return new_move