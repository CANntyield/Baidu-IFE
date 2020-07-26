// 对象的创建与继承使用ES6中的方法

class Restaurant {
    constructor(inf) {
        this.cash = inf.cash;
        this.seats = inf.seats;
        this.staff = inf.staff;
    }
    hire(Worker) {
        if (this.staff.indexOf(Worker) === -1) {
            this.staff.push(Worker);
        }
    }
    fire(Worker) {
        var index = this.staff.indexOf(Worker);
        if (index !== -1) {
            this.staff.splice(index,1);
        }
    }
}

class Worker {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
        this.id = Worker.workerId + 1;
        Worker.workerId++;
        this.finishedTasks = 0;
    }
    finish() {
        this.finishedTasks++;
    }
    // 使用类的静态属性
    static workerId = 0;
}



class Cook extends Worker {
    constructor(name, salary) {
        super(name, salary);
    }
    finish() {
        console.log("烹饪出菜品");
        this.finishedTasks++;
    }
}

class Waiter extends Worker {
    constructor(name, salary) {
        super(name, salary);
    }
    finish(parameter) {
        this.finishedTasks++;
        if (parameter instanceof Array) {
            console.log("记录客人点菜");
        }
        else {
            console.log("上菜");
        }

    }
}

 
class Diners {
    constructor() {}
    order() {
        console.log("点菜");
    }
    eat() {
        console.log("吃");
    }
}

class Dish {
    constructor(name, cost, price) {
        this.name = name;
        this.cost = cost;
        this.price = price;
    }
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

