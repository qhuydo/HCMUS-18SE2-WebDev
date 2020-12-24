const db = require('../utils/db');

module.exports = {
    async signup(account) {
        var sql = `select * from student where username = "${account.username}" or email = "${account.email}"`;
        var [rows, fields] = await db.select(sql);

        if (rows.length != 0) {
            return {"error":'username is exist'};
        }
        sql = `select * from administrator where username = "${account.username}" or email = "${account.email}"`;
        [rows, fields] = await db.select(sql);

        if (rows.length != 0) {
            return {"error":'username or email is exist'};
        }

        sql = `select * from instructor where username = "${account.username}" or email = "${account.email}"`;
        [rows, fields] = await db.select(sql);

        if (rows.length != 0) {
            return {"error":'username or email is exist'};
        }
        let res = null
        res = await db.insert(account,'student')
        console.log(res)
        if (res)
            return {"success":'Sign up success'};
        else
            return {"error":"create row fail"}
    },
}