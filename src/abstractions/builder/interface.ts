// Interfaces
import GenericModelContent 	from "../../interfaces/ModelContent.ts";
import QueryPart 			from "../../interfaces/QueryPart.ts";
import QueryComparison 		from "../../interfaces/QueryComparison.ts";

export default interface AbstractQuery<T = Record<string,GenericModelContent>> {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery<T>;
	orWhere (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery<T>;

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	toString (): string;
	raw (): QueryPart;

	// -------------------------------------------------
	// get methods
	// -------------------------------------------------

	get (fields: string[]) : Promise<T[]>;
	insert (fields: T) : Promise<number | string>;
	update (fields: Partial<T>) : Promise<number | string>;
	delete () : Promise<number>;
}