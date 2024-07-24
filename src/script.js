const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector("button");
const searchLabel = document.querySelector(".input__label");
const loadingScreen = document.querySelector(".loading");
const searchScreen = document.querySelector(".search");
const contentScreen = document.querySelector(".content");
const backButton = document.querySelector(".back__button");
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (searchInput.value == "") {
    searchInput.style.border = "solid 1px red";
    searchLabel.textContent = "Поле обязательно для заполнения!";
    searchLabel.style.color = "red";
    searchInput.addEventListener("input", function (event) {
      if (searchInput.value == "") {
        searchInput.style.border = "solid 1px red";
        searchLabel.style.color = "red";
        searchLabel.textContent = "Поле обязательно для заполнения!";
      } else {
        searchInput.style.border = "solid 1px #efefef";
        searchLabel.style.color = "#8c8c8c";
        searchLabel.textContent = "Введите логин пользователя";
      }
    });
  } else {
    demoGithubUser();
  }
});

backButton.addEventListener("click", function () {
  contentScreen.style.display = "none";
  searchScreen.style.display = "flex";
  document.querySelector(".user__avatar").src = "Неизвестно";
  document.querySelector(".username").innerHTML = "Неизвестно";
  document.querySelector(".login").innerHTML = "Неизвестно";
  document.querySelector(".location").innerHTML = `Локация: неизвестно`;
  document.querySelector(".email").innerHTML = `Email: неизвестно`;
  document.querySelector(
    ".create__date"
  ).innerHTML = `Дата создания: неизвестно`;
  document.querySelector(".github__button").setAttribute("href", "");
});

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = "HttpError";
    this.response = response;
  }
}
async function loadJson(url) {
  const response = await fetch(url);
  if (response.status == 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
}
async function renderUser(user) {
  if (user.name) {
    document.querySelector(".username").innerHTML = await user.name;
  }

  if (user.login) {
    document.querySelector(".login").innerHTML = await user.login;
  }
  if (user.location) {
    document.querySelector(".location").innerHTML = `Локация: ${user.location}`;
  }

  if (user.email) {
    document.querySelector(".email").innerHTML = `Email: ${user.email}`;
  }

  if (user.created_at) {
    document.querySelector(
      ".create__date"
    ).innerHTML = `Дата создания: ${user.created_at.substr(0, 10)}`;
  }

  document
    .querySelector(".github__button")
    .setAttribute("href", `https://github.com/${user.login}`);

  if (user.avatar_url) {
    let avatar = new Image();
    avatar.src = user.avatar_url;
    avatar.onload = function () {
      document.querySelector(".user__avatar").src = avatar.src;
      avatar.remove();
      contentScreen.style.display = "flex";
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        loadingScreen.style.opacity = "1";
      }, 500);
    };
  } else {
    contentScreen.style.display = "flex";
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
      loadingScreen.style.opacity = "1";
    }, 500);
  }
}

async function demoGithubUser() {
  loadingScreen.style.display = "flex";
  searchScreen.style.display = "none";
  let user;
  let name = searchInput.value;
  try {
    user = await loadJson(`https://api.github.com/users/${name}`);
    renderUser(user);
  } catch (err) {
    if (err instanceof HttpError && err.response.status == 404) {
      hotReset("Пользователь не найден. Пожалуйста, повторите ввод");
    } else {
      hotReset("Произошла неизвестная ошибка. Пожалуйста, попробуйте снова.");
    }
  }
}

function hotReset(message) {
  searchInput.value = "";
  document.querySelector(".user__avatar").src = "../img/image.png";
  document.querySelector(".username").innerHTML = "Неизвестно";
  document.querySelector(".location").innerHTML = `Локация: неизвестно`;
  document.querySelector(".email").innerHTML = `Email: неизвестно`;
  document.querySelector(
    ".create__date"
  ).innerHTML = `Дата создания: неизвестно`;
  document.querySelector(".github__button").setAttribute("href", "");
  const notification = document.createElement("div");
  const notificationMessage = document.createElement("p");
  notificationMessage.innerHTML = `${message}`;
  notification.classList.add("notification");
  notificationMessage.classList.add("notification__message");
  notification.append(notificationMessage);
  searchScreen.append(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.remove();
    }, 1000);
  }, 3000);
  searchScreen.style.display = "flex";
  loadingScreen.style.display = "none";
}
