// Interfaces
import GenericModelContent 	from "../../interfaces/ModelContent.ts";
import QueryPart 			from "../../interfaces/QueryPart.ts";
import QueryComparison 		from "../../interfaces/QueryComparison.ts";

export default interface AbstractQuery<T = GenericModelContent> {
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

	get (fields: string[]) : T[];
}