/**#ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
**/

//handles what to do after the review has been set to the server
const handleSentReview = xhr => {
  //create elements
  let title = "";
  let message = "";

  //handle status codes
  switch (xhr.status) {
    case 201:
      title = `Review Submitted Successfully`;
      break;
    case 204:
      title = `Review Updated Successfully`;
      break;
    case 400:
      title = `Bad Request`;
      break;
    default:
      title = `Error code not implemented by client.`;
      break;
  }

  //check if object should be parsed
  if (xhr.response) {
    const obj = JSON.parse(xhr.response);
    //check if there is a message to display
    if (obj.message) {
      message = `Message: ${obj.message}`;
    }
  }

  //send alert
  alert(title + '\n' + message);

  //refresh review list
  getReviewList();
};

//handles displaying the chosen review
const displayReview = xhr => {
  //get review section
  const reviewSection = document.querySelector('#reviewSection');

  //check if object should be parsed
  if (xhr.response) {
    //parse object
    const obj = JSON.parse(xhr.response);

    //create tags
    const h1 = document.createElement('h1');
    const genre = document.createElement('h3');
    const body = document.createElement('p');
    const score = document.createElement('p');

    //check if there is a message to display
    if (obj.message) {
      h1.innerHTML = `Message: ${obj.message}`;
    }

    //check if there is a review to display
    if (obj.review) {
      h1.innerHTML = obj.review.name;
      genre.innerHTML = `<b>Genre:</b> ${obj.review.genre}`;
      body.innerHTML = obj.review.review;
      score.innerHTML = `<b>Score:</b> ${obj.review.score}`;
    }
    //clear reviewSection
    reviewSection.innerHTML = "";

    //append tags
    reviewSection.appendChild(h1);
    reviewSection.appendChild(genre);
    reviewSection.appendChild(body);
    reviewSection.appendChild(score);
  }
};

//method called after clicking on a review, used to get the review information from the server
const getReview = reviewInfo => {
  //grab the review's action, method, and name
  const reviewAction = reviewInfo.getAttribute('action');
  const reviewMethod = reviewInfo.getAttribute('method');
  //set reviewName as parameter to pass to url
  const reviewName = `reviewName=${reviewInfo.value}`;

  //create new Ajax request
  const xhr = new XMLHttpRequest();
  //set method and url
  xhr.open(reviewMethod, reviewAction + "?" + reviewName);
  //set our requested response type in hopes of a JSON response
  xhr.setRequestHeader('Accept', 'application/json');

  //set our function to display the review
  xhr.onload = () => displayReview(xhr);

  //send the request
  xhr.send();
  return false;
};

//method to display the list of reviews
const displayReviewList = xhr => {
  //check for response
  if (xhr.response) {
    //get review list section
    const reviewListSection = document.querySelector('#reviewListSection');

    //clear review list section
    reviewListSection.innerHTML = "";

    //parse the response
    const obj = JSON.parse(xhr.response);

    //check if any reviews exist
    if (obj.reviews) {
      //go through each property in the object
      for (let key in obj.reviews) {
        //check only for original properties
        if (obj.reviews.hasOwnProperty(key)) {
          //create a p tag
          const p = document.createElement('p');

          //set tag's inner html
          p.innerHTML = obj.reviews[key].name;

          //set the value
          p.value = `${key}`;

          //set the action and method
          p.setAttribute('action', '/getReview');
          p.setAttribute('method', 'get');

          //add onclick event to get the review of the tag
          p.addEventListener('click', function () {
            getReview(p);
          });

          //add review to list
          reviewListSection.appendChild(p);
        }
      }
    }
  }
};

//method to send the review to the server
const sendReview = (e, reviewForm) => {
  //grab the form's action and method
  const reviewAction = reviewForm.getAttribute('action');
  const reviewMethod = reviewForm.getAttribute('method');

  //grab the form's fields
  const nameField = reviewForm.querySelector('#nameField');
  const genreField = reviewForm.querySelector('#genreField');
  const reviewField = reviewForm.querySelector('#reviewField');
  const scoreField = reviewForm.querySelector('#scoreField');

  //create new Ajax request
  const xhr = new XMLHttpRequest();
  //set method and url
  xhr.open(reviewMethod, reviewAction);

  //set request type
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //set our requested response type in hopes of a JSON response
  xhr.setRequestHeader('Accept', 'application/json');

  //set our function to handle the response
  xhr.onload = () => handleSentReview(xhr);

  //set formData to input fields
  const formData = `name=${nameField.value}&genre=${genreField.value}&review=${reviewField.value}&score=${scoreField.value}`;

  //send our request with the data
  xhr.send(formData);
  //prevent the browser's default action (to send the form on its own)
  e.preventDefault();
  //return false to prevent the browser from trying to change page
  return false;
};

//method to get the list of reviews from the server
const getReviewList = () => {
  //create new Ajax request
  const xhr = new XMLHttpRequest();

  //set method and url
  xhr.open('get', '/getReviewList');

  //set our requested response type in hopes of a JSON response
  xhr.setRequestHeader('Accept', 'application/json');

  //set our function to handle the response
  xhr.onload = () => displayReviewList(xhr);

  //send our request
  xhr.send();
  //return false to prevent the browser from trying to change page
  return false;
};

const init = () => {
  //grab review form
  const reviewForm = document.querySelector('#reviewForm');

  //create handler
  const addReview = e => sendReview(e, reviewForm);

  //attach event
  reviewForm.addEventListener('submit', addReview);

  //get any reviews on server
  getReviewList();
  //set interval to regularly update list of reviews
  setInterval(function () {
    getReviewList();
  }, 10000);
};

window.onload = init;
