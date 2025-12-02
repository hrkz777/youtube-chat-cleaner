// lib/i18n.js

document.addEventListener('DOMContentLoaded', () => {
	// data-i18n属性を持つ全ての要素を取得
	const i18nElements = document.querySelectorAll('[data-i18n]');

	i18nElements.forEach(element => {
		// 属性値（メッセージキー）を取得
		const messageKey = element.getAttribute('data-i18n');
		
		// Chrome i18n APIを使用して翻訳メッセージを取得
		const translatedText = chrome.i18n.getMessage(messageKey);

		if (translatedText) {
			// 要素のテキストコンテンツを翻訳されたテキストに置き換える
			element.textContent = translatedText;
		}
	});
});