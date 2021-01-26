

// Abstractions
import QueryAbstract from '../../../abstractions/builder/index.ts';

// Interfaces
import ModelContent from "../../../interfaces/ModelContent.ts";

// Strategy
import strategy from './strategy.ts';

export default class PostgresQuery<T = Record<string, ModelContent>> extends QueryAbstract<T> {
	protected static adapter = new strategy();
}