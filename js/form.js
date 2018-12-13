'use strict';
(function () {
  var MAX_CHARACTERS = 20;
  var MAX_TAGS = 5;
  var uploadButton = document.getElementById('upload-file');
  var closeButtonUpload = document.getElementById('upload-cancel');
  var uploadPopup = document.querySelector('.img-upload__overlay');
  var hashTag = uploadPopup.querySelector('.text__hashtags');
  var commentField = uploadPopup.querySelector('.text__description');

  var onUploadEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeUploadPopup();
    }
  };

  var openUploadPopup = function () {
    uploadPopup.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
  };

  var closeUploadPopup = function () {
    uploadPopup.classList.add('hidden');
    document.removeEventListener('keydown', onUploadEscPress);
    uploadButton.value = '';
  };

  uploadButton.addEventListener('change', function () {
    openUploadPopup();
  });

  closeButtonUpload.addEventListener('click', function () {
    closeUploadPopup();
  });

  var showTagError = function (hashTags) {
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].indexOf('#') !== 0) {
        return 'Начните ваш хэштег с символа "#"';
      } else if (hashTags[i].length === 1) {
        return 'Ваш хэштег не может состоять только из одной решетки';
      } else if (hashTags[i].length > MAX_CHARACTERS) {
        return 'Ваш хэштэг превышает максимальную длинну на ' + (hashTags[i].length - MAX_CHARACTERS) + ' символов';
      } else if (hashTags.length > MAX_TAGS) {
        return 'Нельзя указывать больше пяти хэштегов';
      } else if (hashTags[i].indexOf('#', 1) > 0) {
        return 'Хэштэги должны разделяться пробелом';
      } else if (hashTags.indexOf(hashTags[i], i + 1) > 0) {
        return 'Хэштеги не должны повторяться';
      }
    }
    return '';
  };

  var setTagValidity = function () {
    var tagsArray = hashTag.value.toLowerCase().split(' ');

    hashTag.setCustomValidity(showTagError(tagsArray));
  };

  hashTag.addEventListener('input', function () {
    setTagValidity();
  });

  hashTag.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadEscPress);
  });

  hashTag.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadEscPress);
  });

  commentField.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadEscPress);
  });

  commentField.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadEscPress);
  });

})();
