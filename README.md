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

Crafted for people who love fast development cycles, quality code, security, all while maintaining flexiblity of design.<br>

Perfect for building anything from MVPs, to large entreprise applications, to development exercises in the classroom.<br>

## Benefits

###### Enjoy all of these amazing features with Restt

#### Safe and secure code

Built with zero[*](https://restt.io/#Security) package dependencies to ensure your services are safe and secure from any [vulnerabilities](https://hackernoon.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5)<br>

#### Simple external service integration

Easily connect external API services you use like [Stripe](https://stripe.com) with [Providers](https://restt.io/#Provider)<br>

#### Code flexibility

Shape your code the way you like it with few rules and restrictions

###### And even more with Restt-CLI

#### Serve your workers locally

Testing your edge workers services is easily served to you locally with [Cloudworker](https://github.com/dollarshaveclub/cloudworker)<br>

#### Auto-compilation and hot-reloading

Automatically recompile and reload your edge worker services on any changes when developing for testing in an instant
‍
#### Intelligent debugging tools

No more ugly stack traces - enjoy intelligently highlighted error code segments in your terminal
‍
#### Rapid production distribution

Distribute your edge worker services to people all around the globe instantly with [Cloudflare Workers](https://developers.cloudflare.com/workers/)<br>


## Overview

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Supporters](#supporters)
- [Contributing](#contributing)
- [Licence](#licence)

## Installation

[Restt](https://github.com/resttjs/restt) is available through the [npm registry](https://www.npmjs.com/package/restt):

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

Now you're ready to deploy for production with Restt-CLI:<br>

```bash
$ restt deploy helloworld-service.js
```

Congratulations - you've succesfully built and shipped your services to the edge using [Cloudflare Workers](https://developers.cloudflare.com/workers/) with Restt!<br>

You can check a more detailed overview of the above in the [hello world example repository](https://github.com/resttjs/helloworld-example).<br>

Check out the [store example repository](https://github.com/resttjs/store-example) which includes [Stripe](https://stripe.com) and [Cloudflare WorkersKV](https://developers.cloudflare.com/workers/kv/).<br>

## API Documentation

[Check out the documentation](https://restt.io/#API-Documentation)

## Supporting

Restt is generously supported month to month by [these amazing people, teams and organisations](https://github.com/resttjs/restt/blob/master/SUPPORTERS.md)!

If you appreciate Restt and would like to regularly support the maintenance of it, please consider becoming a [supporter](https://www.patreon.com/join/larkin_nz/checkout?rid=3211209), [partner](https://www.patreon.com/join/larkin_nz/checkout?rid=3253979) or [sponsor](https://www.patreon.com/join/larkin_nz/checkout?rid=3253984).<br>

One-time donations can also be made through [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=daniel@larkin.nz&lc=NZ&item_name=Donation&no_note=0&cn=&curency_code=USD&bn=PP-DonationsBF:btn_donateCC_LG.gif:NonHosted).<br>

## Contributing

Please feel free to implement any features by submitting a [pull request](https://github.com/resttjs/restt/pulls).<br>

Alternatively, you also can submit a [feature request](https://github.com/resttjs/restt/issues/new).<br>

All contributions are greatly appreciated!<br>

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Daniel Larkin
