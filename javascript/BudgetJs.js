//UIController

var UIController = (function(){
  var DOMStrings = {
    mark: ".mark",
    description: ".description",
    money: ".money-value",
    button: ".button",
    expContainer: ".display-expenses",
    incContainer: ".display-income",
    budgetValue: ".budget-value",
    expValue: ".expenses-value",
    incValue: ".income-value",
    expPercentageAll: ".expenses-percentage",
    deleteItem:".display",
    itemPercentageValue:".percentage_value",
    title:".title"
  };
  var valueFormatting =  function(num,value){
      var int, decimal,number;
      num = Math.abs(num);
      num = num.toFixed(2).toString();
      number = num;
      num = num.split(".");
      int = num[0];
      decimal = num[1];
      if (int.length > 3){
        number = int.substr(0,int.length-3)+","+int.substr(int.length-3,int.length)+"." + decimal;
      }
      if(value === "exp"){
         number = "-" + number;}
      return number;
  };
    return{
    changeInputColor: function(){

          var fields,fieldsArr;
          fields = document.querySelectorAll(DOMStrings.mark+","+DOMStrings.description+","+DOMStrings.money);
          fieldsArr = Array.prototype.slice.call(fields);
          fieldsArr.forEach(function(element,index,array){
            element.classList.toggle("red-border");
          });
          document.querySelector(DOMStrings.button).classList.toggle("red-button");
      },
    getInput: function(){
      return{
      getMark: document.querySelector(DOMStrings.mark).value,
      getText: document.querySelector(DOMStrings.description).value,
      getMoney: parseFloat(document.querySelector(DOMStrings.money).value)
    };
  },
    getDOMStrings: function(){
      return DOMStrings;
    },
    addListItem: function(obj,mark){
      var html,newHtml,element;

      //create the html string
      if(mark === "inc"){
      html = '<div class="item" id="inc-%id%"><h4 class="item_description">%description%</h4><div class = "item_right_side"><div class="item_value" id="income_value">%value%</div><div class="delete_item"><button><i class="ion-ios-close-outline" id="income_button"></i></button></div></div></div>';
      element = document.querySelector(DOMStrings.incContainer);
    }
      else{
        html = '<div class="item" id="exp-%id%"><h4 class="item_description">%description%</h4><div class = "item_right_side"><div class="item_value">%value%</div><div class= "percentage"><div class="percentage_value">23</div></div><div class="delete_item"><button><i class="ion-ios-close-outline"></i></button></div></div></div>';
        element = document.querySelector(DOMStrings.expContainer);
      }

      //replace values in strings
      newHtml = html.replace('%id%',obj.id);
      newHtml = newHtml.replace('%description%',obj.description);
      newHtml = newHtml.replace('%value%',valueFormatting(obj.value,mark));

      //put the string into new_html
      element.insertAdjacentHTML('beforeend',newHtml);
    },
    clearInputs: function(){
      var fieldsList,fieldsArr;
      //create list with input fields
      fieldsList = document.querySelectorAll(DOMStrings.description + "," + DOMStrings.money);
      //changing the list into array
      fieldsArr = Array.prototype.slice.call(fieldsList);
      //clear the inputs
      fieldsArr.forEach(function(element,index,array){
        element.value = "";
      });
      fieldsArr[0].focus();
    },
    updateUIbudget: function(budget){
    var list, array, mark;
    (budget.budget >= 0)? mark = "inc" : mark = "exp";
    list = document.querySelectorAll(DOMStrings.budgetValue+","+DOMStrings.expValue+","+DOMStrings.incValue+","+DOMStrings.expPercentageAll);
    array = Array.prototype.slice.call(list);
    array[0].innerHTML = valueFormatting(budget.budget,mark);
    array[1].innerHTML = valueFormatting(budget.allInc,"inc");
    array[2].innerHTML = valueFormatting(budget.allExp,"exp");
    if(budget.percentage > 0){
      array[3].innerHTML = budget.percentage+"%";
    }
    else{
      array[3].innerHTML = "---"
        }
    },
    updateItemsPercentages: function(percentagesArray){
      var expItemsList,expItemsArray;
      expItemsList = document.querySelectorAll(DOMStrings.itemPercentageValue);
      expItemsArray = Array.prototype.slice.call(expItemsList);
      expItemsArray.forEach(function(elem){
          elem.innerHTML = percentagesArray[expItemsArray.indexOf(elem)];
        });
    },
    updateMonth: function(){
      var dateObj, title;
      var Months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      dateObj = new Date();
      title = document.querySelector(DOMStrings.title);
      title.innerHTML = "Budget in " + Months[dateObj.getMonth()]+" is:";
    }
  };
})();

