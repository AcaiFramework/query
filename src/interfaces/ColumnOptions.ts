export default interface ColumnOptions {
	name: string;
	type: "string" | "text" | "number" | "boolean" | "date" | "timestamp";
	length?: number;
	autoIncrement?: boolean;
	nullable?: boolean;
}