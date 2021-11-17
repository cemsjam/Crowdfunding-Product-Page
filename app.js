//#region 1.DOM items
const body = document.body;
// header navbar
const hamburgerBtn = document.querySelector(".hamburger-menu");
const navLinks = document.querySelector(".nav-links");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const header = document.querySelector("header");
const navItems = navLinks.querySelectorAll(".nav-item");
// cards
const cards = document.querySelectorAll(".stand-card-item");
//Bookmark items
const bmContainer = document.querySelector(".bm-container");
const bmText = document.querySelector(".bm-text");
//modal radio card buttons
const contentBtns = Array.from(document.querySelectorAll("#contentBtn"));
// modal items
const primaryBtn = document.querySelector(".btn-primary");
const rewardBtns = document.querySelectorAll("#rewardBtn");
const submitBtn = document.querySelectorAll(".content-btn");
const modal = document.querySelector("#modal");
const modalContainer = document.querySelector("#modalContainer");
const radioCardInputs = Array.from(document.getElementsByName("PledgeAmount"));
// close modal btn
const closeModalBtn = document.querySelector("#closeModalBtn");
// updated items
const totalRaised = document.querySelector(".total-raised");
const totalBackers = document.querySelector(".total-backers");
const progressTracker = document.querySelector("#progressBar");
//completed modal
const modalCompleted = document.querySelector("#modalCompleted");
const modalCompletedBtn = document.querySelector("#modalCompletedBtn");
//#endregion
//#region 2.general functions
const openOverlay = () => {
  body.classList.add("overlay-open");
};
const closeOverlay = () => {
  body.classList.remove("overlay-open");
};
const disableScrolling = () => {
  body.classList.add("no-scroll");
};
const enableScrolling = () => {
  body.classList.remove("no-scroll");
};
const removeCommas = (item) => {
  return item.replace(/,/g, "");
};
const numWithCommas = (item) => {
  return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//#endregion
//#region 3.toggle menu
const openMenu = () => {
  window.addEventListener("keydown", escKeyHandlerMenu);
  window.addEventListener("resize", screenWidthChecker);
  header.classList.add("show-menu");
  hamburgerIcon.classList.remove("fa-bars");
  hamburgerIcon.classList.add("fa-times");
  hamburgerIcon.parentElement.setAttribute("aria-expanded", true);
  disableScrolling();
  openOverlay();
  focusableElementsString = "button , a";
  focusableElements = header.querySelectorAll(`${focusableElementsString}`);
  focusableElements = Array.prototype.slice.call(focusableElements);
  firstTabStop = focusableElements[0];
  lastTabStop = focusableElements[focusableElements.length - 1];
  window.addEventListener("keydown", trapTabKey);
};
const closeMenu = () => {
  header.classList.remove("show-menu");
  window.removeEventListener("keydown", escKeyHandlerMenu);
  window.removeEventListener("resize", screenWidthChecker);
  hamburgerIcon.classList.remove("fa-times");
  hamburgerIcon.classList.add("fa-bars");
  hamburgerIcon.parentElement.setAttribute("aria-expanded", false);
  enableScrolling();
  closeOverlay();
  window.removeEventListener("keydown", trapTabKey);
};
const escKeyHandlerMenu = (e) => {
  if (e.key === "Escape") {
    return closeMenu();
  }
};
//close in case of resizing
const screenWidthChecker = () => {
  let headerWidth = header.getBoundingClientRect().width;
  if (headerWidth >= 640) {
    closeMenu();
  }
};
menuToggle = hamburgerBtn.addEventListener("click", () => {
  const menuIsActive = header.classList.contains("show-menu");
  if (!menuIsActive) {
    openMenu();
  } else if (menuIsActive) {
    closeMenu();
  }
});
// nav item selected
navItems.forEach((navItem) => {
  navItem.addEventListener("click", closeMenu);
});
//#endregion
//#region 4.bookmark
const bmToggle = (e) => {
  e.preventDefault();
  bmActive = bmContainer.classList.contains("bookmarked");
  if (!bmActive) {
    bmContainer.classList.add("bookmarked");
    bmText.textContent = `Bookmarked`;
  } else {
    bmContainer.classList.remove("bookmarked");
    bmText.textContent = `Bookmark`;
  }
};
bmContainer.addEventListener("click", bmToggle);
//#endregion
//#region 5.modals
const activeInputs = radioCardInputs.filter((input) => !input.disabled);
// focustrap elements
let focusedElementBeforeModal,
  focusableElementsString,
  focusableElements,
  firstTabStop,
  lastTabStop,
  trapTabKey;
// modal state checker
let isModalActive = false;
let isModalCompletedActive = false;
// for updating stats
let updatedTotalRaised, updatedTotalBackers, inputID;
trapTabKey = (e) => {
  if (e.keyCode !== 9) {
    return;
  } else if (
    e.keyCode === 9 &&
    e.shiftKey &&
    document.activeElement == firstTabStop
  ) {
    e.preventDefault();
    lastTabStop.focus();
  } else if (
    e.keyCode === 9 &&
    !e.shiftKey &&
    document.activeElement == lastTabStop
  ) {
    e.preventDefault();
    firstTabStop.focus();
  }
};
const modalOpen = () => {
  let focusableRadios = radioCardInputs.filter((item) => !item.disabled);
  focusedElementBeforeModal = document.activeElement;
  closeMenu();
  modal.classList.add("show-modal");
  disableScrolling();
  openOverlay();
  focusableElements = [closeModalBtn, focusableRadios[0]];
  focusableElements = Array.prototype.slice.call(focusableElements);
  firstTabStop = focusableElements[0];
  lastTabStop = focusableElements[focusableElements.length - 1];
  window.addEventListener("keydown", trapTabKey);
  //to make tab start from modal
  modalContainer.setAttribute("tabindex", 1);
  modalContainer.focus();
  modalContainer.setAttribute("tabindex", -1);
  window.addEventListener("keydown", escKeyHandlerModal);
};
const modalClose = () => {
  modal.classList.remove("show-modal");
  isModalActive = false;
  enableScrolling();
  closeOverlay();
  window.removeEventListener("keydown", trapTabKey);
  window.removeEventListener("keydown", escKeyHandlerModal);
  focusedElementBeforeModal.focus();
};
const escKeyHandlerModal = (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    modalClose();
    resetRadioBtns();
    focusedElementBeforeModal.focus();
  }
};
const resetRadioBtns = () => {
  activeInputs.forEach((radio) => {
    radio.checked = false;
    radio.nextElementSibling.nextElementSibling.classList.remove(
      "show-content"
    );
    radio.setAttribute("aria-checked", false);
  });
  const ctaSections = modal.querySelectorAll(".modal-item .modal-item__cta");
  ctaSections.forEach((item) => {
    item.setAttribute("aria-expanded", false);
  });
};
const showCtaAndFocusTrap = (element) => {
  element.checked = true;
  element.setAttribute("aria-checked", true);
  element.nextElementSibling.nextElementSibling.classList.add("show-content");
  element.nextElementSibling.nextElementSibling.setAttribute(
    "aria-expanded",
    true
  );
  checkedParent = element.parentElement;
  pledgeInput = checkedParent.querySelector(".content-input");
  contentBtn = checkedParent.querySelector(".content-btn");
  let tabbabbleElements = [pledgeInput, contentBtn];
  if (pledgeInput == null || pledgeInput.disabled) {
    tabbabbleElements.shift(pledgeInput);
  }
  currentFocusableEls = focusableElements.concat(tabbabbleElements);
  firstTabStop = currentFocusableEls[0];
  lastTabStop = currentFocusableEls[currentFocusableEls.length - 1];
};
primaryBtn.addEventListener("click", () => {
  if (!isModalActive && !isModalCompletedActive) {
    modalOpen();
    isModalActive = true;
  }
});
rewardBtns.forEach(function (btn) {
  btn.addEventListener("click", () => {
    if (!isModalActive && !isModalCompletedActive) {
      modalOpen();
      isModalActive = true;
    }
  });
});
const checkStock = () => {
  cards.forEach((card) => {
    const cardStock = card.querySelector(".stock-count").textContent;
    const cardBtn = card.querySelector("button");
    if (cardStock == "0") {
      cardBtn.disabled = true;
      cardBtn.textContent = "Out Of Stock";
      cardBtn.classList.add("disabled");
      card.classList.add("disabled");
    } else if (cardStock > 0) {
      cardBtn.textContent = "Select Reward";
    }
  });
  const hasStockArr = radioCardInputs.filter((item) => {
    return item.id !== "noReward";
  });
  hasStockArr.forEach((element) => {
    const parent = element.parentElement;
    const label = element.nextElementSibling;
    const modalStock = parent.querySelector(".stock-count").textContent;
    if (modalStock == "0") {
      element.disabled = true;
      label.classList.add("disabled");
      parent.classList.add("disabled");
    }
  });
};
closeModalBtn.addEventListener("click", modalClose);
closeModalBtn.addEventListener("click", resetRadioBtns);
// modal interactive phase
activeInputs.forEach((item) => {
  item.addEventListener("change", (e) => {
    resetRadioBtns();
    const currentSelection = e.target;
    inputID = currentSelection.id;
    showCtaAndFocusTrap(currentSelection);
    const handleResetPledgeInput = () => {
      pledgeInput.parentElement.removeAttribute("data-error");
      pledgeInput.parentElement.removeAttribute("data-success");
      pledgeInput.value = pledgeInput.getAttribute("value");
    };
    handleResetPledgeInput();
    if (inputID !== "noReward") {
      contentBtn.addEventListener("click", () => {
        const minValue = Number(pledgeInput.getAttribute("value"));
        const value = Number(pledgeInput.value);
        const addSuccessAttr = () => {
          pledgeInput.parentElement.removeAttribute("data-error");
          pledgeInput.parentElement.setAttribute("data-success", "");
        };
        const addErrorAttr = () => {
          pledgeInput.parentElement.removeAttribute("data-success");
          pledgeInput.parentElement.setAttribute(
            "data-error",
            `Please enter at least $${minValue}`
          );
        };
        if (minValue > value || value == null || isNaN(value)) {
          addErrorAttr();
          pledgeInput.value = null;
          pledgeInput.addEventListener("input", (e) => {
            let currentValue = e.target.value;
            if (minValue <= currentValue) {
              addSuccessAttr();
            } else if (minValue > currentValue) {
              addErrorAttr();
            }
          });
        } else {
          updatedTotalBackers = numWithCommas(
            Number(removeCommas(totalBackers.textContent)) + 1
          );
          updatedTotalRaised = numWithCommas(
            parseInt(removeCommas(totalRaised.textContent)) +
              parseInt(pledgeInput.value)
          );
          openCompletedModal();
        }
      });
    } else if (inputID == "noReward") {
      contentBtn.addEventListener("click", () => {
        updatedTotalBackers = numWithCommas(
          Number(removeCommas(totalBackers.textContent)) + 1
        );
        currentSelection.disabled = true;
        currentSelection.parentElement.classList.add("disabled");
        const parent = currentSelection.parentElement;
        const heading = parent.querySelector("h3");
        heading.textContent =
          "Pledged with no reward , Thank you for your support !";
        openCompletedModal();
      });
    }
  });
});
//#endregion
//#region 6.update project stats

