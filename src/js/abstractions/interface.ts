// Interfaces
import queryBuildPart from "../interfaces/queryBuildPart";

export default interface query<T = Object> {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where (arg1: string | [string, any, any?] | [string, any, any?][], arg2?: any, arg3?: any): query;
	orWhere (arg1: string | [string, any, any?] | [string, any, any?][], arg2?: any, arg3?: any): query;

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	toString (): string;
	raw (): queryBuildPart;

	// -------------------------------------------------
	// get methods
	// -------------------------------------------------

	get (fields: string[]) : T[];
}