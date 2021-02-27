// Packages
import * as Client from "mysql2";

export default function queryResolver (client: Client.Connection, queryString: string, params: unknown[] = []): Promise<any> {
	return new Promise((resolve, reject) => {
		client.query(queryString, params,
		(error, results) => {
			if (error) reject(error);

			resolve(results);
		});
	});
}