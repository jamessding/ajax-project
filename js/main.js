// var $priceButtons = document.querySelectorAll('.price-button');
// var $form = document.querySelector('.form');
// var foodInput = document.querySelector('.food-input');
// var pricing = null;
// var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

// xhr.addEventListener('readystatechange', function () {
//   if (this.readyState === 4) {
//     console.log(this.responseText);
//   }
// });

// xhr.open('GET', 'https://api.yelp.com/v3/businesses/search?categories=chinese&sort_by=rating&price=2&limit=10&longitude=-117.74030913862956&latitude=33.635285701367316');
// xhr.setRequestHeader('Authorization', 'Bearer MbKadfH9UntdZg1702Vgp-gkFYQJHo4wEIwqYtEW84YrOZ68OX6RYcWme1b_ZdDHYopYPY_WqyddKZjPXGtxbR2Qc-OxznKUWkSKz7KVa9MANZLBlp4Th7fjxcykYnYx');
// xhr.setRequestHeader('Cookie', 'hl=en_US; wdi=1|EBEE942995A526F3|0x1.8a9b2caf27c24p+30|0cd2296c58a0c1ba');
// xhr.send();

// function handleSubmit(event) {
//   event.preventDefault();
//   if (event.submitter.textContent === 'Show All Results!') {

//   }

// }
// $form.addEventListener('submit', handleSubmit);

// $form.addEventListener('click', function (event) {
//   if (event.target.className === 'price-button mr-2 btn-sm') {
//     for (var i = 0; i < $priceButtons.length; i++) {
//       if ($priceButtons[i].textContent === event.target.textContent) {
//         $priceButtons[i].classList.add('selected');
//         pricing = event.target.textContent;
//       } else {
//         $priceButtons[i].classList.remove('selected');
//       }
//     }
//   }
// });
