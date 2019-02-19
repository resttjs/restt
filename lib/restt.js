/* Restt (application) class for Restt */

// Import the required modules from Restt
import { Service } from './service';
import { RequestHandler, ResponseHandler } from './handlers';
import { error } from './utils';

// Create a variable for the instance of Restt
let instance;

// Define the Restt class
export class Restt {

  constructor() {

    // Return the existing instance of Restt if there is one
    if (instance) return instance;

    // Create a list of origins (for Restt-CLI)
    this.origins = [];

    // Create a list of services
    this.services = [];

    // Bind the handler to the fetch event listener (when not being read by Restt-CLI)
    addEventListener('fetch', (event) => {

      // Create the request handler
      const req = new RequestHandler(event);

      // Create the response handler
      const res = new ResponseHandler(event);

      // Select the current service if possible based on the origin
      const service = this.services.find((other) => req.url.indexOf(other.origin) > -1);

      // Check whether the requested origin exists
      if (service) {
      
        // Check each of the resources for the requested resource (which match the origin)
        for (const resource of service.resources) {

          // Check if the resource matches the request
          if (resource.match(req)) {

            // If the resource is a GET and is cached
            if (resource.method == 'GET' && resource.cache) {

              // Load the default caches
              const cache = caches.default;

              // Handle the cached response
              const cachedResponse = async() => {

                // Check for a match of the cached request
                const cached = await cache.match(event.request.url);

                // If we have a cached version of the request then return it
                if (cached) return cached;

                // Wait for the response to render
                const response = await res.render(resource.resolve(req));

                // Clone the response and cache it
                cache.put(event.request.url, response.clone());

                // Return the response
                return response;
              };

              // Serve the response from either the cache or the resource
              return event.respondWith(cachedResponse());
            }

            // Serve the response from a resource
            return event.respondWith(res.render(resource.resolve(req)));
          }

        }

        // Send a 404 response to the client as the resource was not found (when passthrough false on the resource)
        if (!service.passthrough) event.respondWith(res.render(404));
      }

    });

    // Bind this instance of Restt to be the singular instance
    instance = this;
  }

  // Bind the service to the application
  use(service) {

    // Check that we are working with an Service
    if (!(service instanceof Service)) return error(`ResttError: Invalid call to 'use' - expects a valid 'Service' instance`);

    // Attempt to hook into Restt-CLI
    try {

      // Check if the origin is in the list of origins (for some logging and cli features)
      if (this.origins.indexOf(service.origin) == -1) {

        // Add the origin to the origins
        this.origins.push(service.orgin);
      
        // Check if running from Restt-CLI
        if (ResttCLI) {

          // Add a log with the service domain
          console.log(`\x1b[32mSuccessfully started service: \x1b[36m${service.origin}`);

          // Attempt to save the origin to the configuration file
          if (ResttCLI && ResttCLI.storeRoute) ResttCLI.storeRoute(service.route);
        }
      }

    } catch(e) {};

    // Find the index of another service with the same origin if there is one
    const current = this.services.findIndex(({ origin }) => service.origin == origin);

    // If there is already a service with the same origin
    if (current > -1) {

      // Update the service passthrough
      if (service.passthrough) this.services[current].passthrough = service.passthrough;

      // Append the new serive headers
      if (service.headers) this.services[current].headers = {
        ...this.services[current].headers,
        ...service.headers
      }

      // Append the new service resources
      return this.services[current].resources = [
        ...this.services[current].resources,
        ...service.resources
      ]

    }

    // Add the service to the restt instance
    this.services.push(service);
  }

}