import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
import { USER_ROLE } from '../types/user-role';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - validation error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'user@mail.ru', password: 'user' });
		expect(res.statusCode).toBe(422);
	});

	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'user@mail.ru', password: 'user', name: 'user' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'user@mail.ru', password: 'user' });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'user@mail.ru', password: 'wrong password' });
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'user@mail.ru', password: 'user' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('user@mail.ru');
	});

	it('Info - error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);
		expect(res.statusCode).toBe(401);
	});

	it('Create user - validation error', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'user@mail.ru', password: 'user' });
		const res = await request(application.app)
			.post('/users/create-user')
			.set('Authorization', `Bearer ${login.body.jwt}`)
			.send({ email: 'user-new@mail.ru', password: 'user', name: 'user' });
		expect(res.statusCode).toBe(422);
	});

	// it('Create user - success', async () => {
	// 	const login = await request(application.app)
	// 		.post('/users/login')
	// 		.send({ email: 'user@mail.ru', password: 'user' });
	// 	const res = await request(application.app)
	// 		.post('/users/create-user')
	// 		.set('Authorization', `Bearer ${login.body.jwt}`)
	// 		.send({
	// 			email: 'user-new@mail.ru',
	// 			password: 'user',
	// 			name: 'user',
	// 			roleName: USER_ROLE.STOCK_MANAGER,
	// 		});
	// 	expect(res.statusCode).toBe(200);
	// });

	it('Delete user password', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'user@mail.ru', password: 'user' });
		const res = await request(application.app)
			.post('/users/delete-user-password')
			.set('Authorization', `Bearer ${login.body.jwt}`)
			.send({
				id: 2,
			});
		expect(res.body.password).toBe('');
	});

	it('Set user password', async () => {
		const login = await request(application.app)
			.post('/users/set-user-password')
			.send({ email: 'user@mail.ru', password: 'user' });
		const res = await request(application.app)
			.post('/users/delete-user-password')
			.set('Authorization', `Bearer ${login.body.jwt}`)
			.send({
				id: 2,
				password: 'user',
			});
		expect(res.body.password).not.toBe('');
	});
});

afterAll(() => {
	application.close();
});
