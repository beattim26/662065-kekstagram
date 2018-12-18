'use strict';
(function (backend, gallery, util) {
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var similarListElement = document.querySelector('.pictures');

  var renderPicture = function (picture, index) {
    var pictureElement = similarPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__img').dataset.picture = index;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  var addPictures = function (picturesArr) {
    for (var i = 0; i < picturesArr.length; i++) {
      gallery.fragment.appendChild(renderPicture(picturesArr[i], i));
    }

    similarListElement.appendChild(gallery.fragment);
  };

  backend.receiveData(function (pictures) {
    var picturesArray = pictures;
    addPictures(picturesArray);

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
