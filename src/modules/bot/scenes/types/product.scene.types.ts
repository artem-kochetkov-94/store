export enum ProductActions {
	Back = 'back',
	AddToOrder = 'AddToOrder',
	RemoveFromOrder = 'RemoveFromOrder',
}

export interface ProductState {
	id: number;
}

export const isProductState = (state: object): state is ProductState => {
	if (typeof state === 'object' && !!state && 'id' in state) {
		return true;
	}

	return false;
};
