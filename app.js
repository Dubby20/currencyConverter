let currFromSelect = document.getElementById('select1');
let currToSelect = document.getElementById('select2');
let convertBtn = document.getElementById('convert');
let fromCurr = '';
let toCurr = '';

currFromSelect.addEventListener('change', () => {
fromCurr = currFromSelect.value;
})

currToSelect.addEventListener('change', () => {
  toCurr = currToSelect.value;
})

const CURR_URL = "https://free.currencyconverterapi.com/api/v5/currencies";

fetch(CURR_URL)
.then((response) => {
  // console.log(response.ok)
  const bodyType = response.json();
  return bodyType;
})
.then((jsonObj) => {
  // console.log(jsonObj.results)

  let currenciesData = jsonObj.results;

  let currencies = Object.keys(currenciesData).sort((a, b) => {
      return a.charCodeAt(0) - b.charCodeAt(0);
  });

  currencySymbols = {};

  Object.values(currenciesData).forEach((item) => {
    var id = item.id;
    //delete item['id'];
    currencySymbols[id] = item.currencySymbol;
})


for(let i in currencies) {
  
  let option = document.createElement('option')
  let option2 = document.createElement('option')

  option.value = currencies[i];
  // console.log(option.value)
  // if(option.value === 'USD') {
  //   option.selected = true;
  // }
  option2.value = currencies[i];
  option.innerHTML = currencies[i];
  option2.innerHTML = currencies[i];
currFromSelect.appendChild(option);
currToSelect.appendChild(option2)
}

}).catch((error) => {
  console.log("Fetch operation failed: ", error.message)
});



const convertCurrency =  () => {
  let currAmt = document.getElementById('currAmt');
  
  currAmtVal = currAmt.value;
  fromCurr = encodeURIComponent(fromCurr.trim()); 
  toCurr = encodeURIComponent(toCurr.trim());
  let query = `${fromCurr}_${toCurr}`;
  console.log(query)

  const url =`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;

  currAmt.value = "";

  fetch(url)
  .then((response) => {
    // console.log(response.ok)
    return response.json();
  })
  .then((data) => {
    console.log(data)
     let conversionCurrency = Object.keys(data)
     let conversionRate = Object.values(data)
     let conversion = conversionRate[0] * Number(currAmtVal)
     result(conversion, currencySymbols[toCurr])
    //  console.log(result)
  }).catch((error) => {
    console.log("Query failed:", error.message)
  });


}



convertBtn.addEventListener('click', (e) => {
  e.preventDefault()
  convertCurrency();
})

const result = (value, symbol)=>  {
let currencyValue = document.getElementById('currencyValue');
currencyValue.value = symbol + value.toFixed(2);
}





//  document.addEventListener('DOMContentLoaded', () => {

//     })