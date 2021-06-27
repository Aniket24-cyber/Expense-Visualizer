const ps = new PerfectScrollbar(".expense-category", {
  wheelSpeed: 2
});
const psu = new PerfectScrollbar(".main-charts", {
  wheelSpeed: 2
});

const labels = [
  'Bills',
  'Grocery',
  'Health',
  'Insurances',
  'Rents',
  'Stationary',
  'Taxes',
  'Travel'
];
const labels2 = {
  'Bills': 0,
  'Grocery': 0,
  'Health': 0,
  'Insurances': 0,
  'Rents': 0,
  'Stationary': 0,
  'Taxes': 0,
  'Travel': 0
};
const labels3 = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const label4 = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]
//**************************************************************initializing global variables/***************** */ */
let totalAmount = 0;
let obj = {};
let monthObj = {}
let mainObj = {}
let date = '';
let dateArr = [];
let selectedGraph = ''
let lastYear = '';
let lastMonth = '';
let lastdate = '';
let income = undefined;
let monthlyIncome = 0;
let monthlySaving = 0;
let monthlySavingPer = 0;
/***********************************************************data from localStorage /*****************************************/

function database() {
  let allTaskData = localStorage.getItem("allTasks");
  let data = JSON.parse(allTaskData);
  let dataObj = data[0]["mainData"];
  let yearArr = Object.keys(dataObj);
  lastYear = yearArr[yearArr.length - 1];
  let monthArr = Object.keys(dataObj[lastYear])
  lastMonth = monthArr[monthArr.length - 1];
  let dayArr = Object.keys(dataObj[lastYear][lastMonth]);
  lastdate = dayArr[dayArr.length - 1];
}
defaultGraph();
///////////////////////////////////////////////////////////loading default graphs//////////////////////////////////////////////
function defaultGraph() {
  let allTaskData = localStorage.getItem("allTasks");
  if (allTaskData != null) {
    database()
    loadGraphs(lastYear, lastMonth, lastdate);
    loadThisMonth(lastYear, lastMonth)
  }
}
////*****************************************************function for loading the particular date stats************  */
function loadGraphs(year, month, day) {
  let object = {}
  let allTaskData = localStorage.getItem("allTasks");
  if (allTaskData == null) {
  } else {
    let storeddata = JSON.parse(allTaskData);
    object = storeddata[0]["mainData"][year][month][day]
    let arr = [];
    for (let i of Object.keys(object)) {
      arr.push(object[i]);
    }
    $(".chart").remove();
    let div = `   <div  class = "chart">
    <canvas id="myChart" ></canvas>
    </div> `;
    $(".main-inputs").append(div);
    const data = {
      labels: labels,
      datasets: [{
        label: `${day}-${month}-${year}.`,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: arr
      }]
    };
    let config = {
      type: 'bar',
      data,
      options: {}
    };
    var myChart = new Chart(
      document.getElementById('myChart'),
      config
    );
    $(".expense").remove()
  }
}

////////////////////////////////////////////////Adding an expense////////////////////////////

$(".add").click(function (e) {
  let selectedExpense = $("#selected-expense :selected").text();
  let expenseList = $(".expense-name");
  if (expenseList.length > 0) {
    for (let i of expenseList) {
      if (selectedExpense == $(i).text()) {
        return;
      }
    }
  }
  let expense = `<div class="expense">
    <div class="expense-name">${selectedExpense}</div>
   <input type="number" placeholder="Rs.Amount"  class="expense-amount">
  </div> `;
  $(".expense-category").append(expense);
});

/////////////////////////////////////////////////////////totalling the amount/////////////////////////////////////

let count = 0;
$(".submit-expense").click(function (e) {
  totalAmount = 0;
  let expenseAmount = document.querySelectorAll(".expense-amount");
  for (let i of expenseAmount) {
    if ($.isNumeric(i.value)) {
      totalAmount += parseInt(i.value);
    }
  }
  $(".total-amount").html("Rs." + totalAmount);
});

////////////////////////////////////////////////////////Resetting the expense////////////////////////////////////////////////

$(".reset-expense").click(function (e) {
  let expense = $(".expense-amount")
  if (expense.length > 0) {
    totalAmount = totalAmount - expense[expense.length - 1].value;
    $(".total-amount").html("Rs." + totalAmount);
    let div = $(".expense")
    div[div.length - 1].remove();
  }
})

/////////////////////////////////////////////////////submitting the data///////////////////////////////////////////////

