'use strict';
(function (util, backend) {
  var NEW_PICTURES_COUNT = 10;
  var MAX_COMMENTS_SHOW = 5;
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
  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var renderComment = function (comment) {
    var commentEllement = socialCommentsTemplate.cloneNode(true);

    commentEllement.querySelector('.social__picture').src = comment.avatar;
    commentEllement.querySelector('.social__text').textContent = comment.message;

    return commentEllement;
  };

  var renderComments = function (arr, comments) {
    for (var i = 0; i < comments; i++) {
      fragment.appendChild(renderComment(arr.comments[i]));
    }

    socialCommentsElement.appendChild(fragment);
  };

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

  var sortUrlAscending = function (arr) {
    arr.sort(function (first, second) {
      return first.url.match(/\d+/) - second.url.match(/\d+/);
    });
  };

  var shufflePictures = function (arr) {
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

  var updatePicturesPopular = function (pictures) {
    removePictures();
    sortUrlAscending(pictures);
    addPictures(pictures);
  };

  var updatePicturesNew = function (pictures) {
    removePictures();
    shufflePictures(pictures);

    for (var i = 0; i < NEW_PICTURES_COUNT; i++) {
      fragment.appendChild(renderPicture(pictures[i], i));
    }

    similarListElement.appendChild(fragment);
  };

  var updatePicturesDiscussed = function (pictures) {
    removePictures();
    sortArrayComments(pictures);
    addPictures(pictures);
  };

  var filtratePictures = function (evt, pictures) {
    if (evt.target.tagName === 'BUTTON' && !evt.target.classList.contains('img-filters__button--active')) {
      makeButtonInactive();
      evt.target.classList.add('img-filters__button--active');
    }

    if (evt.target.id === 'filter-popular') {
      util.debounce(updatePicturesPopular, pictures);
    } else if (evt.target.id === 'filter-new') {
      util.debounce(updatePicturesNew, pictures);
    } else if (evt.target.id === 'filter-discussed') {
      util.debounce(updatePicturesDiscussed, pictures);
    }
  };

  var addPictures = function (picturesArr) {
    for (var i = 0; i < picturesArr.length; i++) {
      fragment.appendChild(renderPicture(picturesArr[i], i));
    }

    similarListElement.appendChild(fragment);
  };

  var removePictures = function () {
    var allPicture = document.querySelectorAll('.picture');
    for (var i = 0; i < allPicture.length; i++) {
      similarListElement.removeChild(allPicture[i]);
    }
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
    commentsLoader.classList.remove('hidden');

    bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.social__caption').textContent = picture.description;

    document.addEventListener('keydown', onPhotoEscPress);

    if (picturesArray[target].comments.length > MAX_COMMENTS_SHOW) {
      commentsAmount = MAX_COMMENTS_SHOW;
    }

    renderComments(picturesArray[target], commentsAmount);

    commentsCount.textContent = commentsAmount + ' из ' + picturesArray[target].comments.length + ' комментариев';

    if (picturesArray[target].comments.length <= MAX_COMMENTS_SHOW) {
      commentsLoader.classList.add('hidden');
    }

    commentsLoader.addEventListener('click', function () {
      usersComments = bigPicture.querySelectorAll('.social__comment');

      if (picturesArray[target].comments.length - usersComments.length > MAX_COMMENTS_SHOW) {
        commentsAmount = MAX_COMMENTS_SHOW;
        renderComments(picturesArray[target], commentsAmount);
      } else {
        commentsAmount = picturesArray[target].comments.length - usersComments.length;
        renderComments(picturesArray[target], commentsAmount);
        commentsLoader.classList.add('hidden');
      }

      usersComments = bigPicture.querySelectorAll('.social__comment');
      commentsCount.textContent = usersComments.length + ' из ' + picturesArray[target].comments.length + ' комментариев';
    });
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

    if (pictures) {
      imageFilters.classList.remove('img-filters--inactive');
    }

    imageFilters.addEventListener('click', function (evt) {
      filtratePictures(evt, picturesArray);
    });

    similarListElement.addEventListener('click', function (evt) {
      if (evt.target.className === 'picture__img') {
        var targetPhoto = evt.target.dataset.picture;
        showPhoto(picturesArray[targetPhoto], targetPhoto, picturesArray);
      }
    });

    similarListElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === util.ENTER_KEYCODE) {
        var targetPhoto = evt.target.firstElementChild.dataset.picture;
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
