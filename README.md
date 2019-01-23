<p align="center">
  <a href="https://restt.io" target="_blank">
    <img src="https://i.imgur.com/jvsfw5c.png">
  </a>
</p>

<p align="center">
  <a href="https://packagephobia.now.sh/badge?p=restt" rel="nofollow" style="text-decoration: none;"><img src="https://packagephobia.now.sh/badge?p=restt" alt="Install Size" style="max-width: 100%;"></a>
  <a href="https://snyk.io/vuln/search?q=restt&type=npm" rel="nofollow" style="text-decoration: none;"><img src="https://img.shields.io/snyk/vulnerabilities/github/resttjs/restt.svg" alt="Vulnerabilities" style="max-width: 100%;"></a>
  <a href="https://npmcharts.com/compare/restt?minimal=true" rel="nofollow" style="text-decoration: none;"><img src="https://img.shields.io/npm/dt/restt.svg" alt="Downloads" style="max-width: 100%;"></a>
  <a href="https://www.npmjs.com/package/restt" rel="nofollow" style="text-decoration: none;"><img src="https://img.shields.io/npm/l/restt.svg" alt="Licence" style="max-width: 100%;"></a>
</p>

***

Restt is a powerful framework for creating fast and reliable edge worker services.<br>

Restt has been crafted for developers who love quality code, security, and ease of use while maintaining flexiblity of design.<br>

Restt is perfect for anything from large entreprise applications, to simple development exercises in the classroom.<br>

## Benefits

#### No package dependencies [*](#security)

