// Interfaces
import { ModelContent } 	from "../../../interfaces/ModelContent";

// Parts
import DataClass from "./data";

export default abstract class JoinClass<T = Record<string, ModelContent>> extends DataClass<T> {
	// -------------------------------------------------
	// join methods
	// -------------------------------------------------

	public joinType <ModelConfig = T> (type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinList = {
			type,
			table,
			firstColumn,
			secondColumn: secondColumn || secondColumnOrOperator,
			operator: secondColumn ? secondColumnOrOperator : "=",
		};

		return this as JoinClass<ModelConfig>;
	}

	public join <ModelConfig = T> (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("outer", table, firstColumn, secondColumnOrOperator, secondColumn);

		return this as JoinClass<ModelConfig>;
	}

	public leftJoin <ModelConfig = T> (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("left", table, firstColumn, secondColumnOrOperator, secondColumn);

		return this as JoinClass<ModelConfig>;
	}

	public rightJoin <ModelConfig = T> (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("right", table, firstColumn, secondColumnOrOperator, secondColumn);

		return this as JoinClass<ModelConfig>;
	}

	public innerJoin <ModelConfig = T> (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("inner", table, firstColumn, secondColumnOrOperator, secondColumn);

		return this as JoinClass<ModelConfig>;
	}
}