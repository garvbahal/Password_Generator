const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = "~`!@#$%^&*()_-+={[]}|:<,.>?/;'";

// starting values
let password = "";
let passwordLength = 10;
let checkCount = 1;
uppercaseCheck.checked = true;
setIndicator("#ccc");
handleSlider();

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  // kuch aur likhna chahiye? - H/W
  const min = inputSlider.min;
  const max = inputSlider.max;

  inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}

function setIndicator(color) {
  indicator.style.cssText = `background-color:${color}; box-shadow: 0 0 14px ${color}`;
  // shadow H/W
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const randomNum = getRandomInteger(0, symbols.length);
  return symbols.charAt(randomNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) {
    hasUpper = true;
  }
  if (lowercaseCheck.checked) {
    hasLower = true;
  }
  if (symbolsCheck.checked) {
    hasSym = true;
  }
  if (numbersCheck.checked) {
    hasNum = true;
  }

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  // to make copy span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

function handleCheckBoxChange() {
  // console.log('inside handle check change function')
  checkCount = 0;
  allCheckBox.forEach((checkBox) => {
    if (checkBox.checked) {
      checkCount++;
    }
  });
  // console.log('value checked')

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  // console.log('returning from function');
}

allCheckBox.forEach((checkBox) => {
  checkBox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (event) => {
  passwordLength = event.target.value;
  handleSlider();
});

function shufflePassword(array) {
  // Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) {
    return;
  }
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // remove old password
  password = "";

  // if (uppercaseCheck.checked) {
  //   password += generateUpperCase();
  // }

  // if (lowercaseCheck.checked) {
  //   password += generateLowerCase();
  // }

  // if (symbolsCheck.checked) {
  //   password += generateSymbol();
  // }

  // if (numbersCheck.checked) {
  //   password += generateRandomNumber();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }

  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }

  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }

  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // shuffle the password
  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});
