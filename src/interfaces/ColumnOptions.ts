// Interfaces
import constraintTypes from "./constraintInterfaces";

export default interface ColumnOptions {
	type: "string" | "text" | "int" | "bigint" | "smallint" | "enum" | "binary" | "boolean" | "date" | "timestamp" | "datetime" | "time" | "float" | "json";
	length?: number;
	autoIncrement?: boolean;
	nullable?: boolean;
	unique?: boolean;
	primary?: boolean;
	default?: unknown;

	foreign?: {
		name?: string;
		table: string;
		column?: string;

		onUpdate?: constraintTypes;
		onDelete?: constraintTypes;
	}
}