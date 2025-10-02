// 全局变量
let currentSettings = {
    apiUrl: 'https://api.siliconflow.cn/v1/images/generations',
    apiKey: '',
    model: 'Kwai-Kolors/Kolors',
    customModel: ''
};

let generatedImages = [];
let isSettingsPanelMinimized = true;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSettings();
    setupEventListeners();

    // 如果没有保存的设置，使用默认模型初始化分辨率选项
    if (!localStorage.getItem('aiImageGeneratorSettings')) {
        updateResolutionOptions('Kwai-Kolors/Kolors');

        // 初始化API KEY显示状态
        const toggleBtn = document.getElementById('toggleApiKey');
        if (toggleBtn) {
            toggleBtn.textContent = '👁️';
            toggleBtn.title = '显示API Key';
        }
    }
});

// 初始化应用
function initializeApp() {
    // 初始化设置面板状态
    const settingsPanel = document.getElementById('settingsPanel');
    settingsPanel.classList.add('minimized');
}

// 设置事件监听器
function setupEventListeners() {
    // 模型选择变化事件
    document.getElementById('modelSelect').addEventListener('change', function() {
        const customModelGroup = document.getElementById('customModelGroup');
        if (this.value === 'custom') {
            customModelGroup.style.display = 'block';
        } else {
            customModelGroup.style.display = 'none';
        }

        // 更新分辨率选项
        updateResolutionOptions(this.value);
    });

    // 分辨率选择变化事件
    document.getElementById('resolution').addEventListener('change', function() {
        const customResolutionContainer = document.getElementById('customResolutionContainer');
        if (this.value === 'custom') {
            customResolutionContainer.style.display = 'block';
        } else {
            customResolutionContainer.style.display = 'none';
        }
    });

    // 预设尺寸按钮点击事件
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const width = this.getAttribute('data-width');
            const height = this.getAttribute('data-height');
            document.getElementById('customWidth').value = width;
            document.getElementById('customHeight').value = height;

            // 添加点击效果
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 自定义尺寸输入验证
    document.getElementById('customWidth').addEventListener('input', validateCustomResolution);
    document.getElementById('customHeight').addEventListener('input', validateCustomResolution);

    // 生成图片按钮
    document.getElementById('generateImages').addEventListener('click', generateImages);

    // 全选按钮
    document.getElementById('selectAll').addEventListener('click', selectAllImages);

    // 下载选中按钮
    document.getElementById('downloadSelected').addEventListener('click', downloadSelectedImages);

    // 下载全部按钮
    document.getElementById('downloadAll').addEventListener('click', downloadAllImages);

    // 清空结果按钮
    document.getElementById('clearResults').addEventListener('click', clearResults);

    // 保存设置按钮
    document.getElementById('saveSettings').addEventListener('click', saveSettings);

    // 浮动设置按钮
    document.getElementById('settingsFab').addEventListener('click', toggleSettingsPanel);

    // 最小化设置按钮
    document.getElementById('minimizeSettings').addEventListener('click', toggleSettingsPanel);

    // API KEY显示/隐藏按钮
    document.getElementById('toggleApiKey').addEventListener('click', toggleApiKeyVisibility);

    // 图片预览模态框事件
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close');
    const modalDownloadBtn = document.getElementById('modalDownload');

    // 关闭模态框
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // 模态框内下载按钮
    modalDownloadBtn.addEventListener('click', function() {
        const imageUrl = document.getElementById('modalImage').src;
        const imageId = document.getElementById('modalTitle').textContent.replace('图片 #', '');
        downloadImage(imageUrl, imageId);
    });
}

// 切换设置面板
function toggleSettingsPanel() {
    const settingsPanel = document.getElementById('settingsPanel');
    const fab = document.getElementById('settingsFab');

    isSettingsPanelMinimized = !isSettingsPanelMinimized;

    if (isSettingsPanelMinimized) {
        settingsPanel.classList.add('minimized');
        fab.style.display = 'flex';
    } else {
        settingsPanel.classList.remove('minimized');
        fab.style.display = 'none';
    }
}

