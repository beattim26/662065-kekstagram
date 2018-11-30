'use strict';
var similarListElement = document.querySelector('.pictures');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var bigPicture = document.querySelector('.big-picture');
var socialCommentsElement = bigPicture.querySelector('.social__comments');
var socialCommentsTemplate = document.getElementById('social-comment').content.querySelector('.social__comment');
var fragment = document.createDocumentFragment();
var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var description = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var names = ['Артем', 'Петр', 'Василий', 'Иван', 'Генадий', 'Виктория', 'Елена', 'Мария'];

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
  return arr[getRandomNumber(0, arr.length)];
};

var getRandomMessage = function (n) {
  if (n === 1) {
    return getRandomFromArray(comments);
  } else {
    return getRandomFromArray(comments) + ' ' + getRandomFromArray(comments);
  }
};

var getRandomComments = function (n) {
  var randomComment = [];
  for (var i = 0; i < n; i++) {
    randomComment.push({
      avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
      message: getRandomMessage(getRandomNumber(1, 2)),
      name: getRandomFromArray(names)
    });
  }
  return randomComment;
};

var getRandomPictures = function (n) {
  var randomData = [];
  for (var i = 0; i < n; i++) {
    randomData.push({
      url: imagesUrls[i],
      likes: getRandomNumber(15, 200),
      comments: getRandomComments(5),
      description: getRandomFromArray(description)
    });
  }
  return randomData;
};

var renderPicture = function (picture) {
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = getRandomNumber(3, 15);

  return pictureElement;
};

var pictureData = getRandomPictures(25);

for (var i = 0; i < pictureData.length; i++) {
  fragment.appendChild(renderPicture(pictureData[i]));
}

similarListElement.appendChild(fragment);

var showPhoto = function (picture) {
  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;
};

showPhoto(pictureData[0]);

var renderComments = function (comment) {
  var commentEllement = socialCommentsTemplate.cloneNode(true);

  commentEllement.querySelector('.social__picture').src = comment.avatar;
  commentEllement.querySelector('.social__text').textContent = comment.message;

  return commentEllement;
};

for (i = 0; i < getRandomNumber(0, 5); i++) {
  fragment.appendChild(renderComments(pictureData[i].comments[i]));
}

socialCommentsElement.appendChild(fragment);

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
