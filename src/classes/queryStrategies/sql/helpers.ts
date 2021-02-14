// Packages
import * as Client from "mysql";

// Interfaces
import ModelContent 		from "../../../interfaces/ModelContent";
import QueryPart 			from "../../../interfaces/QueryPart";
import JoinClauseInterface 	from "../../../interfaces/JoinClause";
import ColumnOptions 		from "../../../interfaces/ColumnOptions";

// -------------------------------------------------
// Resolve query part
// -------------------------------------------------

export const resolveQueryPart = (queryBuild: QueryPart) => {
	const values = [] as unknown[];
	const parts = queryBuild.logic.map((item) => {
		const subparts = (item as QueryPart).logic.map((subitem) => {
			if ((subitem as QueryPart).type) {
				return `(${resolveQueryPart(subitem as QueryPart)})`;
			}
			
			const arrayitem = subitem as [string, string, ModelContent];
			values.push(arrayitem[2]);
			return `${arrayitem[0]} ${arrayitem[1]} ?`;
		});

		return subparts.join(` ${(item as QueryPart).type === "and" ? 'AND':"OR"} `);
	}) as string[];

	return [parts.join(` ${queryBuild.type === "and" ? 'AND':"OR"} `), values] as [string, (string | number | boolean | any)[]];
}

// -------------------------------------------------
// Query resolver
// -------------------------------------------------

export const queryResolver = (client: Client.Connection, queryString: string, params: unknown[] = []): Promise<any> => {
	return new Promise((resolve, reject) => {
		client.query(queryString, params,
		(error, results) => {
			if (error) reject(error);

			resolve(results);
		});
	});
}

// -------------------------------------------------
// Serialize column data
// -------------------------------------------------

const typeMaps = {
	string: "VARCHAR",
	text: "TEXT",
	int: "INT",
	float: "FLOAT",
	boolean: "TINYINT",
	date: "DATE",
	datetime: "DATETIME",
	timestamp: "TIMESTAMP",
	json: "JSON",
};

export const columnSerialize = (key: string, data: ColumnOptions) => {
	return `${key} ${
		typeMaps[data.type].toLowerCase()}${data.length ? `(${data.length})`:""
	}${
		data.nullable ? " NULL":" NOT NULL"
	}${
		data.unique ? " UNIQUE":""
	}${
		data.autoIncrement ? " AUTO_INCREMENT":""
	}`;
}

// -------------------------------------------------
// Serialize column data
// -------------------------------------------------

export const columnDeserialize = (data: Record<string, string | undefined>) => {
	const [type, length] = (data.Type || "").split("(");

	return {
		nullable: data.Null !== "NO",
		primary	: data.Key === "PRI",
		default	: data.Default ? data.Default : undefined,
		type	: Object.keys(typeMaps).find(key => typeMaps[key] === type.toUpperCase()) as keyof typeof typeMaps,
		unique	: data.Key === "UNI",
		length	: length ? parseInt(length.replace(")", "")) : undefined,
	};
}

// -------------------------------------------------
// Join clause builder
// -------------------------------------------------

const types = {
	"inner": "INNER",
	"left": "LEFT",
	"right": "RIGHT",
	"outer": "FULL OUTER"
};
export const joinClauseBuilder = (joinClause: JoinClauseInterface) => {
	const type = types[joinClause.type];

	return `${type} JOIN ${joinClause.table} ON ${joinClause.firstColumn}${joinClause.operator}${joinClause.secondColumn}`;
} 

// -------------------------------------------------
// smart update
// -------------------------------------------------

export const smartUpdate = async (tableName: string, oldColumns: Record<string, ColumnOptions>, updatedColumns: Record<string, ColumnOptions>) => {
	const toUpdateColumns = [] as (ColumnOptions & {name: string, action: string, position?: string})[];

	// columns to add
	Object.keys(updatedColumns).forEach(key => {
		if (!oldColumns[key]) toUpdateColumns.push({...updatedColumns[key], name: key, action: "ADD"});
	});

	// columns to delete
	Object.keys(oldColumns).forEach(key => {
		if (!updatedColumns[key]) toUpdateColumns.push({...oldColumns[key], name: key, action: "DROP"});
	});

	// columns to update
	Object.keys(updatedColumns).forEach(key => {
		if (oldColumns[key]) {
			// diffs
			const { type: ftype, length: flength, unique: funique, nullable: fnullable, default: fdefault } = oldColumns[key];
			const { type: stype, length: slength, unique: sunique, nullable: snullable, default: sdefault } = updatedColumns[key];

			// positioning
			const fpos 	= Object.keys(oldColumns).indexOf(key);
			const spos 	= Object.keys(updatedColumns).indexOf(key);
			const pos 	= spos === 0 ? "FIRST" : `AFTER ${Object.keys(updatedColumns)[spos - 1]}`;

			if (ftype !== stype ||
				flength !== slength ||
				(sunique && funique !== sunique) ||
				(snullable && fnullable !== snullable) ||
				(sdefault && fdefault !== sdefault) ||
				fpos !== spos
			) {
					toUpdateColumns.push({
						...updatedColumns[key],

						name	: key,
						action	: "MODIFY COLUMN",
						position: fpos !== spos ? pos : undefined,
					});
			}
		}
	});

	// update primary key
	const oldkey = Object.keys(oldColumns).find(i => oldColumns[i].primary);
	const newkey = Object.keys(updatedColumns).find(i => updatedColumns[i].primary);
	if (newkey && oldkey !== newkey) {
		toUpdateColumns.push({...updatedColumns[newkey], name: newkey, action: "PRIMARY"});
	}

	return `ALTER TABLE ${tableName} ${
		toUpdateColumns.map(column => {
			if (column.action === "DROP")
				return `DROP COLUMN ${column.name}`;
			else if (column.action === "PRIMARY")
				return `DROP PRIMARY KEY, ADD PRIMARY KEY (${column.name})`;
			else
				return `${column.action} ${columnSerialize(column.name, column)} ${column.position ? column.position:""}`;
		}).join(", ")
	}`;
}