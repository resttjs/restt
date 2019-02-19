/* RequestHandler and ResponseHandler classes for Restt */

// Import the required modules from Restt
import { Response as ResttResponse } from './response';


// Define the RequestHandler class
export class RequestHandler {

  constructor(event) {

    // Return the request event
    return event.request;
  }

}

// Define the ResponseHandler class
export class ResponseHandler {

  constructor(event) {

  }

  // Convert the Restt Response int a Fetch API Response
  async render(response) {

    // If the response is 404
    if (response == 404) response = new ResttResponse({ status: 404 })

    // Wait for the response
    response = await response;

    // Extract the keys from the response and create a 404 response if there is none set
    let { body, headers, status } = (response) ? response : new ResttResponse({ status: 404 });

    // Check if we're running in development mode
    const development = (process && process.env && process.env.NODE_ENV == 'development');

    // Stringify (and beautify in development or when cURL is used)
    body = JSON.stringify(body, null, (development || headers['curl']) ? 2 : 0);

    // If called by cURL (for testing)
    if (headers['curl']) {

      // Add two new lines after the code for tidy output into the terminal
      body = `\n${body}\n\n`;

      // Delete the cURL flag
      delete headers['curl'];
    }
    
    // Create a new Fetch Response (not to be confused with Restt Response)
    return new Response(body, {

      // Add the headers to the response
      headers: {
        ...headers,
        'content-type': 'application/json'
      },
      
      // Add the status to the response
      status

    });
  }
}