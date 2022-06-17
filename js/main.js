/* global data */
var $priceButtons = document.querySelectorAll('.price-button');
var $form = document.querySelector('.form');
var $foodInput = document.querySelector('.food-input');
var $distanceInput = document.querySelector('.distance-input');
var $resultList = document.querySelector('.result-list');
var $views = document.querySelectorAll('.view');
var $resultsTitle = document.querySelector('.results-title');
var $logo = document.querySelector('.logo');
function success(pos) {
  const crd = pos.coords;
  data.latitude = crd.latitude;
  data.longitude = crd.longitude;
}

window.navigator.geolocation.getCurrentPosition(success);

function getRestaurantData(pricing, foodType, latitude, longitude) {
  var targetUrl = encodeURIComponent('https://api.yelp.com/v3/businesses/search?limit=10&price=' + pricing + '&term=' + foodType + '&latitude=' + latitude + '&longitude=' + longitude);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('Authorization', 'Bearer MbKadfH9UntdZg1702Vgp-gkFYQJHo4wEIwqYtEW84YrOZ68OX6RYcWme1b_ZdDHYopYPY_WqyddKZjPXGtxbR2Qc-OxznKUWkSKz7KVa9MANZLBlp4Th7fjxcykYnYx');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.results = xhr.response;
    for (var i = 0; i < data.results.businesses.length; i++) {
      if (data.results.businesses[i].distance < data.distance) {
        var renderedResult = renderResult(data.results.businesses[i]);
        $resultList.appendChild(renderedResult);
      }
    }
  });
  xhr.send();
}

function handleSubmit(event) {
  event.preventDefault();
  if (!event.submitter.classList.contains('search-button')) {
    return;
  }
  $resultList.innerHTML = '';
  if (event.submitter.textContent === 'Show All Results!') {
    getRestaurantData(data.pricing, data.foodType, data.latitude, data.longitude);
  } else if (event.submitter.textContent === 'Pick For Me!') {
    getRestaurantData(data.pricing, data.foodType, data.latitude, data.longitude);
    var randomNum = Math.floor(Math.random() * 10);
    var renderedResult = renderResult(data.results.businesses[randomNum]);
    $resultList.appendChild(renderedResult);
    $resultsTitle.textContent = "Here's What We Picked For You";
  }
  viewSwap('results');
  $form.reset();
  for (var j = 0; j < $priceButtons.length; j++) {
    $priceButtons[j].classList.remove('selected');
  }
}

function renderResult(resultObject) {
  var resultLi = document.createElement('li');
  var colDiv = document.createElement('div');
  colDiv.className = 'col-md-6 col-sm-12';
  resultLi.appendChild(colDiv);
  var cardDiv = document.createElement('div');
  cardDiv.className = 'card mb-5 shadow';
  colDiv.appendChild(cardDiv);
  var rowDiv = document.createElement('div');
  rowDiv.className = 'row no-gutters';
  cardDiv.appendChild(rowDiv);
  var leftColDiv = document.createElement('div');
  leftColDiv.className = 'col-6';
  rowDiv.appendChild(leftColDiv);
  var img = document.createElement('img');
  img.className = 'card-img';
  img.setAttribute('src', resultObject.image_url);
  leftColDiv.appendChild(img);
  var rightColDiv = document.createElement('div');
  rightColDiv.className = 'col-6';
  rowDiv.appendChild(rightColDiv);
  var cardBodyDiv = document.createElement('div');
  cardBodyDiv.className = 'card-body';
  rightColDiv.appendChild(cardBodyDiv);
  var cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.textContent = resultObject.name;
  cardBodyDiv.appendChild(cardTitle);
  var ul = document.createElement('ul');
  ul.className = 'list-group list-group-flush';
  cardBodyDiv.appendChild(ul);
  var ratingLi = document.createElement('li');
  ratingLi.className = 'list-group-item';
  ratingLi.textContent = 'Rating: ' + resultObject.rating;
  ul.appendChild(ratingLi);
  var priceLi = document.createElement('li');
  priceLi.className = 'list-group-item';
  priceLi.textContent = 'Pricing: ' + resultObject.price;
  ul.appendChild(priceLi);
  var distanceLi = document.createElement('li');
  distanceLi.className = 'list-group-item';
  distanceLi.textContent = 'Distance: ' + Math.round(resultObject.distance / 160.9) / 10 + ' mi';
  ul.appendChild(distanceLi);
  var openLi = document.createElement('li');
  openLi.className = 'list-group-item';
  if (resultObject.is_closed) {
    openLi.textContent = 'Closed';
    openLi.classList.add('text-red');
  } else {
    openLi.textContent = 'Open';
    openLi.classList.add('text-green');
  }
  ul.appendChild(openLi);
  return resultLi;
}

function viewSwap(dataview) {
  data.view = dataview;
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-view') === dataview) {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
}

$logo.addEventListener('click', function (e) {
  viewSwap('search-form');
});

$form.addEventListener('submit', handleSubmit);

$form.addEventListener('click', function (e) {
  if (event.target.className === 'price-button mr-2 btn-sm') {
    event.preventDefault();
    for (var i = 0; i < $priceButtons.length; i++) {
      if ($priceButtons[i].textContent === event.target.textContent) {
        $priceButtons[i].classList.add('selected');
        data.pricing = event.target.value;
      } else {
        $priceButtons[i].classList.remove('selected');
      }
    }
  }
});

$distanceInput.addEventListener('change', function (e) {
  data.distance = $distanceInput.valueAsNumber * 1609.34;
});

$foodInput.addEventListener('change', function (e) {
  data.foodType = $foodInput.value;
});

viewSwap('search-form');
