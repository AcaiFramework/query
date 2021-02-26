// Interfaces
import GenericModelContent, { ModelContent } 	from "../../../interfaces/ModelContent";
import QueryComparison 							from "../../../interfaces/QueryComparison";
import PaginatedResponse 						from "../../../interfaces/PaginatedResponse";

// Parts
import JoinClass from "./join";

export default abstract class QueryClass<T = Record<string, ModelContent>> extends JoinClass<T> {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	public table = <ModelConfig = T> (table: string) => {
		this.tableName = table;

		return this as QueryClass<ModelConfig>;
	}

	public where = <ModelConfig = T> (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent) => {
		const subqueries = this.buildQueryPart(arg1, arg2, arg3);
		this.push("and", subqueries);

		// return self for concatenation
		return this as QueryClass<ModelConfig>;
	}

	public orWhere = <ModelConfig = T> (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent) => {
		const subqueries = this.buildQueryPart(arg1, arg2, arg3);
		this.push("or", subqueries);

		// return self for concatenation
		return this as QueryClass<ModelConfig>;
	}

	public orderBy = <ModelConfig = T> (by: string, order?: "ASC" | "DESC") => {
		this.orderByQuery = {order, by};

		return this as QueryClass<ModelConfig>;
	}

	public limit = <ModelConfig = T> (quantity: number, offset?: number) => {
		this.limitQuantity 				= quantity;
		if (offset) this.offsetQuantity = offset;

		return this as QueryClass<ModelConfig>;
	}

	public groupBy = <ModelConfig = T> (column: string) => {
		this.groupByColumn 	= column;

		return this as QueryClass<ModelConfig>;
	}

	public fields  = <ModelConfig = T> (fields: (keyof ModelConfig | "*")[]) => {
		this.fieldsList = fields as string[];

		return this as QueryClass<ModelConfig>;
	}

	public parseResult = <ModelConfig = T> (cb: (result: ModelConfig | ModelConfig[]) => unknown) => {
		this.parseResultCache = cb;

		return this as QueryClass<ModelConfig>;
	}
	// -------------------------------------------------
	// get methods
	// -------------------------------------------------

	public first = async <ModelConfig = T>(fields: (keyof ModelConfig | "*")[] = ['*']) : Promise<ModelConfig | undefined> => {
		const result = (await this.limit(1).get<ModelConfig>())[0];

		return result;
	}

	public last = async <ModelConfig = T>(fields: (keyof ModelConfig | "*")[] = ['*']) : Promise<ModelConfig | undefined> => {
		const result = await this.getAdapter().querySelect<ModelConfig>(
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

		return this.parseResultCache ? this.parseResultCache(result):result;
	}

	public get = async <ModelConfig = T>(fields?: (keyof ModelConfig | "*")[]) : Promise<ModelConfig[]> => {
		const result = await this.getAdapter().querySelect<ModelConfig>(
			this.tableName,
			fields || this.fieldsList as (keyof ModelConfig | "*")[],
			this.queryBuild.logic.length > 0 ? this.queryBuild:undefined,
			this.limitQuantity,
			this.offsetQuantity,
			this.orderByQuery,
			this.joinList,
		);

		return this.parseResultCache ? (this.parseResultCache(result) as ModelConfig[]):result;
	}

	public paginate = async <ModelConfig = T>(page?: number | string, perPage: number | string = 25) : Promise<PaginatedResponse<ModelConfig>> => {
		const total = await this.count();
		const npp 	= parseInt(perPage as string);
		const np 	= parseInt(page as string);
		
		const entries = await this.getAdapter().querySelect<ModelConfig>(
			this.tableName,
			this.fieldsList as (keyof ModelConfig | "*")[],
			this.queryBuild.logic.length > 0 ? this.queryBuild:undefined,
			npp,
			((np || 1) - 1) * npp,
			this.orderByQuery,
			this.joinList,
		);

		return {
			data: ((this.parseResultCache ? this.parseResultCache(entries):entries.map(i => ({...i}))) as ModelConfig[]),

			page: np || 1,
			perPage: npp,

			totalItems: total,
			totalPages: Math.ceil(total / npp),
		};
	}

	// -------------------------------------------------
	// manipulation methods
	// -------------------------------------------------

	public insert = async <ModelConfig = T>(fields: ModelConfig) => {
		return await this.getAdapter().queryAdd<ModelConfig>(this.tableName, fields);
	}

	public update = async <ModelConfig = T>(fields: ModelConfig) => {
		return await this.getAdapter().queryUpdate<ModelConfig>(this.tableName, fields, this.queryBuild);
	}

	public delete = async () => {
		return await this.getAdapter().queryDelete(this.tableName, this.queryBuild);
	}
}