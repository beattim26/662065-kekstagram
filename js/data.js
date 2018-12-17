'use strict';
(function (backend, gallery) {
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var imageFilters = document.querySelector('.img-filters');

  var renderPicture = function (picture, index) {
    var pictureElement = similarPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__img').dataset.picture = index;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  backend.receiveData(function (pictures) {
    for (var i = 0; i < pictures.length; i++) {
      gallery.fragment.appendChild(renderPicture(pictures[i], i));
    }

    gallery.similarListElement.appendChild(gallery.fragment);

    if (pictures) {
      imageFilters.classList.remove('img-filters--inactive');
    }
  });

  var makeButtonInactive = function () {
    var buttonActive = document.querySelector('.img-filters__button--active');
    if (buttonActive) {
      buttonActive.classList.remove('img-filters__button--active');
    }
  };

  imageFilters.addEventListener('click', function (evt) {
    if (event.target.tagName === 'BUTTON' && !evt.target.classList.contains('img-filters__button--active')) {
      makeButtonInactive();
      evt.target.classList.add('img-filters__button--active');
    }
  });
})(window.backend, window.gallery);
