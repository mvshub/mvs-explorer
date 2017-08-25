const exec = require('child_process').exec;
const fs = require('fs');
const cmdList = [
    'seed',
    'ec-to-address',
    'ec-to-public',
    'fetch-balance',
    'fetch-header',
    'fetch-height',
    'fetch-history',
    'fetch-public-key',
    'fetch-stealth',
    'fetch-tx',
    'fetch-tx-index',
    'fetch-utxo',
    'hd-new',
    'hd-private',
    'hd-to-ec',
    'hd-to-public',
    'help',
    'input-set',
    'input-sign',
    'input-validate',
    'mnemonic-new',
    'mnemonic-to-seed',
    'send-tx',
    'settings',
    'stealth-decode',
    'stealth-encode',
    'stealth-public',
    'stealth-secret',
    'stealth-shared',
    'tx-decode',
    'tx-encode',
    'tx-sign',
    'validate-tx',
    'stopall',
    'stop',
    'start',
    'getinfo',
    'getpeerinfo',
    'ping',
    'addnode',
    'getmininginfo',
    'getbestblockhash',
    'getbestblockheader',
    'fetchheaderext',
    'gettransaction',
    'backupwallet',
    'importwallet',
    'lockwallet',
    'backupaccount',
    'importaccount',
    'getnewaccount',
    'getaccount',
    'deleteaccount',
    'lockaccount',
    'setaccountinfo',
    'listaddresses',
    'getnewaddress',
    'getaddress',
    'getpublickey',
    'getblock',
    'signmessage',
    'verifymessage',
    'createmultisig',
    'addmultisigaddress',
    'validateaddress',
    'listbalances',
    'getbalance',
    'listtxs',
    'xfetchbalance',
    'xfetchutxo',
    'gettx',
    'getaddresstx',
    'getaccounttx',
    'deposit',
    'send',
    'sendmore',
    'sendfrom',
    'sendwithmsg',
    'sendwithmsgfrom',
    'listassets',
    'getasset',
    'getaddressasset',
    'getaccountasset',
    'createasset',
    'issue',
    'issuefrom',
    'sendasset',
    'sendassetfrom',
    'getdid',
    'setdid',
    'sendwithdid',
    'settxfee',
    'getwork',
    'submitwork',
    'setminingaccount',
    'changepasswd',
];

const out = [];

function testOne() {
    const item = cmdList.shift();
    const cmd = `/Users/baiting/bitcoin/mvsv0.6.9/mvs-cli ${item} -h`;
    exec(cmd, function(error, stdout, stderr) {
        out.push(`:: ${item} :: `)
        out.push(stdout);
        out.push('------------------');
        if (cmdList.length) {
            testOne();
        } else {
            fs.writeFile('./mcdlist.txt', out.join('\n'));
        }
    });
}

testOne();

