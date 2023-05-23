import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../package.json';
import { LoggerService } from './logger/logger.service';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'REST API Docs',
			version,
		},
		components: {
			securitySchemas: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [
		'./src/modules/product/product.controller.ts',
		'./src/modules/users/users.controller.ts',
		'./src/schema/*.ts',
	],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express, port: number): void {
	// Swagger page
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// Docs in JSON format
	app.get('/docs.json', (req: Request, res: Response) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});

	new LoggerService().log(`Docs available at http://localhost:${port}/docs`);
}
