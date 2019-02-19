/* Service class for Restt */

// Import the required modules from Restt
import { Resource } from './resource';
import { error } from './utils';

// Define the Service class
export class Service {

  constructor({ origin, headers, passthrough, resources }) {
    
    // Check that we have an origin
    if (!origin) return error(`ServiceError: Invalid property 'origin' - expects a valid URL origin`);

    // Bind the origin
    this.origin = origin;

    // Bind the route base (unmodified origin)
    this.route = origin;

    // Bind the headers
    this.headers = (headers) ? headers : {};

    // Bind the passthrough (if true 404 will be thrown when no resource is matched on the resource)
    this.passthrough = (passthrough) ? passthrough : false;

    // Bind the list of resources
    this.resources = resources;

    // Interate through each of the resources on the service
    for (const resource of resources) {

      // Check that we are working with a Resource
      if (!(resource instanceof Resource)) return error(`ServiceError: Invalid property 'resources' - expects a valid array of one or more 'Resource' instances`);

      // Attempt to hook into Restt-CLI
      try {

        // If the worker is running from Restt-CLI
        if (ResttCLI && origin.indexOf('http://localhost') != 0) {

          // Append 'http://localhost:port/' before binding the origin (development mode)
          this.origin = origin.replace(/((http|https)\:\/\/)/, `http://localhost:${configuration.cloudworker.port}/`);
        }

      } catch (e) {};

      // Add the headers to the resource response
      resource.headers = headers;

      // Generate and bind the computed URL for the resource
      resource.url = `${this.origin}${resource.endpoint}`.replace(/(\{([^\/\?\&\=]*)\})/g, (match, template, param) => {
    
        // Add the URL param to the resource's list of params
        resource.params.push(param);
  
        // Convert the template param to a regex match group
        return `([^\/\?\&\=]*)`;
      });

    }

  }
}