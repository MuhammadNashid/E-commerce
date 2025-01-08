import { Router } from "express"
import Auth from './middle/Auth.js'

import * as rh from './requesthandler.js'

const router=Router()

router.route('/adduser').post(rh.addUser)
router.route('/addAddress').post(Auth,rh.addAddress)
router.route('/login').post(rh.login)
router.route('/verifyEmail').post(rh.verifyEmail)
// router.route('/getuser').get(Auth,rh.getUser)
router.route('/getuserData').get(Auth,rh.getUserData)
router.route('/updateUser').put(Auth,rh.updateUserData)
router.route('/updatePassword').put(rh.updatePassword)
router.route('/getUserAddresses').get(Auth, rh.getUserAddresses);
router.route('/getCompany').get(Auth, rh.getCompany);
router.route('/addCompany').post(Auth, rh.addCompany);
router.route('/addProduct').post(Auth, rh.addProduct);
router.route('/editCompany').post(Auth, rh.editCompany);
router.route('/getProducts').get(Auth, rh.getProducts);
router.route('/getProductsByCategory/:category').get(Auth, rh.getProductsByCategory);
router.route('/getProduct/:productId').get(Auth, rh.getProductById);
router.route('/getAllOtherProducts').get(Auth, rh.getAllOtherProducts);
router.route('/getProduct/:productId').get(Auth, rh.getProductById);
export default router