'use strict';
(function (util) {
  var MAX_CHARACTERS = 20;
  var MAX_TAGS = 5;
  var uploadButton = document.getElementById('upload-file');
  var closeButtonUpload = document.getElementById('upload-cancel');
  var uploadPopup = document.querySelector('.img-upload__overlay');
  var hashTag = uploadPopup.querySelector('.text__hashtags');
  var commentField = uploadPopup.querySelector('.text__description');
  var form = document.getElementById('upload-select-image');

  var onUploadEscPress = function (evt) {
    if (evt.keyCode === util.ESC_KEYCODE) {
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
    form.reset();
  };

  uploadButton.addEventListener('change', function () {
    openUploadPopup();
  });

  closeButtonUpload.addEventListener('click', function () {
    closeUploadPopup();
  });

  var showTagError = function (hashTags, input) {
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].length === 0) {
        input.style.border = '';
        return '';
      } else if (hashTags[i].indexOf('#') !== 0) {
        input.style.border = '2px solid red';
        return 'Начните ваш хэштег с символа "#"';
      } else if (hashTags[i].length === 1) {
        input.style.border = '2px solid red';
        return 'Ваш хэштег не может состоять только из одной решетки';
      } else if (hashTags[i].length > MAX_CHARACTERS) {
        input.style.border = '2px solid red';
        return 'Ваш хэштег превышает максимальную длинну на ' + (hashTags[i].length - MAX_CHARACTERS) + ' символов';
      } else if (hashTags.length > MAX_TAGS) {
        input.style.border = '2px solid red';
        return 'Нельзя указывать больше пяти хэштегов';
      } else if (hashTags[i].indexOf('#', 1) > 0) {
        input.style.border = '2px solid red';
        return 'Хэштеги должны разделяться пробелом';
      } else if (hashTags.indexOf(hashTags[i], i + 1) > 0) {
        input.style.border = '2px solid red';
        return 'Хэштеги не должны повторяться';
      }
    }
    input.style.border = '';
    return '';
  };

  var setTagValidity = function () {
    var tagsArray = hashTag.value.toLowerCase().split(' ');
    hashTag.setCustomValidity(showTagError(tagsArray, hashTag));
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

  var showSuccess = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);

    closeUploadPopup();
    document.body.appendChild(successElement);

    successElement.addEventListener('click', function () {
      document.body.removeChild(successElement);
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === util.ESC_KEYCODE) {
        document.body.removeChild(successElement);
      }

      document.removeEventListener('keydown', showSuccess);
    });
  };

  var showError = function (onError) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);

    errorElement.querySelector('.error__title').textContent = onError;

    document.body.appendChild(errorElement);
    uploadPopup.classList.add('hidden');

    var errorButtons = document.querySelectorAll('.error__button');
    var submitButton = errorButtons[0];
    var closeButton = errorButtons[1];

    submitButton.addEventListener('click', function () {
      uploadPopup.classList.remove('hidden');
      document.body.removeChild(document.querySelector('.error'));
    });

    closeButton.addEventListener('click', function () {
      document.body.removeChild(document.querySelector('.error'));
      closeUploadPopup();
    });
  };

  form.addEventListener('submit', function (evt) {
    window.backend.uploadData(new FormData(form), showSuccess, showError);
    evt.preventDefault();
  });

})(window.util);
