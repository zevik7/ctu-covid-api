import { getDB } from '#config/mongodb.js';

const UserModel = getDB().collection('users');

export default UserModel;
