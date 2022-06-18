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
  if (event.submitter.textContent === 'Show All Results!') {
    xhr.addEventListener('load', function () {
      data.results = xhr.response;
      for (var i = 0; i < data.results.businesses.length; i++) {
        if (data.results.businesses[i].distance < data.distance) {
          var renderedResult = renderResult(data.results.businesses[i]);
          $resultList.appendChild(renderedResult);
        }
      }
    });
  } else {
    xhr.addEventListener('load', function () {
      data.results = xhr.response;
      var randomNum = Math.floor(Math.random() * 10);
      var renderedResult = renderResult(data.results.businesses[randomNum]);
      $resultList.appendChild(renderedResult);
      $resultsTitle.textContent = "Here's What We Picked For You";
    });
  }

  xhr.send();
}

// var targetUrl = encodeURIComponent('https://api.yelp.com/v3/businesses/o5r9VGf3R4qlRAPI5TOkAQ');
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
// xhr.setRequestHeader('Authorization', 'Bearer MbKadfH9UntdZg1702Vgp-gkFYQJHo4wEIwqYtEW84YrOZ68OX6RYcWme1b_ZdDHYopYPY_WqyddKZjPXGtxbR2Qc-OxznKUWkSKz7KVa9MANZLBlp4Th7fjxcykYnYx');
// xhr.responseType = 'json';
// xhr.addEventListener('load', function () {
//   data.restaurant = xhr.response;
// });
// xhr.send();

function getDetails(id) {
  var targetUrl = encodeURIComponent('https://api.yelp.com/v3/businesses/' + id);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('Authorization', 'Bearer MbKadfH9UntdZg1702Vgp-gkFYQJHo4wEIwqYtEW84YrOZ68OX6RYcWme1b_ZdDHYopYPY_WqyddKZjPXGtxbR2Qc-OxznKUWkSKz7KVa9MANZLBlp4Th7fjxcykYnYx');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.restaurant = xhr.response;
    var renderedDetails = renderDetails(data.restaurant);
    $resultList.appendChild(renderedDetails);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  if (!event.submitter.classList.contains('search-button')) {
    return;
  }
  $resultList.innerHTML = '';
  getRestaurantData(data.pricing, data.foodType, data.latitude, data.longitude);
  viewSwap('results');
  $form.reset();
  for (var j = 0; j < $priceButtons.length; j++) {
    $priceButtons[j].classList.remove('selected');
  }
}

function handleCardClick(event) {
  getDetails(event.target.closest('li.result').id);
}

$resultList.addEventListener('click', handleCardClick);

/* <li>
  <div class="col-md-6 col-sm-12">
    <div class="card long shadow">
      <div class="card-body">
        <h5 class="card-title">Location and Hours</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">8543 Irvine Center Dr Irvine, CA 92618</li>
          <li class="list-group-item hours">Mon: 11:00 AM - 9:00 PM<br>Tue: 11:00 AM - 9:00 PM<br>Wed: 11:00 AM - 9:00
            PM<br>Thu: 11:00 AM - 9:00 PM<br>Fri: 11:00 AM - 9:00 PM<br>Sat: 11:00 AM - 9:00 PM<br>Sun: 11:00 AM - 9:00 PM
          </li>
          <li class="list-group-item">(949) 418-7448</li>
        </ul>
      </div>
    </div>
  </div>
</li> */
function renderDetails(restaurant) {
  var resultLi = document.createElement('li');
  resultLi.setAttribute('id', restaurant.id);
  resultLi.className = 'result-li';
  var colDiv = document.createElement('div');
  colDiv.className = 'col-md-6 col-sm-12';
  resultLi.appendChild(colDiv);
  var cardDiv = document.createElement('div');
  cardDiv.className = 'card long shadow';
  colDiv.appendChild(cardDiv);
  var cardBodyDiv = document.createElement('div');
  cardBodyDiv.className = 'card-body';
  colDiv.appendChild(cardBodyDiv);
  var cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.textContent = 'Location and Hours';
  cardBodyDiv.appendChild(cardTitle);
  var ul = document.createElement('ul');
  ul.className = 'list-group list-group-flush';
  cardBodyDiv.appendChild(ul);
  var addressLi = document.createElement('li');
  addressLi.className = 'list-group-item';
  addressLi.textContent = restaurant.location.display_address;
  ul.appendChild(addressLi);
  var hoursLi = document.createElement('li');
  hoursLi.className = 'list-group-item hours';
  hoursLi.textContent = 'change me';
  // var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // for (var i = 0; i < restaurant.hours[0].open.length; i++) {
  //   hoursLi.textContent += days[i] + ': ' + restaurant.hours[0].open[0].start;
  // }
  ul.appendChild(hoursLi);
  var phoneLi = document.createElement('li');
  phoneLi.className = 'list-group-item';
  phoneLi.textContent = restaurant.display_phone;
  ul.appendChild(phoneLi);
  return resultLi;
}

function renderResult(resultObject) {
  var resultLi = document.createElement('li');
  resultLi.setAttribute('id', resultObject.id);
  resultLi.className = 'result';
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

function resetData(e) {
  data.view = 'search-form';
  data.results = [];
  data.pricing = null;
  data.distance = 16093.4;
  data.foodType = '';
  data.restaurant = null;
}

$logo.addEventListener('click', function (e) {
  viewSwap('search-form');
  resetData();
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
resetData();