// 切换API KEY显示/隐藏
function toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleBtn = document.getElementById('toggleApiKey');

    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleBtn.textContent = '🙈';
        toggleBtn.title = '隐藏API Key';
    } else {
        apiKeyInput.type = 'password';
        toggleBtn.textContent = '👁️';
        toggleBtn.title = '显示API Key';
    }
}

// 根据模型更新分辨率选项
function updateResolutionOptions(model) {
    const resolutionSelect = document.getElementById('resolution');
    const resolutionNote = document.getElementById('resolutionNote');
    const options = resolutionSelect.querySelectorAll('option');

    let selectedOption = resolutionSelect.value;
    let hasValidOption = false;

    options.forEach(option => {
        const models = option.getAttribute('data-models');
        const shouldShow = models === 'all' ||
                         (models === 'kolors' && (model.includes('Kolors') || model.includes('kolors'))) ||
                         (models === 'dall-e' && (model.includes('dall-e'))) ||
                         models === 'other';

        option.style.display = shouldShow ? 'block' : 'none';

        // 检查当前选择的选项是否仍然可见
        if (option.value === selectedOption && shouldShow) {
            hasValidOption = true;
        }
    });

    // 如果当前选择的选项不可用，选择第一个可用选项
    if (!hasValidOption) {
        const firstVisibleOption = resolutionSelect.querySelector('option[style="display: block;"]');
        if (firstVisibleOption) {
            resolutionSelect.value = firstVisibleOption.value;
            selectedOption = firstVisibleOption.value;
        }
    }

    // 更新提示信息
    if (model.includes('Kolors') || model.includes('kolors')) {
        resolutionNote.textContent = 'Kolor模型支持特定的分辨率选项';
    } else if (model.includes('dall-e')) {
        resolutionNote.textContent = 'DALL-E模型支持多种分辨率选项';
    } else {
        resolutionNote.textContent = '请选择适合的分辨率';
    }

    // 保存当前分辨率设置
    currentSettings.resolution = selectedOption;

    // 如果选择自定义尺寸，同时保存自定义宽高
    if (selectedOption === 'custom') {
        currentSettings.customWidth = document.getElementById('customWidth').value;
        currentSettings.customHeight = document.getElementById('customHeight').value;
    }
}

// 加载设置
function loadSettings() {
    const savedSettings = localStorage.getItem('aiImageGeneratorSettings');
    if (savedSettings) {
        currentSettings = JSON.parse(savedSettings);

        // 填充表单
        document.getElementById('apiUrl').value = currentSettings.apiUrl || 'https://api.siliconflow.cn/v1/images/generations';
        document.getElementById('apiKey').value = currentSettings.apiKey || '';
        document.getElementById('modelSelect').value = currentSettings.model || 'Kwai-Kolors/Kolors';
        document.getElementById('customModel').value = currentSettings.customModel || '';
        document.getElementById('defaultPrompt').value = currentSettings.defaultPrompt || '';
        document.getElementById('resolution').value = currentSettings.resolution || '1024x1024';
        document.getElementById('customWidth').value = currentSettings.customWidth || '1024';
        document.getElementById('customHeight').value = currentSettings.customHeight || '1024';
        document.getElementById('quantity').value = currentSettings.quantity || 1;
        document.getElementById('batchSize').value = currentSettings.batchSize || 10;

        // 如果选择自定义尺寸，显示自定义尺寸容器
        if (currentSettings.resolution === 'custom') {
            document.getElementById('customResolutionContainer').style.display = 'block';
        }

        // 显示/隐藏自定义模型输入框
        const customModelGroup = document.getElementById('customModelGroup');
        if (currentSettings.model === 'custom') {
            customModelGroup.style.display = 'block';
        } else {
            customModelGroup.style.display = 'none';
        }

        // 初始化分辨率选项
        updateResolutionOptions(currentSettings.model);

        // 初始化API KEY显示状态
        const apiKeyInput = document.getElementById('apiKey');
        const toggleBtn = document.getElementById('toggleApiKey');
        if (apiKeyInput && toggleBtn) {
            toggleBtn.textContent = '👁️';
            toggleBtn.title = '显示API Key';
        }
    }
}

