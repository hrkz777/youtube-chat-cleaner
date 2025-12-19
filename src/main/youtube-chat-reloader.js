/*
 * ========================================================
 * リロードボタンを追加する
 * ========================================================
 */

// リソースパスの定義
const RELOAD_SVG_URL = chrome.runtime.getURL('resources/reload.svg');

const MenuButtonSelector = '#live-chat-header-context-menu'; 
const CloseButtonSelector = '#close-button'; 
const ReloadButtonId = 'youtube-chat-reloader-button';

/**
 * SVGファイルからpathのd属性を抽出する
 */
async function getSvgPath(url)
{
	try {
		const response = await fetch(url);
		const text = await response.text();
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(text, "image/svg+xml");
		const path = xmlDoc.querySelector('path');
		return path ? path.getAttribute('d') : '';
	} catch (e) {
		console.error('SVGの読み込みに失敗しました:', e);
		return '';
	}
}

/**
 * チャットヘッダーにリロードボタンを追加する
 */
async function addReloadButton()
{
	// SVGを読み込む
	const pathData = await getSvgPath(RELOAD_SVG_URL);

	// 既にボタンが存在する場合は何もしない
	if (document.getElementById(ReloadButtonId))
	{
		consoleError('すでに追加されています');
		return;
	}

	const chatMenuButton = document.querySelector(MenuButtonSelector);
	if (!chatMenuButton)
	{
		consoleError('チャットメニューボタンが見つかりません');
		return;
	}
	const header = chatMenuButton.parentElement;
	if (!header)
	{
		consoleError('ヘッダーが見つかりません');
		return;
	}
	
	const closeButton = document.querySelector(CloseButtonSelector);
	if (!closeButton)
	{
		consoleError('閉じるボタンが見つかりません');
		return;
	}
	
	// リロードボタンを作成
	const reloadButton = document.createElement('div');
	reloadButton.id = ReloadButtonId;
	reloadButton.className = 'style-scope yt-live-chat-header-renderer';
	reloadButton.setAttribute('title', 'チャットを再読み込みします');
	reloadButton.addEventListener('click', () => {
		consoleLog('リロードボタンでチャットをクリーンアップします');
		location.reload();
	});
	header.insertBefore(reloadButton, chatMenuButton);
	
	const renderer = document.createElement('yt-button-renderer');
	renderer.className = 'style-scope yt-live-chat-header-renderer';
	reloadButton.appendChild(renderer);

	const shape = document.createElement('yt-button-shape');
	renderer.appendChild(shape);

	const button = document.createElement('div');
	button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-only-default yt-spec-button-shape-next--enable-backdrop-filter-experiment';
	shape.appendChild(button);

	const icon = document.createElement('div');
	icon.areaHidden = 'true';
	icon.className = 'yt-spec-button-shape-next__icon';
	button.appendChild(icon);

	const iconWapper = document.createElement('span');
	iconWapper.className = 'ytIconWrapperHost';
	iconWapper.style.cssText = 'width: 24px; height: 24px;';
	icon.appendChild(iconWapper);

	const iconShape = document.createElement('span');
	iconShape.className = 'yt-icon-shape ytSpecIconShapeHost';
	iconWapper.appendChild(iconShape);

	const svgWrapper = document.createElement('div');
	svgWrapper.style.cssText = 'width: 100%; height: 100%; display: block; fill: currentcolor;';
	iconShape.appendChild(svgWrapper);

	const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svgIcon.setAttribute('width', '24');
	svgIcon.setAttribute('height', '24');
	svgIcon.setAttribute('focusable', 'false');
	svgIcon.setAttribute('area-hidden', 'true');
	svgIcon.setAttribute('viewBox', '0 0 24 24');
	svgIcon.style.cssText = 'pointer-events: none; display: inherit; width: 100%; height: 100%;';
	svgWrapper.appendChild(svgIcon);
	
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', pathData);
	svgIcon.appendChild(path);

	consoleLog('リロードボタンを追加しました');
}