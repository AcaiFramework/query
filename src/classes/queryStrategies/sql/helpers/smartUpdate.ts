// Interfaces
import ColumnOptions 		from "../../../../interfaces/ColumnOptions";

// Parts
import columnSerialize from "./columnSerialize";

export default async function smartUpdate (tableName: string, oldColumns: Record<string, ColumnOptions>, updatedColumns: Record<string, ColumnOptions>) {
	const toUpdateColumns = [] as (ColumnOptions & {name: string, action: string, position?: string})[];

	// columns to add
	Object.keys(updatedColumns).forEach(key => {
		if (!oldColumns[key]) {
			toUpdateColumns.push({
				...updatedColumns[key],
				length	: updatedColumns[key].length || ["string", "float", "int"].indexOf(updatedColumns[key].type) + 1 > 0 ? 255: undefined,
				name	: key,
				action	: "ADD",
			});
		}
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

						length	: updatedColumns[key].length || ["string", "float", "int"].indexOf(updatedColumns[key].type) + 1 > 0 ? 255: undefined,
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