"use strict";

const radioButtons = document.querySelectorAll('input[name="info"]');

const BMIFormAdult = document.getElementById("bmi-adult");
const BMIFormChild = document.getElementById("bmi-child");

let heightValue,
  weightValue,
  heightOutputValue,
  submit,
  btnDecrease,
  btnIncrease,
  weightMeasure;

// function for setting initial values
const setInitialValues = (
  heightInputId,
  weightInputId,
  heightOutputSelector,
  btnId,
  btnD,
  btnI,
  weightM
) => {
  heightValue = document.getElementById(heightInputId);
  weightValue = document.getElementById(weightInputId);
  heightOutputValue = document.querySelector(heightOutputSelector);

  heightValue.value = 150;
  weightValue.value = 0;

  heightOutputValue.textContent = `150 cm / 4' 11''`;

  heightValue.oninput = () => {
    heightOutputValue.textContent = `${heightValue.value} cm / ${calcInAndFt(
      +heightValue.value
    )}`;
  };
  submit = document.querySelector(btnId);
  btnDecrease = document.querySelector(btnD);
  btnIncrease = document.querySelector(btnI);
  decrease(weightValue, btnDecrease);
  increase(weightValue, btnIncrease, btnDecrease);
  //listening to see if the user entered <= 0 -- inputWeight
  listenerForEnteredZero(weightValue, btnDecrease);
  weightMeasure = document.getElementById(weightM);
};

// function to convert in and ft from cm
const calcInAndFt = (v) => {
  const i = Math.floor(v / 30.48);
  const f = Math.floor((v - i * 30.48) * 0.393701);
  return `${i}' ${f}''`;
};

// function decrease, increase
const decrease = (input, btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    let newValue = +input.value - 1;
    if (newValue >= 0) {
      input.value = newValue;
      if (newValue === 0) {
        btn.disabled = true;
      }
    }
  });
};

const increase = (input, btn, btnDecrease) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    input.value = +input.value + 1;
    if (input.value > 0) {
      btnDecrease.disabled = false;
    }
  });
};

// function to disable the button when it is 0
const listenerForEnteredZero = (input, btn) => {
  input.addEventListener("change", () => {
    if (+input.value <= 0) {
      input.value = 0;
    }
    btn.disabled = +input.value === 0;
  });
};

//change lb/kg
const lbOnKg = (lb) => {
  const kg = (lb * 0.45359237).toFixed(2);
  return kg;
};

// calc BMI
const calcBMI = (weight, height) => {
  const BMI = (weight / (height / 100) ** 2).toFixed(2);
  let description = "";

  if (BMI <= 18.5) {
    description = "niedowaga";
  } else if (BMI <= 24.9) {
    description = "prawidłowa masa ciała";
  } else if (BMI <= 29.9) {
    description = "nadwaga";
  } else if (BMI <= 34.9) {
    description = "otyłość I stopnia";
  } else if (BMI <= 39.9) {
    description = "otyłość II stopnia";
  } else if (BMI >= 40) {
    description = "otyłość III stopnia (otyłość skrajna)";
  }
  return { description, BMI };
};

