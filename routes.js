const express = require('express');
const router = express.Router();
router.get('/insert' , (req,res)=>{
    res.render('insert',{
        errors:{},
        success:{}
    })
router.post('/register_p', (req,res)=>{
    var errors = [];
    if(!req.body.propertyno){
        errors.push('Please Enter Property number');
    }
    if(!req.body.propertyid){
        errors.push('Please Enter Property ID');
    }
    if(!req.body.propertykhata){
        errors.push('Please Enter Khata Number');
    }
    if(!req.body.khasrano){
        errors.push('Please Enter khasra number');
    }
    if(!req.body.familyno){
        errors.push('Please Enter family number');
    }
       if(!req.body.tehsil){
        errors.push('Please Enter tehsil');
    }
    if(!req.body.district){
        errors.push('Please Enter District');
    }
    if(!req.body.ownerid){
        errors.push('Please Enter Owner Cnic');
    }
    if(!req.body.ownername){
        errors.push('Please Enter Owner Name');
    }
    if(!req.body.fathername){
        errors.push('Please Enter Owners Father name');
    }
    if(!req.body.stay){
        errors.push('Please Enter stay status');
    }
    if(!req.body.mortgage){
        errors.push('Please Enter mortgage status');
    }
    if(!req.body.leased){
        errors.push('Please Enter leased status');
    }
    if(errors.length>0){
        res.render('insert', {
            errors:errors,
            success:{}
        })
    }
    else{
        /*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        await contract.submitTransaction('createProperty', req.body.propertyno, req.body.propertyid, req.body.propertykhata, req.body.khasrano, req.body.familyno, req.body.tehsil, req.body.district,req.body.ownerid,req.body.ownername, req.body.fathername,false,false,false);
       //await contract.submitTransaction('createCar', 'PROPERTY', 'Property123', '13243', '23445', '543566', 'Sialkot', 'Sialkot','34603-8958442-1','Ammar khalid', 'Khalid Mehmood',false,false,false);
       console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        //console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
    res.render('insert',{
        errors:{},
        success:'One car record successfully added to couchdb'
    })
}

main();

    }
})

})

router.get('/Signup' , (req,res)=>{
    res.render('Signup',{
        errors:{},
        success:{}
    })
    router.post('/register_u', (req,res)=>{
        errors=[];
        if(errors.length>0){
            res.render('Signup', {
                errors:errors,
                success:{}
            })
        }
        else{
            'use strict';
const { Gateway ,Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
       const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(req.body.fullname);
        if (userIdentity) {
            console.log('An identity for the user already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: req.body.fullname,
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: req.body.fullname,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        
        await wallet.put(req.body.fullname, x509Identity);
        console.log('Successfully registered and enrolled admin user "Ammar" and imported it into the wallet')
 
         // Check to see if we've already enrolled the user.
         const identity = await wallet.get('appUser');
         if (!identity) {
             console.log('An identity for the user "Ammar" does not exist in the wallet');
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
 
         // Submit the specified transaction.
         // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
         // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
         await contract.submitTransaction('createUser',req.body.email,req.body.fullname,req.body.email, req.body.cnic, req.body.pwd, false);
         console.log('Transaction has been submitted');
 
         // Disconnect from the gateway.
         await gateway.disconnect();
 


    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        process.exit(1);
    }
    res.render('Signup',{
        errors:{},
        success:'User Registered Successfully'
    })
}

main();
        }
})
})

router.get('/signin' , (req,res)=>{
    res.render('signin',{
        errors:{},
        success:{}
    })
    router.post('/Signin', (req,res)=>{
        errors=[];
        if(errors.length>0){
            res.render('signin', {
                errors:errors,
                success:{}
            })
        }
        else{
            
            'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        var x = await contract.evaluateTransaction('CheckUser',req.body.username,req.body.pwd);
        if(x.toString() == 'true'){
        session=req.session;
        session.userid=req.body.username;
        console.log(`Hello: ${req.session.userid}`);
        res.redirect('/Buyer');
    }
    else{
        res.redirect('/Signup');
    }
        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }

}

main();
        }
    })
    })

    router.get('/GetFard' , (req,res)=>{
        res.render('GetFard',{
            errors:{},
            success:{}
        })
        router.post('/Get', (req,res)=>{
            errors=[];
            if(errors.length>0){
                res.render('GetFard', {
                    errors:errors,
                    success:{}
                })
            }
            else{
                
                'use strict';
    
    const { Gateway, Wallets } = require('fabric-network');
    const fs = require('fs');
    const path = require('path');
    
    async function main() {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
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
    
            // Submit the specified transaction.
            var y = await contract.evaluateTransaction('GetUserId',req.session.userid);
           // console.log(`Transaction has been evaluated, result is: ${x}`)
            //console.log(`Transaction has been evaluated, result is: ${y}`)
                const result = await contract.evaluateTransaction('queryAllProperties');
                const sliced = result.slice(1,-1)
              //  console.log(`Transaction has been evaluated, result is: ${sliced}`)
                console.log(`Session is ${req.session.userid}`)
                var Properties = result.toString();
                var z = JSON.parse(Properties);
                for(var i=0; i<z.length; i++){
                  if(z[i].Record.owner_id == y){
                    //var x = await contract.evaluateTransaction('GetFard','2131247','34603-8958442-1');
                    console.log(`Transaction has been evaluated, result is: ${z[i].Record.owner_name}`)
                  }  
                }
                console.log(`Transaction has been evaluated, result is: ${z[0].Record.owner_id}`)
                //console.log(`Transaction has been evaluated, result is: ${y}`)
               // console.log(`Transaction has been evaluated, result is: ${z.length}`)
                res.render('GetFard', {
                    user1:y
                })

            // Disconnect from the gateway.
            await gateway.disconnect();
    
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    
    }
    
    main();
            }
        })
        })



module.exports = router