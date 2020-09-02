// Interfaces
import queryInterface from "./interface";
import queryBuildPart from "../interfaces/queryBuildPart";
import queryStrategy from "../interfaces/queryStrategy";

export default abstract class query<T = Object> implements queryInterface<T> {

	// -------------------------------------------------
	// properties
	// -------------------------------------------------

	protected tableName: string = '';
	protected queryBuild: queryBuildPart = {type:"or", logic:[]};
	protected abstract queryType:queryStrategy;

	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	public where = (arg1: string | [string, any, any?] | [string, any, any?][], arg2?: any, arg3?: any): query => {
		const subqueries = this.buildQueryPart(arg1, arg2, arg3);
		this.push("and", subqueries);

		// return self for concatenation
		return this;
	}

	public orWhere = (arg1: string | [string, any, any?] | [string, any, any?][], arg2?: any, arg3?: any): query => {
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
	
	public get = () : T[] => {
		return [];
	}
	
	public find = (primaryKey : number | string) : any => {
		return primaryKey;
	}

	// -------------------------------------------------
	// helper methods
	// -------------------------------------------------

	private push (type: "and" | "or", subqueries: any[]) {
		if (this.queryBuild.logic.length !== 0 && this.queryBuild.logic[this.queryBuild.logic.length - 1].type === type) {
			for (let i = 0; i < subqueries.length; i ++) {
				this.queryBuild.logic[this.queryBuild.logic.length - 1].logic.push(subqueries[i]);
			}
		}
		else {
			this.queryBuild.logic.push({
				type,
				logic: subqueries,
			})
		}
	}

	private buildQueryPart = (arg1: string | [string, any, any?][], arg2?: any, arg3?: any): any[] => {
		if (typeof arg1 === "string") {
			if (arg3) {
				return [[arg1, arg2, arg3]];
			}
			else {
				return [[arg1, '=', arg2]];
			}
		}
		
		return arg1.reduce((prev: any, item) => {
			const items = this.buildQueryPart(...item);

			items.forEach((v) => prev.push(v));

			return prev;
		}, []);
	}
}