'use strict';
(function (data, util, backend) {
  var MAX_COMMENTS_SHOW = 5;
  var similarListElement = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  var bigPicture = document.querySelector('.big-picture');
  var closeButtonPhoto = bigPicture.querySelector('.big-picture__cancel');
  var socialCommentsTemplate = document.getElementById('social-comment').content.querySelector('.social__comment');
  var socialCommentsElement = bigPicture.querySelector('.social__comments');

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

    backend.receiveData(function (pictures) {
      var commentsCount = pictures[target].comments.length;

      if (pictures[target].comments.length > MAX_COMMENTS_SHOW) {
        commentsCount = MAX_COMMENTS_SHOW;
      }

      for (var i = 0; i < commentsCount; i++)
        fragment.appendChild(renderComment(pictures[target].comments[i]));
      socialCommentsElement.appendChild(fragment);
    });
  };

  var closePhoto = function () {
    var usersComments = bigPicture.querySelectorAll('.social__comment');
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onPhotoEscPress);

    for (var i = 0; i < usersComments.length; i++) {
      socialCommentsElement.removeChild(usersComments[i]);
    }
  };

  similarListElement.addEventListener('click', function (evt) {
    var targetPhoto = event.target.dataset.picture;
    if (evt.target.className === 'picture__img') {
      backend.receiveData(function (pictures) {
        showPhoto(pictures[targetPhoto], targetPhoto);
      });
    }
  });

  similarListElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === util.ENTER_KEYCODE) {
      var targetPhoto = event.target.firstElementChild.dataset.picture;
      backend.receiveData(function (pictures) {
        showPhoto(pictures[targetPhoto], targetPhoto);
      });
    }
  });

  closeButtonPhoto.addEventListener('click', function () {
    closePhoto();
  });

  window.gallery = {
    similarListElement: similarListElement,
    fragment: fragment
  }
})(window.data, window.util, window.backend);
