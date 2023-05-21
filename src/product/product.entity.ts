export class ProductEntity {
	constructor(
		private readonly _title: string,
		private readonly _description: string,
		private _count: number = 0,
	) {}

	get title(): string {
		return this._title;
	}

	get description(): string {
		return this._description;
	}

	get count(): number {
		return this._count;
	}

	// public setCount(): void {
	// 	this._count = this.count - 1;
	// }
}
