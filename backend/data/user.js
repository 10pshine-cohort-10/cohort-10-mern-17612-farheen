import {db} from "../models/index.ts";

export const find_by_email = async(email) => db.User.findOne({email}).select("+password");
export const find_by_id = async(id) => db.User.findById(id);
export const save_user = async(data) => db.User.create(data);
export const bump_ver = async(id) => db.User.updateOne({_id: id}, {$inc: {ver: 1}});
