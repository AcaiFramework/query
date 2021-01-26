// Packages
import { Client } from "https://deno.land/x/postgres/mod.ts";

// Interfaces
import ModelContent 	from "../../../interfaces/ModelContent.ts";
import QueryPart 		from "../../../interfaces/QueryPart.ts";
import queryStrategy 	from "../../../interfaces/queryStrategy.ts";

// -------------------------------------------------
// Helpers
// -------------------------------------------------

const resolveValueType = (value: unknown) => {
	return typeof value === "number" ? value:`'${value}'`;
}

const resolveQueryPart = (queryBuild: QueryPart) => {
	const parts = queryBuild.logic.map((item) => {
		const subparts = (item as QueryPart).logic.map((subitem) => {
			if ((subitem as QueryPart).type) {
				return `(${resolveQueryPart(subitem as QueryPart)})`;
			}
			
			const arrayitem = subitem as [string, string, ModelContent];
			return `${arrayitem[0]} ${arrayitem[1]} ${resolveValueType(arrayitem[2])}`;
		});

		return subparts.join(` ${(item as QueryPart).type === "and" ? 'AND':"OR"} `);
	}) as string[];

	return parts.join(` ${queryBuild.type === "and" ? 'AND':"OR"} `);
}

// -------------------------------------------------
// Default export
// -------------------------------------------------

class PostgresStrategy implements queryStrategy {
	protected client: Client = {} as Client;

	public async close () {
		if (this.client && this.client.end) await this.client.end();
	}

	public async build (settings: Record<string, unknown>) {
		if (this.client && this.client.end) await this.client.end();

		this.client = await new Client(settings);
		await this.client.connect();
	}

	public async querySelect<T = Record<string, ModelContent>>(table: string, fields?: (keyof T)[], condition?: QueryPart) {
		const stringcondition 	= condition && resolveQueryPart(condition);
		const query 			= await this.client.query(`SELECT ${fields ? fields.join(", "):"*"} FROM ${table}${stringcondition ? ` WHERE ${stringcondition}`:''}`);
		return query.rows;
	}

	public async queryAdd<T = Record<string, ModelContent>>(table: string, fields: Partial<T>) {
		const query = await this.client.query(`INSERT INTO ${table}(${Object.keys(fields).join(", ")}) VALUES (${Object.values(fields).map(resolveValueType).join(", ")})`);

		return query.rowCount as number;
	}

	public async queryUpdate<T = Record<string, ModelContent>>(table: string, fields: Partial<T>, condition?: QueryPart) {
		const values 			= Object.keys(fields).map((key) => `${key} = ${resolveValueType(fields[key as keyof Partial<T>])}`);
		const stringcondition 	= condition && resolveQueryPart(condition);
		const query 			= await this.client.query(`UPDATE ${table} SET ${values}${stringcondition ? ` WHERE ${stringcondition}`:''}`);

		return query.rowCount as number;
	}

	public async queryDelete(table: string, condition?: QueryPart) {
		const stringcondition 	= condition && resolveQueryPart(condition);
		const query 			= await this.client.query(`DELETE FROM ${table}${stringcondition ? ` WHERE ${stringcondition}`:''}`);

		return query.rowCount as number;
	}
}

export default PostgresStrategy;