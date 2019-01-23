/* Response class for Restt */

// Define the Response class
export class Response {

  constructor({ headers, body, status }) {

    // Bind the values or their defaults to the response
    this.headers = (headers) ? headers : {};
    this.status = (status) ? status : (body) ? 200 : 404;
    this.body = (body) ? body : ContentDefaults[this.status].body;

  }
}

// Define the default page contents for each status
const ContentDefaults = {
  200: {
    body: {
      message: '200: Success'
    }
  },
  403: {
    body: {
      message: '403: Access to resource on this service has been denied.'
    }
  },
  404: {
    body: {
      message: '404: Resource cannot be found on this service.'
    }
  },
  500: {
    body: {
      message: '500: An internal error has occurred on this service.'
    }
  }
}