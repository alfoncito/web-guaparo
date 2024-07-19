const main = () => {
  handleForm();
};

const handleForm = () => {
  let $form = document.getElementById("contact-form"),
    formInputs = Array.from($form.querySelectorAll(".form-control")).reverse();

  $form.addEventListener("submit", (e) => {
    let isValidForm = true;

    e.preventDefault();
    formInputs.forEach(($input) => {
      isValidForm = isValidForm && $input.checkValidity();
      if (!$input.checkValidity()) invalidInput($input);
    });
    if (isValidForm) console.log("Todo esta bien");
    else console.log("Campos no validos");
  });
};

const invalidInput = ($input) => {
  $input.classList.add("is-invalid");
  $input.focus();
  const handleKeypress = () => {
    $input.classList.remove("is-invalid");
    $input.removeEventListener("keypress", handleKeypress);
  };
  $input.addEventListener("keypress", handleKeypress);
};

document.addEventListener("DOMContentLoaded", main);
