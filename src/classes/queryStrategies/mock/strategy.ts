// Interfaces
import queryBuildPart 	from "../../../interfaces/QueryPart.ts";
import ModelContent 	from "../../../interfaces/ModelContent.ts";
import queryStrategy 	from "../../../interfaces/queryStrategy.ts";

// -------------------------------------------------
// Helpers
// -------------------------------------------------

const resolveValueType = (value: any) => {
	return typeof value === "number" ? value:`'${value}'`;
}

const resolveQueryPart = (queryBuild: queryBuildPart) => {
	const parts = queryBuild.logic.map((item: any) => {
		const subparts = item.logic.map((subitem: queryBuildPart | [string, string, any]) => {
			if ((subitem as queryBuildPart).type) {
				return `(${resolveQueryPart(subitem as queryBuildPart)})`;
			}
			
			const arrayitem = subitem as [string, string, any];
			return `${arrayitem[0]} ${arrayitem[1]} ${resolveValueType(arrayitem[2])}`;
		});

		return subparts.join(` ${item.type === "and" ? 'AND':"OR"} `);
	});

	return parts.join(` ${queryBuild.type === "and" ? 'AND':"OR"} `);
}

// -------------------------------------------------
// Default export
// -------------------------------------------------

class Strategy implements queryStrategy {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	private static database: any = {};
	private lastQuery: any;

	// -------------------------------------------------
	// Methods
	// -------------------------------------------------

	public getLastQuery = () => this.lastQuery;

	public queryCondition = (queryBuild: queryBuildPart) => {
		return resolveQueryPart(queryBuild);
	}

	public querySelect = <T = Record<string, ModelContent>>(table: string, fields?: string[], condition?: string) => {
		// Prepare table
		if (!Strategy.database[table]) return [];

		// Save query
		this.lastQuery = {table, fields, condition, action: 'select'};

		return Strategy.database[table] as T[];
	}

	public queryAdd = <T = Record<string, ModelContent>>(table: string, fields: T) => {
		// Prepare table
		if (!Strategy.database[table]) Strategy.database[table] = [];

		// Add field
		Strategy.database[table].push(fields);

		// Save query
		this.lastQuery = {table, fields, action: 'store'};

		return fields as T;
	}

	public queryUpdate = <T = Record<string, ModelContent>>(table: string, fields: T, condition: string) => {
		// Prepare table
		if (!Strategy.database[table]) Strategy.database[table] = [];

		// Add field
		Strategy.database[table].push(fields);

		// Save query
		this.lastQuery = {table, fields, condition, action: 'update'};

		return fields as T;
	}

	public queryDelete = (table: string, condition: string): boolean => {
		// Prepare table
		if (!Strategy.database[table]) return false;

		// Save query
		this.lastQuery = {table, condition, action: 'delete'};

		return true;
	}
}

export default new Strategy();