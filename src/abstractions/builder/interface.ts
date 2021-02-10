// Interfaces
import GenericModelContent 	from "../../interfaces/ModelContent";
import QueryPart 			from "../../interfaces/QueryPart";
import QueryComparison 		from "../../interfaces/QueryComparison";

export default interface AbstractQuery {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery;
	orWhere (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery;

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	toString (): string;
	rawQueryObject (): QueryPart;

	// -------------------------------------------------
	// data methods
	// -------------------------------------------------

	raw (query: string): any;
	getColumns <ModelConfig = Record<string, string | number | boolean>> (fields?: (keyof ModelConfig | "*")[]) : Promise<Record<string, string | number>[]>;

	// -------------------------------------------------
	// crud methods
	// -------------------------------------------------

	get <ModelConfig = Record<string, string | number | boolean>> (fields?: (keyof ModelConfig | "*")[]) : Promise<ModelConfig[]>;
	insert <T = Record<string, string | number | boolean>>(fields: T) : Promise<number | string>;
	update <T = Record<string, string | number | boolean>>(fields: Partial<T>) : Promise<number | string>;
	delete () : Promise<number>;
}