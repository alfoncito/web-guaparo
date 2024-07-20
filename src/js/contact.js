const main = () => {
  handleForm();
};

const handleForm = () => {
  let $form = document.getElementById("contact-form"),
    formInputs = Array.from($form.querySelectorAll(".form-control")).reverse(),
    $loader = document.getElementById("loader"),
    $btnSubmitText = document.getElementById("btn-submit-text");

  $form.addEventListener("submit", (e) => {
    let isValidForm = true;

    formInputs.forEach(($input) => {
      isValidForm = isValidForm && $input.checkValidity();
      if (!$input.checkValidity()) invalidInput($input);
    });
    if (!isValidForm) {
      e.preventDefault();
    } else {
      $loader.classList.remove("d-none");
      $btnSubmitText.classList.add("d-none");
    }
  });
};

const invalidInput = ($input) => {
  $input.classList.add("is-invalid");
  $input.focus();
  const handleEvent = () => {
    $input.classList.remove("is-invalid");
    $input.removeEventListener("keypress", handleEvent);
    $input.removeEventListener("change", handleEvent);
  };
  $input.addEventListener("keypress", handleEvent);
  $input.addEventListener("change", handleEvent);
};

document.addEventListener("DOMContentLoaded", main);
