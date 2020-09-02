export default interface QueryBuildPart {
	type: "and" | "or";
	logic: (string | number | any | QueryBuildPart)[];
}