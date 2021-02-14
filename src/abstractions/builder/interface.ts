// Interfaces
import GenericModelContent, { ModelContent } 	from "../../interfaces/ModelContent";
import QueryPart 								from "../../interfaces/QueryPart";
import QueryComparison 							from "../../interfaces/QueryComparison";
import PaginatedResponse 						from "../../interfaces/PaginatedResponse";
import ColumnOptions from "../../interfaces/ColumnOptions";

export default interface AbstractQuery {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery;
	orWhere (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery;
	limit (value: number): AbstractQuery;
	offset (value: number, limit?: number): AbstractQuery;
	orderBy (by: string, order?: "ASC" | "DESC"): AbstractQuery;
	groupBy (column: string): AbstractQuery;
	fields <ModelConfig = Record<string, ModelContent>>(fields: (keyof ModelConfig | "*")[]): AbstractQuery;

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	toString (): string;
	rawQueryObject (): QueryPart;

	// -------------------------------------------------
	// table methods
	// -------------------------------------------------

	getColumns <ModelConfig = Record<string, ModelContent>> (fields?: (keyof ModelConfig | "*")[]) : Promise<Record<string, ColumnOptions>>;

	// -------------------------------------------------
	// join methods
	// -------------------------------------------------

	join (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;
	leftJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;
	rightJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;
	innerJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;
	joinType (type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;

	// -------------------------------------------------
	// data methods
	// -------------------------------------------------

	raw (query: string): any;
	avg (columnName: string): Promise<number>;
	sum (columnName: string): Promise<number>;
	count (columnName?: string): Promise<number>;

	// -------------------------------------------------
	// retrieve methods
	// -------------------------------------------------

	get <ModelConfig = Record<string, ModelContent>> (fields?: (keyof ModelConfig | "*")[]) : Promise<ModelConfig[]>;
	first <ModelConfig = Record<string, ModelContent>> (fields?: (keyof ModelConfig | "*")[]) : Promise<ModelConfig>;
	last <ModelConfig = Record<string, ModelContent>> (fields?: (keyof ModelConfig | "*")[]) : Promise<ModelConfig>;
	paginate <ModelConfig = Record<string, ModelContent>> (page?: number, perPage?: number) : Promise<PaginatedResponse<ModelConfig[]>>;

	// -------------------------------------------------
	// crud methods
	// -------------------------------------------------
	insert <T = Record<string, ModelContent>>(fields: T) : Promise<number | string>;
	update <T = Record<string, ModelContent>>(fields: Partial<T>) : Promise<number | string>;
	delete () : Promise<number>;
}