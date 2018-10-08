/**#ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
**/

const handleResponse = (xhr) => {
  //get content section
  const content = document.querySelector('#content');
  //create elements
  const h1 = document.createElement('h1');
  const p = document.createElement('p');
  
  switch(xhr.status) {
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
  if(xhr.response){
    const obj = JSON.parse(xhr.response);
    console.dir(obj);
    //check if there is a message to display
    if(obj.message){
      p.innerHTML = `Message: ${obj.message}`;
    }
  }
  //clear content section
  content.innerHTML = "";
  //append elements to content section
  content.appendChild(h1);
  content.appendChild(p);
};

const handleReviewList = (xhr) =>{
  
  if(xhr.response){
    const reviewListSection = document.querySelector('#reviewListSection');
    
    
    const obj = JSON.parse(xhr.response);
    //check if any reviews exist
    if(obj.reviews){
      for(let key in obj.reviews){
        if(obj.reviews.hasOwnProperty(key)){
          console.dir(`Game Name: ${obj.reviews[key].name}`);
          console.dir(`Game Score: ${obj.reviews[key].score}`);
        }
      }
      
      
      
      
    }
    
    
    
    
  }
};

const sendReview = (e, reviewForm) =>{

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
  xhr.setRequestHeader ('Accept', 'application/json');
  
  //set our function to handle the response
  xhr.onload = () => handleResponse(xhr);
  
  //set formData to input fields
  const formData = `name=${nameField.value}&genre=${genreField.value}&review=${reviewField.value}&score=${scoreField.value}`;
  
  //send our request with the data
  xhr.send(formData);
  //prevent the browser's default action (to send the form on its own)
  e.preventDefault();
  //return false to prevent the browser from trying to change page
  return false;
};

const populateReviewList = (e) =>{
  console.dir("Populating List");
  
  //create new Ajax request
  const xhr = new XMLHttpRequest();
  //set method and url
  xhr.open('get', '/getReviewList');
  
  //set our requested response type in hopes of a JSON response
  xhr.setRequestHeader ('Accept', 'application/json');
  
  //set our function to handle the response
  xhr.onload = () => handleReviewList(xhr);
  
  //send our request
  xhr.send();
  //return false to prevent the browser from trying to change page
  return false;
  
};




const init = () => {
  //grab form
  const reviewForm = document.querySelector('#reviewForm');
  
  const reviewListButton = document.querySelector('#reviewListButton');
  const refreshReviewList = (e) => populateReviewList(e);
  reviewListButton.addEventListener('click', refreshReviewList);
  
  //create handler
  const addReview = (e) => sendReview(e, reviewForm);
  
  //attach submit event
  reviewForm.addEventListener('submit', addReview);
  
  console.dir("Setting Interval");
  setInterval(function(){populateReviewList();}, 5000);
  //populateReviewList();
};

window.onload = init;