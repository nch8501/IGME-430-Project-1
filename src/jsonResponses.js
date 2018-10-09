// object to hold the game reviews
const reviews = {};

// handles GET responses
const respondToGET = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// handles HEAD responses
const respondToHEAD = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// function to retrieve a list of reviews
const getReviewList = (request, response, action) => {
  // check if HEAD request
  if (action === 'HEAD') {
    return respondToHEAD(request, response, 200);
  }

  // create response object
  const responseJSON = {
    reviews,
  };

  return respondToGET(request, response, 200, responseJSON);
};

// function to retrieve a specific review
const getReview = (request, response, review, action) => {
  // check if HEAD request
  if (action === 'HEAD') {
    return respondToHEAD(request, response, 200);
  }
  console.dir(review);
  console.dir(action);

  // create response object
  const responseJSON = {
    reviews,
  };

  // responseJSON.reviews = reviews[review];


  return respondToGET(request, response, 200, responseJSON);
};

// function to add review
const addReview = (request, response, body) => {
  console.dir('addReview');
  // default json message
  const responseJSON = {
    message: 'Game name, genre, review, and score are required',
  };

  // check body params
  if (!body.name || !body.genre || !body.review || !body.score) {
    responseJSON.id = 'missingParams';
    return respondToGET(request, response, 400, responseJSON);
  }

  // default status code to 201 created
  let responseCode = 201;

  // check if review already exists
  if (reviews[body.name]) {
    // change responseCode to updated
    responseCode = 204;
  } else {
    // create new review
    reviews[body.name] = {};
  }

  // add or update fields
  reviews[body.name].name = body.name;
  reviews[body.name].genre = body.genre;
  reviews[body.name].review = body.review;
  reviews[body.name].score = body.score;

  // if created, send to respondToGET
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondToGET(request, response, responseCode, responseJSON);
  }

  // if updated, send to respondToHEAD
  return respondToHEAD(request, response, responseCode);
};

const notReal = (request, response, action) => {
  if (action === 'HEAD') {
    return respondToHEAD(request, response, 404);
  }

  const responseJSONObject = {
    id: 'notFound',
    message: 'The resource you were looking for was not found',
  };

  return respondToGET(request, response, 404, responseJSONObject);
};


module.exports = {
  notReal,
  getReviewList,
  getReview,
  addReview,

};
