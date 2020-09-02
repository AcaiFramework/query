// Abstractions
import query from '../../../abstractions';

// Strategy
import strategy from './strategy';

export default class SqlQuery<T = Object> extends query<T> {
	protected queryType = strategy;
}