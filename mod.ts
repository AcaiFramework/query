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

let standard!: typeof AbstractQuery;

export async function setDefault(name:string, config?: Record<string, ModelContent>) {
	switch (name) {
		case "sql":
			standard = SqlQuery;
		break;
		case "pg":
		case "postgres":
		case "postgresql":
			standard = PostgresQuery;
		break;
	}

	if (standard && config) {
		await standard.toggleSettings(config);
	}
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
export default () => standard;