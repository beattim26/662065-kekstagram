'use strict';
(function (backend, gallery, util) {
  var NEW_PICTURES_COUNT = 10;
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var imageFilters = document.querySelector('.img-filters');
  var similarListElement = document.querySelector('.pictures');

  var renderPicture = function (picture, index) {
    var pictureElement = similarPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__img').dataset.picture = index;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  var sortArrayComments = function (arr) {
    arr.sort(function (picture1, picture2) {
      return picture2.comments.length - picture1.comments.length;
    });
  };

  var sortArrayUrl = function (arr) {
    arr.sort(function (first, second) {
      return first.url.match(/\d+/) - second.url.match(/\d+/);
    });
  };

  var shuffleArray = function (arr) {
    var j;
    var temp;

    for (var i = 0; i < arr.length; i++) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  };
  var makeButtonInactive = function () {
    var buttonActive = document.querySelector('.img-filters__button--active');
    if (buttonActive) {
      buttonActive.classList.remove('img-filters__button--active');
    }
  };

  var addPictures = function (picturesArr) {
    for (var i = 0; i < picturesArr.length; i++) {
      gallery.fragment.appendChild(renderPicture(picturesArr[i], i));
    }

    similarListElement.appendChild(gallery.fragment);
  };

  var removePictures = function () {
    var allPicture = document.querySelectorAll('.picture');
    for (var i = 0; i < allPicture.length; i++) {
      similarListElement.removeChild(allPicture[i]);
    }
  };

  backend.receiveData(function (pictures) {
    var picturesArray = pictures;
    addPictures(picturesArray);

    if (pictures) {
      imageFilters.classList.remove('img-filters--inactive');
    }

    imageFilters.addEventListener('click', function (evt) {
      if (event.target.tagName === 'BUTTON' && !evt.target.classList.contains('img-filters__button--active')) {
        makeButtonInactive();
        evt.target.classList.add('img-filters__button--active');
      }

      if (event.target.id === 'filter-popular') {
        removePictures();
        sortArrayUrl(picturesArray);
        addPictures(picturesArray);
      } else if (event.target.id === 'filter-new') {
        removePictures();
        shuffleArray(picturesArray);
        for (var i = 0; i < NEW_PICTURES_COUNT; i++) {
          gallery.fragment.appendChild(renderPicture(picturesArray[i], i));
        }
        similarListElement.appendChild(gallery.fragment);
      } else if (event.target.id === 'filter-discussed') {
        removePictures();
        sortArrayComments(picturesArray);
        addPictures(picturesArray);
      }
    });

    similarListElement.addEventListener('click', function (evt) {
      if (evt.target.className === 'picture__img') {
        var targetPhoto = event.target.dataset.picture;
        gallery.showPhoto(picturesArray[targetPhoto], targetPhoto, picturesArray);
      }
    });

    similarListElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === util.ENTER_KEYCODE) {
        var targetPhoto = event.target.firstElementChild.dataset.picture;
        gallery.showPhoto(picturesArray[targetPhoto], targetPhoto, picturesArray);
      }
    });
  });
})(window.backend, window.gallery, window.util);
