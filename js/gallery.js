'use strict';
(function (util, backend) {
  var NEW_PICTURES_COUNT = 10;
  var PREVIEW_COMMENTS_COUNT = 5;
  var fragment = document.createDocumentFragment();
  var bigPicture = document.querySelector('.big-picture');
  var closeButtonPhoto = bigPicture.querySelector('.big-picture__cancel');
  var socialCommentsTemplate = document.querySelector('#social-comment').content.querySelector('.social__comment');
  var socialCommentsElement = bigPicture.querySelector('.social__comments');
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var similarListElement = document.querySelector('.pictures');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var usersComments = bigPicture.querySelectorAll('.social__comment');
  var imageFilters = document.querySelector('.img-filters');
  var filterButtons = imageFilters.querySelectorAll('.img-filters__button');
  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var renderPicture = function (picture) {
    var pictureElement = similarPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__img').dataset.picture = picture.dataset;
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

  var sortPicturesByComments = function (arr) {
    arr.sort(function (picture1, picture2) {
      return picture2.comments.length - picture1.comments.length;
    });
  };

  var makeButtonInactive = function () {
    var buttonActive = document.querySelector('.img-filters__button--active');
    if (buttonActive) {
      buttonActive.classList.remove('img-filters__button--active');
    }
  };

  var updatePicturesPopular = function (pictures) {
    removePictures();
    addPictures(pictures);
  };

  var updatePicturesNew = function (pictures) {
    removePictures();
    util.shufflePictures(pictures);

    for (var i = 0; i < NEW_PICTURES_COUNT; i++) {
      fragment.appendChild(renderPicture(pictures[i], i));
    }

    similarListElement.appendChild(fragment);
  };

  var updatePicturesDiscussed = function (pictures) {
    removePictures();
    sortPicturesByComments(pictures);
    addPictures(pictures);
  };

  var filterPictures = function (evt, pictures) {
    var picturesCopy = pictures.slice();
    makeButtonInactive();
    evt.target.classList.add('img-filters__button--active');

    switch (evt.target.id) {
      case 'filter-popular':
        util.debounce(updatePicturesPopular, picturesCopy);
        break;
      case 'filter-new':
        util.debounce(updatePicturesNew, picturesCopy);
        break;
      case 'filter-discussed':
        util.debounce(updatePicturesDiscussed, picturesCopy);
        break;
    }
  };

  var removePictures = function () {
    Array.prototype.forEach.call(document.querySelectorAll('.picture'), function (picture) {
      picture.parentNode.removeChild(picture);
    });
  };

  var onPhotoEscPress = function (evt) {
    if (evt.keyCode === util.ESC_KEYCODE) {
      closePhoto();
    }
  };

  var showPhoto = function (picture, target, picturesArray) {
    var commentsAmount = picturesArray[target].comments.length;
    var commentsCopy = picturesArray[target].comments.slice();

    bigPicture.classList.remove('hidden');
    commentsLoader.classList.remove('hidden');

    bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.social__caption').textContent = picture.description;

    document.addEventListener('keydown', onPhotoEscPress);

    renderComments(prepareComments(commentsCopy));
    usersComments = bigPicture.querySelectorAll('.social__comment');
    updateCommentsContent(usersComments.length, commentsAmount);

    commentsLoader.addEventListener('click', function () {
      renderComments(prepareComments(commentsCopy));
      usersComments = bigPicture.querySelectorAll('.social__comment');
      updateCommentsContent(usersComments.length, commentsAmount);
    });
  };

  var renderComment = function (comment) {
    var commentEllement = socialCommentsTemplate.cloneNode(true);

    commentEllement.querySelector('.social__picture').src = comment.avatar;
    commentEllement.querySelector('.social__text').textContent = comment.message;

    return commentEllement;
  };

  var renderComments = function (pictures) {
    for (var i = 0; i < pictures.length; i++) {
      fragment.appendChild(renderComment(pictures[i]));
    }

    socialCommentsElement.appendChild(fragment);
  };

  var updateCommentsContent = function (currentCount, totalCount) {
    commentsCount.textContent = currentCount + ' из ' + totalCount + ' комментариев';
  };

  var prepareComments = function (comments) {
    if (comments.length > PREVIEW_COMMENTS_COUNT) {
      commentsLoader.classList.remove('hidden');

      return comments.splice(0, PREVIEW_COMMENTS_COUNT);
    }

    commentsLoader.classList.add('hidden');

    return comments.splice(0, comments.length);
  };

  var closePhoto = function () {
    usersComments = bigPicture.querySelectorAll('.social__comment');
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onPhotoEscPress);

    for (var i = 0; i < usersComments.length; i++) {
      socialCommentsElement.removeChild(usersComments[i]);
    }
  };

  backend.receiveData(function (data) {
    var pictures = data.map(function (picture, index) {
      picture.dataset = index;

      return picture;
    });

    addPictures(pictures);

    if (pictures) {
      imageFilters.classList.remove('img-filters--inactive');
    }

    for (var i = 0; i < filterButtons.length; i++) {
      filterButtons[i].addEventListener('click', function (evt) {
        filterPictures(evt, pictures);
      });
    }

    similarListElement.addEventListener('click', function (evt) {
      if (evt.target.className === 'picture__img') {
        var targetPhoto = evt.target.dataset.picture;
        showPhoto(pictures[targetPhoto], targetPhoto, pictures);
      }
    });

    similarListElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === util.ENTER_KEYCODE) {
        var targetPhoto = evt.target.firstElementChild.dataset.picture;
        showPhoto(pictures[targetPhoto], targetPhoto, pictures);
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
