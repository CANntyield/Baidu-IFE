// 在使用day44-46的基础上进行设计
// 既然要用到ES6中的Promise，就开始使用ES6语法吧
const UNIT_TIME = 1000; 

function Restaurant(inf) {
    this.cash = inf.cash;
    this.seats = inf.seats;
    this.staff = inf.staff;
}
Restaurant.prototype = {
    constructor: Restaurant,
    hire: function(Worker) {
        if(this.staff.indexOf(Worker) === -1){
            this.staff.push(Worker);
        }
    },
    fire: function(Worker) {
        var index = this.staff.indexOf(Worker);
        if(index !== -1){
            this.staff.splice(index,1);
        }
    }
};


function Worker(name, salary) {
    this.name = name;
    this.salary = salary;
    // 感觉这样做有点傻
    this.id = Worker.prototype.workerId + 1;
    Worker.prototype.workerId++;
    this.finishedTasks = 0;
}
Worker.prototype = {
    constructor: Worker,
    workerId: 0,
    finish: function(){
        // 当调用finish方法时，会根据原型链往上找，找到此方法时，
        // 该this指向的是最低层的对象
        this.finishedTasks++;
    }
}

var getCookInstance = (function () {
    var instance;
    function Cook(name, salary) {
        Worker.call(this, name, salary);
    }
    Cook.prototype = Object.create(Worker.prototype);
    Cook.prototype.constructor = Cook;
    function prepare(i, len, menu, Waiter, thisCook, dishStatus) {
        new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve("菜品" + menu.dishes[Waiter.dishIds[i]].name + "做好了");
            }, UNIT_TIME * menu.dishes[Waiter.dishIds[i]].time);
        }).then(function(r) {
            console.log(r);
            console.log("通知服务员上菜");
            Waiter.serve(menu.dishes[Waiter.dishIds[i]].name);
            thisCook.finishedTasks++;
            if (i === len - 1) {
                dishStatus.status = true;
            }
            else {
                prepare(i + 1, len, menu, Waiter, thisCook, dishStatus);
            }
        })
    }
    Cook.prototype.finish = function(Waiter, menu, dishStatus) {
        console.log("厨师" + this.name + "开始烹饪");
        let thisCook = this;
        let i = 0;
        let len = Waiter.dishIds.length;
        prepare(i, len, menu, Waiter, thisCook, dishStatus);
                
    }
    return function(name, salary) {
        if (!instance) {
            instance = new Cook(name, salary);
        }
        return instance;
    }

})();

// 每过一秒判断是否已经点好菜了，如果已经点好菜，就通知厨师做菜。
function checkStatus(thisWaiter, Cook, menu, orderStatus, dishStatus) {
    if (orderStatus.status === true) {
        // 通知厨师的同时，将做菜的状态变量传送过去
        thisWaiter.notify(Cook, menu, dishStatus);
    }
    else {
        setTimeout(checkStatus, 1000, thisWaiter, Cook, menu, orderStatus, dishStatus);
    }
    
}

var getWaiterInstance = (function () {
    var instance;
    function Waiter(name, salary) {
        Worker.call(this, name, salary);
    }
    Waiter.prototype = Object.create(Worker.prototype);
    Waiter.prototype.constructor = Waiter;
    Waiter.prototype.order = function(Cook, menu, dishStatus) {
        console.log("服务员" + this.name + "招呼顾客点菜");
        var orderStatus = {status: false};
        this.dishIds = [];
        diners.order(menu, orderStatus, this.dishIds);
        var thisWaiter = this;
        checkStatus(thisWaiter, Cook, menu, orderStatus, dishStatus);
    }
    Waiter.prototype.notify = function(Cook, menu, dishStatus) {
        console.log("服务员通知厨师准备菜品");
        Cook.finish(this, menu, dishStatus);
    }
    Waiter.prototype.serve = function(dishName) {
        console.log(this.name + "上菜" + dishName);
    }
    return function(name, salary) {
        if (!instance) {
            instance = new Waiter(name, salary);
        }
        return instance;
    }
})();

