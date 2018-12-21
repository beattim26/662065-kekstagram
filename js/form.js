'use strict';
(function (util, backend, photoEditor) {
  var MAX_CHARACTERS = 20;
  var MAX_TAGS = 5;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var uploadButton = document.querySelector('#upload-file');
  var imagePreview = document.querySelector('.img-upload__preview-photo');
  var closeButtonUpload = document.querySelector('#upload-cancel');
  var uploadPopup = document.querySelector('.img-upload__overlay');
  var form = document.querySelector('#upload-select-image');
  var radioEffectNone = document.querySelector('#effect-none');
  var hashTag = uploadPopup.querySelector('.text__hashtags');
  var commentField = uploadPopup.querySelector('.text__description');

  var onUploadEscPress = function (evt) {
    if (evt.keyCode === util.ESC_KEYCODE) {
      closeUploadPopup();
    }
  };

  var openUploadPopup = function () {
    uploadPopup.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
    radioEffectNone.checked = true;
    photoEditor.hideEffectsSlider();
  };

  var closeUploadPopup = function () {
    uploadPopup.classList.add('hidden');
    document.removeEventListener('keydown', onUploadEscPress);
    uploadButton.value = '';
    photoEditor.clearFilter();
    hashTag.value = '';
    commentField.value = '';
  };

  uploadButton.addEventListener('change', function () {
    var file = uploadButton.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imagePreview.src = reader.result;
        openUploadPopup();
      });

      reader.readAsDataURL(file);
    }
  });

  closeButtonUpload.addEventListener('click', function () {
    closeUploadPopup();
  });

  var showSuccess = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);

    var removeSucess = function (evt) {
      if (evt.keyCode === util.ESC_KEYCODE) {
        document.body.removeChild(successElement);
        document.removeEventListener('keydown', removeSucess);
      }
    };

    closeUploadPopup();
    document.body.appendChild(successElement);

    successElement.addEventListener('click', function () {
      document.body.removeChild(successElement);
    });

    document.addEventListener('keydown', removeSucess);
  };

  var showError = function (onError) {
    var similarErrorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = similarErrorTemplate.cloneNode(true);

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
    backend.uploadData(new FormData(form), showSuccess, showError);
    evt.preventDefault();
  });

  var showTagError = function (hashTags) {
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].length === 0) {
        return '';
      } else if (hashTags[i].indexOf('#') !== 0) {
        return 'Начните ваш хэштег с символа "#"';
      } else if (hashTags[i].length === 1) {
        return 'Ваш хэштег не может состоять только из одной решетки';
      } else if (hashTags[i].length > MAX_CHARACTERS) {
        return 'Ваш хэштег превышает максимальную длинну на ' + (hashTags[i].length - MAX_CHARACTERS) + ' символов';
      } else if (hashTags.length > MAX_TAGS) {
        return 'Нельзя указывать больше пяти хэштегов';
      } else if (hashTags[i].indexOf('#', 1) > 0) {
        return 'Хэштеги должны разделяться пробелом';
      } else if (hashTags.indexOf(hashTags[i], i + 1) > 0) {
        return 'Хэштеги не должны повторяться';
      }
    }
    return '';
  };

  var setTagValidity = function () {
    var tagsArray = hashTag.value.toLowerCase().split(/[\s]+/);

    hashTag.setCustomValidity(showTagError(tagsArray));

    hashTag.style.border = showTagError(tagsArray) ? '2px solid red' : '';
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
})(window.util, window.backend, window.photoEditor);
