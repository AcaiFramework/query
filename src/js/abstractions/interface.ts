// Interfaces
import queryBuildPart from "../interfaces/queryBuildPart";

export default interface AbstractQuery<T = object> {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where (arg1: string | [string, any, any?] | [string, any, any?][], arg2?: any, arg3?: any): AbstractQuery;
	orWhere (arg1: string | [string, any, any?] | [string, any, any?][], arg2?: any, arg3?: any): AbstractQuery;

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