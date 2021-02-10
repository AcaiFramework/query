// Packages
import * as Client from "mysql";

// Interfaces
import ModelContent 	from "../../../interfaces/ModelContent";
import QueryPart 		from "../../../interfaces/QueryPart";
import queryStrategy 	from "../../../interfaces/queryStrategy";
import ColumnOptions 	from "../../../interfaces/ColumnOptions";

// Helpers
import { columnSerialize, queryResolver, resolveQueryPart } from "./helpers";

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
	// Main methods
	// -------------------------------------------------

	public async raw (query: string) {
		return await queryResolver(this.client, query);
	}

	// -------------------------------------------------
	// Table methods
	// -------------------------------------------------

	public async getColumns<T = Record<string, ModelContent>> (table: string, fields?: (keyof T)[]) {
		const response = (await queryResolver(
			this.client,
			`SHOW COLUMNS FROM ${table}`,
		));

		if (fields)
			return response.filter(i => fields.find(x => x === i.Field));
		else
			return response;
	}

	public async createTable<T = Record<string, ModelContent>> (table: string, fields: Record<keyof T, ColumnOptions>) {
		await queryResolver(
			this.client,
			`CREATE TABLE ${table} (${
				Object.keys(fields).map(key => {
					return columnSerialize(key, fields[key]);
				}).join(", ")
			})`,
		);

		return true;
	}

	public async alterTable<T = Record<string, ModelContent>> (table: string, fields: Record<keyof T, ColumnOptions>) {
		await queryResolver(
			this.client,
			`ALTER TABLE IF EXISTS ${table} (${
				Object.keys(fields).map(key => {
					return columnSerialize(key, fields[key]);
				}).join(", ")
			})`,
		);

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

	public async querySelect<T = Record<string, ModelContent>>(table: string, fields?: (keyof T)[], condition?: QueryPart) {
		const stringcondition 	= condition && resolveQueryPart(condition);

		return await queryResolver(
			this.client,
			`SELECT ${fields ? fields.join(", "):"*"} FROM ${table}${stringcondition ? ` WHERE ${stringcondition[0]}`:''}`,
			stringcondition && stringcondition[1]
		);
	}

	public async queryAdd<T = Record<string, ModelContent>>(table: string, fields: Partial<T>) {		
		const response = await queryResolver(
			this.client,
			`INSERT INTO ${table}(${Object.keys(fields).join(", ")}) VALUES (${Object.values(fields).map(() => "?").join(", ")})`,
			Object.values(fields),
		);

		const primaryKey = (await this.getColumns(table)).find(i => i.Key === "PRI");

		return {...(await this.querySelect(table, undefined, {
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						[primaryKey.Field, '=', response.insertId],
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