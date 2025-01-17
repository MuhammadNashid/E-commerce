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
router.route('/getAllOtherProducts').get(Auth, rh.getAllOtherProducts);
router.route('/getProduct/:productId').get(Auth, rh.getProductById);
router.route('/addCart').post(Auth, rh.addCart);
router.route('/findOnCart/:productId').get(Auth, rh.findOnCart);
router.route('/getCart').get(Auth, rh.getCart);
router.route('/deleteCartItem/:productId').delete(Auth, rh.delCartItem);
router.route('/incrementCartQuantity/:productId').put(Auth, rh.incrementCartQuantity);
router.route('/decrementCartQuantity/:productId').put(Auth, rh.decrementCartQuantity);
router.route('/placeOrder').post(Auth, rh.placeOrder);
router.route('/getBuyerOrder').get(Auth, rh.getBuyerOrder);
router.route('/getSellerOrders').get(Auth, rh.getSellerOrders);
router.route('/confirmOrder/:productId').put(Auth, rh.confirmOrder);


export default router