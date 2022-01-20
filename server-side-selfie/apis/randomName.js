const alphabets = "abcdefghijklmnopqrstuvwxyz";
const alphaUp = alphabets.toUpperCase();
const numbers = "0123456789";

module.exports = (len = 18) => {

  let result = "";
  const allLetters = alphabets + alphaUp + numbers;

  while (len > 0) {

    result += allLetters[Math.floor(Math.random() * allLetters.length)];

    len--;
  }

  return result;

}
