/* Provider class for Restt */

// Import the required modules from restt
import { Action } from './action';
import { error } from './utils';

// Define the Provider class
export class Provider {

  constructor({ origin, headers = {}, actions }) {

    // Check whether there is an origin set
    if (!origin) return error(`ProviderError: Missing property 'origin' - expects a valid URL origin`);

    // Interate through each of the actions of the provider
    for (const action of actions) {

      // Check that we are working with an Action
      if (!(action instanceof Action)) return error(`ProviderError: Invalid property 'actions' - expects a valid array of one or more 'Action' instances`);

      // Generate and bind the computed URL for the action
      action.url = `${origin}${action.endpoint}`.replace(/(\{([^\/\?\&\=]*)\})/g, (match, template, param) => {

        // Add the URL param to the resource or action's list of URL params
        action.params.push(param);

        // Return the param as it already was
        return `{${param}}`;
      });

      // Add the provider headers to the action
      action.headers = { ...headers, ...action.headers };

      // Prevent any header case sensitivity issues
      if (headers['Content-Type']) {

        // Bind the lowecase occurance
        headers['content-type'] = headers['Content-Type'];

        // Remove the uppercase occurance
        delete headers['Content-Type'];
      }

      // Check if a content type is set
      if (action.headers && action.headers['content-type']) {

        // Check whether the content type is supported
        if (action.headers['content-type'] != 'application/json' && action.headers['content-type'] != 'application/x-www-form-urlencoded') {

          // Throw an error as the content type is not supported
          return error(`ProviderError: Unsupported content type - must be either 'application/json' or 'application/x-www-form-urlencoded'`);
        }
      }

      // Add the action function to the provider
      this[action.name] = async(payload) => {

        // Await for the action to make a request
        return await action.resolve(payload);
      }

    }

  }
}