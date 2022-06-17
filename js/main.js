/* global data */
var $priceButtons = document.querySelectorAll('.price-button');
var $form = document.querySelector('.form');
var $foodInput = document.querySelector('.food-input');
var $distanceInput = document.querySelector('.distance-input');
var $resultList = document.querySelector('.result-list');

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
  });
  xhr.send();
}

function handleSubmit(event) {
  event.preventDefault();
  if (event.submitter.textContent === 'Show All Results!') {
    getRestaurantData(data.pricing, data.foodType, data.latitude, data.longitude);
  } else if (event.submitter.textContent === 'Pick For Me!') {
    getRestaurantData();
  }
}

// <li>
//  <div class="col-md-6 col-sm-12">
//    <div class="card mb-5 shadow">
//      <div class="row no-gutters">
//        <div class="col-6">
//          <img src="https://s3-media1.fl.yelpcdn.com/bphoto/vW5_ZhieLVsbNVousdugFw/o.jpg" class="card-img" alt="...">
//        </div>
//        <div class="col-6">
//          <div class="card-body">
//            <h5 class="card-title">Marufuku Ramen Irvine</h5>
//            <ul class="list-group list-group-flush">
//              <li class="list-group-item">Rating: 4.5</li>
//              <li class="list-group-item">Pricing: $$</li>
//              <li class="list-group-item">Distance: 0.8 mi</li>
//              <li class="list-group-item">Open</li>
//            </ul>
//          </div>
//        </div>
//      </div>
//    </div>
//  </div>
// </li >

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
  openLi.textContent = 'Closed Now: ' + resultObject.is_closed;
  ul.appendChild(openLi);
  return resultLi;
}

// $resultList.appendChild(renderResult({
//   image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/vW5_ZhieLVsbNVousdugFw/o.jpg',
//   name: 'Marufuku Ramen Irvine',
//   rating: 4.5,
//   price: '$$',
//   distance: 1245.6448383293518,
//   is_closed: false
// }));
$resultList.appendChild(renderResult(data.results.businesses[0]));
// console.log(data.results.businesses[0]);

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
