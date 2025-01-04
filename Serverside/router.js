import { Router } from "express";
import Auth from './middle/Auth.js';

import * as rh from './requesthandler.js'

const router=Router();
router.route('/adduser').post(rh.addUser)
router.route('/login').post(rh.login)
router.route('/verify').post(rh.verifyEmail)
router.route('/getuser').get(Auth,rh.getUser)
router.route('/getuserData').get(Auth,rh.getUserData)
router.route('/adduserData').post(Auth,rh.addUserData)
router.route('/edituserData').put(Auth,rh.editUserData)
router.route('/deleteData').delete(Auth,rh.deleteUser)
router.route('/addPost').post(Auth,rh.addPost)
router.route('/getPosts').get(Auth, rh.getPosts)
router.route('/getPost/:id').get(Auth, rh.getPost)
router.route('/deletePost/:id').delete(Auth, rh.deletePost)
router.route('/getAllPosts').get(Auth, rh.getAllPosts)

export default router