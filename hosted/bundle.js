/**#ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
**/

const handleResponse = xhr => {
  //get content section
  const content = document.querySelector('#content');
  //create elements
  const h1 = document.createElement('h1');
  const p = document.createElement('p');

  switch (xhr.status) {
    case 200:
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201:
      console.dir("Handled Create");
      break;
    case 204:
      console.dir("Handled Update");
      break;
    case 400:
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    default:
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }
  //check if object should be parsed
  if (xhr.response) {
    const obj = JSON.parse(xhr.response);
    console.dir(obj);
    //check if there is a message to display
    if (obj.message) {
      p.innerHTML = `Message: ${obj.message}`;
    }
  }
  //clear content section
  content.innerHTML = "";
  //append elements to content section
  content.appendChild(h1);
  content.appendChild(p);
};

//handles what to do after the review has been set to the server
const handleSentReview = xhr => {
  //get confirmation section
  const confirmation = document.querySelector('#confirmation');
  //clear confirmation section
  confirmation.innerHTML = "";

  //create elements
  const h1 = document.createElement('h1');
  const p = document.createElement('p');

  //handle status codes
  switch (xhr.status) {
    case 201:
      h1.innerHTML = `<b>Review Submitted Successfully</b>`;
      break;
    case 204:
      h1.innerHTML = `<b>Review Updated Successfully</b>`;
      break;
    case 400:
      h1.innerHTML = `<b>Bad Request</b>`;
      break;
    default:
      h1.innerHTML = `Error code not implemented by client.`;
      break;
  }

  //check if object should be parsed
  if (xhr.response) {
    const obj = JSON.parse(xhr.response);
    //check if there is a message to display
    if (obj.message) {
      p.innerHTML = `Message: ${obj.message}`;
    }
  }

  //append elements to confirmation section
  confirmation.appendChild(h1);
  confirmation.appendChild(p);
};

const displayReview = xhr => {
  console.dir("Handling Displayed Review");
};

//method called after clicking on a review, used to get the review information from the server
const getReview = reviewInfo => {
  //grab the review's action, method, and name
  const reviewAction = reviewInfo.getAttribute('action');
  const reviewMethod = reviewInfo.getAttribute('method');
  //set reviewName as parameter to pass to url
  const reviewName = `reviewName=${reviewInfo.value}}`;

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
          p.innerHTML = `Game Name: ${obj.reviews[key].name}  Genre: ${obj.reviews[key].genre}  Score: ${obj.reviews[key].score} Key: ${key}`;

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
const getReviewList = e => {
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
  //grab refresh review list button
  const reviewListButton = document.querySelector('#reviewListButton');

  //create handlers
  const addReview = e => sendReview(e, reviewForm);
  const refreshReviewList = e => getReviewList(e);

  //attach events
  reviewForm.addEventListener('submit', addReview);
  reviewListButton.addEventListener('click', refreshReviewList);

  //set interval to regularly update list of reviews
  setInterval(function () {
    getReviewList();
  }, 10000);
};

window.onload = init;
