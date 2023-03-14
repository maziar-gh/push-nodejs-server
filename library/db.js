const config = require("../config.json");
const moment = require('moment');
let date = moment();
date = moment(date).format("YYYY-MM-DD HH:mm:ss");
const knex = require('knex')({
    client: 'mysql',
    debug: ['ComQueryPacket'],
    connection: {
        host: config.mysql_host,
        user: config.mysql_user,
        password: config.mysql_pass,
        database: config.mysql_db
    }
});


module.exports.getUserDetails = async (site_id, limit = 10000, offset = 0) => {

    try {
        return knex("user").where("site_id", site_id).limit(limit).offset(offset);

    } catch (e) {
        return [];
    }

}

module.exports.updateStatus = async (data) => {
    //
    try {
        if (data.status == "d") {
            let site = await knex('camp_data').insert([{
                "created_at": date,
                camp_id: data.camp,
                user_id: data.user_id,
                status: data.status
            }]);
        } else {

            await knex("camp_data").where({
                "camp_id": data.camp,
                "user_id": data.user_id
            }).update({"updated_at": date, status: data.status});


        }
        return true;
    } catch (e) {
        console.error(e)
        return false;
    }


}


module.exports.getSiteDetails = async (site_id) => {
    try {
        return knex("sites").where("id", site_id);
    } catch (e) {
        return [];
    }

}

module.exports.setCampData = async (insert_data) => {
    try {
        return knex("camp").insert(insert_data);
    } catch (e) {
        return [];
    }

}
module.exports.getCampData = async (camp_id = "") => {
    try {
        if (camp_id) {
            return await knex('camp').where("id", camp_id)
        } else {
            return await knex('camp');

        }
    } catch (e) {
        return [];
    }

}


module.exports.setCampaginData = async (campdata = []) => {

    try {

        await knex("camp_data").insert(campdata)

    } catch (e) {
        console.error(e)

    }

}