$(".submission").click(function (e) {

  let obj = {};
  let monthObj = {}
  let mainObj = {}
  date = $(".date-selector").val();
  dateArr = date.split("-");
  let year = dateArr[0];
  let month = dateArr[1];
  let day = dateArr[2];
  mainObj[dateArr[0]] = {}
  monthObj[dateArr[1]] = {}
  obj[day] = {}
  if ((date != '')) {
    obj[day] = { ...labels2 };
    let expense = $(".expense");
    for (let j of expense) {
      obj[day][$(j).first().text().trim()] = j.querySelector(".expense-amount").value;
    }
  } else {
    alert("Add a date");
    return
  }
  //////////////////////////////////////////////creating the object//////////////////////////////////////

  $(".total-amount").text("Rs . 0");
  $(".input-stats").remove();
  monthObj[dateArr[1]] = obj;
  mainObj[dateArr[0]] = monthObj;

  /**************************************************************setting up the local Storage********************* */

  let allTaskData = localStorage.getItem("allTasks");
  if (allTaskData == null) {
    let data = [{ "mainData": mainObj }, { "Income": 0 }];
    localStorage.setItem("allTasks", JSON.stringify(data));
  } else {
    let data = JSON.parse(allTaskData);
    let dataObj = data[0]["mainData"];
    let mainkeys = Object.keys(mainObj);
    let dataKeys = Object.keys(dataObj);
    if (dataObj[year] == undefined) {
      dataObj[year] = {}
      dataObj[year][month] = {}
      dataObj[year][month] = mainObj[year][month];
    } else {
      if (dataObj[year][month] == undefined) {
        dataObj[year][month] = {}
        dataObj[year][month][day] = {}
        dataObj[year][month] = mainObj[year][month];
      } else {
        if (dataObj[year][month][day] == undefined) {
          dataObj[year][month][day] = {}
          dataObj[year][month][day] = mainObj[year][month][day];
        } else {
          let value = Object.keys(dataObj[year][month][day]);
          for (let i of value) {
            let val = parseInt(dataObj[year][month][day][i]);
            dataObj[year][month][day][i] = JSON.stringify(val + parseInt(mainObj[year][month][day][i]));
          }
        }
      }
    }
    let data2 = [{ "mainData": dataObj }, { "Income": 0 }];
    localStorage.setItem("allTasks", JSON.stringify(data2));
    loadGraphs(year, month, day);
    loadThisMonth(year, month)
  }
});
/////////////////////////////function for setting up the default month graph///////////////////

