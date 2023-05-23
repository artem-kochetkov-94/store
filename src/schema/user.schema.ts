/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *     SetUserPasswordDto:
 *       type: object
 *       required:
 *        - id
 *        - password
 *       properties:
 *         id:
 *           type: number
 *         password:
 *           type: string
 *     UserCreateDto:
 *       type: object
 *       required:
 *        - email
 *        - password
 *        - name
 *        - roleName
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         roleName:
 *           type: string
 *     UserLoginDto:
 *       type: object
 *       required:
 *       - email
 *       - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     UserRegisterDto:
 *       type: object
 *       required:
 *        - email
 *        - password
 *        - name
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 */
