// Interfaces
import QueryPart 	from "./QueryPart.ts";
import ModelContent from "./ModelContent.ts";

export default interface QueryStrategy {
	queryCondition										(query: QueryPart)										: string;
	querySelect		<T = Record<string, ModelContent>>	(table: string, fields?: string[], condition?: string)	: T[];
	queryAdd		<T = Record<string, ModelContent>>	(table: string, fields: T)								: T;
	queryUpdate		<T = Record<string, ModelContent>>	(table: string, fields: T, condition: string)			: T;
	queryDelete											(table: string, condition: string)						: boolean;
}