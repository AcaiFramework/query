// Interfaces
import ModelContent 	from "../../../interfaces/ModelContent.ts";
import queryBuildPart 	from "../../../interfaces/QueryPart.ts";
import queryStrategy 	from "../../../interfaces/queryStrategy.ts";

// -------------------------------------------------
// Helpers
// -------------------------------------------------

const resolveValueType = (value: unknown) => {
	return typeof value === "number" ? value:`'${value}'`;
}

const resolveQueryPart = (queryBuild: queryBuildPart) => {
	const parts = queryBuild.logic.map((item: any) => {
		const subparts = item.logic.map((subitem: queryBuildPart | [string, string, ModelContent]) => {
			if ((subitem as queryBuildPart).type) {
				return `(${resolveQueryPart(subitem as queryBuildPart)})`;
			}
			
			const arrayitem = subitem as [string, string, ModelContent];
			return `${arrayitem[0]} ${arrayitem[1]} ${resolveValueType(arrayitem[2])}`;
		});

		return subparts.join(` ${item.type === "and" ? 'AND':"OR"} `);
	});

	return parts.join(` ${queryBuild.type === "and" ? 'AND':"OR"} `);
}

// -------------------------------------------------
// Default export
// -------------------------------------------------

export default {
	queryCondition: (queryBuild: queryBuildPart): string => resolveQueryPart(queryBuild),
} as queryStrategy;