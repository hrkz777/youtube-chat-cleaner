// **【popup.js】**

document.addEventListener('DOMContentLoaded', () =>
{
	const maxMessagesInput = document.getElementById('maxMessages');
	const checkIntervalInput = document.getElementById('checkInterval');
	const loggingSelect = document.getElementById('logging');
	const saveButton = document.getElementById('saveButton');
	const statusDiv = document.getElementById('status');

	// 初期値
	// content.jsの初期値と合わせる
	chrome.storage.sync.get(
		DEFAULT_SETTINGS,
		(items) =>
		{
			maxMessagesInput.value = items.maxMessages;
			checkIntervalInput.value = items.checkInterval;
			loggingSelect.value = items.logging;
		}
	);

	// 保存ボタン
	saveButton.addEventListener('click', () =>
	{
		const newMaxMessages = parseInt(maxMessagesInput.value);
		const newCheckInterval = parseInt(checkIntervalInput.value);
		const newLogging = loggingSelect.value;
		
		// 入力値のバリデーション
		if (isNaN(newMaxMessages) || newMaxMessages < 10 || isNaN(newCheckInterval) || newCheckInterval < 500)
		{
			statusDiv.textContent = 'エラー: 入力値が不正です';
			statusDiv.style.color = 'red';
			return;
		}

		// 設定の保存
		chrome.storage.sync.set(
		{
			maxMessages: newMaxMessages,
			checkInterval: newCheckInterval,
			logging: newLogging
		},
		() =>
		{
			statusDiv.textContent = '設定を保存しました';
			statusDiv.style.color = 'green';
		});
	});
});