// 采用JS高级语言程序设计中创建对象的方法中，组合使用构造函数模式和原型模式
// 继承方法采用，寄生组合式继承,使用ES5中的Object.create方法
function Restaurant(inf) {
    this.cash = inf.cash;
    this.seats = inf.seats;
    this.staff = inf.staff;
}
Restaurant.prototype = {
    constructor: Restaurant,
    hire: function(Worker){
        if(this.staff.indexOf(Worker) === -1){
            this.staff.push(Worker);
        }
    },
    fire: function(Worker){
        var index = this.staff.indexOf(Worker);
        if(index !== -1){
            this.staff.splice(index,1);
        }
    }
}

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

function Cook(name, salary) {
    Worker.call(this, name, salary);
}
Cook.prototype = Object.create(Worker.prototype);
Cook.prototype.constructor = Cook;
Cook.prototype.finish = function() {
    console.log("烹饪出菜品");
    this.finishedTasks++;
}

function Waiter(name, salary) {
    Worker.call(this, name, salary);
}
Waiter.prototype = Object.create(Worker.prototype);
Cook.prototype.constructor = Waiter;
Waiter.prototype.finish = function(parameter) {
    this.finishedTasks++;
    if (parameter instanceof Array) {
        console.log("记录客人点菜");
    }
    else {
        console.log("上菜");
    }
}


function Diners() {

}
Diners.prototype = {
    order: function(){
        console.log("点菜");
    },
    eat: function(){
        console.log("吃");
    }
}

function Dish(name, cost, price) {
    this.name = name;
    this.cost = cost;
    this.price = price;
}

var ifeRestaurant = new Restaurant({
    cash: 1000000,
    seats: 20,
    staff: []
});

var newCook = new Cook("Tony", 10000);
ifeRestaurant.hire(newCook);

console.log(ifeRestaurant.staff);

ifeRestaurant.fire(newCook);
console.log(ifeRestaurant.staff);