// 保存设置
function saveSettings() {
    const modelSelect = document.getElementById('modelSelect').value;

    currentSettings.apiUrl = document.getElementById('apiUrl').value;
    currentSettings.apiKey = document.getElementById('apiKey').value;
    currentSettings.model = modelSelect;
    currentSettings.customModel = document.getElementById('customModel').value;
    currentSettings.defaultPrompt = document.getElementById('defaultPrompt').value;
    currentSettings.resolution = document.getElementById('resolution').value;
    currentSettings.customWidth = document.getElementById('customWidth').value;
    currentSettings.customHeight = document.getElementById('customHeight').value;
    currentSettings.quantity = parseInt(document.getElementById('quantity').value);
    currentSettings.batchSize = parseInt(document.getElementById('batchSize').value);

    // 保存到localStorage
    localStorage.setItem('aiImageGeneratorSettings', JSON.stringify(currentSettings));

    // 显示成功消息
    showMessage('设置已保存', 'success');
}

// 显示消息
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    messageContainer.appendChild(messageDiv);

    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 生成图片
async function generateImages() {
    const prompt = document.getElementById('prompt').value.trim();
    const defaultPrompt = document.getElementById('defaultPrompt').value.trim();
    let resolution = document.getElementById('resolution').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const batchSize = parseInt(document.getElementById('batchSize').value);

    // 如果选择自定义尺寸，获取自定义宽高
    if (resolution === 'custom') {
        const customWidth = parseInt(document.getElementById('customWidth').value);
        const customHeight = parseInt(document.getElementById('customHeight').value);

        // 验证自定义尺寸
        if (!customWidth || !customHeight) {
            showMessage('请输入有效的自定义宽度和高度', 'error');
            return;
        }

        if (customWidth < 64 || customWidth > 2048 || customHeight < 64 || customHeight > 2048) {
            showMessage('自定义尺寸必须在 64-2048 像素之间', 'error');
            return;
        }

        resolution = `${customWidth}x${customHeight}`;
    }

    // 验证输入
    if (!currentSettings.apiUrl) {
        showMessage('请先配置API地址', 'error');
        return;
    }

    if (!currentSettings.apiKey) {
        showMessage('请先配置API Key', 'error');
        return;
    }

    if (!prompt && !defaultPrompt) {
        showMessage('请输入提示词或设置默认提示词', 'error');
        return;
    }

    // 组合最终提示词
    const finalPrompt = prompt || defaultPrompt;

    // 显示进度条
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressText.textContent = '0%';

    try {
        const totalBatches = Math.ceil(quantity / batchSize);
        let completedImages = 0;

        for (let batch = 0; batch < totalBatches; batch++) {
            const batchQuantity = Math.min(batchSize, quantity - (batch * batchSize));

            // 生成一批图片
            const batchResults = await generateImageBatch(finalPrompt, resolution, batchQuantity);

            // 保存结果
            generatedImages.push(...batchResults);

            // 更新进度
            completedImages += batchResults.length;
            const progress = Math.round((completedImages / quantity) * 100);

            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;

            // 显示结果
            displayResults();
        }

        showMessage(`成功生成 ${quantity} 张图片`, 'success');

    } catch (error) {
        console.error('生成图片失败:', error);
        showMessage(`生成图片失败: ${error.message}`, 'error');
    } finally {
        // 隐藏进度条
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 1000);
    }
}

