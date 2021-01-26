

// Abstractions
import QueryAbstract from '../../../abstractions/builder/index.ts';

// Interfaces
import SettingsConfigInterface 	from "./types.ts";

// Strategy
import strategy from './strategy.ts';

export default class SqlQuery extends QueryAbstract {
	protected static adapter = new strategy();
	protected static settings: SettingsConfigInterface;
}