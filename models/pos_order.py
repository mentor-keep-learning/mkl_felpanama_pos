# -*- coding: utf-8 -*-
import logging
from datetime import datetime
from markupsafe import Markup
from functools import partial, lru_cache
from itertools import groupby
from collections import defaultdict

import psycopg2
import pytz
import re

from odoo import api, fields, models, tools, _
from odoo.tools import float_is_zero, float_round, float_repr, float_compare
from odoo.exceptions import ValidationError, UserError
from odoo.osv.expression import AND
import base64

_logger = logging.getLogger(__name__)

class PosOrder(models.Model):
    _inherit = "pos.order"
    
    def _create_invoice(self, move_vals):
        new_move = super(PosOrder, self)._create_invoice(move_vals)
        new_move.crear_folio_fel()
        return new_move
    
    def _export_for_ui(self, order):
        vals = super(PosOrder, self)._export_for_ui(order)
        vals['test'] = "ESTE ES UN TEST"
        _logger.info(f"*__export_for_ui: {vals}")
        return vals
    
    # @api.model
    # def _order_fields(self, ui_order):
    #     vals = super(PosOrder, self)._order_fields(ui_order)
    #     vals['test'] = "ESTE ES UN TEST"
    #     _logger.info(f"*_order_fields: {vals}")
    #     return vals