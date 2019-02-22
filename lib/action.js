/* Action class for Restt */

// Import the required modules from Restt
import { Request } from './request';
import { error } from './utils';

// Define the Action class
export class Action {
  
  constructor({ name, endpoint, method, headers, fields }) {

    // Check that the name exists
    if (!name) error(`ActionError: Missing property 'name' - expects a valid string`);

    // Check that the endpoint exists
    if (!endpoint) error(`ActionError: Missing property 'endpoint' - expects a valid URL path`);

    // Bind all of the properties to the action
    this.name = name;
    this.endpoint = endpoint;
    this.method = (method) ? method.toUpperCase() : 'GET';
    this.headers = (headers) ? headers : {};
    this.fields = (fields) ? fields : [];
    this.params = [];

  }

  async resolve({ ...payload }) {

    // Create a list of missing fields
    const missing = [];

    // If there are no params
    this.caseURL = this.url;

    // Check the list of URL params
    for (const param of this.params) {

      // Check if the URL params is in the payload
      if (payload[param]) {

        // Bind the param data into the URL (for this execution / case only)
        this.caseURL = this.caseURL.replace(new RegExp(`({${param}})`, 'ig'), payload[param]);

      } else {

        // Add the param to the list of missing params and fields
        missing.push(param);
      }
    }

    // Iterate through each of the expected fields
    for (const field of this.fields) {

      // Check if the body field is in the payload
      if (!payload[field]) {

        // Add the param to the list of missing params and fields
        missing.push(field);
      }
    }

    // If there are missing fields then throw and error
    if (missing.length > 0) return error(
      `ActionError: '${this.name}' was called but is missing the following ${((missing.length > 1) ? 'parameters' : 'paramater')}: ${missing.join(', ')}.`
    );

    // Create the request for the action
    const request = new Request({
      url: this.caseURL,
      headers: this.headers,
      method: this.method,
      body: payload
    });

    // Return the resolved result of the request as JSON
    return await request.json();
  }

}