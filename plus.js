const app = Vue.createApp({
    data() {
        return {
            season: [
                ["spring", "春"],
                ["summer", "夏"],
                ["autumn", "秋"],
                ["winter", "冬"],
            ],
            week: ["日", "一", "二", "三", "四", "五", "六"],
            animal_list: ["chicken", "rabbit", "animal_1", "animal_2"],
            year: 1,
            month: 0,
            day: 1,
            advance_day: 7,
            name: "",
            birthday_month: 0,
            birthday_day: 1,
            animal: {
                chicken: 0,
                rabbit: 0,
                animal_1: 0,
                animal_2: 0,
            },
            cookbook: "",
            resident: "",
            festival: "",
            set_data: false,
            set_birthday: false,
            loop: 0,
        }
    },
    created() {
        // 如果本地存储localStorage是空着的，则进行初始化操作。
        if (localStorage.mineraltown_plus == undefined) {
            this.reset()
            this.set_data = true
        } else {
            this.localStorage_to_data()
        }
        // 导入JSON数据
        this.import_data()
    },
    methods: {
        // 导入JSON数据
        import_data() {
            // 居民信息
            axios.get("Resident.json").then((response) => {
                for (i in response.data) {
                    if (
                        response.data[i]["birthday"]["month"] == this.season[this.month][1]
                    ) {
                        if (
                            response.data[i]["birthday"]["day"] == localStorage.birthday_day
                        ) {
                            if (response.data[i]["birthday"]["day2"] != null) {
                                response.data[i]["birthday"]["day"] =
                                    response.data[i]["birthday"]["day2"]
                            }
                        }
                    }
                }
                this.resident = response.data
            })
            // 节日信息
            axios.get("Festival.json").then((response) => {
                this.festival = response.data
            })
            // 菜谱
            axios.get("Cookbook.json").then((response) => {
                this.cookbook = response.data
            })
        },
        // 修改季节
        switch_month(i, mode) {
            this[mode] = parseInt(i)
            this.data_to_localStorage()
        },
        // 修改年份（button）
        switch_year(i) {
            if (i == "add") {
                this.year += 1
            } else if (i == "sub") {
                if (this.year > 1) {
                    this.year = parseInt(this.year) - 1
                }
            }
            this.data_to_localStorage()
        },
        // 修改年份（input）
        change_year(e) {
            var INT = new RegExp("^[1-9][0-9]*$")
            if (e.target.value == "") {
                this.year = 1
            } else if (INT.test(e.target.value)) {
                this.year = parseInt(e.target.value)
            } else {
                e.target.value = parseInt(this.year)
            }
            this.data_to_localStorage()
        },
        // 修改天数（button）
        switch_day(i, mode) {
            let n
            if (mode == 'advance_day') {
                n = 0
            } else {
                n = 1
            }
            if (i == "add") {
                if (this[mode] + 1 <= 30) {
                    this[mode] += 1
                } else {
                    this[mode] = n
                }
            } else if (i == "sub") {
                if (this[mode] - 1 < n) {
                    this[mode] = 30
                } else {
                    this[mode] -= 1
                }
            }
            this.data_to_localStorage()
        },
        // 修改天数（input）
        change_day(e, mode) {
            let n
            let INT
            if (mode == 'advance_day') {
                n = 0
                INT = new RegExp("^[0-9][0-9]*$")
            } else {
                n = 1
                INT = new RegExp("^[1-9][0-9]*$")
            }
            if (e.target.value == "") {
                this[mode] = n
            } else if (INT.test(e.target.value)) {
                if (e.target.value > 30) {
                    this[mode] = 1
                } else if (e.target.value < n) {
                    this[mode] = n
                } else {
                    this[mode] = parseInt(e.target.value)
                }
            } else {
                e.target.value = parseInt(this[mode])
            }
            this.data_to_localStorage()
        },
        // 修改玩家姓名
        change_my_name(e) {
            this.name = e.target.value
            this.data_to_localStorage()
        },
        // 生日：是否在n天之内举行
        test_birthday(i, n) {
            // 如果这个月是冬，下一个月则是春。
            let next_month
            if (this.month == 3) {
                next_month = 0
            } else {
                next_month = this.month + 1
            }
            // 判断生日月份是否在当前月份或者下个月
            if (i.birthday.month == this.season[this.month][1]) {
                if (i.birthday.day - this.day == n) {
                    return true
                } else {
                    return false
                }
            } else if (i.birthday.month == this.season[next_month][1]) {
                if (i.birthday.day + 30 - this.day == n) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        // 节日：是否在n天之内举行
        test_festival(i, n) {
            // 如果这个月是冬，下一个月则是春。
            let next_month
            if (this.month == 3) {
                next_month = 0
            } else {
                next_month = this.month + 1
            }
            // 判断节日月份是否在当前月份或者下个月
            if (i.month == this.season[this.month][1]) {
                if (i.day - this.day == n) {
                    return true
                } else {
                    return false
                }
            } else if (i.month == this.season[next_month][1]) {
                if (i.day + 30 - this.day == n) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        // 判断是否是节日，商店在节日时休息
        if_festival() {
            let f = this.festival
            for (i in f) {
                if (this.day == f[i].day && this.season[this.month][1] == f[i].month) {
                    if (
                        // 无固定场所的节日商店不休息
                        f[i].name.cn == "春季感恩节" ||
                        f[i].name.cn == "南瓜节" ||
                        f[i].name.cn == "冬季感恩节"
                    ) {
                        return false
                    } else if (this.year == 1 && this.month == 0 && this.day == 1) {
                        // 第一年春1日的年糕大会不举行
                        return false
                    } else {
                        return true
                    }
                }
            }
            return false
        },
        // 从localStorage写入data
        localStorage_to_data() {
            var d = JSON.parse(localStorage.mineraltown_plus)
            this.year = parseInt(d["year"])
            this.month = parseInt(d["month"])
            this.day = parseInt(d["day"])
            this.advance_day = parseInt(d["advance_day"])
            this.name = d["name"]
            this.birthday_month = parseInt(d["birthday_month"])
            this.birthday_day = parseInt(d["birthday_day"])
            for (let i in this.animal_list) {
                this.animal[this.animal_list[i]] = parseInt(d["animal"][this.animal_list[i]])
            }
        },
        // 从data写入localStorage
        data_to_localStorage() {
            var d = {
                "year": this.year,
                "month": this.month,
                "day": this.day,
                "advance_day": this.advance_day,
                "name": this.name,
                "birthday_month": this.birthday_month,
                "birthday_day": this.birthday_day,
                "animal": {
                    "chicken": this.animal["chicken"],
                    "rabbit": this.animal["rabbit"],
                    "animal_1": this.animal["animal_1"],
                    "animal_2": this.animal["animal_2"]
                }
            }
            localStorage.mineraltown_plus = JSON.stringify(d)
        },
        // 初始化
        reset() {
            console.log("初始化")
            var d = {
                "year": 1,
                "month": 0,
                "day": 1,
                "advance_day": 7,
                "name": "Pite",
                "birthday_month": 0,
                "birthday_day": 1,
                "animal": {
                    "chicken": 0,
                    "rabbit": 0,
                    "animal_1": 0,
                    "animal_2": 0
                }
            }
            localStorage.mineraltown_plus = JSON.stringify(d)
            this.localStorage_to_data()
        },
        // 动物妊娠_长按开始的时候
        set_animal_start(e) {
            // 刚开始按时触发
            if (this.animal[e] == 0) {
                if (e == "chicken") {
                    this.animal[e] = 3
                    console.log(e + ': 将一个鸡蛋放入孵蛋箱')
                } else if (e == "rabbit") {
                    this.animal[e] = 5
                    console.log(e + ': 对安哥拉兔使用了人工配种器。')
                } else {
                    this.animal[e] = 21
                    console.log(e + ': 对牛/羊/羊驼使用了人工配种器。')
                }
                this.data_to_localStorage()
            }
            let then = this
            // 清理掉计时器，防止重复注册定时器
            clearTimeout(this.loop)
            this.loop = setTimeout(function () {
                // 按过的0.5秒后触发
                then.loop = 0
                then.animal[e] = 0
                then.data_to_localStorage()
                console.log(e + ': 取消了妊娠状态。')
            }, 500)
        },
        // 动物妊娠_长按松手的时候
        set_animal_end(e) {
            // 松手就清理掉计时器，也就是如果长按时间没到0.5秒，则取消长按事件的触发
            clearTimeout(this.loop)
        },
        // 导出本地存储
        export_localStorage() {
            console.log(JSON.stringify(localStorage))
            copy(JSON.stringify(localStorage))
        },
        // 导入本地存储
        import_localStorage(e) {
            for (let i in e) {
                console.log(i)
                localStorage[i] = e[i]
            }
            this.localStorage_to_data()
        },
        // 下一天
        next() {
            // 日期 +1
            if (this.day + 1 <= 30) {
                this.day += 1
            } else {
                this.day = 1
                if (this.month + 1 < 4) {
                    this.month += 1
                } else {
                    this.month = 0
                    this.year += 1
                }
            }
            console.log('第' + this.year + '年 ' + this.season[this.month][1] + this.day + '日 星期' + this.week[((this.year - 1) * 120 + this.month * 30 + this.day - 1) % 7])
            // 动物妊娠天数 -1
            for (i in this.animal) {
                if (this.animal[i] != 0) {
                    this.animal[i] -= 1
                    if (this.animal[i] == 0) {
                        console.log(i + ': 动物出生了。')
                    }
                }
            }
            // 存档
            this.data_to_localStorage()
        },
    },
})
const vm = app.mount('#plus')