// 单例的方式来进行设计
// 在使用day42-43的基础上进行设计


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
    Cook.prototype.finish = function(Waiter) {
        console.log(this.name + "烹饪出了菜品");
        console.log("通知服务员上菜");
        Waiter.serve();
        this.finishedTasks++;

    }
    return function(name, salary) {
        if (!instance) {
            instance = new Cook(name, salary);
        }
        return instance;
    }

})();


var getWaiterInstance = (function () {
    var instance;
    function Waiter(name, salary) {
        Worker.call(this, name, salary);
    }
    Waiter.prototype = Object.create(Worker.prototype);
    Waiter.prototype.constructor = Waiter;
    Waiter.prototype.order = function(Cook) {
        console.log("服务员" + this.name + "招呼顾客点菜");
        diners.order();
        this.notify(Cook);
    }
    Waiter.prototype.notify = function(Cook) {
        console.log("通知厨师菜品");
        Cook.finish(this);
    }
    Waiter.prototype.serve = function() {
        console.log(this.name + "上菜");
    }
    return function(name, salary) {
        if (!instance) {
            instance = new Waiter(name, salary);
        }
        return instance;
    }
})();

var getDinersInstance = (function () {
    var instance;
    function Diners(name) {
        this.name = name;
        this.id = Diners.prototype.id + 1;
        Diners.prototype.id++;
        console.log(name + "进入了餐厅,编号为" + this.id);
    }
    Diners.prototype = {
        id: 0,
        order: function() {
            console.log("编号" + this.id + "顾客开始点菜");
            var dishId = Math.floor(Math.random() * (menu.dishes.length - 1));
            menu.order(dishId);
        },
        eat: function() {
            console.log("编号" + this.id + "顾客吃完了，离开了餐厅");
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

function Dish(name, cost, price) {
    this.name = name;
    this.cost = cost;
    this.price = price;
}
// 菜单对象
var menu = {
    dishes: [],
    order: function(id) {
        var dish = this.dishes[id];
        console.log("选择了" + dish.name + ",花费了" + dish.cost + "元");
    }
}

// 用数组的shift和push方法，模拟实现队列
var dinersQueue = ["小红", "小明", "小李", "李华"];

menu.dishes.push(new Dish("红烧茄子", 5, 15));
menu.dishes.push(new Dish("小炒肉", 6, 18));
menu.dishes.push(new Dish("番茄炒蛋", 5, 14));


var ifeRestaurant = new Restaurant({
    cash: 1000000,
    seats: 1,
    staff: []
});
var newCook = getCookInstance("老王", 12000);
var newWaiter = getWaiterInstance("小丽", 7000);
while (dinersQueue.length > 0){
    var diners = getDinersInstance(dinersQueue[0]);
    newWaiter.order(newCook);
    diners.eat();

    dinersQueue.shift();
}