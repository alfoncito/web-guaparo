const main = () => {
  handleForm();
};

const handleForm = () => {
  let $form = document.getElementById("contact-form"),
    formInputs = Array.from($form.querySelectorAll(".form-control")).reverse(),
    $btnSubmit = document.getElementById("btn-submit");

  $form.addEventListener("submit", (e) => {
    let isValidForm = true;

    formInputs.forEach(($input) => {
      isValidForm = isValidForm && $input.checkValidity();
      if (!$input.checkValidity()) invalidInput($input);
    });
    e.preventDefault();
    if (isValidForm) {
      let $loader = createLoader();

      
      $btnSubmit.disabled = true;
      $form.insertAdjacentElement(
	"beforeend",
        $loader
      );
      setTimeout(() => {
	$loader.remove();
	$btnSubmit.disabled = false;
        alert("Gracias por su mensage, le contestarmos pronto.");
	$form.reset();
      }, 3000);
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

const createLoader = () => {
  let $loader = document.createElement("div");

  $loader.classList.add("loader", "mx-auto", "my-3");
  return $loader;
}

document.addEventListener("DOMContentLoaded", main);
