/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const bank_transfers = require('./lib/bank_transfers');

module.exports.bank_transfers = bank_transfers;
module.exports.contracts = [ bank_transfers ];
