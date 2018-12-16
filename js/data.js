'use strict';
(function (backend, gallery) {
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  var renderPicture = function (picture, index) {
    var pictureElement = similarPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__img').dataset.picture = index;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  backend.receiveData(function(pictures) {
    for (var i = 0; i < pictures.length; i++) {
      gallery.fragment.appendChild(renderPicture(pictures[i], i));
    }
    gallery.similarListElement.appendChild(gallery.fragment);
  });
})(window.backend, window.gallery);