// change form when user click select
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("change", function () {
    if (this.value === "adult") {
      if (!BMIFormChild.classList.contains("hidden")) {
        BMIFormChild.classList.add("hidden");
      }
      BMIFormAdult.classList.remove("hidden");

      setInitialValues(
        "heightAdult",
        "weightAdult",
        ".height__output--adult",
        ".btn-adult",
        ".decreaseWeightAdult",
        ".increaseWeightAdult",
        "measureWeightAdult"
      );
      submit.addEventListener("click", (e) => {
        e.preventDefault();
        let resultsDescription = "";
        const weight =
          weightMeasure.value === "kg"
            ? +weightValue.value
            : lbOnKg(+weightValue.value);

        weightValue.style.border = "1px solid transparent";
        document.querySelector(".weight__subtitle").style.color = "#fff";

        if (+weightValue.value > 0) {
          const resultBMI = calcBMI(weight, +heightValue.value);
          resultsDescription = `Twój wskaźnik BMI wynosi: ${
            resultBMI.description
          } ${resultBMI.BMI}\r\n
          Twój wzrost wynosi ${+heightValue.value}
          \r\n Twoja waga ${
            weightMeasure.value === "kg"
              ? +weightValue.value + " kg"
              : +weightValue.value + " lb"
          }`;
        } else {
          if (+weightValue.value <= 0) {
            resultsDescription +=
              "Uzupełnij formularz! \r\n Waga nie może być równa/mniejsza 0.";
            weightValue.style.border = "2px solid #E9190F";
            document.querySelector(".weight__subtitle").style.color = "#E9190F";
          }
        }

        resultsDiv.textContent = resultsDescription;
        resultsDiv.innerHTML = resultsDiv.innerHTML.replace(/\r\n?/g, "<br />");
        resultsDiv.style.opacity = 1;
      });
    } else if (this.value === "child") {
      if (!BMIFormAdult.classList.contains("hidden")) {
        BMIFormAdult.classList.add("hidden");
      }
      BMIFormChild.classList.remove("hidden");

      setInitialValues(
        "heightChild",
        "weightChild",
        ".height__output--child",
        ".btn-child",
        ".decreaseWeightChild",
        ".increaseWeightChild",
        "measureWeightChild"
      );

      resultsDiv.style.opacity = 0;

      const ageDate = document.getElementById("age__input");
      const measurementDate = document.getElementById("date__input");
      measurementDate.value = new Date().toISOString().split("T")[0];
      const currentDate = new Date().toISOString().split("T")[0];
      ageDate.max = currentDate;
      measurementDate.max = currentDate;

      submit.addEventListener("click", (e) => {
        e.preventDefault();
        let resultsDescription = "";
        const weight =
          weightMeasure.value === "kg"
            ? +weightValue.value
            : lbOnKg(+weightValue.value);

        const [male, female] = document.getElementsByName("gender");

        const birthday = new Date(ageDate.value);

        const monthDifference = (dateTo, dateFrom) => {
          const diff =
            dateTo.getMonth() -
            dateFrom.getMonth() +
            12 * (dateTo.getFullYear() - dateFrom.getFullYear());
          return diff;
        };

        const months = monthDifference(
          new Date(measurementDate.value),
          birthday
        );

        const genderContent = document.querySelector(".gender__content");
        const ageSubtitle = document.querySelector(".age__subtitle");
        const weightSubtitle = document.querySelector(
          ".weight__subtitle-child"
        );
        const genderSubtitle = document.querySelector(".gender__subtitle");

        genderContent.style.border =
          weightValue.style.border =
          ageDate.style.border =
            "1px solid transparent";

        ageSubtitle.style.color =
          weightSubtitle.style.color =
          genderSubtitle.style.color =
            "#fff";

        const fetchDataFromFIle = async () => {
          let arr = [];
          if (months > 23 && months < 61) {
            const res = await fetch(
              `./assets/data/${male.checked ? "boys" : "girls"}_2_5.json`
            );
            const data = await res.json();
            arr = Object.values(data)[0];
          } else if (months > 60 && months < 229) {
            const res = await fetch(
              `./assets/data/${male.checked ? "boys" : "girls"}_5_19.json`
            );
            const data = await res.json();
            arr = Object.values(data)[0];
          } else {
            resultsDescription += "Podaj wiek pomiędzy 2 - 19 lat.";
          }

          const BMI = (weight / (+heightValue.value / 100) ** 2).toFixed(2);
          const findMonthValues = arr.find((el) => el.Month === `${months}`);

          const up = Math.pow(+BMI / findMonthValues.M, findMonthValues.L) - 1;
          const down = findMonthValues.S * findMonthValues.L;
          const zScore = (up / down).toFixed(2);

          return zScore;
        };

        if (
          (male.checked || female.checked) &&
          months > 23 &&
          +heightValue.value > 0 &&
          +weightValue.value > 0 &&
          (!ageDate.value === "" ||
            (!isNaN(ageDate.valueAsNumber) &&
              ageDate.valueAsDate < measurementDate.valueAsDate))
        ) {
          const resultBMI = calcBMI(weight, +heightValue.value);
          fetchDataFromFIle()
            .then((z) => {
              resultsDescription = `Twój wskaźnik BMI wynosi: ${
                resultBMI.description
              } ${resultBMI.BMI}
          \r\nTwój wzrost wynosi ${+heightValue.value}
          \r\n Twoja waga: ${
            weightMeasure.value === "kg"
              ? +weightValue.value + " kg"
              : +weightValue.value + " lb"
          }
          \r\n Data pomiaru: ${measurementDate.value}
          \r\n Data urodzenia: ${ageDate.value}
          \r\n Z-score: ${z}`;
              resultsDiv.textContent = resultsDescription;
              resultsDiv.innerHTML = resultsDiv.innerHTML.replace(
                /\r\n?/g,
                "<br />"
              );
              resultsDiv.style.opacity = 1;
            })
            .catch((er) => {
              resultsDescription +=
                "Nie udało pobrać się danych z pliku, do obliczenia z-score... \r\n Spróbuj później";
            });
        } else {
          resultsDescription += "Uzupełnij formularz! \r\n";
          if (!male.checked && !female.checked) {
            resultsDescription += "Wybierz płeć dziecka. \r\n";
            genderContent.style.border = "2px solid #E9190F";
            genderSubtitle.style.color = "#E9190F";
          }
          if (+heightValue.value <= 50) {
            resultsDescription +=
              "Wzrost nie może być mniejszy nić 50 cm. \r\n";
          }
          if (+weightValue.value <= 0) {
            resultsDescription += "Waga nie może być równa/mniejsza 0. \r\n";
            weightValue.style.border = "2px solid #E9190F";
            weightSubtitle.style.color = "#E9190F";
          }
          if (ageDate.value === "" || isNaN(ageDate.valueAsDate)) {
            resultsDescription += "Wprowadź datę urodzenia dziecka. \r\n";
            ageDate.style.border = "2px solid #E9190F";
            ageSubtitle.style.color = "#E9190F";
          } else if (
            ageDate.valueAsDate > measurementDate.valueAsDate ||
            ageDate.valueAsDate < measurementDate.valueAsDate
          ) {
            resultsDescription +=
              "Data urodzenia powinna być wcześniejsza niż data pomiaru \r\n oraz dziecko powinno być w wieku 2 - 19 lat.";
            ageDate.style.border = "2px solid #E9190F";
            ageSubtitle.style.color = "#E9190F";
          }
        }

        resultsDiv.textContent = resultsDescription;
        resultsDiv.innerHTML = resultsDiv.innerHTML.replace(/\r\n?/g, "<br />");
        resultsDiv.style.opacity = 1;
      });
    }
  });
});

