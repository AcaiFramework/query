// Interfaces
import queryInterface 							from "./interface";
import QueryPart 								from "../../interfaces/QueryPart";
import QueryStrategy 							from "../../interfaces/queryStrategy";
import GenericModelContent, { ModelContent } 	from "../../interfaces/ModelContent";
import QueryComparison 							from "../../interfaces/QueryComparison";

export default abstract class Query implements queryInterface {

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

	public where = (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): Query => {
		const subqueries = this.buildQueryPart(arg1, arg2, arg3);
		this.push("and", subqueries);

		// return self for concatenation
		return this;
	}

	public orWhere = (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): Query => {
		const subqueries = this.buildQueryPart(arg1, arg2, arg3);
		this.push("or", subqueries);

		// return self for concatenation
		return this;
	}

	public raw = async (query: string) => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.raw(query);
	}

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	public rawQueryObject = () => {
		return this.queryBuild;
	}

	// -------------------------------------------------
	// table methods
	// -------------------------------------------------
	
	public getColumns = async <ModelConfig = Record<string, string | number | boolean>>(fields: (keyof ModelConfig | "*")[] = ['*']) => {
		const result = await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.getColumns<ModelConfig>(this.tableName, fields);
		return result.map(i => ({...i}));
	}

	// -------------------------------------------------
	// get methods
	// -------------------------------------------------

	public first = async <ModelConfig = Record<string, string | number | boolean>>(fields: (keyof ModelConfig | "*")[] = ['*']) : Promise<ModelConfig[]> => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.querySelect<ModelConfig>(this.tableName, fields, this.queryBuild)[0];
	}

	public get = async <ModelConfig = Record<string, string | number | boolean>>(fields: (keyof ModelConfig | "*")[] = ['*']) : Promise<ModelConfig[]> => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.querySelect<ModelConfig>(this.tableName, fields, this.queryBuild);
	}

	// -------------------------------------------------
	// manipulation methods
	// -------------------------------------------------

	public insert = async <ModelConfig = Record<string, string | number | boolean>>(fields: ModelConfig) => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.queryAdd<ModelConfig>(this.tableName, fields);
	}

	public update = async <ModelConfig = Record<string, string | number | boolean>>(fields: ModelConfig) => {
		return await (this.constructor as unknown as {adapter: QueryStrategy}).adapter.queryUpdate<ModelConfig>(this.tableName, fields, this.queryBuild);
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

	private buildQueryPart = <ModelConfig = Record<string, string | number | boolean>>(arg1: keyof ModelConfig | [keyof ModelConfig, QueryComparison | GenericModelContent, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): [string, string, ModelContent][] => {
		if (typeof arg1 === "string") {
			if (arg3) {
				return [[arg1, arg2 as string, arg3]];
			}
			else {
				return [[arg1, '=', arg2 as string]];
			}
		}
		
		return (arg1 as unknown as any).reduce((prev: [keyof ModelConfig, QueryComparison, ModelContent][], item: [keyof ModelConfig, QueryComparison, ModelContent]) => {
			const items = this.buildQueryPart(...item);

			items.forEach((v) => prev.push(v as unknown as any));

			return prev;
		}, []);
	}
}