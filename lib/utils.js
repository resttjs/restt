/* Generic utility functions for Restt */

// Create an error log and terminate the scripts
export const error = (description) => {

  // Throw an error which will terminate the code from running
  throw(description);
}

// Convert JSON to www-form-urlencoded
export const encodeForm = (form, nesting = '') => {

  // Store the name of the field
  let field = '';

  // Shorthand the current function
  const en = encodeForm;

  // Shorthand the uri encode / escape function
  const es = encodeURIComponent;

  // Map each of the pairs in the object
  const pairs = Object.entries(form).map(([key, value]) => {

    // Handle a second base case where the value to encode is an array
    if (value instanceof Array) {
      
      // Create a key for subkeys
	    let key1 = 0;
      
      // Map the subvalues of an array
      return value.map((value1) => {

        // Define the field name based on whether there is recursion or not
        field = (nesting == '') ? `${nesting}${key}[${key1++}]` : `${nesting}[${key}][${key1++}]`;
		
        // Check if the subvalue is an object and call the function recursively if so
        if (typeof value1 === 'object') return en(value1, field);

        // Create the key pair
        return `${es(field)}=${es(value1)}`;
      }).join('&');

    } else if (typeof value === 'object') {

      // Define the field name based on whether there is recursion or not
      field = (nesting == '') ? `${nesting}${key}` : `${nesting}[${key}]`;

      // Call the function recursively for the object
      return en(value, field);

    } else {

      // Define the field name based on whether there is recursion or not
      field = (nesting == '') ? `${nesting}${key}` : `${nesting}[${key}]`;
      
      // Create the key pair
      return `${es(field)}=${es(value)}`;
    }
  });

  // Return the www-form-urlencoded data
  return pairs.join('&').replace(/%20/g, '+');
}

// Extract the query paramaters from a URL
export const queryParams = (url) => {

  // Create an empty object of params
  const params = {};

  // Decode the url
  const decoded = decodeURI(url);

  // Return if there are no query params
  if (decoded.indexOf('?') == -1) return params;
  
  // Split up each of the params
  const entries = decoded.replace(/((.*)\?)/, '').split('&').map(param => param.split('='));

  // Bind each of the params with values
  for (const [key, value] of entries) {
    
    // Check if the value is 'true' or if the value is not set for the key
    if (value == 'true' || !value) {

      // Add the param as a true boolean value
      params[key] = true;
    
    // Check if the value is 'false'
    } else if (value == 'false') {

      // Add the param as a false boolean value
      params[key] = false;
    
    // Check if the param is a number
    } else if (Number(value)) {

      // Add the param as a number value
      params[key] = Number(value);
    
    // Otherwise add the parameter as a string
    } else params[key] = value;
  }

  // Return the params with their values
  return params;
}
