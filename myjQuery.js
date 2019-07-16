/**
 * 目的：
 * 仿照jQuery，封装一个js文件
 * 所要具备的功能：
 * 1.获取元素
 * 2.css方法
 * 3.操作类名 addClass、removeClass、toggleClass……
 * 4.……
 */



// 使用自调用函数，让整个js的封装形成一个局部作用域，把自己写的代码保护起来
; (function () {
    // 为了省掉每次都有new一个对象再调用构造函数（构造函数中的this 指向 上一步创建的对象）的麻烦，这边直接模仿jQuery
    // 例如：let obj = new Init();
    function jQuery(selector) {
        // document.querySelectorAll 返回值是一个伪数组 - 是NodeList构造函数的实例对象
        return new Init(selector);
    }
    // 把封装的jQuery函数变成window的一个属性，让外面可以使用
    window.$ = window.jQuery = jQuery;

    // 所有的方法都放在原型对象上

    /**
     * 功能1
     * 获取元素
     * 实现基本的选择器功能  $(css选择器-selector)
     */
    function Init(selector) {
        // jq对象要求是一个伪数组：使用索引数字作为属性名的对象
        let domNL = document.querySelectorAll(selector);
        // 遍历伪数组
        for (let i = 0; i < domNL.length; i++) {
            // 把伪数组里面的每个元素都拿出来组成this身上的伪数组
            this[i] = domNL[i];
        }
        // 伪数组还需要一个长度 length
        this.length = domNL.length;
    }

    /**
     * jq的css方法两个功能
     * 设置css样式  jq对象.css(属性名，属性值)
     * 获取css样式  jq对象.css(属性名)
     */
    Init.prototype.css = function (property, value) {
        // 修改实例对象伪数组里面的样式
        // 先判断有没有传第二个参数，如果传了value就是设置样式，否则就是获取
        if (value == undefined) {
            return window.getComputedStyle(this[0])[property];
        } else {
            // 用数组储存一个数组
            let pxArr = ['width', 'height', 'top', 'left'];
            // 把带单位和不带单位的属性区分开
            // 遍历伪数组，把里面的每个元素都进行修改
            for (let i = 0; i < this.length; i++) {
                // 遍历里的this指向实例对象（原型对象上的方法中的this都是指向实例对象）
                if (pxArr.indexOf(property) !== -1) {
                    // 判断是否带了单位 indexOf获取索引，如果没有就是-1  要转换格式
                    if (value.toString().indexOf('px') === -1) {
                        // 需要加单位
                        this[i].style[property] = value + 'px';
                    } else {
                        this[i].style[property] = value;
                    }
                } else {
                    this[i].style[property] = value;
                }
            }
            // 最后返回一个this，实现链式编程
            return this;
        }
    }

    /**
     * 操作类名的方法需要用到遍历伪数组
     * 先封装一个遍历伪数组的方法
     */
    Init.prototype.each = function (callback) {
        for (let i = 0; i < this.length; i++) {
            // 在遍历里面的逻辑是多变的，不确定的，所以此时用一个回调函数
            callback(i, this[i]);//i是索引，this[i]是事件源等
        }
    }

    /**
     * 实现添加类名 addClass 功能
     * jq里面  jq对象.addClass(类名)
     */
    Init.prototype.addClass = function (className) {
        // 调用上面遍历伪数组的方法
        this.each(function (e, i) {
            e.classList.add(className);
        })
        // 最后返回一个this，实现链式编程
        return this;
    }

    /**
     * 实现删除类名 removeClass 功能
     * jq里面  jq对象.removeClass(类名)
     */
    Init.prototype.removeClass = function (className) {
        // 调用上面遍历伪数组的方法
        this.each(function (e, i) {
            e.classList.remove(className);
        })
        // 返回一个this，实现链式编程
        return this;
    }

    /**
     * 实现切换类名 toggleClass 功能
     * jq里面  jq对象.toggleClass(类名)
     */
    Init.prototype.toggleClass = function (className) {
        // 调用上面遍历伪数组的方法
        this.each(function (e, i) {
            e.classList.toggle(className);
        })
        // 返回一个this，实现链式编程
        return this;
    }


    /**
     * 将元素的textContent内容改写成指定内容
     * 通过setText()函数
     */
    Init.prototype.setText = function (texts) {
        // 遍历元素，逐个将textContent改变
        /* // 调用上面遍历伪数组的方法
        this.each(function(e,i){
            e.textContent = texts;
        }) */
        for (let i = 0; i < this.length; i++) {
            Init[i].textContent = texts;
        }
        return this;
    }

    /**
     * 实现$('div').html('hello')功能
     * 封装一个html()函数，根据传递进来的参数判断是获取第一个dom元素的innerHTML还是设置每一个dom元素的innerHTML
     */
    Init.prototype.html = function (val) {
        //定义jQuery中的html()方法
        if (val) {
            for (let i = 0; i < this['length']; i++) {
                this[i].innerHTML = val;
            }
        } else {
            return this[0].innerHTML;
        }
        return this.length;
    };
})()
let box = $('.box');
box.css('width', 200);
box.css('height', 200);
box.css('backgroundColor', 'yellow');
box.addClass('a');