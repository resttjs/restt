/* Resource class for Restt */

// Import the required modules from Restt
import { error, queryParams } from './utils';

// Define the Resource class
export class Resource {
  
  constructor({ endpoint, method, cache, fields, response }) {

    // Check that the endpoint exists
    if (!endpoint) error(`ResourceError: Missing property 'endpoint' - expects a valid URL path`);

    // Check that the response exists
    if (!response) error(`ResourceError: Missing property 'response' - expects a valid 'Function' which returns a 'Response'`);

    // Bind all of the properties to the resource
    this.endpoint = endpoint;
    this.method = (method) ? method.toUpperCase() : 'GET';
    this.cache = (cache) ? cache : false;
    this.fields = (fields) ? fields : [];
    this.params = [];
    this.response = response;

  }

  // Generate the url regex
  urlRegex() {

    // Escape all the characters
    return new RegExp(this.url.replace(/(\?)/g, `\\?`).replace(/(\.)/g, `\\.`).replace(/(\^\/\\\?)/g, '^/\?'), 'ig');
  }

  // Check whether the request URL and method matches this resource
  match(req) {

    // Check whether the request url matches the regex
    const url = this.urlRegex().exec(req.url);

    // Check whether the request method matches the resource method
    const method = (this.method.toUpperCase() == req.method.toUpperCase());

    // Return whether there is a match
    return (url && method);
  }

  // Resolve the response for a resource
  async resolve(req) {

    // Parse a URL and extract the params from it
    let params = this.urlRegex().exec(req.url).filter((p, i) => i > 0);
    
    // Convert the list of params to an object with keys and values
    params = params.reduce((p, param, i) => ({ ...p, [this.params[i]]: (param != '') ? param : null }), {});

    // Merge the list of params with the computed query params
    params = { ...params, ...queryParams(req.url) };

    // Define a variable for the fields
    let fields

    // Define a variable for the error
    let error;

    // Attempt to parse to JSON
    try {

      // Ready the request body or store an empty object
      fields = (req.body) ? JSON.parse(await req.text()) : {};
    
    } catch(e) {

      // Configure the error to a 500 internal
      error = {
        headers: this.headers,
        body: {
          message: `500: An internal error occurred when attempting to parse the request body.`
        },
        status: 500
      };

    }

    // Return if we have an error
    if (error) return error;

    // Create a list of missing params and fields
    const missing = [...this.params, ...this.fields];

    // Create the set of properties to send to the response function
    const properties = { ...params, ...fields };

    // Iterate through each of the properties
    for (const property of Object.keys(properties)) {

      // If the property is set and is in the missing list then remove it
      if (missing.indexOf(property) > -1 && properties[property] != null) missing.splice(missing.indexOf(property), 1);
    }

    // If there are missing fields then return a 400 error
    if (missing.length > 0) return {
      headers: this.headers,
      body: {
        message: `400: Request body is missing the following ${((fields.length > 1) ? 'fields' : 'field')}: ${missing.join(', ')}`
      },
      status: 400
    };

    // Create an empty object of headers
    const requestHeaders = {
      
      // Check whether a header matches a value
      equals(header, value) {
        return (requestHeaders[header] == value);
      },

      // Check whether a header contains a value
      contains(header, value) {
        return (requestHeaders[header].indexOf(value) > -1);
      }
    }

    // Check if we have headers with the standard Fetch Headers spec
    if (!req.headers.forEach) {
      
      // Add the headers for Cloudflare (standard Fetch Headers spec)
      for (const [header] of req.headers.entries()) {
        requestHeaders[header.toLowerCase()] = req.headers.get(header);
      }

    // Check if we have headers with the Cloudworker Headers spec
    } else if (req.headers.forEach) {
      
      // Add the headers for Cloudworker
      req.headers.forEach((value, header) => requestHeaders[header.toLowerCase()] = value);
    }

    // Define the response key
    let response;

    // Attempt to compute the response
    try {

      // Compute the response from the resources response function (with headers)
      response = await this.response({ ...properties, headers: requestHeaders });

    } catch (e) {

      // Log out the error
      console.error(e);

      // Throw a 500 error
      return {
        headers: this.headers,
        body: {
          message: `500: An internal error occurred when generating the response for this resource.`
        },
        status: 500
      }
    }

    // Extend the response headers with the service headers (response headers take priority)
    response.headers = { ...this.headers, ...response.headers };

    // Add a cURL flag in the headers if cURL was used so that we can beautify output
    if (requestHeaders['user-agent'] && requestHeaders['user-agent'].indexOf('curl') > -1) response.headers['curl'] = true;

    // Check if the cache is set to be used and that there are no cache control headers
    if (this.cache && (!response.headers['cache-control'] || !response.headers['Cache-Control'])) {

    // Add the cache control headers (default cache time is 60 seconds)
      response.headers = {
        ...response.headers,
        'cache-control': `max-age=${((this.cache == true) ? 60 : this.cache)}` 
      };
    }

    // Return the response
    return response;
  }

}