// 生成一批图片
async function generateImageBatch(prompt, resolution, quantity) {
    // 确定使用的模型
    const selectedModel = currentSettings.model === 'custom' ? currentSettings.customModel : currentSettings.model;

    let requestBody = {};

    // 根据不同的API调整请求体
    if (currentSettings.model === 'dall-e-3' || currentSettings.model === 'dall-e-2') {
        // OpenAI DALL-E格式
        requestBody = {
            model: selectedModel,
            prompt: prompt,
            n: quantity,
            size: resolution,
            response_format: 'url'
        };
    } else if (selectedModel.includes('Kolors')) {
        // Kwai-Kolors格式 - 兼容SiliconFlow API
        requestBody = {
            model: selectedModel,
            prompt: prompt,
            n: quantity,
            size: resolution,
            seed: Math.floor(Math.random() * 1000000)
        };
    } else {
        // 通用格式
        requestBody = {
            model: selectedModel,
            prompt: prompt,
            n: quantity,
            size: resolution
        };
    }

    console.log('API请求参数:', requestBody);

    const response = await fetch(currentSettings.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSettings.apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    console.log('响应状态:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误响应:', errorText);
        let errorMessage = `API请求失败 (${response.status})`;

        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch (e) {
            // 如果解析失败，使用原始错误文本
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API响应数据:', data);

    // 根据不同的API格式处理响应
    let images = [];

    if (data.data && Array.isArray(data.data)) {
        // OpenAI格式
        images = data.data.map((item, index) => ({
            id: Date.now() + index,
            url: item.url,
            prompt: prompt,
            resolution: resolution,
            timestamp: new Date().toISOString(),
            selected: false
        }));
    } else if (data.images && Array.isArray(data.images)) {
        // 其他API格式
        images = data.images.map((item, index) => ({
            id: Date.now() + index,
            url: item.url || item,
            prompt: prompt,
            resolution: resolution,
            timestamp: new Date().toISOString(),
            selected: false
        }));
    } else if (data.url) {
        // 单张图片响应
        images = [{
            id: Date.now(),
            url: data.url,
            prompt: prompt,
            resolution: resolution,
            timestamp: new Date().toISOString(),
            selected: false
        }];
    } else {
        console.error('未知的响应格式:', data);
        throw new Error('API响应格式无法识别');
    }

    console.log('解析后的图片数据:', images);
    return images;
}

// 显示结果
function displayResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    const selectAllBtn = document.getElementById('selectAll');
    const downloadSelectedBtn = document.getElementById('downloadSelected');
    const downloadAllBtn = document.getElementById('downloadAll');
    const clearResultsBtn = document.getElementById('clearResults');
    const imageCount = document.getElementById('imageCount');

    // 更新图片计数
    imageCount.textContent = `已生成: ${generatedImages.length} 张`;

    if (generatedImages.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🖼️</div>
                <p>还没有生成图片</p>
                <p class="empty-subtitle">在左侧输入提示词并点击生成按钮开始创作</p>
            </div>
        `;
        selectAllBtn.style.display = 'none';
        downloadSelectedBtn.style.display = 'none';
        downloadAllBtn.style.display = 'none';
        clearResultsBtn.style.display = 'none';
        return;
    }

    // 显示按钮
    selectAllBtn.style.display = 'inline-block';
    downloadSelectedBtn.style.display = 'inline-block';
    downloadAllBtn.style.display = 'inline-block';
    clearResultsBtn.style.display = 'inline-block';

    // 生成图片展示HTML
    const imagesHTML = generatedImages.map(image => `
        <div class="image-result">
            <div class="image-checkbox-container">
                <input type="checkbox" class="image-checkbox" data-image-id="${image.id}" ${image.selected ? 'checked' : ''}>
            </div>
            <img src="${image.url}" alt="${image.prompt}" loading="lazy" onclick="openImageModal('${image.id}')" style="cursor: pointer;" title="点击放大预览">
            <div class="image-info">
                <h4>图片 #${image.id}</h4>
                <p>提示词: ${image.prompt}</p>
                <p>分辨率: ${image.resolution}</p>
                <p>生成时间: ${new Date(image.timestamp).toLocaleString()}</p>
                <div class="image-actions">
                    <button class="btn-download" onclick="downloadImage('${image.url}', '${image.id}')">下载</button>
                </div>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = `<div class="results-grid">${imagesHTML}</div>`;

    // 添加复选框事件监听器
    document.querySelectorAll('.image-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const imageId = parseInt(this.getAttribute('data-image-id'));
            const image = generatedImages.find(img => img.id === imageId);
            if (image) {
                image.selected = this.checked;
                updateSelectAllButton();
            }
        });
    });

    updateSelectAllButton();
}

