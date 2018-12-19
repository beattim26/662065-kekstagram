'use strict';
(function (util, backend) {
  var MAX_COMMENTS_SHOW = 5;
  var fragment = document.createDocumentFragment();
  var bigPicture = document.querySelector('.big-picture');
  var closeButtonPhoto = bigPicture.querySelector('.big-picture__cancel');
  var socialCommentsTemplate = document.getElementById('social-comment').content.querySelector('.social__comment');
  var socialCommentsElement = bigPicture.querySelector('.social__comments');
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var similarListElement = document.querySelector('.pictures');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var usersComments = bigPicture.querySelectorAll('.social__comment');

  var renderComment = function (comment) {
    var commentEllement = socialCommentsTemplate.cloneNode(true);

    commentEllement.querySelector('.social__picture').src = comment.avatar;
    commentEllement.querySelector('.social__text').textContent = comment.message;

    return commentEllement;
  };

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
      fragment.appendChild(renderPicture(picturesArr[i], i));
    }

    similarListElement.appendChild(fragment);
  };

  var onPhotoEscPress = function (evt) {
    if (evt.keyCode === util.ESC_KEYCODE) {
      closePhoto();
    }
  };

  var showPhoto = function (picture, target, picturesArray) {
    var commentsAmount = picturesArray[target].comments.length;
    usersComments = bigPicture.querySelectorAll('.social__comment');

    bigPicture.classList.remove('hidden');

    bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.social__caption').textContent = picture.description;

    document.addEventListener('keydown', onPhotoEscPress);

    if (picturesArray[target].comments.length > MAX_COMMENTS_SHOW) {
      commentsAmount = MAX_COMMENTS_SHOW;
    }

    for (var i = 0; i < commentsAmount; i++) {
      fragment.appendChild(renderComment(picturesArray[target].comments[i]));
    }

    socialCommentsElement.appendChild(fragment);

    commentsCount.textContent = commentsAmount + ' из ' + picturesArray[target].comments.length + ' комментариев';
  };

  var closePhoto = function () {
    usersComments = bigPicture.querySelectorAll('.social__comment');
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onPhotoEscPress);

    for (var i = 0; i < usersComments.length; i++) {
      socialCommentsElement.removeChild(usersComments[i]);
    }
  };

  backend.receiveData(function (pictures) {
    var picturesArray = pictures;
    addPictures(picturesArray);

    similarListElement.addEventListener('click', function (evt) {
      if (evt.target.className === 'picture__img') {
        var targetPhoto = event.target.dataset.picture;
        showPhoto(picturesArray[targetPhoto], targetPhoto, picturesArray);
      }
    });

    similarListElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === util.ENTER_KEYCODE) {
        var targetPhoto = event.target.firstElementChild.dataset.picture;
        showPhoto(picturesArray[targetPhoto], targetPhoto, picturesArray);
      }
    });
  });

  closeButtonPhoto.addEventListener('click', function () {
    closePhoto();
  });

  window.gallery = {
    showPhoto: showPhoto
  };
})(window.util, window.backend);
