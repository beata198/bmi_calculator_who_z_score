"use strict";

const [male, female] = document.getElementsByName("gender");

// console.log(male.checked, female.checked);

const inputHeight = document.getElementById("height__input");
const outputHeight = document.querySelector(".height__input--output");

const inputWeight = document.getElementById("weight__input");
const inputAge = document.getElementById("age__input");

//buttons
const submit = document.querySelector(".btn");
const btnMinusWeight = document.querySelector(".weightDown");
const btnPlusWeight = document.querySelector(".weightUp");
const btnMinusAge = document.querySelector(".ageDown");
const btnPlusAge = document.querySelector(".ageUp");

//default values
inputHeight.value = outputHeight.textContent = 150;
inputAge.value = inputWeight.value = 0;
const lb = 0.45359237;

//display the current selected value - height
inputHeight.oninput = () => {
  outputHeight.textContent = `${inputHeight.value}`;
};

//btn addition, subtraction - weight, age
function calc(button, v, chart) {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (+v.value >= 0 && chart === -1) {
      v.value = v.value - chart;
    } else if (+v.value > 0 && chart === 1) {
      v.value = v.value - chart;
    } else {
      v.value = 0;
    }
  });
}

calc(btnPlusAge, inputAge, -1);
calc(btnMinusAge, inputAge, 1);
calc(btnPlusWeight, inputWeight, -1);
calc(btnMinusWeight, inputWeight, 1);

submit.addEventListener("click", (e) => {
  e.preventDefault();

  const weightMeasure = document.getElementById("measureWeight").value;

  const weight =
    weightMeasure === "kg" ? +inputWeight.value : inputWeight.value * lb;
  let descriptionBMI = "";

  if (
    inputWeight.value > 0 &&
    inputAge.value > 0 &&
    (male.checked || female.checked)
  ) {
    const BMI = (weight / (inputHeight.value / 100) ** 2).toFixed(2);

    if (BMI <= 18.5) {
      descriptionBMI = "niedowaga";
    } else if (BMI <= 24.9) {
      descriptionBMI = "prawidłowa masa ciała";
    } else if (BMI <= 29.9) {
      descriptionBMI = "nadwaga";
    } else if (BMI <= 34.9) {
      descriptionBMI = "otyłość I stopnia";
    } else if (BMI <= 39.9) {
      descriptionBMI = "otyłość II stopnia";
    } else if (BMI >= 40) {
      descriptionBMI = "otyłość III stopnia (otyłość skrajna)";
    }
    // const bmiDescriptions = {
    //   18.5: "niedowaga",
    //   24.9: "prawidłowa masa ciała",
    //   29.9: "nadwaga",
    //   34.9: "otyłość I stopnia",
    //   39.9: "otyłość II stopnia",
    //   Infinity: "otyłość III stopnia (otyłość skrajna)",
    // };

    // const descriptionBMI = Object.entries(bmiDescriptions).find(
    //   ([bmiValue, description]) => BMI <= bmiValue
    // )[1];

    document.querySelector(".results__bmi").textContent = BMI;
    document.querySelector(".results__bmi--description").textContent =
      descriptionBMI;
    document.querySelector(".results__weight").textContent =
      weight.toFixed(2) + ` kg`;
    document.querySelector(".results__height").textContent = inputHeight.value;
    document.querySelector(".results__age").textContent = inputAge.value;
    document.querySelector(".results__gender").textContent = male.checked
      ? "mężczyzna"
      : "kobieta";
  }
  //validation input gender
  if (!male.checked && !female.checked) {
    if (!document.querySelector(".gender .subtitle .empty")) {
      const x = document.querySelector(".gender .subtitle");
      x.insertAdjacentHTML(
        "beforeend",
        '<span class="empty emptyGender">Uzupełnij pole!</span>'
      );
    }

    // inputWeight.style.border = "1px solid #d36135";
  } else if (document.querySelector(".emptyGender")) {
    document.querySelector(".emptyGender").remove();
  }
  //validation input age

  if (inputAge.value == 0) {
    if (!document.querySelector(".age .subtitle .emptyAge")) {
      const x = document.querySelector(".age .subtitle");
      x.insertAdjacentHTML(
        "beforeend",
        '<span class="empty emptyAge">Uzupełnij pole!</span>'
      );
      inputAge.style.border = "1px solid #d36135";
    }
  } else if (document.querySelector(".emptyAge")) {
    document.querySelector(".emptyAge").remove();
    inputAge.style.border = "1px solid transparent";
  }
  //validation input weight

  //rozwiązanie ghatgpt
  const emptyWeight = document.querySelector(".emptyWeight");
  inputWeight.value == 0
    ? !emptyWeight &&
      document
        .querySelector(".weight .subtitle")
        .insertAdjacentHTML(
          "beforeend",
          '<span class="empty emptyWeight">Uzupełnij pole!</span>'
        )
    : emptyWeight?.remove();
  // if (inputWeight.value == 0) {
  //   if (!document.querySelector(".weight .subtitle .emptyWeight")) {
  //     const x = document.querySelector(".weight .subtitle");
  //     x.insertAdjacentHTML(
  //       "beforeend",
  //       '<span class="empty emptyWeight">Uzupełnij pole!</span>'
  //     );
  //     inputWeight.style.border = "1px solid #d36135";
  //   }
  // } else if (document.querySelector(".emptyWeight")) {
  //   document.querySelector(".emptyWeight").remove();
  //   inputWeight.style.border = "1px solid transparent";
  // }
});
