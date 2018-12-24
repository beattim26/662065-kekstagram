'use strict';
(function (util, backend) {
  var NEW_PICTURES_COUNT = 10;
  var PREVIEW_COMMENTS_COUNT = 5;
  var onCommentsLoaderClick;
  var fragment = document.createDocumentFragment();
  var bigPicture = document.querySelector('.big-picture');
  var closeButtonPhoto = bigPicture.querySelector('.big-picture__cancel');
  var similarComments = document.querySelector('#social-comment').content.querySelector('.social__comment');
  var socialComments = bigPicture.querySelector('.social__comments');
  var similarPicture = document.querySelector('#picture').content.querySelector('.picture');
  var pictureList = document.querySelector('.pictures');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var usersComments = bigPicture.querySelectorAll('.social__comment');
  var imageFilters = document.querySelector('.img-filters');
  var filterButtons = imageFilters.querySelectorAll('.img-filters__button');
  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var renderPicture = function (picture) {
    var pictureElement = similarPicture.cloneNode(true);

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

    pictureList.appendChild(fragment);
  };

  var sortPicturesByComments = function (arr) {
    arr.sort(function (picture1, picture2) {
      return picture2.comments.length - picture1.comments.length;
    });
  };

  var makeButtonInactive = function () {
    var buttonActive = imageFilters.querySelector('.img-filters__button--active');
    if (buttonActive) {
      buttonActive.classList.remove('img-filters__button--active');
    }
  };

  var updatePicturesPopular = function (pictures) {
    addPictures(pictures);
  };

  var updatePicturesNew = function (pictures) {
    util.shufflePictures(pictures);
    addPictures(pictures.slice(0, NEW_PICTURES_COUNT));
  };

  var updatePicturesDiscussed = function (pictures) {
    sortPicturesByComments(pictures);
    addPictures(pictures);
  };

  var filterPictures = function (evt, pictures) {
    var picturesCopy = pictures.slice();
    removePictures();

    switch (evt.target.id) {
      case 'filter-popular':
        updatePicturesPopular(picturesCopy);
        break;
      case 'filter-new':
        updatePicturesNew(picturesCopy);
        break;
      case 'filter-discussed':
        updatePicturesDiscussed(picturesCopy);
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
    document.body.classList.add('modal-open');
    commentsLoader.classList.remove('hidden');
    commentsLoader.removeEventListener('click', onCommentsLoaderClick);

    bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.social__caption').textContent = picture.description;

    document.addEventListener('keydown', onPhotoEscPress);

    renderComments(prepareComments(commentsCopy));
    usersComments = bigPicture.querySelectorAll('.social__comment');
    updateCommentsContent(usersComments.length, commentsAmount);

    onCommentsLoaderClick = onCommentsClick.bind(null, commentsCopy, commentsAmount);

    commentsLoader.addEventListener('click', onCommentsLoaderClick);
  };

  var onCommentsClick = function (copy, amount) {
    renderComments(prepareComments(copy));
    usersComments = bigPicture.querySelectorAll('.social__comment');
    updateCommentsContent(usersComments.length, amount);
  };

  var renderComment = function (comment) {
    var commentEllement = similarComments.cloneNode(true);

    commentEllement.querySelector('.social__picture').src = comment.avatar;
    commentEllement.querySelector('.social__text').textContent = comment.message;

    return commentEllement;
  };

  var renderComments = function (pictures) {
    for (var i = 0; i < pictures.length; i++) {
      fragment.appendChild(renderComment(pictures[i]));
    }

    socialComments.appendChild(fragment);
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
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onPhotoEscPress);

    usersComments.forEach(function (comment) {
      socialComments.removeChild(comment);
    });
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

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function (evt) {
        makeButtonInactive();
        evt.target.classList.add('img-filters__button--active');
        util.debounce(filterPictures.bind(null, evt, pictures));
      });
    });

    pictureList.addEventListener('click', function (evt) {
      if (evt.target.className === 'picture__img') {
        var targetPhoto = evt.target.dataset.picture;
        showPhoto(pictures[targetPhoto], targetPhoto, pictures);
      }
    });

    pictureList.addEventListener('keydown', function (evt) {
      if (evt.keyCode === util.ENTER_KEYCODE) {
        if (evt.target.className === 'picture') {
          var targetPhoto = evt.target.firstElementChild.dataset.picture;
          showPhoto(pictures[targetPhoto], targetPhoto, pictures);
        }
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