// 全选/取消全选图片
function selectAllImages() {
    const selectAllBtn = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.image-checkbox');
    const shouldSelectAll = selectAllBtn.textContent === '全选';

    checkboxes.forEach(checkbox => {
        checkbox.checked = shouldSelectAll;
        const imageId = parseInt(checkbox.getAttribute('data-image-id'));
        const image = generatedImages.find(img => img.id === imageId);
        if (image) {
            image.selected = shouldSelectAll;
        }
    });

    selectAllBtn.textContent = shouldSelectAll ? '取消全选' : '全选';
}

// 更新全选按钮状态
function updateSelectAllButton() {
    const selectAllBtn = document.getElementById('selectAll');
    const selectedCount = generatedImages.filter(img => img.selected).length;
    const totalCount = generatedImages.length;

    if (selectedCount === 0) {
        selectAllBtn.textContent = '全选';
    } else if (selectedCount === totalCount) {
        selectAllBtn.textContent = '取消全选';
    } else {
        selectAllBtn.textContent = `全选 (${selectedCount}/${totalCount})`;
    }
}

// 下载选中的图片
function downloadSelectedImages() {
    const selectedImages = generatedImages.filter(img => img.selected);
    if (selectedImages.length === 0) {
        showMessage('请先选择要下载的图片', 'error');
        return;
    }

    selectedImages.forEach(image => {
        downloadImage(image.url, image.id);
    });
    showMessage(`开始下载 ${selectedImages.length} 张选中图片`, 'success');
}

// 下载单张图片
function downloadImage(imageUrl, imageId) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-image-${imageId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 下载全部图片
function downloadAllImages() {
    generatedImages.forEach(image => {
        downloadImage(image.url, image.id);
    });
    showMessage('开始下载全部图片', 'success');
}

// 清空结果
function clearResults() {
    if (confirm('确定要清空所有生成的图片吗？')) {
        generatedImages = [];
        displayResults();
        showMessage('结果已清空', 'success');
    }
}

// 打开图片预览模态框
function openImageModal(imageId) {
    const image = generatedImages.find(img => img.id == imageId);
    if (!image) return;

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrompt = document.getElementById('modalPrompt');
    const modalResolution = document.getElementById('modalResolution');
    const modalTime = document.getElementById('modalTime');

    // 设置模态框内容
    modalImage.src = image.url;
    modalTitle.textContent = `图片 #${image.id}`;
    modalPrompt.innerHTML = `<strong>提示词:</strong> ${image.prompt}`;
    modalResolution.innerHTML = `<strong>分辨率:</strong> ${image.resolution}`;
    modalTime.innerHTML = `<strong>生成时间:</strong> ${new Date(image.timestamp).toLocaleString()}`;

    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动

    // 等待图片加载完成后调整
    modalImage.onload = function() {
        // 图片加载完成后的处理（如果需要）
    };
}

// 验证自定义尺寸输入
function validateCustomResolution() {
    const width = parseInt(this.value);
    const height = parseInt(document.getElementById(this.id === 'customWidth' ? 'customHeight' : 'customWidth').value);

    // 验证输入范围
    if (width < 64 || width > 2048) {
        this.setCustomValidity('宽度必须在 64-2048 像素之间');
        this.reportValidity();
    } else {
        this.setCustomValidity('');
    }

    // 检查宽高比是否合理（可选）
    if (height && width) {
        const ratio = Math.max(width, height) / Math.min(width, height);
        if (ratio > 16) { // 避免过于极端的宽高比
            showMessage('宽高比过于极端，可能影响生成效果', 'warning');
        }
    }
}

// 关闭图片预览模态框
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 恢复背景滚动
}