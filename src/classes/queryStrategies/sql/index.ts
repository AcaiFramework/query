// Abstractions
import query from '../../../abstractions/builder/index.ts';

// Interfaces
import ModelContent from "../../../interfaces/ModelContent.ts";

// Strategy
import strategy from './strategy.ts';

export default class SqlQuery<T = Record<string, ModelContent>> extends query<T> {
	protected queryType = strategy;
}