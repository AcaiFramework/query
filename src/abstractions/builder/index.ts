// Interfaces
import queryInterface 							from "./interface";
import QueryPart 								from "../../interfaces/QueryPart";
import QueryStrategy 							from "../../interfaces/queryStrategy";
import GenericModelContent, { ModelContent } 	from "../../interfaces/ModelContent";
import QueryComparison 							from "../../interfaces/QueryComparison";
import PaginatedResponse 						from "../../interfaces/PaginatedResponse";
import JoinClauseInterface 						from "../../interfaces/JoinClause";

export default abstract class Query implements queryInterface {

	// -------------------------------------------------
	// properties
	// -------------------------------------------------

	protected tableName 			= '';
	protected queryBuild	 : QueryPart = {type:"or", logic:[]};
	protected orderByQuery  ?: {order?: "ASC" | "DESC", by: string};
	protected offsetQuantity?: number;
	protected limitQuantity ?: number;
	protected fieldsList	?: string[] = [];
	protected joinList		?: JoinClauseInterface;
	protected groupByColumn ?: string;

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

	public orderBy = (by: string, order?: "ASC" | "DESC") => {
		this.orderByQuery = {order, by};

		return this;
	}

	public offset = (quantity: number, limit?: number) => {
		this.offsetQuantity 			= quantity;
		if (limit) this.limitQuantity 	= limit;

		return this;
	}

	public limit = (quantity: number) => {
		this.limitQuantity 	= quantity;

		return this;
	}

	public groupBy = (column: string) => {
		this.groupByColumn 	= column;

		return this;
	}

	public fields = <ModelConfig = Record<string, ModelContent>>(fields: (keyof ModelConfig | "*")[]) => {
		this.fieldsList = fields as string[];

		return this;
	}

	// -------------------------------------------------
	// join methods
	// -------------------------------------------------

	public joinType (type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinList = {
			type,
			table,
			firstColumn,
			secondColumn: secondColumn || secondColumnOrOperator,
			operator: secondColumn ? secondColumnOrOperator : "=",
		};

		return this;
	}

	public join (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("outer", table, firstColumn, secondColumnOrOperator, secondColumn);

		return this;
	}

	public leftJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("left", table, firstColumn, secondColumnOrOperator, secondColumn);

		return this;
	}

	public rightJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("right", table, firstColumn, secondColumnOrOperator, secondColumn);

		return this;
	}

	public innerJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("inner", table, firstColumn, secondColumnOrOperator, secondColumn);

		return this;
	}

	// -------------------------------------------------
	// data methods
	// -------------------------------------------------

	public raw = async (query: string) => {
		return await this.getAdapter().raw(query);
	}

	public count = async (column?: string) => {
		return await this.getAdapter().count(this.tableName, column || "*");
	}

	public avg = async (column: string) => {
		return await this.getAdapter().avg(this.tableName, column);
	}

	public sum = async (column: string) => {
		return await this.getAdapter().sum(this.tableName, column);
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
	
	public getColumns = async <ModelConfig = Record<string, ModelContent>>(fields: (keyof ModelConfig | "*")[] = ['*']) => {
		const result = await this.getAdapter().getColumns<ModelConfig>(this.tableName, fields);
		return result.map(i => ({...i}));
	}

	// -------------------------------------------------
	// get methods
	// -------------------------------------------------

	public first = async <ModelConfig = Record<string, ModelContent>>(fields: (keyof ModelConfig | "*")[] = ['*']) : Promise<ModelConfig> => {
		return await this.getAdapter().querySelect<ModelConfig>(
			this.tableName,
			fields,
			this.queryBuild.logic.length > 0 ? this.queryBuild:undefined,
			1,
			0,
			{
				order: "ASC",
				by: this.orderByQuery?.by || "id",
			},
			this.joinList,
		)[0];
	}

	public last = async <ModelConfig = Record<string, ModelContent>>(fields: (keyof ModelConfig | "*")[] = ['*']) : Promise<ModelConfig> => {
		return await this.getAdapter().querySelect<ModelConfig>(
			this.tableName,
			fields,
			this.queryBuild.logic.length > 0 ? this.queryBuild:undefined,
			1,
			0,
			{
				order: "DESC",
				by: this.orderByQuery?.by || "id",
			},
			this.joinList,
		)[0];
	}

	public get = async <ModelConfig = Record<string, ModelContent>>(fields?: (keyof ModelConfig | "*")[]) : Promise<ModelConfig[]> => {
		return await this.getAdapter().querySelect<ModelConfig>(
			this.tableName,
			fields || this.fieldsList as (keyof ModelConfig | "*")[],
			this.queryBuild.logic.length > 0 ? this.queryBuild:undefined,
			this.limitQuantity,
			this.offsetQuantity,
			this.orderByQuery,
			this.joinList,
		);
	}

	public paginate = async <ModelConfig = Record<string, ModelContent>>(page?: number, perPage: number = 25) : Promise<PaginatedResponse<ModelConfig>> => {
		const total = await this.getAdapter().count(this.tableName, "*", this.queryBuild.logic.length > 0 ? this.queryBuild:undefined);
		
		const entries = await this.getAdapter().querySelect<ModelConfig>(
			this.tableName,
			this.fieldsList as (keyof ModelConfig | "*")[],
			this.queryBuild.logic.length > 0 ? this.queryBuild:undefined,
			perPage,
			((page || 1) - 1) * perPage,
			this.orderByQuery,
			this.joinList,
		);

		return {
			data: entries.map(i => ({...i})),

			page: page || 1,
			perPage,

			totalItems: total,
			totalPages: Math.ceil(total / perPage),
		};
	}

	// -------------------------------------------------
	// manipulation methods
	// -------------------------------------------------

	public insert = async <ModelConfig = Record<string, ModelContent>>(fields: ModelConfig) => {
		return await this.getAdapter().queryAdd<ModelConfig>(this.tableName, fields);
	}

	public update = async <ModelConfig = Record<string, ModelContent>>(fields: ModelConfig) => {
		return await this.getAdapter().queryUpdate<ModelConfig>(this.tableName, fields, this.queryBuild);
	}

	public delete = async () => {
		return await this.getAdapter().queryDelete(this.tableName, this.queryBuild);
	}

	// -------------------------------------------------
	// helper methods
	// -------------------------------------------------

	private getAdapter () {
		return (this.constructor as unknown as {adapter: QueryStrategy}).adapter;
	}

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