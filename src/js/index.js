// TODO localStorage Read & Write
// - localStorage에 데이터를 저장한다.
// - 메뉴를 추가할 때
// - 메뉴를 수정할 때
// - 메뉴를 삭제할 때
// - localStorage에 있는 데이터를 읽어온다.
/* localStorage는 브라우저에 저장할 수 있는 간단한 저장소 , url 별로 저장이 된다. 
  localStorage.setItem("키", "밸류")로 저장된다.
  localStorage.getItem("키")로 가져올 수 있다.
*/
// TODO 카테고리별 메뉴판 관리
// - 에스프레소 메뉴판 관리
// - 프라푸치노 메뉴판 관리
// - 블렌디드 메뉴판 관리
// - 티바나 메뉴판 관리
// - 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - 페이지에 최초에 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
// - 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가한다
// - 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - 클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.

// TODO 메뉴 추가
const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu)); // localStorage에는 문자열로만 저장해줘야 한다.
  },
  getLocalStorage() {
    localStorage.getItem("menu");
  },
};

function App() {
  this.menu = [];
  //상태(변하는 데이터) - 메뉴명
  // 메뉴 총갯수를 보여주는 함수
  const menuListCount = () => {
    // - 총 메뉴 갯수를 count하여 상단에 보여준다.
    const menuCount = document.querySelectorAll(".menu-list-item").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };
  // 메뉴 추가 함수
  const addMenuName = () => {
    const espressoMenuName = $("#espresso-menu-name").value;
    // - 사용자 입력 값이 빈 값이라면 추가되지 않는다.
    if (espressoMenuName === "") {
      alert("값을 입력해주세요");
      return;
    }
    this.menu.push({ name: espressoMenuName });
    //#2 . localStorage에 데이터 저장하기
    store.setLocalStorage(this.menu);

    const template = this.menu
      .map((item) => {
        return `
      <li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${item.name}</span>
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
    $("#espresso-menu-list").innerHTML = template;
    menuListCount();

    // - 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
    $("#espresso-menu-name").value = "";
  };
  // 메뉴 수정 함수
  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    $menuName.innerText = updatedMenuName;
  };
  // 메뉴 삭제 함수
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      menuListCount();
    }
  };

  // form 태그가 자동으로 전송되는 걸 막아준다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  // - 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
  // - 메뉴의 이름을 입력 받고 확인 버튼 클릭으로 추가한다.
  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  /* 이벤트 위임, 상위엘리먼트에게 먼저 바인딩해놓기 */
  $("#espresso-menu-list").addEventListener("click", (e) => {
    // TODO 메뉴 수정
    // - 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창이 뜬다.
    // - 모달창에서 신규메뉴명을 입력받고, 확인 버튼을 누르면 메뉴가 수정된다.
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    // TODO 메뉴 삭제
    // - 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
    // - 확인 버튼을 클릭하면 메뉴가 삭제된다.
    // - 총 메뉴 갯수를 count하여 상단에 보여준다.
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });
}

const app = new App();
