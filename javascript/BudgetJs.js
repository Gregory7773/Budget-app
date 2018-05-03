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
    expPercentageAll: ".expenses-percentage"
  };
  return {
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
      html = '<div class="item" id="item_inc-%id%"><h4 class="item_description">%description%</h4><div class = "item_right_side"><div class="item_value" id="income_value">%value%</div><div class="delete_item"><button><i class="ion-ios-close-outline" id="income_button"></i></button></div></div></div>';
      element = document.querySelector(DOMStrings.incContainer);
    }
      else{
        html = '<div class="item" id="item_exp-%id%"><h4 class="item_description">%description%</h4><div class = "item_right_side"><div class="item_value">%value%</div><div class= "percentage"><div class="percentage_value">23</div></div><div class="delete_item"><button><i class="ion-ios-close-outline"></i></button></div></div></div>';
        element = document.querySelector(DOMStrings.expContainer);
      }
      //replace values in strings
      newHtml = html.replace('%id%',obj.id);
      newHtml = newHtml.replace('%description%',obj.description);
      newHtml = newHtml.replace('%value%',obj.value);

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
    var list;
    var array;
    list = document.querySelectorAll(DOMStrings.budgetValue+","+DOMStrings.expValue+","+DOMStrings.incValue+","+DOMStrings.expPercentageAll);
    array = Array.prototype.slice.call(list);
    array[0].innerHTML = budget.budget;
    array[1].innerHTML = budget.allInc;
    array[2].innerHTML = budget.allExp;
    if(budget.percentage > 0){
      array[3].innerHTML = budget.percentage+"%";
    }
    else{
      array[3].innerHTML = "---"
    }
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
  };
  var Income = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };
  //create object to save all input and calculated values
  var data = {
    exp:[],
    inc:[],
    allExpInc:{
      exp:0,
      inc:0
    },
    budget:0,
    percentage:-1
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
  }
};

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
  };

  var updateBudget = function(mark){
    //start the updateBudgetValue function and save output to budget variable
    var budget = budctrl.updateBudgetValue(mark);
    //pass the budget object to UIController
    uictrl.updateUIbudget(budget);
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
      uictrl.updateUIbudget({
        allExp: 0,
        allInc: 0,
        budget: 0,
        percentage: -1
      });
    }
  };

})(UIController,budgetController);

controller.init();
