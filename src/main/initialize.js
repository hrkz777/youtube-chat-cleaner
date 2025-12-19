
/**
 * ライブチャットのDOMがロードされるのを待機し、クリーンアップ処理を開始
 */
function initialize()
{
	setupCleaner();
	addReloadButton();
}

// 拡張機能の設定が変更されたときに自動で再起動する
chrome.storage.onChanged.addListener((changes, namespace) =>
{
	// syncストレージに変更があったか確認
	if (namespace === 'sync' && (changes.maxMessages || changes.checkInterval || changes.logging))
	{
		consoleLog('設定変更を検出しました。クリーナーを再起動します');
		setupCleaner();
		addReloadButton();
	}
});

// 拡張機能の開始
initialize();