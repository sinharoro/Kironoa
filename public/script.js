document.addEventListener("DOMContentLoaded", initDropdown);

if (document.readyState !== "loading") {
  initDropdown();
}

const dropdownObserver = new MutationObserver(initDropdown);
dropdownObserver.observe(document.documentElement, { childList: true, subtree: true });

function initDropdown() {
  const dropdownButton = document.querySelector("#dropdownBtn");
  const dropdownMenu = document.querySelector("#dropdownMenu");

  if (!dropdownButton || !dropdownMenu) {
    return;
  }

  if (dropdownButton.dataset.dropdownReady === "true") {
    return;
  }
  dropdownButton.dataset.dropdownReady = "true";

  const dropdown = dropdownButton.closest(".dropdown");

  function setOpen(isOpen) {
    dropdownButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  dropdownButton.addEventListener("click", function (event) {
    event.stopPropagation();
    const isOpen = dropdownMenu.classList.toggle("show");
    setOpen(isOpen);
  });

  dropdownMenu.addEventListener("click", function () {
    dropdownMenu.classList.remove("show");
    setOpen(false);
  });

  document.addEventListener("click", function (event) {
    if (dropdown && !dropdown.contains(event.target)) {
      dropdownMenu.classList.remove("show");
      setOpen(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && dropdownMenu.classList.contains("show")) {
      dropdownMenu.classList.remove("show");
      setOpen(false);
      dropdownButton.focus();
    }
  });
}
