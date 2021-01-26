
// Interfaces
import QueryPart 	from "./QueryPart.ts";
import ModelContent from "./ModelContent.ts";

export default interface QueryStrategy {
	// adapter
	close (): void;
	build (settings: Record<string, ModelContent>): Promise<void>;

	// query
	querySelect		<T = Record<string, ModelContent>>	(table: string, fields?: string[], condition?: QueryPart)	: Promise<T[]>;
	queryAdd		<T = Record<string, ModelContent>>	(table: string, fields: T)									: Promise<string | number>;
	queryUpdate		<T = Record<string, ModelContent>>	(table: string, fields: Partial<T>, condition: QueryPart)	: Promise<string | number>;
	queryDelete											(table: string, condition: QueryPart)						: Promise<number>;
}