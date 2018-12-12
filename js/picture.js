'use strict';
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var STEP_VALUE = 25;
var MAX_VALUE = '100%';
var MIN_VALUE = '25%';
var MAX_SYMBOLS = 20;
var MAX_TAGS = 5;
var activeFilter;
var similarListElement = document.querySelector('.pictures');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var bigPicture = document.querySelector('.big-picture');
var socialCommentsElement = bigPicture.querySelector('.social__comments');
var socialCommentsTemplate = document.getElementById('social-comment').content.querySelector('.social__comment');
var fragment = document.createDocumentFragment();
var uploadButton = document.getElementById('upload-file');
var uploadPopup = document.querySelector('.img-upload__overlay');
var closeButtonUpload = document.getElementById('upload-cancel');
var closeButtonPhoto = bigPicture.querySelector('.big-picture__cancel');
var scaleValue = uploadPopup.querySelector('.scale__control--value');
var scaleSmaller = uploadPopup.querySelector('.scale__control--smaller');
var scaleBigger = uploadPopup.querySelector('.scale__control--bigger');
var imagePreview = uploadPopup.querySelector('.img-upload__preview-photo');
var effectsList = uploadPopup.querySelector('.img-upload__effects');
var effectLevel = uploadPopup.querySelector('.img-upload__effect-level');
var effectPin = uploadPopup.querySelector('.effect-level__pin');
var effectValue = uploadPopup.querySelector('.effect-level__value');
var effectsLabel = uploadPopup.querySelectorAll('.effects__label');
var hashTag = uploadPopup.querySelector('.text__hashtags');
var commentField = uploadPopup.querySelector('.text__description');
var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var descriptions = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var names = ['Артем', 'Петр', 'Василий', 'Иван', 'Генадий', 'Виктория', 'Елена', 'Мария'];
var Filter = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat'
};

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getImagesUrls = function (n) {
  var anyUrls = [];
  var randomUrl = 'photos/' + getRandomNumber(1, n) + '.jpg';
  while (anyUrls.length < n) {
    randomUrl = 'photos/' + getRandomNumber(1, n) + '.jpg';
    if (anyUrls.indexOf(randomUrl) === -1) {
      anyUrls.push(randomUrl);
    }
  }
  return anyUrls;
};

var imagesUrls = getImagesUrls(25);

var getRandomFromArray = function (arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
};

var getRandomMessage = function (n) {
  if (n === 1) {
    return getRandomFromArray(comments);
  }
  return getRandomFromArray(comments) + ' ' + getRandomFromArray(comments);
};

var getRandomComments = function (n) {
  var randomComments = [];
  for (var i = 0; i < n; i++) {
    randomComments.push({
      avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
      message: getRandomMessage(getRandomNumber(1, 2)),
      name: getRandomFromArray(names)
    });
  }
  return randomComments;
};

var getRandomPictures = function (n) {
  var randomData = [];
  for (var i = 0; i < n; i++) {
    randomData.push({
      url: imagesUrls[i],
      likes: getRandomNumber(15, 200),
      comments: getRandomComments(getRandomNumber(0, 5)),
      description: getRandomFromArray(descriptions)
    });
  }
  return randomData;
};

var renderPicture = function (picture, index) {
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__img').dataset.picture = index;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = getRandomNumber(3, 15);

  return pictureElement;
};

var pictures = getRandomPictures(25);

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

var onUploadEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeEffect();
  }
};

var onPhotoEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePhoto();
  }
};

var openEffect = function () {
  uploadPopup.classList.remove('hidden');
  document.addEventListener('keydown', onUploadEscPress);
};

var closeEffect = function () {
  uploadPopup.classList.add('hidden');
  document.removeEventListener('keydown', onUploadEscPress);
  uploadButton.value = '';
};

var showPhoto = function (picture) {
  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  document.addEventListener('keydown', onPhotoEscPress);

  for (i = 0; i < picture.comments.length; i++) {
    fragment.appendChild(renderComment(pictures[event.target.dataset.picture].comments[i]));
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

uploadButton.addEventListener('change', function () {
  openEffect();
});

closeButtonUpload.addEventListener('click', function () {
  closeEffect();
});

similarListElement.addEventListener('click', function (evt) {
  if (evt.target.className === 'picture__img') {
    showPhoto(pictures[event.target.dataset.picture]);
  }
});

closeButtonPhoto.addEventListener('click', function () {
  closePhoto();
});

var changeFilter = function (filterName) {
  var effectsValue = 'effects__preview--' + filterName;
  effectLevel.classList.remove('hidden');

  imagePreview.className = '';
  imagePreview.classList.add(effectsValue);
  imagePreview.style.filter = null;

  if (filterName === Filter.NONE) {
    effectLevel.classList.add('hidden');
    activeFilter = Filter.NONE;
  } else {
    activeFilter = filterName;
  }
};

var getFilterStyle = function (name, value) {
  switch (name) {
    case Filter.CHROME:
      return 'grayscale(0.' + (0.1 * value) + ')';
    case Filter.SEPIA:
      return 'sepia(0.' + (0.1 * value) + ')';
    case Filter.MARVIN:
      return 'invert(' + value + '%)';
    case Filter.PHOBOS:
      return 'blur(' + (0.05 * value) + 'px)';
    case Filter.HEAT:
      return 'brightness(' + (0.03 * value) + ')';
    default:
      return value;
  }
};

var applyFilter = function () {
  imagePreview.style.filter = getFilterStyle(activeFilter, effectValue.value);
};

scaleBigger.addEventListener('click', function () {
  if (scaleValue.value !== MAX_VALUE) {
    var currentValue = parseInt(scaleValue.value, 10);
    scaleValue.value = currentValue + STEP_VALUE + '%';
    currentValue += STEP_VALUE;
    imagePreview.style.transform = 'scale(' + currentValue / 100 + ')';
  }
});

scaleSmaller.addEventListener('click', function () {
  if (scaleValue.value !== MIN_VALUE) {
    var currentValue = parseInt(scaleValue.value, 10);
    scaleValue.value = currentValue - STEP_VALUE + '%';
    currentValue -= STEP_VALUE;
    imagePreview.style.transform = 'scale(' + currentValue / 100 + ')';
  }
});

effectsList.addEventListener('change', function (evt) {
  changeFilter(evt.target.value);
});

for (i = 0; i < effectsLabel.length; i++) {
  effectsLabel[i].addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      var eventInput = document.getElementById(event.target.parentNode.htmlFor);
      changeFilter(eventInput.value);
    }
  });
}

effectPin.addEventListener('mouseup', function () {
  applyFilter();
});

effectPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    applyFilter();
  }
});

var showTagError = function (hashTags) {
  for (i = 0; i < hashTags.length; i++) {
    if (hashTags[i].indexOf('#') !== 0) {
      return 'Начните ваш хэштег с символа "#"';
    } else if (hashTags[i].length === 1) {
      return 'Ваш хэштег не может состоять только из одной решетки';
    } else if (hashTags[i].length > MAX_SYMBOLS) {
      return 'Ваш хэштэг превышает максимальную длинну на ' + (hashTags[i].length - MAX_SYMBOLS) + ' символов';
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
