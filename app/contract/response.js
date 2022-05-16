/**
 * @apiDefine response
 * @apiSuccessExample {json} 200
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "data": {},
 *       "msg": "请求成功",
 *       "success": true
 *     }
 * @apiSuccessExample {json} 404
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 404,
 *       "data": null,
 *       "msg": "系统异常",
 *       "success": false
 *     }
 * @apiSuccessExample {json} 500
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 500,
 *       "data": null,
 *       "msg": "系统异常",
 *       "success": false
 *     }
 *  @apiSuccessExample {json} 401
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 401,
 *       "data": null,
 *       "msg": "用户未登录",
 *       "success": false
 *     }
 */
