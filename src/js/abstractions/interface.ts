export default interface query<T = Object> {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where (arg1: string | [], arg2?: any, arg3?: any): query;
	orWhere (arg1: string | [], arg2?: any, arg3?: any): query;

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	toString (): string;
	raw (): queryPart;

	// -------------------------------------------------
	// get methods
	// -------------------------------------------------

	get () : T[];
	find (primaryKey : string | number) : T;
}

export interface queryPart {
	type: "and" | "or";
	logic: (string | number | any | queryPart)[];
}

export interface queryStrategy {
	queryCondition(query: queryPart): string;
	querySelect(table: string, fields?: string[], condition?: string): string;
	queryAdd(table: string, condition: string): string;
	queryUpdate(table: string, condition: string): string;
	queryDelete(table: string, condition: string): string;
}