import {decodeFunctionData} from 'viem';

import abiEvc from '../euler-interfaces/abis/1/EthereumVaultConnector.json';
import abiEVault from '../euler-interfaces/abis/1/EVault.json';
import abiEulerRouter from '../euler-interfaces/abis/1/EulerRouter.json';

const abi = [...abiEvc, ...abiEVault, ...abiEulerRouter];


/*
const file = process.argv[2];
if (!file) throw Error("usage: decode.js <file.json>");

decodeEVCBatch(JSON.parse(fs.readFileSync(file)));
*/


export function decodeEVCBatch(contents) {
    let decodedBatch = decodeFunctionData({
        abi,
        data: contents.data,
    });

    if (decodedBatch.functionName !== 'batch') throw Error(`unexpected function invocation: ${decodedBatch.functionName}`);

    let items = [];

    for (let item of decodedBatch.args[0]) {
        let decodedItem = decodeFunctionData({
            abi,
            data: item.data,
        });

        items.push({ ...item, decoded: decodedItem, });
    }

    return items;
}
