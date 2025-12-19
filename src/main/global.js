
// デフォルト設定
// 内部で利用する設定変数
let settings = DEFAULT_SETTINGS;

function consoleLog(message)
{
	// ログが有効かチェック
	if (settings.logging)
	{
		console.log(`[YouTubeChatCleaner] ${message}`);
		return;
	}
}

function consoleError(message)
{
	// ログが有効かチェック
	if (settings.logging)
	{
		console.error(`[YouTubeChatCleaner] ${message}`);
		return;
	}
}
