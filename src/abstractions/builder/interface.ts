// Interfaces
import GenericModelContent 	from "../../interfaces/ModelContent.ts";
import QueryPart 			from "../../interfaces/QueryPart.ts";
import QueryComparison 		from "../../interfaces/QueryComparison.ts";

export default interface AbstractQuery {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where <T = Record<string, string | number | boolean>> (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery<T>;
	orWhere <T = Record<string, string | number | boolean>> (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery<T>;

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	toString (): string;
	raw (): QueryPart;

	// -------------------------------------------------
	// get methods
	// -------------------------------------------------

	get <T = Record<string, string | number | boolean>>(fields: string[]) : Promise<T[]>;
	insert <T = Record<string, string | number | boolean>>(fields: T) : Promise<number | string>;
	update <T = Record<string, string | number | boolean>>(fields: Partial<T>) : Promise<number | string>;
	delete () : Promise<number>;
}