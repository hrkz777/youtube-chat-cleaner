/*
 * ========================================================
 * YouTubeライブチャットのメモリリーク対策を適用するスクリプト
 * ========================================================
 */

// デフォルト設定
// 内部で利用する設定変数
let settings = DEFAULT_SETTINGS;

// iframe内のチャットリストのid
const IFRAME_CHAT_CONTAINER_SELECTOR = '#items';
// 個々のチャットメッセージ要素のタグ的なやつ
const MESSAGE_ITEM_SELECTOR = 'yt-live-chat-text-message-renderer'; 

// 設定チェック込みでログ調整
function consoleLog(message)
{
	// ログが有効かチェック
	if (settings.logging === 'true')
	{
		console.log(`[YouTubeChatCleaner] ${message}`);
		return;
	}
}

/**
 * メモリクリーンアップを実行するメイン関数
 */
function executeCleanup(contentDocument)
{
	// iframeからチャットのリストを探す
	const chatContainer = contentDocument.querySelector(IFRAME_CHAT_CONTAINER_SELECTOR);
	if (!chatContainer)
	{
		consoleLog('iframe内部のチャットコンテナが見つかりません');
		return;
	}

	// チャットコンテナ内からメッセージを取得
	const messages = chatContainer.querySelectorAll(MESSAGE_ITEM_SELECTOR);
	const totalMessages = messages.length; 

	const excessCount = totalMessages - settings.maxMessages;
	if (excessCount <= 0)
	{
		// デバッグ：現在のメッセージ枢表示
		consoleLog(`現在のメッセージ数: ${totalMessages} 件 / 上限: ${settings.maxMessages} 件`);
		return;
	}

	// 超過分を頭から消していく
	for (let i = 0; i < excessCount; i++)
	{
		const messageToDelete = messages[i];
		messageToDelete.remove(); 
	}

	// 実行ログ
	consoleLog(`クリーンアップ実行`);
	consoleLog(` - 削除数: ${excessCount} 件`);
	consoleLog(` - 現在のメッセージ数: ${settings.maxMessages} 件`);
}

/*
 * ========================================================
 * YouTube読み込み時に登録する処理
 * ========================================================
 */

let intervalId = null;

/**
 * メモリクリーンアップを実行するメイン関数
 */
function cleanChatMessages()
 {
	executeCleanup(document)
 }

/**
 * クリーンアップ処理を開始
 */
function setupCleaner()
{
	// 既存のタイマーを停止
	if (intervalId)
	{
		clearInterval(intervalId);
		intervalId = null;
	}

	chrome.storage.sync.get(DEFAULT_SETTINGS, (items) =>
	{
		settings = items;
		
		consoleLog('初期化');

		// 繰り返し実行登録
		intervalId = setInterval(cleanChatMessages, settings.checkInterval);

		// 初回実行
		cleanChatMessages();
	});
}

/**
 * ライブチャットのDOMがロードされるのを待機し、クリーンアップ処理を開始
 */
function initialize()
{
	setupCleaner();
}

// 拡張機能の設定が変更されたときに自動で再起動する
chrome.storage.onChanged.addListener((changes, namespace) =>
{
	// syncストレージに変更があったか確認
	if (namespace === 'sync' && (changes.maxMessages || changes.checkInterval || changes.logging))
	{
		consoleLog('設定変更を検出しました。クリーナーを再起動します');
		setupCleaner();
	}
});

// 拡張機能の開始
initialize();