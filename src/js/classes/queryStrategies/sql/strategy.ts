// Interfaces
import { queryStrategy, queryPart } from "../../../abstractions/interface";

// -------------------------------------------------
// Helpers
// -------------------------------------------------

const resolveQueryPart = (queryBuild: queryPart) => {
	const parts = queryBuild.logic.map(item => {
		const parts = item.logic.map((subitem: any) => {
			if (subitem.type) {
				return `(${resolveQueryPart(subitem)})`;
			}
			else {
				const value = typeof subitem[2] === "number" ? subitem[2]:`'${subitem[2]}'`;
				return `${subitem[0]} ${subitem[1]} ${value}`;
			}
		});

		return parts.join(` ${item.type === "and" ? 'AND':"OR"} `);
	});

	return parts.join(` ${queryBuild.type === "and" ? 'AND':"OR"} `);
}

// -------------------------------------------------
// Default export
// -------------------------------------------------

export default {
	queryCondition: (queryBuild: queryPart): string => resolveQueryPart(queryBuild),
	
	querySelect: (table: string, fields?: string[], condition?: string): string => {
		const stringFields = fields ? fields.join(', '):'*';
		const stringCondition = condition ? ` WHERE ${condition}`:'';

		return `SELECT ${stringFields} FROM ${table}${stringCondition}`;
	},
} as queryStrategy;