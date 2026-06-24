const CONSONANTS = "bcdfghjklmnpqrstvwxyz";

function countConsonants(str) {
  let count = 0;
  for (const ch of str.toLowerCase()) {
    if (CONSONANTS.includes(ch)) {
      count++;
    }
  }
  return count;
}

const textInput = document.getElementById("text-input");
const countDisplay = document.getElementById("count");

textInput.addEventListener("input", () => {
  countDisplay.textContent = countConsonants(textInput.value);
});
