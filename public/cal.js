const numberButtons = document.querySelectorAll("[data-number]");
const operandButtons = document.querySelectorAll("[data-operation]");
const currentNumber = document.querySelector("[data-current-operand]");
const prevNumber = document.querySelector("[data-previous-operand]");
const caluclateBtn = document.querySelector("[data-equals]");
const clearBtn = document.querySelector("[data-all-clear]");
const deleteBtn = document.querySelector("[data-delete]");

var socket;
socket = io.connect(window.location.href);

socket.on("serverMessage", (dataArray) => {
  document.getElementById("msgs").innerHTML =
    dataArray.length > 0
      ? dataArray.map((dataElm) => `<li>${dataElm}</li>`)
      : "No Results";
});

let operandSelected;
let firstOperandSelected = false;
let resultOutput;

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (operandSelected && !firstOperandSelected) {
      prevNumber.innerHTML = currentNumber.innerHTML;
      currentNumber.innerHTML = button.innerText;
      firstOperandSelected = true;
    } else {
      currentNumber.innerHTML = currentNumber.innerText + button.innerText;
    }
  });
});

operandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    operandSelected = button.innerText;
    currentNumber.append(operandSelected);
  });
});

caluclateBtn.addEventListener("click", () => {
  const prevNum = prevNumber.innerText.substring(
    0,
    prevNumber.innerText.length - 1
  );
  const currentNum = +currentNumber.innerText;
  const operandValue = operandSelected;

  switch (operandSelected) {
    case "+":
      resultOutput = +prevNum + currentNum;
      break;
    case "-":
      resultOutput = +prevNum - currentNum;
      break;
    case "*":
      resultOutput = +prevNum * currentNum;
      break;
    default:
      resultOutput = +prevNum / currentNum;
  }

  clearBtn.click();
  let resultText = `${prevNum} ${operandValue} ${currentNum} = `;
  currentNumber.innerText = resultOutput;
  resultOutput = resultText + resultOutput;
  const nameValue = document.getElementById("name").value;
  socket.emit(
    "sendMessage",
    nameValue + "  " + resultOutput + "      " + new Date().toUTCString()
  );
});

clearBtn.addEventListener("click", () => {
  operandSelected = "";
  currentNumber.innerText = "";
  prevNumber.innerText = "";
  firstOperandSelected = false;
});

deleteBtn.addEventListener("click", function () {
  if (currentNumber.innerText.length > 0) {
    if (
      "+-*/".includes(
        currentNumber.innerText.substring(currentNumber.innerText.length - 1)
      )
    ) {
      firstOperandSelected = false;
      operandSelected = "";
    }
    currentNumber.innerText = currentNumber.innerText.substring(
      0,
      currentNumber.innerText.length - 1
    );
  } else if (prevNumber.innerText.length > 0) {
    currentNumber.innerText = prevNumber.innerText;
    prevNumber.innerText = "";
    deleteBtn.click();
  }

  // }
  // else if(operandSelected) {
  //   operandSelected
  // } else if (prevNumber.innerText.length > 0) {
  //   prevNumber.innerText = prevNumber.innerText.substring(
  //     0,
  //     prevNumber.innerText.length - 1
  //   );
  // } else {
  // }
});
