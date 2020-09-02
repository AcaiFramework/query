export default interface queryBuildPart {
	type: "and" | "or";
	logic: (string | number | any | queryBuildPart)[];
}