const updateBackers = () => {
  totalBackers.textContent = updatedTotalBackers;
};
const updateRaisedAndStock = () => {
  let currentStock = document.querySelectorAll(`[data-stock='${inputID}']`);
  if (currentStock == null) {
    return;
  } else {
    currentStock.forEach((stock) => {
      stock.textContent = parseInt(stock.textContent) - 1;
    });
  }
  if (updatedTotalRaised == undefined) {
    return;
  } else {
    totalRaised.textContent = updatedTotalRaised;
  }
  checkStock();
};
const setBarValue = () => {
  let remainingPercentage;
  const aim = 100;
  if (updatedTotalRaised == undefined) {
    remainingPercentage = (
      aim -
      parseInt(removeCommas(totalRaised.textContent)) / 1000
    ).toFixed(2);
  } else {
    remainingPercentage = (
      aim -
      parseInt(removeCommas(updatedTotalRaised)) / 1000
    ).toFixed(2);
  }

  let currentWidth = 100 - remainingPercentage;
  progressTracker.style.width = `${currentWidth}%`;
  progressTracker.setAttribute("aria-valuenow", `${currentWidth}`);
};
//#endregion
//#region 7.Modal Completed
const escKeyHandlerModalCompleted = (e) => {
  if (e.key === "Escape") {
    return StepsCompleted();
  }
};
const openCompletedModal = () => {
  window.addEventListener("keydown", escKeyHandlerModalCompleted);
  modalClose();
  isModalCompletedActive = true;
  openOverlay();
  disableScrolling();
  resetRadioBtns();
  setTimeout(() => {
    modalCompleted.classList.add("show-modal-completed");
    focusableElements = modalCompletedBtn;
    firstTabStop = focusableElements;
    lastTabStop = focusableElements;
    window.addEventListener("keydown", trapTabKey);
    modalCompleted.setAttribute("tabindex", 0);
    modalCompleted.focus();
    modalCompleted.setAttribute("tabindex", -1);
  }, 500);
};
const scrollToViewStats = () => {
  const statsPos =
    document.querySelector(".project-stats").getBoundingClientRect().top +
    window.scrollY -
    16;
  window.scrollTo(0, statsPos);
};
const stats = document.querySelector(".project-stats");
const StepsCompleted = (e) => {
  modalCompleted.classList.remove("show-modal-completed");
  window.removeEventListener("keydown", escKeyHandlerModalCompleted);
  window.removeEventListener("keydown", trapTabKey);
  isModalCompletedActive = false;
  resetRadioBtns();
  closeOverlay();
  enableScrolling();
  scrollToViewStats();
  stats.classList.add("loading");
  progressTracker.style.width = "0";
  setTimeout(() => {
    stats.classList.remove("loading");
    updateBackers();
    updateRaisedAndStock();
    setBarValue();
  }, 450);
};

modalCompletedBtn.addEventListener("click", StepsCompleted);
//#endregion
window.addEventListener("DOMContentLoaded", checkStock);
