// TODO localStorage Read & Write
/* localStorage는 브라우저에 저장할 수 있는 간단한 저장소 , url 별로 저장이 된다. 
  localStorage.setItem("키", "밸류")로 저장된다.
  localStorage.getItem("키")로 가져올 수 있다.
*/

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - 페이지에 최초에 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  // TODO 카테고리별 메뉴판 관리
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  // - 에스프레소 메뉴를 최초 페이지에 그려준다.
  this.currentCategory = "espresso";

  /* 초기화한다는 의미 */
  this.init = () => {
    if (store.getLocalStorage()) {
      //localStorage에 있는 데이터를 읽어온다.
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };
  // - 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가한다
  // - 클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.
  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `
            <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
              <span class="w-100 pl-2 menu-name ${
                menuItem.soldOut ? "sold-out" : ""
              }">${menuItem.name}</span>
              <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">
                품절
              </button>
              <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
              >
                수정
              </button>
              <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
              >
                삭제
              </button>
            </li>
            `;
      })
      .join("");

    // - 추가되는 메뉴의 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>`안에 삽입해야 한다.
    $("#menu-list").innerHTML = template;
    menuListCount();
  };
  //상태(변하는 데이터) - 메뉴명
  // 메뉴 총갯수를 보여주는 함수
  const menuListCount = () => {
    // - 총 메뉴 갯수를 count하여 상단에 보여준다.
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };
  // 메뉴 추가 함수
  const addMenuName = () => {
    const menuName = $("#menu-name").value;
    // - 사용자 입력 값이 빈 값이라면 추가되지 않는다.
    if (menuName === "") {
      alert("값을 입력해주세요");
      return;
    }
    this.menu[this.currentCategory].push({ name: menuName });
    // localStorage에 데이터 저장하기
    store.setLocalStorage(this.menu);
    render();
    // - 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
    $("#menu-name").value = "";
  };
  // 메뉴 수정 함수
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    // localStorage에 데이터 저장
    store.setLocalStorage(this.menu);
    render();
  };
  // 메뉴 삭제 함수
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      // localStorage에 데이터 저장
      store.setLocalStorage(this.menu);
      render();
    }
  };
  //메뉴 품절 함수
  // - 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    // form 태그가 자동으로 전송되는 걸 막아준다.
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });
    // - 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });
    // - 메뉴의 이름을 입력 받고 확인 버튼 클릭으로 추가한다.
    $("#menu-submit-button").addEventListener("click", addMenuName);

    /* 이벤트 위임, 상위엘리먼트에게 먼저 바인딩해놓기 */
    $("#menu-list").addEventListener("click", (e) => {
      // TODO 메뉴 수정
      // - 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창이 뜬다.
      // - 모달창에서 신규메뉴명을 입력받고, 확인 버튼을 누르면 메뉴가 수정된다.
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      // TODO 메뉴 삭제
      // - 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
      // - 확인 버튼을 클릭하면 메뉴가 삭제된다.
      // - 총 메뉴 갯수를 count하여 상단에 보여준다.
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      // 클릭 시 품절
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });
    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}
const app = new App();
app.init();
