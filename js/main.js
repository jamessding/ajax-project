var $priceButtons = document.querySelectorAll('.price-button');
var $form = document.querySelector('.form');
$form.addEventListener('click', function (event) {
  if (event.target.className === 'price-button mr-2 btn-sm') {
    for (var i = 0; i < $priceButtons.length; i++) {
      if ($priceButtons[i].textContent === event.target.textContent) {
        $priceButtons[i].classList.add('selected');
      } else {
        $priceButtons[i].classList.remove('selected');
      }
    }
  }
});
