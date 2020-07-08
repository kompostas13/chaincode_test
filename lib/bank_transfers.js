/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class bank_transfers extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const transfers = [
            {
                from: 'blue',
                to: 'Toyota',
                amount: 'Prius',
                description: 'Tomoko',
            },
            {
                from: 'red',
                to: 'Ford',
                amount: 'Mustang',
                description: 'Brad',
            },
            {
                from: 'green',
                to: 'Hyundai',
                amount: 'Tucson',
                description: 'Jin Soo',
            },
            {
                from: 'yellow',
                to: 'Volkswagen',
                amount: 'Passat',
                description: 'Max',
            },
            {
                from: 'black',
                to: 'Tesla',
                amount: 'S',
                description: 'Adriana',
            },
            {
                from: 'purple',
                to: 'Peugeot',
                amount: '205',
                description: 'Michel',
            },
            {
                from: 'white',
                to: 'Chery',
                amount: 'S22L',
                description: 'Aarav',
            },
            {
                from: 'violet',
                to: 'Fiat',
                amount: 'Punto',
                description: 'Pari',
            },
            {
                from: 'indigo',
                to: 'Tata',
                amount: 'Nano',
                description: 'Valeria',
            },
            {
                from: 'brown',
                to: 'Holden',
                amount: 'Barina',
                description: 'Shotaro',
            },
        ];

        for (let i = 0; i < transfers.length; i++) {
            transfers[i].docType = 'transfer';
            await ctx.stub.putState('transfer' + i, Buffer.from(JSON.stringify(transfers[i])));
            console.info('Added <--> ', transfers[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async querytransfer(ctx, transferNumber) {
        const transferAsBytes = await ctx.stub.getState(transferNumber); // get the transfer from chaincode state
        if (!transferAsBytes || transferAsBytes.length === 0) {
            throw new Error(`${transferNumber} does not exist`);
        }
        console.log(transferAsBytes.toString());
        return transferAsBytes.toString();
    }

    async createTransfer(ctx, transferNumber, to, amount, from, description) {
        console.info('============= START : Create transfer ===========');

        const transfer = {
            from,
            docType: 'transfer',
            to,
            amount,
            description,
        };

        await ctx.stub.putState(transferNumber, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Create transfer ===========');
    }

    async queryAlltransfers(ctx) {
        const startKey = 'transfer0';
        const endKey = 'transfer999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changetransferdescription(ctx, transferNumber, newdescription) {
        console.info('============= START : changetransferdescription ===========');

        const transferAsBytes = await ctx.stub.getState(transferNumber); // get the transfer from chaincode state
        if (!transferAsBytes || transferAsBytes.length === 0) {
            throw new Error(`${transferNumber} does not exist`);
        }
        const transfer = JSON.parse(transferAsBytes.toString());
        transfer.description = newdescription;

        await ctx.stub.putState(transferNumber, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : changetransferdescription ===========');
    }

}

module.exports = bank_transfers;