Built with zero package dependencies to ensure your services are safe and secure from any [vulnerabilities](https://hackernoon.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5)<br>

#### No more libraries for external API services

Say goodbye to libraries for every service you use like [Stripe](https://stripe.com) - say hello to [Providers](#provider)<br>

#### No more infrastructure and maintenance

Ship your serverless and infrastructure independent services to with [Cloudflare Workers](https://developers.cloudflare.com/workers/)<br>

## Overview

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [Restt](#restt)
  - [Service](#service)
    - [Resource](#resource)
    - [Response](#response)
  - [Provider](#provider)
    - [Action](#action)
- [CLI Documentation](#cli-documentation)
  - [Configuration](#configuration)
  - [Serving for development](#serving-for-development)
  - [Deploying to the edge](#deploying-to-the-edge)  
- [Supporters](#supporters)
- [Contributing](#contributing)
- [Security](#security)
- [Licence](#licence)

## Installation

Restt is available through the [npm registry](https://www.npmjs.com/package/restt):

```bash
$ npm install restt
```

[Restt-CLI](https://github.com/resttjs/restt-cli) is highly recommended alongside Restt and is also available through the [npm registry](https://www.npmjs.com/package/restt-cli):

```bash
$ npm install -g restt-cli
```

## Usage

Creating a simple hello world service with Restt is as easy as the following:<br>

###### helloworld-service.js
```js
// Import the required classes from Restt
import { Restt, Service, Resource, Response } from 'restt';

// Create a hello world service
const helloworld = new Service({

  // Define the origin of the service
  origin: 'https://yourdomain.io',
  
  // Define the list of resources
  resources: [
    
    // Bind a resource to the service
    new Resource({

      // Define the endpoint (https://yourdomain.io/helloworld)
      endpoint: '/helloworld',

      // Define the resource protocol
      method: 'GET',
      
      // Define the response of the resource
      response() {

        // Create a response to send to the client
        return new Response({

          // Define the body of the response
          body: {
            message: 'hello world!'
          }
        });
      }
    })
  ]
});

// Create the Restt application
const app = new Restt();

// Bind the service to the application
app.use(helloworld);
```

If you're using Restt-CLI (and you're all [configured](#configuration)) you can now deploy your services locally:<br>

```bash
$ restt serve helloworld-service.js
```

Once served with Restt-CLI you can test your service - let's connect to our resource using curl:</br>

```bash
$ curl http://localhost:3000/yourdomain.io/helloworld
```

If everything is working correctly then curl should output the following:<br>

```bash
{
  "message": "helloworld!"
}
```

Now you're ready to deploy for production with Restt-CLI [Cloudflare Workers](https://developers.cloudflare.com/workers/):<br>

```bash
$ restt deploy helloworld-service.js
```

Congratulations - you've succesfully built and shipped your services to the edge using [Cloudflare Workers](https://developers.cloudflare.com/workers/)with Restt!<br>

You can check a more detailed overview of the above in the [hello world service repository](https://github.com/resttjs/helloworld-example).<br>

Check out the [collection of more complex examples](https://github.com/resttjs/complex-example) which also includes a [Provider](#provider) using [Stripe](https://stripe.com) and [WorkersKV](https://developers.cloudflare.com/workers/kv/).<br>

## API Documentation

Restt follows the [ECMA-262 spec](https://www.ecma-international.org/publications/standards/Ecma-262.htm) alongside the [standard service worker spec](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) which work with the [V8 JavaScript engine](https://v8.dev/).<br>

### Restt

Restt create an edge worker service application.<br>

Restt should only be instantiated once within any application, but the instance it can have any number of [Services](#service) bound to it.<br>

```ts
class Restt {
 
  constructor();
 
  use(service: Service);
 
}
```

### Service

Service represents a API service which contains a selection of [Resources](#resource).<br>

Services are deployed to a specified origin.<br>

```ts
class Service {
 
  constructor(service: ServiceConfiguration);
 
}
```

#### constructor(service)

##### service

```ts
type ServiceConfiguration {
  origin: String,
  headers?: Object,
  passthrough?: Boolean,
  resources: [Resource]
}
```

##### service.origin

`origin` is a required field.<br>
`origin` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) which describes a [URL Origin](https://developer.mozilla.org/en-US/docs/Web/API/URL/origin) which the service will be running on.<br>
`origin` must not end with a trailing slash.<br><br>
 
```ts
// A URL Origin
origin: 'https://yourdomain.io'

// A URL Origin including a port
origin: 'https://yourdomain.io:3000'
```

##### service.headers

`headers` is an optional field.<br>
`headers` must be an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).<br>
`headers` should only include keys in lowercase.<br>
`headers` will always enforce `'content-type': 'application/json'`.<br>
`headers` defines the [response headers](https://developer.mozilla.org/en-US/docs/Web/API/Response/headers) returned by any request to any resources on this service.<br>

```ts
// An example set of response headers (sent to the client)
headers: {

  // Allow CORS from anywhere
  'access-control-allow-origin': '*',

  // Send a flag about the project service version
  'project-service-version': '0.0.1'
}
```

##### service.passthrough

`origin` is an optional field.<br>
`origin` must be a [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) - setting this to `true` will allow all [requests](https://developer.mozilla.org/en-US/docs/Web/API/Request) on a service origin (e.g. `https://yourdomain.io`) to attempt to return their original content (pass through the edge) rather than throw a [404](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) when a [Resource](#resource) does not match the [request url](https://developer.mozilla.org/en-US/docs/Web/API/Request/url).

##### service.resources

`resources` is a required field.<br>
`resources` must be an array of [Resources](#resource).<br>
`resources` must contain at least one resource.<br>

```ts
// Create a set of resources (contains only one resource)
resource: [
  new Resource({
    endpoint: '/helloworld',
    method: 'GET',
    response() {
      return new Response({
        body: {
          message: 'hello world!'
        },
        status: 200
      });
    }
  })
]
```

### Resource

Resources are endpoints which run on a [Service](#service).<br>

Resources can be statically or dynamically generated depending on their [params](#resourceendpoint) and [fields](#resourcefields).<br>

Resources can also be cached using the [cache](#resourcecache) property.<br>

```ts
class Resource {
 
  constructor(configuration: ResourceConfiguration);
 
}
```

#### constructor(resource)

##### resource

```ts
type ResourceConfiguration {
  endpoint: String,
  method: String,
  cache?: (Number | Boolean)
  fields?: [String],
  response: Response
}
```

##### resource.endpoint

`endpoint` is a required field.<br>
`endpoint` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) which describes a URL path (and optionally query paramaters) which the resource can be accessed from.<br>
`endpoint` must not end with a trailing slash.<br>
`endpoint` can have required dynamic paramaters by wrapping paramaters in braces like `{param}`.<br>

```ts
// A simple static endpoint
endpoint: '/helloworld'

// A simple dynamic endpoint
endpoint: '/sqrt/{number}'

// A complex dynamic endpoint
endpoint: '/messages/{user}?search={query}&limit={limit}'
```

##### resource.method

`method` a required field.<br>
`method` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) and be one of the supported [methods](https://developer.mozilla.org/en-US/docs/Web/API/Request/method) in [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).<br>

```ts
// GET method
method: 'GET'

// POST 
method: 'POST'
```

##### resource.cache

`origin` is an optional field.<br>
`origin` must be either a [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) where `true` represents caching for 60 seconds or a [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) which represents the number of seconds to cache for.<br>
 
```ts
// Do not cache
cache: false

// Cache for the default number of seconds
cache: true

// Cache for 1 hour (3600 seconds)
cache: 3600
```

##### resource.fields

`fields` is an optional field.<br>
`fields` must be an array of [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) which defines the minimum required fields in the [request body](https://developer.mozilla.org/en-US/docs/Web/API/Body/body).<br>

```ts
// A set of fields required in the request body
fields: ['email', 'password']
```

##### resource.response(params)

`response` is a required field.<br>
`response` must be a [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) and can be an [asynchronous function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).<br>
`response` must return a [Response](#response) which will be sent to the client when the resource is requested.<br>
`response` accepts `params` which will contain any [url and query paramaters](#resourceendpoint), [fields](#resourcefields) which are sent in the request, as well as any [headers](#request-headers).<br>

```ts
// A simple static response
response: () => {
  return new Response({ 
    body: { 
      message: 'hello world',
    },
    status: 200 
  });
}

// A simple dynamic response generating data from paramaters or fields
response: ({ number }) => {
  return new Response({ 
    body: { 
      message: Math.sqrt(number),
    },
    status: 200
  });
}

// A complex dynamic response generating data from paramaters, fields and headers
response: async({ email, password, headers }) => {

  // Check the authorization header (e.g. private internal platform)
  if (!headers.equals('authorization', 'your-auth-token')) {
    
    // Throw a 403 as the authorization header is incorrect
    return new Response({ status: 403 });
  }

  // Search the database for the customer
  const customer = await Customers.findOne({ email });
  
  // Check if the customer exists
  if (customer) {

    // Check whether the passwords match
    if (customer.password == password) {

      // Remove the password from the payload
      delete customer.password;

      // Return the customer
      return new Response({ 
        body: { 
          customer,
          success: true
        },
        status: 200
      });
    }
  }

  // Return an error response if there is no customer or invalid credentials
  return new Response({ 
    body: { 
      message: 'Invalid email and password combination',
      success: false
    },
    status: 403
  });
}
```

### Response

Responses are sent to the client when a request to a [Resource](#resource) is made.<br>

```ts
class Response {
 
  constructor(response: ResponseConfiguration);
 
}
```

#### constructor(response)

##### response

```ts
type ResponseConfiguration {
  headers: Object?
  body: Object,
  status: Number
}
```

##### response.headers

`headers` is an optional field.<br>
`headers` must be an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).<br>
`headers` should only include keys in lowercase.<br>
`headers` will always enforce `'content-type': 'application/json'`.<br>
`headers` defines the [response headers](https://developer.mozilla.org/en-US/docs/Web/API/Response/headers) for this resource.<br>
`headers` will extend (and take priority with conflicts) over any [headers configured on the service](#serviceheaders).<br>


```ts
// An example set of response headers (sent back to the client)
headers: {

  // Set a cookie for this session
  'set-cookie': 'sessionid=SK302903; Secure'

}
```

##### response.body

`body` is a required field.<br>
`body` must be an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).<br>

```ts
// An example body
body: {
  message: 'hello world!'
}
```

##### response.status

`status` is a required field.<br>
`status` must be a [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).<br>
`status` must be an accepted [HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).<br>

```ts
// An example status(success)
status: 200
```

### Provider

Providers represent external API services which are needed by a [Service](#service) to (e.g. [Stripe](https://stripe.com/)).<br>

###### stripe-provider.js

```ts
// Import the provider module from Restt
import { Provider, Action } from 'restt';

// Export the Stripe provider to be used by a Response
export const Stripe = new Provider({
  
  // Define the origin for the provider
  origin: 'https://api.stripe.com/v1',

  // Define the headers for the provider (load from the restt.config.json with Restt-CLI)
  headers: configuration.stripe.headers,

  // Add the actions to the providers
  actions: [

    // Create a customer action
    new Action({

      // Define the name for the action
      name: 'createCustomer',

      // Define the endpoint (https://api.stripe.com/v1/customers)
      endpoint: '/customers',

      // Define the method
      method: 'POST',

      // Define the minimum required fields to be called by the function
      fields: ['email']
    })

  ]
});
```

When instantiated, each action on the Provider will be bound as a function.<br>

```ts
// Create a customer with Stripe (async / returns a promise)
Stripe.createCustomer({ email: 'example@yourdomain' });
```

Providers provide a high level of flexibility for connecting external API services, and allow flow of data to and from external sources without needing to import any service library.<br>

Providers are defined in a similar way to [Services](#services), but with the focus on requesting content rather than serving it.<br>

Providers contain a selection of [Actions](#action).<br>

```ts
class Provider {
 
  constructor(provider: ProviderConfiguration);
 
}
```

#### constructor(provider)

##### provider

```ts
type ProviderConfiguration {
  origin: String,
  headers?: Object,
  resources: [Resource]
}
```

##### provider.origin

`origin` is a required field.<br>
`origin` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) which describes a [URL Origin](https://developer.mozilla.org/en-US/docs/Web/API/URL/origin) (and path if applicable) which the external API service is running on.<br>
`origin` must not end with a trailing slash.<br><br>
 
```ts
// A URL Origin
origin: 'https://api.example.io'

// A URL Origin (with a path)
origin: 'https://api.stripe.com/v1'
```

##### provider.headers

`headers` is an optional field.<br>
`headers` must be an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).<br>
`headers` should only include keys in lowercase.<br>
`headers` defines the [request headers](https://developer.mozilla.org/en-US/docs/Web/API/Request/headers) for this provider.<br>

```ts
// An example set of headers (sent to the external service)
headers: {

    // Add the secret key token as require with Stripe
    'authorization': 'Bearer {your_secret_stripe_key}',
    
    // Add the content type (must be 'application/json' or 'application/x-www-form-urlencoded')
    'content-type': 'application/x-www-form-urlencoded'
}
```

##### provider.actions

`actions` is a required field.<br>
`actions` must be an array of [Actions](#action).<br>
`actions` must contain at least one action.<br>
`actions` defines the action functions which can be called from the provider instance.<br>

```ts
// Add the set of actions
actions: [
  new Action({
    name: 'createCustomer',
    endpoint: '/customers',
    method: 'POST',
    fields['email']
  })
]
```

### Actions

Actions are actions or methods which can be called from a [Provider](#provider).<br>

When actions are called they make [Requests](https://developer.mozilla.org/en-US/docs/Web/API/Request) to their specified endpoints.<br>

Actions when called return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which contains their [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) data as [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)<br>

```ts
class Action {
 
  constructor(action: ActionConfiguration);
 
}
```

#### constructor(action)

##### action

```ts
type ActionConfiguration {
  name: String,
  endpoint: String,
  headers: Headers?,
  method: String,
  fields?: [String]
}
```

##### action.name

`name` is always required.<br>
`name` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) and defines a function which can be called on a [Provider](#provider).<br>

```ts
// An example name for an action 
name: 'createCustomer'

// Another example name for an action
name: 'updateCustomer'

// Another example name for an action
name: 'findCustomer'
```

##### action.endpoint

`endpoint` is always required.<br>
`endpoint` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) which describes a URL path (and optionally search params) which the resource can be accessed from.<br>
`endpoint` must not end with a trailing slash.<br>
`endpoint` can have dynamic paramaters by using the wrapping the paramater in braces like `{param}`.<br>

```ts
// A static endpoint
endpoint: '/customers'

// A dynamic endpoint
endpoint: '/customers/{id}'

// Anonther dynamic endpoint
endpoint: 'customers?email={email}'
```

##### action.headers

`headers` is an optional field.<br>
`headers` must be an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).<br>
`headers` should only include keys in lowercase.<br>
`headers` defines the [request headers](https://developer.mozilla.org/en-US/docs/Web/API/Request/headers) for this action.<br>
`headers` will extend (and take priority with conflicts) over any [headers configured on the provider](#providerheaders).<br>

```ts
// An example set of headers (sent to the external service)
headers: {
    
    // Add the content type (must be 'application/json' or 'application/x-www-form-urlencoded')
    'content-type': 'application/x-www-form-urlencoded'
}
```

##### action.method

`method` is a required field.<br>
`method` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) and be one of the supported [methods](https://developer.mozilla.org/en-US/docs/Web/API/Request/method) in [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).<br>

```ts
// POST method
method: 'POST'

// GET method
method: 'GET'
```

##### action.fields

`fields` is an optional field.<br>
`fields` must be an array of [Strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) which defines the minimum required fields in the [request body](https://developer.mozilla.org/en-US/docs/Web/API/Body/body).<br>
`fields` will be passed in the [resource response params](#resourceresponseparams).

```ts
// An example set of fields required by the action
fields: ['email', 'description']
```

### Request Headers

##### headers

Each of the headers from the [Request Headers](https://developer.mozilla.org/en-US/docs/Web/API/Request/headers) are casted to lowercase and bound to the `headers` object which contains two helper functions (match and contains).<br>

```ts
// An example headers object
headers: {
  'authorization': 'your-secret-key',
  'content-type': 'application/json'
}
```

##### headers.equals(header, value)

Checks whether a specific header matches a value and returns `true` if the `header` matches the `value`.<br>

###### header
`header` is a required field.<br>
`header` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).<br>
`header` must be lowercase.<br>

###### value
`value` is a required field.<br>
`value` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).<br>


##### headers.contains(header, value)

Checks whether a specific header matches a value and returns `true` if the `header` contains the `value`.<br>

###### header
`header` is a required field.<br>
`header` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).<br>
`header` must be lowercase.<br>

###### value
`value` is a required field.<br>
`value` must be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).<br>

### CLI Documentation

##### Configuration

After installing Restt-CLI a file named `restt.config.json` will be added to your project directory.<br>

It includes all of the the following default configurations required for running Restt-CLI:<br>

###### restt.config.json
```ts
{
  // Default properties relating to Cloudflare
  "cloudflare": {

    // Cloudflare domain zone (needs to be configured for deployment with WorkersKV)
    "account": ""

    // Cloudflare email address (needs to be configured for deployment)
    "email": "",

    // Cloudflare authentication key (needs to be configured for deployment)
    "key": "",

    // Cloudflare domain zone (needs to be configured for deployment)
    "zone": ""
  },

  // Default properties relating to Cloudworker
  "cloudworker": {

    // Cloudworker debug flag (optional)
    "debug": false,

    // Cloudworker deployment port (needs to be configured for serving)
    "port": 3000
  },

  // Default properties relating to Cloudflare WorkersKV
  "workerskv": {

    // Namespaces to use in Cloudflare WorkersKV (optional)
    // Expects an array of strings of which each must be uppercase A-Z (e.g. DEMOSPACE)
    "namespaces": []
  }
}
```

All properties in `restt.config.json` will be bound to the `configuration` object which is accessible from within any edge worker script which is [served](#serving-for-development) or [deployed](#deploying-to-the-edge) with Restt-CLI.<br>

###### restt.config.json

```ts
{
  "cloudworker": {
    "debug": false,
    "port": 3000
  },
  ...
  "credentials": {
    "authkey": "12345678"
  }
}
```

###### example-worker.js

```ts
// Outputs "12345678" to the console
console.log(configuration.credentials.authkey);
```

If you also have a `webpack.config.js` in your project directory then Restt-CLI will also load and use it.<br>

You can also add webpack configurations to your `restt.config.json` which will be prioritised over your `webpack.config.js`.<br>

### Serving for development

Restt-CLI makes developing your edge worker services with Restt much easier and faster.<br>

Running the following command will automatically build and serve your edge worker service.<br>

```bash
$ restt serve [script]
```

`script` must point to the path where your edge worker script is located (e.g. `src/helloworld-service.js`).<br>

If any changes are detected to your script will be automatically recompiled and hot-reloaded.<br>

[Service origins](https://github.com/resttjs/restt/blob/README.md#serviceorigin) used in [Restt Services](https://github.com/resttjs/restt/blob/README.md#service) will be automatically rewritten based on your [cloudworker.port](#configuration).<br>

Example: `https://demo.restt.io` becomes `http://localhost:3000/demo.restt.io`<br>

### Deploying to the edge

Restt-CLI can instantly build and distribute your edge worker services in production mode to all over the globe.<br>

Running the following command will automatically build and distribute your edge worker script:<br>

```bash
$ restt deploy [script]
```

`script` must point to the path where your worker script is located (e.g. `src/helloworld-service.js`).<br>

When deploying for production your edge worker script will be shipped to [Cloudflare Workers](https://developers.cloudflare.com/workers/) using the credentials specified in your [restt.config.json](#configuration) file.<br>

Please ensure that you have setup Cloudflare Workers on your Cloudflare account if you are deploying.<br>

When using [Cloudflare WorkerKV](https://developers.cloudflare.com/workers/kv/), please also ensure that you have WorkerKV configured on your account.<br>

## Supporting

Restt is generously supported month to month by [these amazing people, teams and organisations](https://github.com/resttjs/restt/blob/master/SUPPORTERS.md)!

If you appreciate Restt and would like to regularly support the maintenance of it, please consider becoming a supporter, partner or sponsor through [Patreon](https://www.patreon.com/larkin_nz).<br>

One-time donations can also be made through [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=daniel@larkin.nz&lc=NZ&item_name=Donation&no_note=0&cn=&curency_code=USD&bn=PP-DonationsBF:btn_donateCC_LG.gif:NonHosted).<br>

## Contributing

Please feel free to implement any features you feel Restt is missing by submitting a [pull request](https://github.com/resttjs/restt/pulls).<br>

Alternatively, you can submit a [feature request](https://github.com/resttjs/restt/issues/new) and I will review it as soon as possible.<br>

All contributions are greatly appreciated!<br>

## Security

Restt has been built with ultimate security in mind and has as zero dependencies to mitigate most risks, vulnerabilities and exploits which can come with using third-party packages.<br>

[Restt-CLI](https://github.com/resttjs/restt-cli) which is highly recommended alongside Restt contains both [Webpack](https://github.com/webpack/webpack) and [Cloudworker](https://github.com/dollarshaveclub/cloudworker) as dependencies.<br>

At present it is incredibly difficult to create software which uses JavaScript packages or modules without a compilation tool such as Webpack<br>

Likewise, it is a difficult task to deploy edge workers locally for development and testing without a runner like Cloudworker.<br>

Webpack and Cloudworker are both made by highly respectable developers, teams and organisations who also are very security conscious.<br>

No package or module can guarantee complete security of your code and any data which passes through it.<br>

Security is at the core of Restt and I aim to continue to do all I can to improve the security for anyone using Restt.<br>

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Daniel Larkin