//budgetController

var budgetController = (function(){
  //create function constuctors for new item objects
  var Expense = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = 0;
  };
  var Income = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };
  //create Expense object prototype
  Expense.prototype.calcPercentage = function(){
    var perc = Math.round((this.value/data.allExpInc.inc)*100);
    if(Number.isFinite(perc)){
      this.percentage = perc+"%";
    }
    else{
      this.percentage = "---"
    }
  }
  //create object to save all input and calculated values
  var data = {
    exp:[],
    inc:[],
    allExpInc:{
      exp:0,
      inc:0
    },
    budget:0,
    percentage:-1,
  };
  var calculateAll = function(mark){
      data.allExpInc[mark] = 0;
      data[mark].forEach(function(element){
        data.allExpInc[mark] += element.value;
    });
      data.budget = data.allExpInc.inc - data.allExpInc.exp;
      if(data.allExpInc.inc > 0){
        data.percentage = Math.round((data.allExpInc.exp/data.allExpInc.inc)*100);
      }
      else{
        data.percentage = -1;
      }
  };
return{
  addItem: function(mark,description,value){
    var newItem, id;
    //id of new item = lenght of array +1
    id = data[mark].length+1;
    //create new items objects
    if(mark === "exp"){
      newItem = new Expense(id,description,value);
    }
    else if(mark === "inc"){
      newItem = new Income(id,description,value);
    }
    //save the new item to array
    data[mark].push(newItem);
    return newItem;
  },
  testing: function(){
    return data;
  },
  updateBudgetValue: function(mark){
    calculateAll(mark);
    return {
      allExp: data.allExpInc.exp,
      allInc: data.allExpInc.inc,
      budget: data.budget,
      percentage: data.percentage
    };
  },
  deleteDataItem: function(mark,id){
    var deleteId, arrayId;
    arrayId = data[mark].map(function(elem){
      return elem.id;
    });
    deleteId = arrayId.indexOf(id);
    data[mark].splice(deleteId,1);
  },
  updatePercentageInItems: function(){
    var percentages;
    data.exp.forEach(function(elem){
      elem.calcPercentage();
    });
    percentages = data.exp.map(function(elem){
      return elem.percentage;
    });
    console.log(percentages);
    return percentages;
  }

  }


})();



//controller

var controller = (function(uictrl,budctrl){

  //event handlers
  var addEventListeners = function(){
    var DOMStrings = uictrl.getDOMStrings();
    document.querySelector(DOMStrings.button).addEventListener("click", execute);
    document.addEventListener("keydown",function(event){
      if(event.keyCode === 13 || event.whitch === 13){
        execute();
      }
    });
    document.querySelector(DOMStrings.deleteItem).addEventListener("click",function(){deleteItem(event);});
    document.querySelector(DOMStrings.mark).addEventListener("change",uictrl.changeInputColor);
  };

  var updateBudget = function(mark){
    //start the updateBudgetValue function and save output to budget variable
    var budget = budctrl.updateBudgetValue(mark);
    //pass the budget object to UIController
    uictrl.updateUIbudget(budget);
    var percentages = budctrl.updatePercentageInItems();
    uictrl.updateItemsPercentages(percentages);
  };
  //delete item function
   var deleteItem = function(ev){
     if(ev.target.nodeName === "I"){
       var ItemToDelete = ev.target.parentNode.parentNode.parentNode.parentNode;
       var itemId = ev.target.parentNode.parentNode.parentNode.parentNode.id;
       var itemIdArray = itemId.split("-");
       budctrl.deleteDataItem(itemIdArray[0],parseFloat(itemIdArray[1]));
       updateBudget(itemIdArray[0]);
       ItemToDelete.remove();
       var x = budctrl.updatePercentageInItems();
       uictrl.updateItemsPercentages(x);
     }
  };

  //main controller function
  var execute = function(){
    //get inserted value of inputs
    var input = uictrl.getInput();
    if(input.getText !== "" && !isNaN(input.getMoney) && input.getMoney > 0){
      //add the new list item
      var newItem = budctrl.addItem(input.getMark,input.getText,input.getMoney);
      uictrl.addListItem(newItem,input.getMark);
      //clear input fields
      uictrl.clearInputs();
      //update budget
      updateBudget(input.getMark);
    }
  }

  return {
    init: function(){
      addEventListeners();
      budget = {
        allExp: 0,
        allInc: 0,
        budget: 0,
        percentage: "---"
      };
      uictrl.updateUIbudget(budget);
      uictrl.updateMonth();
    }
  };

})(UIController,budgetController);

controller.init();
