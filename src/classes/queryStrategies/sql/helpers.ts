// Packages
import * as Client from "mysql";
import ColumnOptions from "../../../interfaces/ColumnOptions";

// Interfaces
import ModelContent 	from "../../../interfaces/ModelContent";
import QueryPart 		from "../../../interfaces/QueryPart";

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

export const queryResolver = (client: Client.Connection, queryString: string, params: unknown[] = []): Promise<any> => {
	return new Promise((resolve, reject) => {
		client.query(queryString, params,
		(error, results) => {
			if (error) reject(error);

			resolve(results);
		});
	});
}

export const columnSerialize = (key: string, data: ColumnOptions) => {

}