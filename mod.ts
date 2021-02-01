// -------------------------------------------------
// Imports
// -------------------------------------------------

import AbstractQuery 	from "./src/abstractions/builder/index.ts";
import SqlQuery 		from './src/classes/queryStrategies/sql/index.ts';
import PostgresQuery 	from './src/classes/queryStrategies/postgres/index.ts';

// interfaces
import ModelContent from "./src/interfaces/ModelContent.ts";

// -------------------------------------------------
// Configurations
// -------------------------------------------------

const queries = {} as Record<string, typeof AbstractQuery>;

export async function addQuery (name: string, type: string, config?: Record<string, ModelContent>) {
	switch (type) {
		case "sql":
		case "mysql":
		case "mysqli":
			queries[name] = SqlQuery;
		break;

		case "pg":
		case "postgres":
		case "postgresql":
			queries[name] = PostgresQuery;
		break;
	}

	if (config) {
		await queries[name].toggleSettings(config);
	}
}

export async function setDefault(name:string, config?: Record<string, ModelContent>) {
	await addQuery("default", name, config);
}

// -------------------------------------------------
// Exports
// -------------------------------------------------

// Base abstract query
export {default as AbstractQuery} from './src/abstractions/builder/index.ts';

// Implementations
export {default as SqlQuery} 		from './src/classes/queryStrategies/sql/index.ts';
export {default as PostgresQuery} 	from './src/classes/queryStrategies/postgres/index.ts';

// default query
export default (key?: string) => queries[key || "default"];