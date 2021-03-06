/* global data */
var $priceButtons = document.querySelectorAll('.price-button');
var $form = document.querySelector('.form');
var $foodInput = document.querySelector('.food-input');
var $distanceInput = document.querySelector('.distance-input');
var $resultList = document.querySelector('.result-list');
var $views = document.querySelectorAll('.view');
var $resultsTitle = document.querySelector('.results-title');
var $resultsContainer = document.querySelector('.results');
var $favorites = document.querySelector('.favorites');
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
          $resultsTitle.textContent = 'Best Restaurants Near You';
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

function getDetails(id) {
  var targetUrl = encodeURIComponent('https://api.yelp.com/v3/businesses/' + id);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('Authorization', 'Bearer MbKadfH9UntdZg1702Vgp-gkFYQJHo4wEIwqYtEW84YrOZ68OX6RYcWme1b_ZdDHYopYPY_WqyddKZjPXGtxbR2Qc-OxznKUWkSKz7KVa9MANZLBlp4Th7fjxcykYnYx');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.restaurant = xhr.response;
    var $resultLiList = document.querySelectorAll('li.result');
    for (var i = 0; i < $resultLiList.length; i++) {
      if ($resultLiList[i].id !== data.restaurant.id) {
        $resultLiList[i].classList.add('hidden');
      }
    }
    var renderedDetails = renderDetails(data.restaurant);
    $resultList.appendChild(renderedDetails);
    var renderedCarousel = renderCarousel(data.restaurant);
    $resultList.appendChild(renderedCarousel);
    if ($resultsTitle.textContent !== "Here's What We Picked For You") {
      if ($resultsTitle.textContent === 'Best Restaurants Near You') {
        var backButton = renderBackButton('Back To Results');
      } else if ($resultsTitle.textContent === 'Favorites List') {
        backButton = renderBackButton('Back To Favorites');
      }
      $resultsContainer.appendChild(backButton);
      backButton.addEventListener('click', handleBackClick);
    }
    $resultsTitle.textContent = 'Restaurant Details';
  });
  xhr.send();
}

function handleBackClick(event) {
  event.preventDefault();
  var $resultLiList = document.querySelectorAll('li.result');
  for (var i = 0; i < $resultLiList.length; i++) {
    $resultLiList[i].classList.remove('hidden');
  }
  var detailsCard = document.querySelector('.result-li');
  var backButton = document.querySelector('.back-button');
  $resultList.removeChild(detailsCard);
  $resultsContainer.removeChild(backButton);
  data.restaurant = null;
  if (backButton.textContent === 'Back To Favorites') {
    $resultsTitle.textContent = 'Favorites List';
  } else if (backButton.textContent === 'Back To Results') {
    $resultsTitle.textContent = 'Best Restaurants Near You';
  }
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
  if (event.target.tagName === 'I') {
    return;
  }
  if (data.restaurant !== null && $resultsTitle.textContent !== 'Favorites List') {
    return;
  }
  getDetails(event.target.closest('li.result').id);
}

function renderBackButton(string) {
  var row = document.createElement('div');
  row.className = 'row back-button align-items-center justify-content-center mt-4';
  var backButton = document.createElement('button');
  backButton.textContent = string;
  backButton.className = 'btn-lg';
  row.appendChild(backButton);
  return row;
}

