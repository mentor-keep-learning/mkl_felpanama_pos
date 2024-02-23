# -*- coding: utf-8 -*-
import logging
_logger = logging.getLogger(__name__)

from odoo import api, fields, models, tools, _
from odoo.exceptions import ValidationError, UserError

class PosOrder(models.Model):
    _inherit = "pos.order"
    
    def _create_invoice(self, move_vals):
        doc_type_fel = self.env['dgi.tipo.documento'].sudo().search([('codigo','=','01')],limit=1)
        move_vals['tipo_documento_fel'] = doc_type_fel.id;
        new_move = super(PosOrder, self)._create_invoice(move_vals)
        new_move.crear_folio_fel()
        return new_move