// default values for first display form
setInitialValues(
  "heightAdult",
  "weightAdult",
  ".height__output--adult",
  ".btn-adult",
  ".decreaseWeightAdult",
  ".increaseWeightAdult",
  "measureWeightAdult"
);

submit.addEventListener("click", (e) => {
  e.preventDefault();
  let resultsDescription = "";
  const weight =
    weightMeasure.value === "kg"
      ? +weightValue.value
      : lbOnKg(+weightValue.value);

  weightValue.style.border = "1px solid transparent";
  document.querySelector(".weight__subtitle").style.color = "#fff";

  if (+weightValue.value > 0) {
    const resultBMI = calcBMI(weight, +heightValue.value);
    resultsDescription = `Twój wskaźnik BMI wynosi: ${resultBMI.description} ${
      resultBMI.BMI
    }\r\nTwój wzrost wynosi ${+heightValue.value}\r\n Twoja waga ${
      weightMeasure.value === "kg"
        ? +weightValue.value + " kg"
        : +weightValue.value + " lb"
    }`;
  } else {
    if (+weightValue.value <= 0) {
      resultsDescription +=
        "Uzupełnij formularz! \r\n Waga nie może być równa/mniejsza 0. \r\n";
      weightValue.style.border = "2px solid #E9190F";
      document.querySelector(".weight__subtitle").style.color = "#E9190F";
    }
  }

  resultsDiv.textContent = resultsDescription;
  resultsDiv.innerHTML = resultsDiv.innerHTML.replace(/\r\n?/g, "<br />");
  resultsDiv.style.opacity = 1;
});
//create result div
const resultsDiv = document.createElement("div");
resultsDiv.className = "results";
//append results div#calculator
const calculatorContainer = document.getElementById("calculator");
calculatorContainer.appendChild(resultsDiv);
