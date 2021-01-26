export default interface SettingsConfigInterface extends Record<string, string | number | undefined> {
	hostname	: string;
	username	: string;
	password	: string;
	database	: string;
	port		: string | number;
}