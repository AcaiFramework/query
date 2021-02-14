// Packages
import * as Client from "mysql";

// Interfaces
import ModelContent 		from "../../../interfaces/ModelContent";
import QueryPart 			from "../../../interfaces/QueryPart";
import queryStrategy 		from "../../../interfaces/queryStrategy";
import ColumnOptions 		from "../../../interfaces/ColumnOptions";
import JoinClauseInterface 	from "../../../interfaces/JoinClause";

// Helpers
import { columnDeserialize, columnSerialize, joinClauseBuilder, queryResolver, resolveQueryPart, smartUpdate } from "./helpers";

class SqlStrategy implements queryStrategy {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected client: Client.Connection = {} as Client.Connection;

	// -------------------------------------------------
	// Client methods
	// -------------------------------------------------

	public async close () {
		if (this.client && this.client.end) await this.client.end();
	}

	public async build (settings: Record<string, unknown>) {
		await this.close();
		this.client = await Client.createConnection(settings);
		await this.client.connect();
	}

	// -------------------------------------------------
	// Data methods
	// -------------------------------------------------

	public async raw (query: string) {
		return await queryResolver(this.client, query);
	}

	public async sum (table: string, column: string, condition?: QueryPart) {
		const stringcondition = condition && resolveQueryPart(condition);
		
		return await queryResolver(
			this.client,
			`SELECT SUM(${column}) FROM ${table}${ stringcondition ? ` WHERE ${stringcondition[0]}`:'' }`,
		);
	}

	public async avg (table: string, column: string, condition?: QueryPart) {
		const stringcondition = condition && resolveQueryPart(condition);
		
		return await queryResolver(
			this.client,
			`SELECT AVG(${column}) FROM ${table}${ stringcondition ? ` WHERE ${stringcondition[0]}`:'' }`,
		);
	}

	public async count (table: string, column: string, condition?: QueryPart) {
		const stringcondition = condition && resolveQueryPart(condition);
		
		return Object.values((await queryResolver(
			this.client,
			`SELECT COUNT(${column}) FROM ${table}${ stringcondition ? ` WHERE ${stringcondition[0]}`:'' }`,
		))[0])[0] as number;
	}

	// -------------------------------------------------
	// Table methods
	// -------------------------------------------------

	public async getColumns (table: string) {
		const query = (await queryResolver(
			this.client,
			`SHOW COLUMNS FROM ${table}`,
		));

		const response = {} as Record<string, ColumnOptions>;
		
		query.forEach(column => {
			response[column.Field] = columnDeserialize(column);
		});

		return response;
	}

	public async createTable<T = Record<string, ModelContent>> (table: string, fields: Record<keyof T, ColumnOptions>) {
		const key = Object.keys(fields).find(k => fields[k].primary);

		await queryResolver(
			this.client,
			`CREATE TABLE ${table} (${
				Object.keys(fields).map(key => columnSerialize(key, fields[key])).join(", ")
			}${
				key ? `,PRIMARY KEY (${key})`:""
			})`,
		);

		return true;
	}

	public async alterTable<T = Record<string, ModelContent>> (table: string, fields: Record<keyof T, ColumnOptions>) {
		const currentFields = await this.getColumns(table);
		const query = await smartUpdate(table, currentFields, fields);
		await queryResolver(this.client, query);

		return true;
	}

	public async dropTable (table: string) {
		await queryResolver(
			this.client,
			`DROP TABLE IF EXISTS ${table}`,
		);

		return true;
	}

	// -------------------------------------------------
	// CRUD methods
	// -------------------------------------------------

	public async querySelect<T = Record<string, ModelContent>>(table: string, fields?: (keyof T)[], condition?: QueryPart, limit?: number, offset?: number, orderBy?: {order?: "ASC" | "DESC", by: string}, joinClause?: JoinClauseInterface, groupBy?: string) {
		const stringcondition 	= condition && resolveQueryPart(condition);

		return await queryResolver(
			this.client,
			`SELECT ${
				(fields && fields.length > 0) ? fields.join(", "):"*"
			} FROM ${
				table
			}${
				stringcondition ? ` WHERE ${stringcondition[0]}`:''
			}${
				limit ? ` LIMIT ${limit}`:""
			}${ offset ? ` OFFSET ${offset}`:""}${
				joinClause ? joinClauseBuilder(joinClause):""
			}${
				groupBy ? ` GROUP BY ${groupBy}`:""
			}${
				orderBy ? ` ORDER BY ${orderBy.by} ${orderBy.order || "ASC"}`:""
			}`,
			stringcondition && stringcondition[1]
		);
	}

	public async queryAdd<T = Record<string, ModelContent>>(table: string, fields: Partial<T>) {		
		const response = await queryResolver(
			this.client,
			`INSERT INTO ${table}(${Object.keys(fields).join(", ")}) VALUES (${Object.values(fields).map(() => "?").join(", ")})`,
			Object.values(fields),
		);

		const columns = await this.getColumns(table);
		const primaryKey = Object.keys(columns).find(i => columns[i].primary);

		return {...(await this.querySelect(table, undefined, {
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						[primaryKey, '=', response.insertId],
					],
				},
			],
		}))[0]};
	}

	public async queryUpdate<T = Record<string, ModelContent>>(table: string, fields: Partial<T>, condition?: QueryPart) {
		const values 			= Object.keys(fields).map((key) => `${key} = ?`);
		const stringcondition 	= condition && resolveQueryPart(condition);
		const query				= await queryResolver(
			this.client,
			`UPDATE ${table} SET ${values}${stringcondition ? ` WHERE ${stringcondition[0]}`:''}`,
			[...Object.values(fields), ...((stringcondition && stringcondition[1]) || [])],
		);

		return query.affectedRows;
	}

	public async queryDelete(table: string, condition?: QueryPart) {
		const stringcondition 	= condition && resolveQueryPart(condition);
		const query				= await queryResolver(
			this.client,
			`DELETE FROM ${table}${stringcondition ? ` WHERE ${stringcondition[0]}`:''}`,
			(stringcondition && stringcondition[1]),
		);

		return query as any;
	}
}

export default SqlStrategy;