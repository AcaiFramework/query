
// Interfaces
import QueryPart 		from "./QueryPart";
import ModelContent 	from "./ModelContent";
import ColumnOptions 	from "./ColumnOptions";

export default interface QueryStrategy {
	// adapter
	close (): void;
	build (settings: Record<string, ModelContent>): Promise<void>;

	// general
	raw	(query: string) : any;

	// table
	createTable		<T = Record<string, ModelContent>>	(table: string, fields: Record<keyof T, ColumnOptions>)	: Promise<boolean>;
	getColumns		<T = Record<string, ModelContent>>	(table: string, fields?: (keyof T | "*")[])	: Promise<Record<string, string | number>[]>;
	alterTable		<T = Record<string, ModelContent>>	(table: string, fields: Record<keyof T, ColumnOptions>)	: Promise<boolean>;
	dropTable											(table: string)	: Promise<boolean>;

	// query
	querySelect		<T = Record<string, ModelContent>>	(table: string, fields?: (keyof T | "*")[], condition?: QueryPart)	: Promise<T[]>;
	queryAdd		<T = Record<string, ModelContent>>	(table: string, fields: T)											: Promise<string | number>;
	queryUpdate		<T = Record<string, ModelContent>>	(table: string, fields: Partial<T>, condition: QueryPart)			: Promise<string | number>;
	queryDelete											(table: string, condition: QueryPart)								: Promise<number>;
}