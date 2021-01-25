// Interfaces
import queryInterface 		from "./interface.ts";
import QueryPart 			from "../../interfaces/QueryPart.ts";
import queryStrategy 		from "../../interfaces/queryStrategy.ts";
import GenericModelContent 	from "../../interfaces/ModelContent.ts";
import QueryComparison 		from "../../interfaces/QueryComparison.ts";

export default abstract class Query<T = Record<string, string | number | boolean>> implements queryInterface<T> {

	// -------------------------------------------------
	// properties
	// -------------------------------------------------

	protected tableName 			= '';
	protected queryBuild: QueryPart = {type:"or", logic:[]};
	protected abstract queryType:queryStrategy;

	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	public where = (arg1: string | [string, QueryComparison | GenericModelContent, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): Query<T> => {
		const subqueries = this.buildQueryPart(arg1, arg2, arg3);
		this.push("and", subqueries);

		// return self for concatenation
		return this;
	}

	public orWhere = (arg1: string | [string, QueryComparison | GenericModelContent, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): Query<T> => {
		const subqueries = this.buildQueryPart(arg1, arg2, arg3);
		this.push("or", subqueries);

		// return self for concatenation
		return this;
	}

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	public raw = () => {
		return this.queryBuild;
	}

	public toString = (): string => {
		return this.queryType.queryCondition(this.queryBuild);
	}

	// -------------------------------------------------
	// get methods
	// -------------------------------------------------
	
	public get = (fields: string[] = ['*']) : T[] => {
		return this.queryType.querySelect<T>(this.tableName, fields, this.queryType.queryCondition(this.queryBuild));
	}

	// -------------------------------------------------
	// manipulation methods
	// -------------------------------------------------

	public store = (fields: T) => {
		return this.queryType.queryAdd<T>(this.tableName, fields);
	}

	public update = (fields: T) => {
		return this.queryType.queryUpdate<T>(this.tableName, fields, this.queryType.queryCondition(this.queryBuild));
	}

	public delete = () => {
		return this.queryType.queryDelete(this.tableName, this.queryType.queryCondition(this.queryBuild));
	}

	// -------------------------------------------------
	// helper methods
	// -------------------------------------------------

	private push (type: "and" | "or", subqueries: any[]) {
		if (this.queryBuild.logic.length !== 0 && (this.queryBuild.logic as any)[this.queryBuild.logic.length - 1].type === type) {
			for (let i = 0; i < subqueries.length; i ++) {
				(this.queryBuild.logic as any)[this.queryBuild.logic.length - 1].logic.push(subqueries[i]);
			}
		}
		else {
			this.queryBuild.logic.push({
				type,
				logic: subqueries,
			})
		}
	}

	private buildQueryPart = (arg1: string | [string, QueryComparison | GenericModelContent, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent) => {
		if (typeof arg1 === "string") {
			if (arg3) {
				return [[arg1, arg2, arg3]];
			}
			else {
				return [[arg1, '=', arg2]];
			}
		}
		
		return arg1.reduce((prev: any[], item) => {
			const items = this.buildQueryPart(...item);

			items.forEach((v) => prev.push(v));

			return prev;
		}, []);
	}
}