// 使用简单工厂模式，构造一个员工工厂，让Waiter和Cook与document松耦合
function getWaiterOrCook(name, salary, job) {
    var obj = null;
    if (job === "Cook") {
        obj = getCookInstance(name, salary);
    }
    else if ( job === "Waiter") {
        obj = getWaiterInstance(name, salary);
    }
    return obj;
}


// 随机生成需要顾客会点多少个菜
function randomGeneDishIds(menu, amount, dishIds) {
    var tempId;
    while (amount--) {
        tempId = Math.floor(Math.random() * (menu.dishes.length - 1));
        if (dishIds.indexOf(tempId) === -1) {
            dishIds.push(tempId);
        }
    }
}

var getDinersInstance = (function () {
    var instance;
    function Diners(name) {
        this.name = name;
        this.id = Diners.prototype.id + 1;
        this.pay = 0;
        Diners.prototype.id++;
        console.log(name + "进入了餐厅,编号为" + this.id);
    }
    Diners.prototype = {
        id: 0,
        // order增加一个状态变量status，判断是否已经点菜完成
        order: function(menu, orderStatus, dishIds) {
            console.log("编号" + this.id + "顾客开始点菜");
            var thisDiners = this;
            // 修改点菜函数，顾客可以点多个菜
            // amount变量表示，顾客点amount个菜，该值随机生成
            var amount = Math.floor(Math.random() * (menu.dishes.length - 1) + 1);
            new Promise(function(resolve, reject) {
                setTimeout(function() {
                    randomGeneDishIds(menu, amount, dishIds);
                    resolve('ok');
                }
                , UNIT_TIME * 3);
            }).then(function(r) {
                var sum = menu.order(dishIds);
                thisDiners.pay = sum;
                orderStatus.status = true;
            });
            
        },
        eat: function() {
            console.log("编号" + this.id + "顾客吃完了");
            console.log("支付了" + this.pay + "元，离开了餐厅");
            instance = null;
        }
    }
    return function(name) {
        if (!instance) {
            instance = new Diners(name);
        }
        return instance;
    }
})();


function Dish(name, cost, price, time) {
    this.name = name;
    this.cost = cost;
    this.price = price;
    this.time = time;
}
// 菜单对象
var menu = {
    dishes: [],
    order: function(ids) {
        var dish;
        var sum = 0;
        for(let i = 0; i<ids.length ;i++) {
            dish = this.dishes[ids[i]];
            console.log("选择了" + dish.name + ",需要花费" + dish.price + "元");
            sum += dish.price;
        }
        return sum;
    }
}

// 用数组的shift和push方法，模拟实现队列
var dinersQueue = ["小红", "小明", "小李", "李华"];

menu.dishes.push(new Dish("红烧茄子", 5, 15, 6));
menu.dishes.push(new Dish("小炒肉", 6, 18, 4));
menu.dishes.push(new Dish("番茄炒蛋", 5, 14, 3));
menu.dishes.push(new Dish("腐竹炒肉", 7, 16, 5));
menu.dishes.push(new Dish("青椒肉丝", 7, 17, 5));
menu.dishes.push(new Dish("糖醋排骨", 9, 20, 10));


var ifeRestaurant = new Restaurant({
    cash: 1000000,
    seats: 1,
    staff: []
});
var newCook = getWaiterOrCook("老王", 12000, "Cook");
var newWaiter = getWaiterOrCook("小丽", 7000, "Waiter");
var diners;
let i = 0;
var isComplete = {status: false};
function queueHavingDinner(i, Waiter, Cook) {
    new Promise(function(resolve, reject) {
        isComplete = {status: false};
        diners = getDinersInstance(dinersQueue[0]);
        Waiter.order(Cook, menu, isComplete);
        setTimeout(
            function checkComplete(isComplete) {
                if (isComplete.status === true) {
                    diners.eat();
                    resolve("进来下一位顾客");
                }
                else {
                    setTimeout(checkComplete, 1000, isComplete);
                }
            }
            , 1000, isComplete);
    }).then(function(r) {
        if (i < dinersQueue.length) {
            dinersQueue.shift();
            queueHavingDinner(i + 1);
        }
    });
}
queueHavingDinner(i, newWaiter, newCook);
