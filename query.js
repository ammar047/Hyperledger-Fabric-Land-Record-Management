
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const oneDay = 1000 * 60 * 60 * 24;
const session = require('express-session');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
var express = require('express');
var app = express();
var layout = require('express-layout');
var engine = require('ejs-mate');
var bodyparser = require('body-parser');
const bodyParser = require('body-parser');
var middleware = [
    layout(),
    express.static(path.join(__dirname, 'public'))
]
app.use(express.static(__dirname + '/views'));
app.use(middleware);
app.engine('ejs',engine);
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
const routes = require('./routes');
app.use('/', routes);
app.get('/',function(req,res){
    res.render('index')
});
app.get('/display',function(req,res){
    'use strict';
    
async function main() {
if(req.session.userid!=undefined){
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllProperties');
            const sliced = result.slice(1,-1)
            console.log(`Transaction has been evaluated, result is: ${sliced}`)
            console.log(`Session is ${req.session.userid}`)
            var Properties = result.toString();
            var x = JSON.parse(Properties);
            console.log(`Transaction has been evaluated, result is: ${x[0].Key}`)
            console.log(`Transaction has been evaluated, result is: ${x[1].Key}`)
            console.log(`Transaction has been evaluated, result is: ${x.length}`)

            /*var data = result.toString();
            var data2 = [];
            var label = [];
            var values = [];
            for(var i=0;i<data.length;i++){
                if(data[i]!= '{' && data[i]!= '}' && data[i]!='{' && data[i]!= '"' && data[i]!='[' && data[i]!=']'){
                    data2.push(data[i]);
                }
            }
            var string;
            var j;
            for(var i=0;i<data2.length;i++){
                if(i==0 || data2[i]=='"'){
                    if(data2[i+1]== ' '){
                        i+=8;
                    }
                    if(i==0){
                        j=i;
                    }
                    else
                    {
                        j=i+1;
                    }
                    while(data2[j]!=':'){
                        string+=data2[j];
                        j++;
                    }
                    label.push(string);
                    i=--j;
                }
            }
            for(var i=0; i<data2.length;i++){
                if(data2[i]==':'){
                    if(data2[i+1]=='c' && data2[i+2]=='o' && data2[i+3]=='l' && data2[i+4]=='o' && data2[i+5]=='u' && data2[i+6]=='r'){
                        i+=7;
                    }
                    j=i+1;
                    while(data2[j]!=','){
                        if(j==data2.length){
                            string+=data2[j];
                            break;
                        }
                        string+=data2[j];
                        j++;
                    }
                    values.push(string);
                    i=--j;
                }
            }
*/          
            res.render('display',{
                user1:x
            })
        

  
        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }


}else{
    var resu = "Please Login to view details"
    res.render('display',{
        user:resu
    })
}
}
main();
});

app.get('/Buyer',function(req,res){
    'use strict';
    
async function main() {
if(req.session.userid!=undefined){
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllProperties');
            const sliced = result.slice(1,-1)
            console.log(`Transaction has been evaluated, result is: ${sliced}`)
            console.log(`Session is ${req.session.userid}`)
            var Properties = result.toString();
            var x = JSON.parse(Properties);
            console.log(`Transaction has been evaluated, result is: ${x[0].Key}`)
            console.log(`Transaction has been evaluated, result is: ${x[1].Key}`)
            console.log(`Transaction has been evaluated, result is: ${x.length}`)

            /*var data = result.toString();
            var data2 = [];
            var label = [];
            var values = [];
            for(var i=0;i<data.length;i++){
                if(data[i]!= '{' && data[i]!= '}' && data[i]!='{' && data[i]!= '"' && data[i]!='[' && data[i]!=']'){
                    data2.push(data[i]);
                }
            }
            var string;
            var j;
            for(var i=0;i<data2.length;i++){
                if(i==0 || data2[i]=='"'){
                    if(data2[i+1]== ' '){
                        i+=8;
                    }
                    if(i==0){
                        j=i;
                    }
                    else
                    {
                        j=i+1;
                    }
                    while(data2[j]!=':'){
                        string+=data2[j];
                        j++;
                    }
                    label.push(string);
                    i=--j;
                }
            }
            for(var i=0; i<data2.length;i++){
                if(data2[i]==':'){
                    if(data2[i+1]=='c' && data2[i+2]=='o' && data2[i+3]=='l' && data2[i+4]=='o' && data2[i+5]=='u' && data2[i+6]=='r'){
                        i+=7;
                    }
                    j=i+1;
                    while(data2[j]!=','){
                        if(j==data2.length){
                            string+=data2[j];
                            break;
                        }
                        string+=data2[j];
                        j++;
                    }
                    values.push(string);
                    i=--j;
                }
            }
*/          
            res.render('Buyer', {
                user1:x
            })
        

  
        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }


}else{
    var resu = "Please Login to view details"
    res.render('Buyer',{
        user1:resu
    })
}
}
main();
});
app.listen(3001, function(){
    console.log("Server started on port 3001")
})


