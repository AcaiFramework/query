// Interfaces
import queryBuildPart from "./queryBuildPart";

export default interface queryStrategy {
	queryCondition(query: queryBuildPart): string;
	querySelect<T = Object>(table: string, fields?: string[], condition?: string): T[];
	queryAdd<T = Object>(table: string, condition: string): T;
	queryUpdate<T = Object>(table: string, condition: string): T;
	queryDelete(table: string, condition: string): boolean;
}