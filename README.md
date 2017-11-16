# Cimpress Fulfiller Identity client

This project contains a thin client library for Cimpress' Fulfiller Identity service.

## Usage

In order to use the client

`npm install cimpress-fulfiller-identity --save`

and once the package is available

     const FulfillerIdentity = require('cimpress-fulfiller-identity');

     let fulfillerIdentity = new FulfillerIdentity(req.headers.authorization);
     fulfillerIdentity.getFulfiller(fulfillerId).then(
             (fulfiller) => {
                  console.log(fulfiller.fulfillerId);
                  console.log(fulfiller.internalFulfillerId)
                  console.log(fulfiller.name)
                  console.log(fulfiller.email)
                  console.log(fulfiller.phone)
                  console.log(fulfiller.language)
                  console.log(fulfiller.archived)
                  console.log(fulfiller.getSecurityGroupUrl())
                  console.log(fulfiller.getLogoUrl())
             });


## Support

For any inquiries, we invite you to reach out to the Trdelnik Squad at TrdelnikSquad@cimpress.com.