$resultList.addEventListener('click', handleCardClick);

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
  cardDiv.appendChild(cardBodyDiv);
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
  var table = document.createElement('table');
  table.className = 'table-borderless';
  hoursLi.appendChild(table);
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);
  var days = ['Mon:', 'Tue:', 'Wed:', 'Thu:', 'Fri:', 'Sat:', 'Sun:'];
  var counter = 0;
  var times = ['', '', '', '', '', '', ''];
  for (var i = 0; i < restaurant.hours[0].open.length; i++) {
    var startHour = restaurant.hours[0].open[i].start.slice(0, 2);
    var startMinutes = restaurant.hours[0].open[i].start.slice(-2);
    var endHour = restaurant.hours[0].open[i].end.slice(0, 2);
    var endMinutes = restaurant.hours[0].open[i].end.slice(-2);
    var startAmOrPm = startHour >= 12 ? 'PM' : 'AM';
    var endAmOrPm = endHour >= 12 ? 'PM' : 'AM';
    if (restaurant.hours[0].open[i].day === counter) {
      times[counter] += ' ' + ((startHour % 12) || 12) + ':' + startMinutes + ' ' + startAmOrPm + ' - ' + ((endHour % 12) || 12) + ':' + endMinutes + ' ' + endAmOrPm;
    } else {
      counter++;
      i--;
    }
  }
  for (var j = 0; j < days.length; j++) {
    if (times[j] === '') {
      times[j] = 'Closed';
    }
    var tr = document.createElement('tr');
    tbody.appendChild(tr);
    var tdDay = document.createElement('td');
    tdDay.className = 'days';
    tdDay.textContent = days[j];
    tr.appendChild(tdDay);
    var tdHours = document.createElement('td');
    tdHours.textContent = times[j];
    tr.appendChild(tdHours);
  }
  ul.appendChild(hoursLi);
  var phoneLi = document.createElement('li');
  phoneLi.className = 'list-group-item';
  phoneLi.textContent = restaurant.display_phone;
  ul.appendChild(phoneLi);
  return resultLi;
}

/* <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="d-block w-100" src="https://s3-media0.fl.yelpcdn.com/bphoto/vW5_ZhieLVsbNVousdugFw/l.jpg" alt="First slide">
      </div>
      <div class="carousel-item">
        <img class="d-block w-100" src="https://s3-media0.fl.yelpcdn.com/bphoto/QKG6vHm87pJhZZ-1XLXuRA/o.jpg" alt="Second slide">
      </div>
      <div class="carousel-item">
        <img class="d-block w-100" src="https://s3-media0.fl.yelpcdn.com/bphoto/yNpe6oAD8lhW4ySxLnAn-g/o.jpg" alt="Third slide">
      </div>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div> */

