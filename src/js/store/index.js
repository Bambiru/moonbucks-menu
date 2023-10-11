// localStorage
const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu)); // localStorage에는 문자열로만 저장해줘야 한다.
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

export default store;
