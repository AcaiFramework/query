// Interfaces
import { ModelContent } 	from "../../../interfaces/ModelContent";

// Parts
import StaticClass from "./static";

export default abstract class DataClass<T = Record<string, ModelContent>> extends StaticClass<T> {

	// -------------------------------------------------
	// data methods
	// -------------------------------------------------

	public raw = async (query: string) => {
		return await this.getAdapter().raw(query);
	}

	public count = async (column?: string) => {
		return await this.getAdapter().count(this.tableName, column || "*");
	}

	public avg = async (column: string) => {
		return await this.getAdapter().avg(this.tableName, column);
	}

	public sum = async (column: string) => {
		return await this.getAdapter().sum(this.tableName, column);
	}
}