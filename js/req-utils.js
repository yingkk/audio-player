var _baseURI = _fgConfig.baseURI;

function getToken() {
  return getFgCookie("token");
}

function fgGet(url, params, callback) {
  var _token = getToken();
  axios
    .get(_baseURI + url, {
      params: params,
      headers: { authToken: _token },
    })
    .then(function (response) {
      callback && callback(null, response.data);
    })
    .catch(function (error) {
      callback && callback(error);
    });
}

function fgGetWithOutToken(url, params, callback) {
  axios
    .get(_baseURI + url, {
      params: params,
    })
    .then(function (response) {
      callback && callback(null, response.data);
    })
    .catch(function (error) {
      callback && callback(error);
    });
}

function fgPost(url, data, callback) {
  var _token = getToken();
  _token = _token || "";
  axios
    .post(_baseURI + url, data, {
      headers: { authToken: _token },
    })
    .then(function (response) {
      callback && callback(null, response.data);
    })
    .catch(function (error) {
      callback && callback(error);
    });
}

function fgPostFile(url, data, callback) {
  var _token = getToken();
  var forms = new FormData();
  var configs = {
    headers: { "Content-Type": "multipart/form-data", authToken: _token },
  };
  forms.append("file", data.file);
  this.axios
    .post(_baseURI + url, forms, configs)
    .then(function (response) {
      if (!response) return;
      if (!response.data) return;
      if (response.data.code == 200) {
        callback && callback(null, response.data);
      } else {
        callback && callback(null, response.data);
      }
    })
    .catch(function (error) {
      callback && callback(error);
    });
}

function fgPostWithoutToken(url, data, callback) {
  axios
    .post(_baseURI + url, data, {
      // 利用 transformRequest 进行转换配置
      transformRequest: [
        function (oldData) {
          // console.log(oldData)
          var newStr = "";
          for (var item in oldData) {
            newStr +=
              encodeURIComponent(item) +
              "=" +
              encodeURIComponent(oldData[item]) +
              "&";
          }
          newStr = newStr.slice(0, -1);
          return newStr;
        },
      ],
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then(function (response) {
      callback && callback(null, response.data);
    })
    .catch(function (error) {
      callback && callback(error);
    });
}

function fgPostJsonWithoutToken(url, data, callback) {
  axios
    .post(_baseURI + url, data)
    .then(function (response) {
      callback && callback(null, response.data);
    })
    .catch(function (error) {
      callback && callback(error);
    });
}

