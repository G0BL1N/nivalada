const request = require('request-promise-native');

module.exports = {
  booruRequestRecursive
}

function booruRequestRecursive(url, list, currPage) {
  let requestUrl = url + `&pid=${currPage}`;
  return request(requestUrl)
    .then((body) => {
      if(!body) {
        throw new Error('Not found');
      }
      let content = JSON.parse(body);
      list = list.concat(content);
      if(content.length < 100 || list.length === 1000) return list;
      return booruRequestRecursive(url, list, ++currPage);
    })
}