function loadThisMonth(lastYear, lastMonth) {
  let allTaskData = localStorage.getItem("allTasks");
  selectedGraph = $("#selected-graphType :selected").val();
  if (allTaskData != null) {
    let storeddata = JSON.parse(allTaskData);
    let dataObj = storeddata[0]["mainData"];
    let arr = [0, 0, 0, 0, 0, 0, 0, 0];
    if (dataObj[lastYear][lastMonth] == undefined) {
    } else {
      let dateArr = Object.keys(dataObj[lastYear][lastMonth]);
      let keys = labels
      for (let i in keys) {
        for (let j of dateArr) {
          let val = parseInt(dataObj[lastYear][lastMonth][j][keys[i]])
          arr[i] = JSON.stringify(parseInt(arr[i]) + val);
        }
      }
    }
    let sum = 0;
    for (let i in arr) {
      sum += parseInt(arr[i]);
    }
    if (monthlyIncome == '') {
      monthlyIncome = 0;
    } else {
      monthlySaving = monthlyIncome - sum;
      let newSaving = 0;
      if (monthlySaving < 0) {
        newSaving = -monthlySaving
      } else {
        newSaving = monthlySaving
      }
      monthlySavingPer = newSaving / monthlyIncome * 100;
      monthlySavingPer = monthlySavingPer.toFixed(2);
    }
    $(".chart2").remove();
    let div = `  <div class= " chart2">
    <canvas id="myChart2"></canvas>
    <div class = "total-amount-month">Total Amount : Rs. ${sum}</div>
    </div> `;
    $(".main-charts").append(div);
    let st = Number(lastMonth)
    const data = {
      labels: labels,
      datasets: [{
        label: `${labels3[st - 1]}-${lastYear}`,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: arr
      }]
    };
    let config = {
      type: `${selectedGraph}`,
      data,
      options: {}
    };
    var myChart = new Chart(
      document.getElementById('myChart2'),
      config
    );
  }
}
//*******************************************for setting up the last month added************************** */
$(".btn").click(function (e) {
  selectedGraph = $("#selected-graphType :selected").val();
  $(".monthly-savings-stats").remove();
  $(".input-stats").remove();
  defaultGraph();
})
////*************************************************Calling for function for uploading monthly stats/////////////////*/
$(".submit-month").click(function (e) {
  $(".input-stats").remove();
  let monthInput = $("#month").val();
  if (monthInput != '') {
    let div2 = `
    <div class = "input-stats">
     <input  class = "enteredIncome" type="number" placeholder=" Your Monthly Income in Rs.">
     <button class="setIncome-Btn">Submit</button></div>`
    $(".stats").append(div2);
    monthInput = monthInput.split("-");
    $(".setIncome-Btn").click(function (e) {
      fn(monthInput[0], monthInput[1])
    })
  }
})
///************************************************function for loading up the monthly stats*************************** */
function fn(monthInput, dateInput) {
  monthlyIncome = document.querySelector(".enteredIncome").value;
  loadThisMonth(monthInput, dateInput);
  $(".monthly-savings-stats").remove();
  let div = `<div class = "monthly-savings-stats">
    <span class = "total-monthlyIncome">Total Income : Rs. ${monthlyIncome}</span>
    <span class = "total-monthlySaving">Total Saving : Rs. ${monthlySaving} : ${monthlySavingPer} %</span></div>`
  $(".main-charts").append(div);
}
function addlistner() {
  $(".setIncome-Btn").click(function (e) {
    year = $("#year").val();
    if (year == '') {
      year = lastYear
    }
    income = document.querySelector(".enteredIncome").value;
    $(".monthly-savings-stats").remove();
    getSaving();
  })
}
//*****************************************************function for setting up the income Vs Expense******************* */
function getSaving() {
  selectedGraph = $("#selected-graphType :selected").val();
  let incomeArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (income == undefined) {
  } else {
    for (let i in incomeArr) {
      incomeArr[i] = income;
    }
  }
  let allTaskData = localStorage.getItem("allTasks");
  if (allTaskData != null) {
    let storeddata = JSON.parse(allTaskData);
    let dataObj = storeddata[0]["mainData"];
    let monthArr = label4;
    let expenseArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (dataObj[year] == undefined) {
    } else {
      for (let k in monthArr) {
        let arr = [0, 0, 0, 0, 0, 0, 0, 0];
        if (dataObj[year][monthArr[k]] == undefined) {
        } else {
          let dateArr = Object.keys(dataObj[year][monthArr[k]]);
          let keys = labels
          for (let i in keys) {
            for (let j of dateArr) {
              let val = parseInt(dataObj[year][monthArr[k]][j][keys[i]])
              arr[i] = JSON.stringify(parseInt(arr[i]) + val);
            }
          }
        }
        let sum = 0;
        for (let i in arr) {
          sum += parseInt(arr[i]);
        }
        expenseArr[k] = (sum);
      }
    }
    let oversum = 0;
    let savingsArr = [];
    for (let x in expenseArr) {
      oversum += parseInt(expenseArr[x]);
      savingsArr[x] = incomeArr[x] - expenseArr[x];
    }
    incomesum = 30000 * 12;
    let savingSum = incomesum - oversum;
    let savingPer = (savingSum / incomesum) * 100;
    savingPer = savingPer.toFixed(2);
    $(".chart2").remove();
    let div = ` <div class="chart2"> <div class= "">
      <canvas id="myChart2"></canvas></div>
      <div class = "savings-stats">
      <span class = "total-amount-month">Total Expenses : Rs. ${oversum}</span>
      <span class = "total-income-month">Total Income : Rs. ${incomesum}</span>
      <span class = "total-saving-month">Total Saving : Rs. ${savingSum} : ${savingPer} %</span></div>
      </div> `;
    $(".main-charts").append(div);
    const data = {
      labels: labels3,
      datasets: [{
        label: `expense-${year}`,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: expenseArr
      }, {
        label: `income-${year}`,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        data: incomeArr
      }, {
        label: `savings-${year}`,
        backgroundColor: '#fff',
        borderColor: '#fff',
        data: savingsArr
      }]
    };
    let config = {
      type: `${selectedGraph}`,
      data,
      options: {}
    };
    var myChart = new Chart(
      document.getElementById('myChart2'),
      config
    );
  }
}
$("#month").click(function (e) {
  $(".input-stats").remove();
})
let year = lastYear

/////***************************************************submitting the Month******************************************/
$(".savings").click(function (e) {
  $(".input-stats").remove();
  $("#month").val("")
  let div = `
    <div class = "input-stats">
    <input  type="number" id="year" name="bdaymonth" value = "${lastYear}">
     <input  class = "enteredIncome" type="number" placeholder=" Your Monthly Income in Rs.">
     <button class="setIncome-Btn">Submit</button></div>`
  $(".stats").append(div)
  addlistner();
})

///////////////////////////////////////////////////////delete an update/////////////////////////////////////////////
$(".deleteExpense").click(function (e) {
  $(".input-stats").remove();
  let div = `<div class = "input-stats">
    <input class="date-selector-deletion" type="date" data-date-inline-picker="true" />
    <button class = "deleteButton">Delete</Button></div>`
  $(".stats").append(div);
  let deletedate = $(".date-selector-deletion").val();
  dateArr = date.split("-");
  let deleteYear = dateArr[0];
  let deleteMonth = dateArr[1];
  let deleteDay = dateArr[2];
  $(".deleteButton").click(function (e) {
    if (deletedate == '') {
      alert("Enter a date");
      return
    } else {
      // Will update Soon
    }
  })
})






