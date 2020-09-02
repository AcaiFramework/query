// Interfaces
import queryBuildPart from "../../../interfaces/queryBuildPart";
import queryStrategy from "../../../interfaces/queryStrategy";

// -------------------------------------------------
// Helpers
// -------------------------------------------------

const resolveValueType = (value: any) => {
	return typeof value === "number" ? value:`'${value}'`;
}

const resolveQueryPart = (queryBuild: queryBuildPart) => {
	const parts = queryBuild.logic.map(item => {
		const parts = item.logic.map((subitem: queryBuildPart | [string, string, any]) => {
			if ((subitem as queryBuildPart).type) {
				return `(${resolveQueryPart(subitem as queryBuildPart)})`;
			}
			
			const arrayitem = subitem as [string, string, any];
			return `${arrayitem[0]} ${arrayitem[1]} ${resolveValueType(arrayitem[2])}`;
		});

		return parts.join(` ${item.type === "and" ? 'AND':"OR"} `);
	});

	return parts.join(` ${queryBuild.type === "and" ? 'AND':"OR"} `);
}

// -------------------------------------------------
// Default export
// -------------------------------------------------

export default {
	queryCondition: (queryBuild: queryBuildPart): string => resolveQueryPart(queryBuild),
} as queryStrategy;