'use strict';
(function (data, util) {
  var similarListElement = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var fragment = document.createDocumentFragment();
  var bigPicture = document.querySelector('.big-picture');
  var closeButtonPhoto = bigPicture.querySelector('.big-picture__cancel');
  var socialCommentsTemplate = document.getElementById('social-comment').content.querySelector('.social__comment');
  var socialCommentsElement = bigPicture.querySelector('.social__comments');
  var pictures = data.getRandomPictures(25);

  var renderPicture = function (picture, index) {
    var pictureElement = similarPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__img').dataset.picture = index;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = util.getRandomNumber(3, 15);

    return pictureElement;
  };

  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderPicture(pictures[i], i));
  }

  similarListElement.appendChild(fragment);

  var renderComment = function (comment) {
    var commentEllement = socialCommentsTemplate.cloneNode(true);

    commentEllement.querySelector('.social__picture').src = comment.avatar;
    commentEllement.querySelector('.social__text').textContent = comment.message;

    return commentEllement;
  };

  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');

  var onPhotoEscPress = function (evt) {
    if (evt.keyCode === util.ESC_KEYCODE) {
      closePhoto();
    }
  };

  var showPhoto = function (picture, target) {
    bigPicture.classList.remove('hidden');

    bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    bigPicture.querySelector('.social__caption').textContent = picture.description;

    document.addEventListener('keydown', onPhotoEscPress);

    for (i = 0; i < picture.comments.length; i++) {
      fragment.appendChild(renderComment(pictures[target.dataset.picture].comments[i]));
    }
    socialCommentsElement.appendChild(fragment);
  };

  var closePhoto = function () {
    var usersComments = bigPicture.querySelectorAll('.social__comment');
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onPhotoEscPress);

    for (i = 0; i < usersComments.length; i++) {
      socialCommentsElement.removeChild(usersComments[i]);
    }
  };

  similarListElement.addEventListener('click', function (evt) {
    if (evt.target.className === 'picture__img') {
      showPhoto(pictures[event.target.dataset.picture], event.target);
    }
  });

  similarListElement.addEventListener('keydown', function (evt) {
    if (evt.target.className === 'picture') {
      if (evt.keyCode === util.ENTER_KEYCODE) {
        showPhoto(pictures[event.target.firstElementChild.dataset.picture], event.target.firstElementChild);
      }
    }
  });

  closeButtonPhoto.addEventListener('click', function () {
    closePhoto();
  });
})(window.data, window.util);
