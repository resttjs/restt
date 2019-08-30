/* Request class for Restt */

// Import the required modules from Restt
import { error, encodeForm } from './utils';

// Define the Request class
export class Request {

  constructor({ url, method, headers, body }) {

    // Check that a URL is defined (this should never happen)
    if (!url) return error(`RequestError: Missing parameter 'url' - expects a valid URL`);

    // Define url for the request
    this.url = url;

    // Define the method for the request
    this.method = (method) ? method.toUpperCase() : 'GET';

    // Prevent any case sensitivity issues
    if (headers['Content-Type']) {

      // Bind the lowecase occurance
      headers['content-type'] = headers['Content-Type'];

      // Remove the uppercase occurance
      delete headers['Content-Type'];
    }

    // Define the body for the request (if applicable)
    this.body = (body && this.method != 'GET' && this.method != 'HEAD') ? body : null;

    // Define the headers for the request
    this.headers = (this.body) ? { 'content-type': 'application/json' } : {};
    this.headers = (headers) ? { ...this.headers, ...headers } : { ...this.headers };

    // Check that that the content type is accepted and format the body (if there is one)
    if (this.headers['content-type'] == 'application/json' && this.body) {

      // Convert the body to application/json
      this.body = JSON.stringify(this.body);

    } else if (this.headers['content-type'] == 'application/x-www-form-urlencoded' && this.body) {

      // Convert the body to application/x-www-form-urlencoded
      this.body = encodeForm(body);

    } else if (this.body) {

      // Throw an error as the content type is not supported
      return console.error(`RequestError: Unsupported content type - must be either 'application/json' or 'application/x-www-form-urlencoded'`);
    }

  }

  // Await for the text response of a request
  async text() {

    // Prevent case differences
    if (this.headers['Accept']) delete this.headers['Accept'];

    // Create a new fetch request
    const request = await fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body
    });
    
    // Define the reponse body
    const response = await request.text();

    // Return the response body
    return response;
  }

  // Await for the JSON response of a request
  async json() {

    // Prevent case differences
    if (this.headers['Accept']) delete this.headers['Accept'];

    // Add the accept header
    this.headers['accept'] = 'application/json';

    // Create a new fetch request
    const request = await fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body
    });

    // Create a new fetch request and return the text
    const response = await request.text();

    // Attempt to parse the response body
    try {

      // Attempt to parse the result as JSON
      const json = JSON.parse(response);

      // If there is json return the reponse
      if (json) return { ...json, success: true };

    } catch (e) {

      // Handle the response when there is no response body or the result is not JSON
      return ((request.status == 202) ? { success: true } : { status: request.status, success: false });
    }
  }

  // Await for the array buffer response of a request
  async buffer() {

    // Create a new fetch request
    const request = await fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body
    });
    
    // Define the reponse buffer
    const response = await request.arrayBuffer();

    // Return the response buffer
    return response;
  }
}