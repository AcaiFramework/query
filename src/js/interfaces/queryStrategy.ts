// Interfaces
import queryBuildPart from "./queryBuildPart";

export default interface QueryStrategy {
	queryCondition(query: queryBuildPart): string;
	querySelect<T = object>(table: string, fields?: string[], condition?: string): T[];
	queryAdd<T = object>(table: string, fields: T): T;
	queryUpdate<T = object>(table: string, fields: T, condition: string): T;
	queryDelete(table: string, condition: string): boolean;
}