var $priceButtons = document.querySelectorAll('.price-button');
var $form = document.querySelector('.form');
var $foodInput = document.querySelector('.food-input');
var pricing = null;
var distance = 10;
var foodType = '';
var $distanceInput = document.querySelector('.distance-input');

function getRestaurantData() {
  var targetUrl = encodeURIComponent('https://api.yelp.com/v3/businesses/search?term=ramen&sort_by=rating&price=2&limit=10&longitude=-117.74030913862956&latitude=33.635285701367316');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('Authorization', 'Bearer MbKadfH9UntdZg1702Vgp-gkFYQJHo4wEIwqYtEW84YrOZ68OX6RYcWme1b_ZdDHYopYPY_WqyddKZjPXGtxbR2Qc-OxznKUWkSKz7KVa9MANZLBlp4Th7fjxcykYnYx');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // console.log(xhr.response);
  });
  xhr.send();
}

function handleSubmit(event) {
  event.preventDefault();
  if (event.submitter.textContent === 'Show All Results!') {
    getRestaurantData(pricing, distance, foodType);
  } else if (event.submitter.textContent === 'Pick For Me!') {
    getRestaurantData();
  }
}
$form.addEventListener('submit', handleSubmit);

$form.addEventListener('click', function (e) {
  if (event.target.className === 'price-button mr-2 btn-sm') {
    event.preventDefault();
    for (var i = 0; i < $priceButtons.length; i++) {
      if ($priceButtons[i].textContent === event.target.textContent) {
        $priceButtons[i].classList.add('selected');
        pricing = event.target.value;
      } else {
        $priceButtons[i].classList.remove('selected');
      }
    }
  }
});

$distanceInput.addEventListener('change', function (e) {
  distance = $distanceInput.valueAsNumber;
});

$foodInput.addEventListener('change', function (e) {
  foodType = $foodInput.value;
});
