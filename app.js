const currFromSelect = document.getElementById('select1');
const currToSelect = document.getElementById('select2');
const convertBtn = document.getElementById('convert');



const CURR_URL = "https://free.currencyconverterapi.com/api/v5/currencies";

fetch(CURR_URL)
.then(function(response) {
  console.log(response.ok)
  const bodyType = response.json();
  return bodyType;
})
.then(function(jsonObj) {
  // console.log(jsonObj.results)
  let currencies = jsonObj.results
for(let i in currencies) {
  let option = document.createElement('option')
  let option2 = document.createElement('option')

  option.value = currencies[i].id;
  // console.log(option.value)
  if(option.value === 'USD') {
    option.selected = true;
  }
  option2.value = currencies[i].id
  option.innerHTML = currencies[i].id;
  option2.innerHTML = currencies[i].id
currFromSelect.appendChild(option);
currToSelect.appendChild(option2)
}

}).catch(function(error) {
  console.log("Fetch operation failed: ", error.message)
});


convertBtn.onclick = () => {


}





function convertCurrency() {
  let currAmt = document.getElementById('currAmt');
  // currencyAmt = currAmt.value;
  currAmt.value = ""

  let fromCurr = currFromSelect.value;
  let toCurr = currToSelect.value;

  fromCurr = encodeURIComponent(fromCurr);
  toCurr = encodeURIComponent(toCurr);
  let query = `${fromCurr} _ ${toCurr}`;

  const url = 'https://free.currencyconverterapi.com/api/v5/convert?q='
  + query + '&compact=ultra';

  fetch(url)
  .then(function(response) {
    // console.log(response.ok)
    const objType = response.json();
    return objType;
  })
  .then(function(data) {
    console.log(data.query)
    // let datas = 
    // for(let )
  }).catch(function(error) {
    console.log("Query failed:", error.message)
  });



}


convertCurrency()









document.addEventListener('DOMContentLoaded', () => {
  
  })