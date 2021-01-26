// deno-lint-ignore-file

// Interfaces
import queryInterface 							from "./interface.ts";
import QueryPart 								from "../../interfaces/QueryPart.ts";
import QueryStrategy 							from "../../interfaces/queryStrategy.ts";
import GenericModelContent, { ModelContent } 	from "../../interfaces/ModelContent.ts";
import QueryComparison 							from "../../interfaces/QueryComparison.ts";

export default abstract class Query<T = Record<string, string | number | boolean>> implements queryInterface<T> {

	// -------------------------------------------------
	// properties
	// -------------------------------------------------

	protected tableName 			= '';
	protected queryBuild: QueryPart = {type:"or", logic:[]};

	protected static adapter: QueryStrategy;
	protected static settings: Record<string, ModelContent>;

	// -------------------------------------------------
	// static methods
	// -------------------------------------------------

	public static async toggleAdapter (adapter: QueryStrategy, settings?: Record<string, ModelContent>) {
		this.adapter = new (adapter as any)();
		if (settings) this.settings = settings;

		await this.adapter.build(this.settings);
	}

	public static async toggleSettings (settings: Record<string, ModelContent>) {
		this.settings = settings;

		await this.adapter.build(this.settings);
	}

	public static async close () {
		await this.adapter.close();
	}
	
	public static table (table: string) {
		const query = new (this as any)();
		
		query.table(table);
		
		return query as queryInterface;
	}

	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	public table = (table: string) => {
		this.tableName = table;

		return this;
	}

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

	// -------------------------------------------------
	// get methods
	// -------------------------------------------------
	
	public get = async (fields: string[] = ['*']) : Promise<T[]> => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.querySelect<T>(this.tableName, fields, this.queryBuild);
	}

	// -------------------------------------------------
	// manipulation methods
	// -------------------------------------------------

	public insert = async (fields: T) => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.queryAdd<T>(this.tableName, fields);
	}

	public update = async (fields: T) => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.queryUpdate<T>(this.tableName, fields, this.queryBuild);
	}

	public delete = async () => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.queryDelete(this.tableName, this.queryBuild);
	}

	// -------------------------------------------------
	// helper methods
	// -------------------------------------------------

	private push (type: "and" | "or", subqueries: unknown[]) {
		if (this.queryBuild.logic.length !== 0 && (this.queryBuild.logic[this.queryBuild.logic.length - 1] as QueryPart).type === type) {
			for (let i = 0; i < subqueries.length; i ++) {
				(this.queryBuild.logic[this.queryBuild.logic.length - 1] as QueryPart).logic.push(subqueries[i]);
			}
		}
		else {
			this.queryBuild.logic.push({
				type,
				logic: subqueries,
			})
		}
	}

	private buildQueryPart = (arg1: string | [string, QueryComparison | GenericModelContent, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): [string, string, ModelContent][] => {
		if (typeof arg1 === "string") {
			if (arg3) {
				return [[arg1, arg2 as string, arg3]];
			}
			else {
				return [[arg1, '=', arg2 as string]];
			}
		}
		
		return arg1.reduce((prev: [string, string, ModelContent][], item) => {
			const items = this.buildQueryPart(...item);

			items.forEach((v) => prev.push(v));

			return prev;
		}, []);
	}
}