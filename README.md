# Cimpress Fulfiller Identity client

This project contains a thin client library for Cimpress' Fulfiller Identity service.

## Usage

In order to use the client

`npm install cimpress-fulfiller-identity --save`

and once the package is available

### Import

`const FulfillerIdentity = require('cimpress-fulfiller-identity');`

or 

`import FulfillerIdentity from 'cimpress-fulfiller-identity'`

### Instantiation
```

const options = {
   AWSXRay: aws-xray-sdk, // AWS X-Ray SDK
   url: 'string', // Base url of the service, by default it will be fulfilleridentity.trdlnk.cimpress.io
   retries: 3, // By default there are 3 retries
   retryDelayInMs: 1000 //Default: 1000
}
const authorization = null || string || function, // Used to authorize the requests.

const fulfillerIdentity = new FulfillerIdentity(authorization, options);


```
### Class functions 



```
fulfillerIdentity.getUrl() // Returns the base url of the service


```



```
const options = {
    showArchived: boolean, // Show archived fulfillers within the result of the query.
    filterByName: string, // Filter the result by this fulfiller name
    noCache: boolean // Invalidates the cache when is set to true    
}

fulfillerIdentity.getFulfillers(options) // Returns a promise which resolves a list of fulfillers that match the criteria
.then(fulfillers => {
        const fulfiller = fulfillers[0]
        console.log(fulfiller.fulfillerId);
        console.log(fulfiller.internalFulfillerId)
        console.log(fulfiller.name)
        console.log(fulfiller.email)
        console.log(fulfiller.phone)
        console.log(fulfiller.language)
        console.log(fulfiller.archived)
        console.log(fulfiller.getSecurityGroupUrl())
        console.log(fulfiller.getLogoUrl())
        console.log(fulfiller.getFulfillerContactsUrl())
        console.log(fulfiller.getFulfillerFulfillmentLocationsUrl())
}

```


```
const options = {
    noCache: boolean // Invalidates the cache when is set to true    
}
const fulfillerId = "a3efe4wef"

fulfillerIdentity.getFulfiller(fulfillerId, options) // Returns a promise which resolves the fulfiller passed by parameter.
.then(fulfiller => {
        console.log(fulfiller.fulfillerId);
        console.log(fulfiller.internalFulfillerId)
        console.log(fulfiller.name)
        console.log(fulfiller.email)
        console.log(fulfiller.phone)
        console.log(fulfiller.language)
        console.log(fulfiller.archived)
        console.log(fulfiller.getSecurityGroupUrl())
        console.log(fulfiller.getLogoUrl())
        console.log(fulfiller.getFulfillerContactsUrl())
        console.log(fulfiller.getFulfillerFulfillmentLocationsUrl())
}

```


```
const options = {
    noCache: boolean // Invalidates the cache when is set to true    
}
const fulfillerId = "a3efe4wef"

fulfillerIdentity.getFulfillerContacts(fulfillerId, options) // Returns a promise which resolves the fulfiller passed by 
.then(fulfillerContact => {
        console.log(fulfillerContact.id);
        console.log(fulfillerContact.createdAt)
        console.log(fulfillerContact.createdBy)
        console.log(fulfillerContact.defaultContact)
        console.log(fulfillerContact.email)
        console.log(fulfillerContact.language)
        console.log(fulfillerContact.name)
        console.log(fulfillerContact.phone)
        console.log(fulfillerContact.technicalContact)
        console.log(fulfillerContact.businessContact)
        console.log(fulfillerContact.operationalSupportContact)
        console.log(fulfillerContact.getContactUrl())
        console.log(fulfillerContact.getFulfillerUrl())
}

```



```
const fulfiller = new Fulfiller(fulfillerId, internalFulfillerId, name, email, phone, language, links) // It will be not archived by default
const fulfiller = new Fulfiller(fulfillerId, internalFulfillerId, name, email, phone, language, links, archived)

fulfillerIdentity.saveFulfiller(fulfiller) // Creates or updates a fulfiller

```
## Support

For any inquiries, we invite you to reach out to the Trdelnik Squad at TrdelnikSquad@cimpress.com.