/* <div class="card" style="width: 18rem;"> add this to renderCarousel */
function renderCarousel(restaurant) {
  var resultLi = document.createElement('li');
  resultLi.setAttribute('id', restaurant.id);
  resultLi.className = 'result-li';
  var colDiv = document.createElement('div');
  colDiv.className = 'col-md-6 col-sm-12';
  resultLi.appendChild(colDiv);
  var cardDiv = document.createElement('div');
  cardDiv.className = 'card long shadow';
  colDiv.appendChild(cardDiv);
  var carouselSlide = document.createElement('div');
  carouselSlide.id = 'carouselExampleControls';
  carouselSlide.className = 'carousel slide';
  carouselSlide.setAttribute('data-ride', 'carousel');
  cardDiv.appendChild(carouselSlide);
  var carouselInner = document.createElement('div');
  carouselInner.className = 'carousel-inner';
  carouselSlide.appendChild(carouselInner);
  var firstItem = document.createElement('div');
  firstItem.className = 'carousel-item active';
  carouselInner.appendChild(firstItem);
  var firstImage = document.createElement('img');
  firstImage.className = 'd-block w-100';
  firstImage.src = restaurant.photos[0];
  firstItem.appendChild(firstImage);
  var secondItem = document.createElement('div');
  secondItem.className = 'carousel-item';
  carouselInner.appendChild(secondItem);
  var secondImage = document.createElement('img');
  secondImage.className = 'd-block w-100';
  secondImage.src = restaurant.photos[1];
  secondItem.appendChild(secondImage);
  var thirdItem = document.createElement('div');
  thirdItem.className = 'carousel-item';
  carouselInner.appendChild(thirdItem);
  var thirdImage = document.createElement('img');
  thirdImage.className = 'd-block w-100';
  thirdImage.src = restaurant.photos[2];
  thirdItem.appendChild(thirdImage);
  var controlPrev = document.createElement('a');
  controlPrev.className = 'carousel-control-prev';
  controlPrev.href = '#carouselExampleControls';
  controlPrev.setAttribute('role', 'button');
  controlPrev.setAttribute('data-slide', 'prev');
  carouselSlide.appendChild(controlPrev);
  var prevIcon = document.createElement('span');
  prevIcon.className = 'carousel-control-prev-icon';
  prevIcon.setAttribute('aria-hidden', 'true');
  controlPrev.appendChild(prevIcon);
  var prevSr = document.createElement('span');
  prevSr.className = 'sr-only';
  prevSr.textContent = 'Previous';
  controlPrev.appendChild(prevSr);
  var controlNext = document.createElement('a');
  controlNext.className = 'carousel-control-next';
  controlNext.href = '#carouselExampleControls';
  controlNext.setAttribute('role', 'button');
  controlNext.setAttribute('data-slide', 'next');
  carouselSlide.appendChild(controlNext);
  var nextIcon = document.createElement('span');
  nextIcon.className = 'carousel-control-next-icon';
  nextIcon.setAttribute('aria-hidden', 'true');
  controlNext.appendChild(nextIcon);
  var nextSr = document.createElement('span');
  nextSr.className = 'sr-only';
  nextSr.textContent = 'Next';
  controlNext.appendChild(nextSr);
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
  var ratingImage = document.createElement('img');
  if (Math.floor(resultObject.rating) === resultObject.rating) {
    ratingImage.src = 'https://budgetbranders.com/wp-content/plugins/restaurant-generator/template/img/extra_large_' + resultObject.rating + '.png';
  } else {
    ratingImage.src = 'https://budgetbranders.com/wp-content/plugins/restaurant-generator/template/img/extra_large_' + Math.floor(resultObject.rating) + '_half.png';
  }
  ratingLi.appendChild(ratingImage);
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
  var saveLi = document.createElement('li');
  saveLi.className = 'list-group-item';
  var saveIcon = document.createElement('i');
  saveIcon.className = 'far fa-heart fa-3x';
  for (var i = 0; i < data.favorites.length; i++) {
    if (resultObject.id === data.favorites[i].id) {
      saveIcon.className = 'fas fa-heart fa-3x';
      break;
    }
  }
  saveLi.appendChild(saveIcon);
  ul.appendChild(saveLi);
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

function resetData() {
  data.view = 'search-form';
  data.results = [];
  data.pricing = null;
  data.distance = 16093.4;
  data.foodType = '';
  data.restaurant = null;
}

function clickSaveIcon(event) {
  if (event.target.tagName !== 'I') {
    return;
  }
  if (event.target.classList.contains('far')) {
    event.target.classList.replace('far', 'fas');
    for (var i = 0; i < data.results.businesses.length; i++) {
      if (data.results.businesses[i].id === event.target.closest('li.result').id) {
        data.favorites.push(data.results.businesses[i]);
      }
    }
  } else if (event.target.classList.contains('fas')) {
    event.target.classList.replace('fas', 'far');
    for (var j = 0; j < data.favorites.length; j++) {
      if (data.favorites[j].id === event.target.closest('li.result').id) {
        data.favorites.splice(j, 1);
      }
    }
  }
}

function clickFavorites(event) {
  $resultList.textContent = '';
  viewSwap('results');
  $form.reset();
  for (var i = 0; i < data.favorites.length; i++) {
    var renderedResult = renderResult(data.favorites[i]);
    $resultList.appendChild(renderedResult);
  }
  $resultsTitle.textContent = 'Favorites List';
}

document.addEventListener('click', clickSaveIcon);

$favorites.addEventListener('click', clickFavorites);

document.addEventListener('click', function (e) {
  if (event.target.classList.contains('logo')) {
    viewSwap('search-form');
    resetData();
  }
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
