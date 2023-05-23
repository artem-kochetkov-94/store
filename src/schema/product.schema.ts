/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         count:
 *           type: number
 *     CreateProductDto:
 *       type: object
 *       required:
 *        - title
 *        - description
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     AddProductDto:
 *       type: object
 *       required:
 *        - id
 *        - count
 *       properties:
 *         id:
 *           type: number
 *         count:
 *           type: number
 *     FindProductDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         count:
 *           type: number
 *     UpdateProductDto:
 *       type: object
 *       required:
 *        - id
 *       properties:
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     DeleteProductDto:
 *       type: object
 *       required:
 *        - id
 *       properties:
 *         id:
 *           type: number
 */
