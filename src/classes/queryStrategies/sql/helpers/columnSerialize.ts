// Interfaces
import ColumnOptions from "../../../../interfaces/ColumnOptions";

// Parts
import typeMaps from "./typeMaps";

export default function columnSerialize (key: string, data: ColumnOptions) {
	const length = data.length !== undefined ? data.length : ["string", "float", "int"].indexOf(data.type) + 1 > 0 ? 255: undefined;

	return [
		`${key} ${
			typeMaps[data.type].toLowerCase()}${length ? `(${length})`:""
		}${
			data.nullable ? " NULL":" NOT NULL"
		}${
			data.unique ? " UNIQUE":""
		}${
			data.autoIncrement ? " AUTO_INCREMENT":""
		}${
			data.default ? ` DEFAULT ${(typeof data.default === "string" ? `'${data.default}'`:data.default)}`:""
		}`,
		data.foreign ? `FOREIGN KEY (${
			key
		}) REFERENCES ${
			data.foreign.table
		}(${
			data.foreign.column || "id"
		})${
			data.foreign.onUpdate ? ` ON UPDATE ${data.foreign.onUpdate}`:""
		}${
			data.foreign.onDelete ? ` ON DELETE ${data.foreign.onDelete}`:""
		}`:undefined
	];
}