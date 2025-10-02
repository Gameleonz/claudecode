// 面积学习乐园 - JavaScript交互功能

// 全局变量
let currentQuestionIndex = 0;
let score = 0;
let puzzleScore = 0;
let isGameActive = false;

// 动画相关全局变量
let areaAnimationData = {
    squares: [],
    currentSquare: 0,
    isPlaying: false,
    totalSquares: 24
};

let formulaAnimationData = {
    type: '',
    step: 0,
    isPlaying: false
};

let areaAnimationFrame = null;
let formulaAnimationFrame = null;

// 基础练习题库
const basicQuestions = [
    {
        question: "一个正方形的边长是8厘米，它的面积是多少平方厘米？",
        options: ["16 平方厘米", "64 平方厘米", "32 平方厘米", "24 平方厘米"],
        correct: 1,
        explanation: {
            formula: "正方形面积 = 边长 × 边长",
            calculation: "8 × 8 = 64",
            unit: "平方厘米",
            tips: "记住正方形的面积公式是边长乘以边长，不是边长乘以4（那是周长）！"
        }
    },
    {
        question: "一个长方形的长是12米，宽是5米，它的面积是多少平方米？",
        options: ["17 平方米", "60 平方米", "34 平方米", "24 平方米"],
        correct: 1,
        explanation: {
            formula: "长方形面积 = 长 × 宽",
            calculation: "12 × 5 = 60",
            unit: "平方米",
            tips: "长方形的面积就是用长乘以宽，不要把长和宽相加哦！"
        }
    },
    {
        question: "一个正方形的面积是49平方分米，它的边长是多少分米？",
        options: ["6 分米", "7 分米", "8 分米", "9 分米"],
        correct: 1,
        explanation: {
            formula: "正方形边长 = √面积",
            calculation: "因为 7 × 7 = 49，所以边长是7分米",
            unit: "分米",
            tips: "这是面积公式的逆运算，想想哪个数乘以自己等于49？"
        }
    },
    {
        question: "黑板长4米，宽1米，面积是多少平方米？",
        options: ["4 平方米", "5 平方米", "10 平方米", "2 平方米"],
        correct: 0,
        explanation: {
            formula: "长方形面积 = 长 × 宽",
            calculation: "4 × 1 = 4",
            unit: "平方米",
            tips: "任何数乘以1都等于它本身，所以4×1=4平方米"
        }
    },
    {
        question: "一个正方形的边长是6厘米，它的面积是多少平方厘米？",
        options: ["12 平方厘米", "24 平方厘米", "36 平方厘米", "48 平方厘米"],
        correct: 2,
        explanation: {
            formula: "正方形面积 = 边长 × 边长",
            calculation: "6 × 6 = 36",
            unit: "平方厘米",
            tips: "6乘以6等于36，可以用乘法口诀：六六三十六"
        }
    }
];

// 页面加载完成后初始化 - 已移至底部统一初始化

// 初始化页面
function initializePage() {
    // 设置平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 初始化练习题
    loadQuestion('basic');
}

// 设置事件监听器
function setupEventListeners() {
    // 正方形边长滑块
    const squareSide = document.getElementById('squareSide');
    if (squareSide) {
        squareSide.addEventListener('input', updateSquare);
    }

    // 长方形尺寸滑块
    const rectLength = document.getElementById('rectLength');
    const rectWidth = document.getElementById('rectWidth');
    if (rectLength) rectLength.addEventListener('input', updateRectangle);
    if (rectWidth) rectWidth.addEventListener('input', updateRectangle);

    // 滚动动画
    window.addEventListener('scroll', handleScroll);
}

// 开始学习
function startLearning() {
    const conceptsSection = document.getElementById('concepts');
    conceptsSection.scrollIntoView({ behavior: 'smooth' });

    // 添加开始学习的动画效果
    conceptsSection.classList.add('fade-in');
}

// 绘制面积概念演示
function drawAreaConcept() {
    const canvas = document.getElementById('areaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const rows = 10;
    const cols = 15;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(cols * gridSize, i * gridSize);
        ctx.stroke();
    }

    for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        ctx.moveTo(j * gridSize, 0);
        ctx.lineTo(j * gridSize, rows * gridSize);
        ctx.stroke();
    }

    // 绘制一个长方形并用小方块填充
    const rectX = 3;
    const rectY = 2;
    const rectWidth = 8;
    const rectHeight = 5;

    // 填充小方块
    for (let i = rectY; i < rectY + rectHeight; i++) {
        for (let j = rectX; j < rectX + rectWidth; j++) {
            ctx.fillStyle = `hsl(${(i + j) * 20}, 70%, 60%)`;
            ctx.fillRect(j * gridSize + 1, i * gridSize + 1, gridSize - 2, gridSize - 2);
        }
    }

    // 绘制边框
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.strokeRect(rectX * gridSize, rectY * gridSize, rectWidth * gridSize, rectHeight * gridSize);

    // 添加文字说明
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText('面积 = ' + rectWidth + ' × ' + rectHeight + ' = ' + (rectWidth * rectHeight) + ' 平方厘米', 10, canvas.height - 10);
}

// 更新正方形演示
function updateSquare() {
    const side = parseInt(document.getElementById('squareSide').value);
    document.getElementById('squareSideValue').textContent = side;
    document.getElementById('squareResult').textContent = side * side;

    drawSquare();
}

// 绘制正方形
function drawSquare() {
    const canvas = document.getElementById('squareCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const side = parseInt(document.getElementById('squareSide').value);
    const scale = 15; // 缩放比例
    const squareSize = side * scale;
    const padding = (canvas.width - squareSize) / 2;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格背景
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * scale);
        ctx.lineTo(canvas.width, i * scale);
        ctx.stroke();
    }

    // 绘制正方形
    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    ctx.fillRect(padding, padding, squareSize, squareSize);

    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.strokeRect(padding, padding, squareSize, squareSize);

    // 添加尺寸标注
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.fillText(side + 'cm', padding + squareSize/2 - 15, padding - 5);

    // 旋转文字显示另一边
    ctx.save();
    ctx.translate(padding - 5, padding + squareSize/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(side + 'cm', -15, 0);
    ctx.restore();

    // 显示面积计算过程
    ctx.fillStyle = '#2196F3';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText(side + ' × ' + side + ' = ' + (side * side), padding, padding + squareSize + 25);
}

// 更新长方形演示
function updateRectangle() {
    const length = parseInt(document.getElementById('rectLength').value);
    const width = parseInt(document.getElementById('rectWidth').value);
    document.getElementById('rectLengthValue').textContent = length;
    document.getElementById('rectWidthValue').textContent = width;
    document.getElementById('rectResult').textContent = length * width;

    drawRectangle();
}

// 绘制长方形
function drawRectangle() {
    const canvas = document.getElementById('rectCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const length = parseInt(document.getElementById('rectLength').value);
    const width = parseInt(document.getElementById('rectWidth').value);
    const scale = 12; // 缩放比例
    const rectWidth = length * scale;
    const rectHeight = width * scale;
    const paddingX = (canvas.width - rectWidth) / 2;
    const paddingY = (canvas.height - rectHeight) / 2;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格背景
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 16; i++) {
        ctx.beginPath();
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, canvas.height);
        ctx.stroke();
    }

    for (let i = 0; i <= 16; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * scale);
        ctx.lineTo(canvas.width, i * scale);
        ctx.stroke();
    }

    // 绘制长方形
    ctx.fillStyle = 'rgba(255, 152, 0, 0.3)';
    ctx.fillRect(paddingX, paddingY, rectWidth, rectHeight);

    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 3;
    ctx.strokeRect(paddingX, paddingY, rectWidth, rectHeight);

    // 添加尺寸标注
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.fillText(length + 'cm', paddingX + rectWidth/2 - 15, paddingY - 5);

    // 旋转文字显示宽
    ctx.save();
    ctx.translate(paddingX - 5, paddingY + rectHeight/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(width + 'cm', -15, 0);
    ctx.restore();

    // 显示面积计算过程
    ctx.fillStyle = '#2196F3';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText(length + ' × ' + width + ' = ' + (length * width), paddingX, paddingY + rectHeight + 25);
}

// 绘制周长和面积对比演示
function drawComparisonDemo() {
    const canvas = document.getElementById('comparisonCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 60;
    const padding = 30;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制周长演示（线）
    ctx.strokeStyle = '#F44336';
    ctx.lineWidth = 4;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(padding, padding, size, size);
    ctx.setLineDash([]);

    ctx.fillStyle = '#F44336';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.fillText('周长 = 4 × 6 = 24cm', padding, padding + size + 40);

    // 绘制面积演示（面）
    const areaPadding = padding + size + 60;
    ctx.fillStyle = 'rgba(76, 175, 80, 0.5)';
    ctx.fillRect(areaPadding, padding, size, size);

    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(areaPadding, padding, size, size);

    ctx.fillStyle = '#4CAF50';
    ctx.fillText('面积 = 6 × 6 = 36cm²', areaPadding, padding + size + 40);

    // 添加标题
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText('周长（线的长度）', padding - 10, padding - 10);
    ctx.fillText('面积（面的大小）', areaPadding - 10, padding - 10);
}

// 绘制组合图形演示
function drawComboDemo() {
    const canvas = document.getElementById('comboCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制一个L形组合图形
    const x = 50, y = 50;
    const unitSize = 30;

    // L形的两个矩形
    // 竖直部分
    ctx.fillStyle = 'rgba(33, 150, 243, 0.5)';
    ctx.fillRect(x, y, unitSize * 2, unitSize * 4);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, unitSize * 2, unitSize * 4);

    // 水平部分
    ctx.fillStyle = 'rgba(255, 152, 0, 0.5)';
    ctx.fillRect(x, y + unitSize * 3, unitSize * 4, unitSize);
    ctx.strokeStyle = '#FF9800';
    ctx.strokeRect(x, y + unitSize * 3, unitSize * 4, unitSize);

    // 添加分割线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x + unitSize * 2, y);
    ctx.lineTo(x + unitSize * 2, y + unitSize * 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + unitSize * 3);
    ctx.lineTo(x + unitSize * 4, y + unitSize * 3);
    ctx.stroke();
    ctx.setLineDash([]);

    // 添加计算说明
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.fillText('分割法：', x, y + unitSize * 5 + 20);
    ctx.fillText('矩形1：2 × 4 = 8', x, y + unitSize * 5 + 40);
    ctx.fillText('矩形2：4 × 1 = 4', x, y + unitSize * 5 + 60);
    ctx.fillText('总面积：8 + 4 = 12', x, y + unitSize * 5 + 80);
}

// 切换练习题标签
function switchTab(tabName) {
    // 移除所有活动状态
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // 激活选中的标签
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // 加载对应的题目
    loadQuestion(tabName);
}

// 加载题目
function loadQuestion(type) {
    let questionData;

    switch(type) {
        case 'basic':
            questionData = basicQuestions[currentQuestionIndex % basicQuestions.length];
            break;
        case 'intermediate':
            // 进阶题目
            questionData = {
                question: "一个长方形的长是宽的3倍，周长是32厘米，它的面积是多少平方厘米？",
                options: ["48 平方厘米", "64 平方厘米", "96 平方厘米", "128 平方厘米"],
                correct: 0,
                explanation: {
                    formula: "长方形周长 = 2 × (长 + 宽)，面积 = 长 × 宽",
                    calculation: "设宽为x，则长为3x。2 × (x + 3x) = 32，所以8x = 32，x = 4，长 = 12。面积 = 12 × 4 = 48",
                    unit: "平方厘米",
                    tips: "先用周长公式求出长和宽，再用面积公式计算面积。这是两步计算题！"
                }
            };
            break;
        case 'advanced':
            // 挑战题目
            questionData = {
                question: "用两个边长为4厘米的正方形拼成一个长方形，这个长方形的面积和周长各是多少？",
                options: ["面积32cm²，周长24cm", "面积16cm²，周长16cm", "面积32cm²，周长16cm", "面积16cm²，周长24cm"],
                correct: 0,
                explanation: {
                    formula: "面积 = 各部分面积之和，周长 = 2 × (长 + 宽)",
                    calculation: "面积：两个正方形面积 = 2 × (4 × 4) = 32cm²。长方形长 = 8cm，宽 = 4cm，周长 = 2 × (8 + 4) = 24cm",
                    unit: "cm² 和 cm",
                    tips: "拼成后的长方形长是8cm，宽是4cm。注意面积是相加，周长不是简单的相加！"
                }
            };
            break;
    }

    if (questionData) {
        displayQuestion(questionData, type);
    }
}

// 显示题目
function displayQuestion(questionData, type) {
    const container = document.querySelector(`#${type} .question-card`);
    const options = container.querySelectorAll('.option-btn');

    container.querySelector('.question-text').textContent = questionData.question;

    options.forEach((btn, index) => {
        btn.textContent = questionData.options[index];
        btn.className = 'option-btn';
        btn.disabled = false;
        btn.onclick = function() { checkAnswer(this, questionData.correct, type); };
    });

    // 清除反馈信息和解析
    const feedback = container.querySelector('.feedback');
    const explanation = container.querySelector('.explanation');

    if (feedback) {
        feedback.className = 'feedback';
        feedback.textContent = '';
    }

    if (explanation) {
        explanation.style.display = 'none';
    }
}

// 检查答案
function checkAnswer(button, correctAnswer, type) {
    const container = button.parentElement.parentElement;
    const options = button.parentElement.querySelectorAll('.option-btn');
    const feedback = container.querySelector('.feedback');
    const explanation = container.querySelector('.explanation');

    // 禁用所有选项
    options.forEach(btn => btn.disabled = true);

    // 获取当前题目数据
    let currentQuestion;
    if (type === 'basic') {
        currentQuestion = basicQuestions[currentQuestionIndex % basicQuestions.length];
    } else if (type === 'intermediate') {
        currentQuestion = {
            question: "一个长方形的长是宽的3倍，周长是32厘米，它的面积是多少平方厘米？",
            options: ["48 平方厘米", "64 平方厘米", "96 平方厘米", "128 平方厘米"],
            correct: 0,
            explanation: {
                formula: "长方形周长 = 2 × (长 + 宽)，面积 = 长 × 宽",
                calculation: "设宽为x，则长为3x。2 × (x + 3x) = 32，所以8x = 32，x = 4，长 = 12。面积 = 12 × 4 = 48",
                unit: "平方厘米",
                tips: "先用周长公式求出长和宽，再用面积公式计算面积。这是两步计算题！"
            }
        };
    } else if (type === 'advanced') {
        currentQuestion = {
            question: "用两个边长为4厘米的正方形拼成一个长方形，这个长方形的面积和周长各是多少？",
            options: ["面积32cm²，周长24cm", "面积16cm²，周长16cm", "面积32cm²，周长16cm", "面积16cm²，周长24cm"],
            correct: 0,
            explanation: {
                formula: "面积 = 各部分面积之和，周长 = 2 × (长 + 宽)",
                calculation: "面积：两个正方形面积 = 2 × (4 × 4) = 32cm²。长方形长 = 8cm，宽 = 4cm，周长 = 2 × (8 + 4) = 24cm",
                unit: "cm² 和 cm",
                tips: "拼成后的长方形长是8cm，宽是4cm。注意面积是相加，周长不是简单的相加！"
            }
        };
    }

    // 检查答案
    const selectedIndex = Array.from(options).indexOf(button);
    if (selectedIndex === correctAnswer) {
        button.classList.add('correct');
        feedback.className = 'feedback success';
        feedback.textContent = '🎉 回答正确！你真棒！';
        score += 10;

        // 添加成功动画
        button.style.animation = 'bounce 0.5s ease';

        // 显示解析（即使是正确答案也显示解析）
        showExplanation(type, currentQuestion.explanation);
    } else {
        button.classList.add('incorrect');
        options[correctAnswer].classList.add('correct');
        feedback.className = 'feedback error';
        feedback.textContent = '😅 再想想看，正确答案是：' + options[correctAnswer].textContent;

        // 添加错误动画
        button.style.animation = 'shake 0.5s ease';

        // 显示详细解析
        showExplanation(type, currentQuestion.explanation);
    }
}

// 显示解析
function showExplanation(type, explanation) {
    const explanationDiv = document.getElementById(type + 'Explanation');
    const formulaDiv = document.getElementById(type + 'Formula');
    const calculationDiv = document.getElementById(type + 'Calculation');
    const tipsDiv = document.getElementById(type + 'Tips');

    if (explanationDiv && explanation) {
        // 设置解析内容
        formulaDiv.textContent = explanation.formula;
        calculationDiv.textContent = explanation.calculation;
        tipsDiv.textContent = explanation.tips;

        // 显示解析区域
        explanationDiv.style.display = 'block';

        // 滚动到解析区域
        setTimeout(() => {
            explanationDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }
}

// 下一题
function nextQuestion(type) {
    currentQuestionIndex++;

    // 隐藏解析区域
    const explanationDiv = document.getElementById(type + 'Explanation');
    if (explanationDiv) {
        explanationDiv.style.display = 'none';
    }

    loadQuestion(type);
}

// 面积概念动画演示
function startAreaAnimation() {
    console.log('开始面积概念动画');
    const canvas = document.getElementById('areaConceptAnimation');
    if (!canvas) {
        console.error('面积概念动画画布未找到');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('无法获取画布上下文');
        return;
    }

    // 重置动画状态
    areaAnimationData.squares = [];
    areaAnimationData.currentSquare = 0;
    areaAnimationData.isPlaying = true;
    areaAnimationData.totalSquares = 24; // 6×4的长方形

    // 重置显示信息
    document.getElementById('filledSquares').textContent = '0';
    document.getElementById('totalArea').textContent = '0';

    // 生成长方形的方块位置
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
            areaAnimationData.squares.push({
                x: 50 + col * 45,
                y: 50 + row * 45,
                width: 40,
                height: 40,
                color: `hsl(${(row * 6 + col) * 15}, 70%, 60%)`,
                filled: false
            });
        }
    }

    // 更新按钮状态
    updateAnimationButtons('area', 'playing');

    // 开始动画
    animateAreaConcept();
}

function animateAreaConcept() {
    if (!areaAnimationData.isPlaying) return;

    const canvas = document.getElementById('areaConceptAnimation');
    const ctx = canvas.getContext('2d');

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格背景
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
            const x = 50 + col * 45;
            const y = 50 + row * 45;
            ctx.strokeRect(x, y, 40, 40);
        }
    }

    // 绘制已填充的方块
    let filledCount = 0;
    areaAnimationData.squares.forEach((square, index) => {
        if (square.filled) {
            ctx.fillStyle = square.color;
            ctx.fillRect(square.x, square.y, square.width, square.height);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(square.x, square.y, square.width, square.height);
            filledCount++;
        }
    });

    // 填充下一个方块
    if (areaAnimationData.currentSquare < areaAnimationData.squares.length) {
        areaAnimationData.squares[areaAnimationData.currentSquare].filled = true;
        areaAnimationData.currentSquare++;

        // 更新显示信息
        document.getElementById('filledSquares').textContent = areaAnimationData.currentSquare;
        document.getElementById('totalArea').textContent = areaAnimationData.currentSquare;
    }

    // 绘制边框
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 270, 160);

    // 添加文字说明
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText('长方形面积 = 6 × 4 = 24 平方厘米', 50, 250);

    // 继续动画或停止
    if (areaAnimationData.currentSquare < areaAnimationData.squares.length) {
        areaAnimationFrame = setTimeout(() => {
            animateAreaConcept();
        }, 100);
    } else {
        areaAnimationData.isPlaying = false;
        // 动画完成
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 18px Microsoft YaHei';
        ctx.fillText('✓ 动画完成！', 150, 280);

        // 更新按钮状态
        updateAnimationButtons('area', 'completed');

        // 3秒后自动重置
        setTimeout(() => {
            resetAreaAnimation();
        }, 3000);
    }
}

function pauseAreaAnimation() {
    areaAnimationData.isPlaying = false;
    if (areaAnimationFrame) {
        clearTimeout(areaAnimationFrame);
    }
    updateAnimationButtons('area', 'paused');
}

function resetAreaAnimation() {
    pauseAreaAnimation();
    areaAnimationData.currentSquare = 0;
    areaAnimationData.squares = [];

    // 清空画布并重绘初始状态
    const canvas = document.getElementById('areaConceptAnimation');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        drawInitialAreaAnimation(ctx, canvas.width, canvas.height);
    }

    // 重置显示信息
    document.getElementById('filledSquares').textContent = '0';
    document.getElementById('totalArea').textContent = '0';

    updateAnimationButtons('area', 'ready');
}

// 更新动画按钮状态
function updateAnimationButtons(type, status) {
    if (type === 'area') {
        const playBtn = document.querySelector('button[onclick="startAreaAnimation()"]');
        const pauseBtn = document.querySelector('button[onclick="pauseAreaAnimation()"]');
        const resetBtn = document.querySelector('button[onclick="resetAreaAnimation()"]');

        if (playBtn && pauseBtn && resetBtn) {
            switch(status) {
                case 'playing':
                    playBtn.disabled = true;
                    pauseBtn.disabled = false;
                    resetBtn.disabled = false;
                    break;
                case 'paused':
                    playBtn.disabled = false;
                    pauseBtn.disabled = true;
                    resetBtn.disabled = false;
                    break;
                case 'ready':
                case 'completed':
                    playBtn.disabled = false;
                    pauseBtn.disabled = true;
                    resetBtn.disabled = false;
                    break;
            }
        }
    }
}

// 公式推导演示
function startFormulaAnimation(type) {
    console.log('开始公式动画，类型：', type);
    const canvas = document.getElementById('formulaAnimation');
    if (!canvas) {
        console.error('公式动画画布未找到');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('无法获取公式动画画布上下文');
        return;
    }

    const formulaText = document.getElementById('formulaText');
    if (!formulaText) {
        console.error('公式文本元素未找到');
        return;
    }

    // 停止之前的动画
    if (formulaAnimationFrame) {
        clearTimeout(formulaAnimationFrame);
    }

    formulaAnimationData.type = type;
    formulaAnimationData.step = 0;
    formulaAnimationData.isPlaying = true;

    // 重置公式文本
    formulaText.innerHTML = '正在准备动画...';

    // 开始动画
    animateFormula();
}

function animateFormula() {
    if (!formulaAnimationData.isPlaying) return;

    const canvas = document.getElementById('formulaAnimation');
    const ctx = canvas.getContext('2d');
    const formulaText = document.getElementById('formulaText');

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (formulaAnimationData.type === 'rectangle') {
        // 长方形公式推导
        switch(formulaAnimationData.step) {
            case 0:
                drawRectangleBase(ctx);
                formulaText.innerHTML = '步骤1：画一个长方形';
                break;
            case 1:
                drawRectangleWithRows(ctx);
                formulaText.innerHTML = '步骤2：观察长方形有几行';
                break;
            case 2:
                drawRectangleWithCols(ctx);
                formulaText.innerHTML = '步骤3：观察每行有几列';
                break;
            case 3:
                drawRectangleComplete(ctx);
                formulaText.innerHTML = '步骤4：总面积 = 行数 × 列数 = 长 × 宽';
                break;
            default:
                formulaAnimationData.isPlaying = false;
                return;
        }
    } else if (formulaAnimationData.type === 'square') {
        // 正方形公式推导
        switch(formulaAnimationData.step) {
            case 0:
                drawSquareBase(ctx);
                formulaText.innerHTML = '步骤1：画一个正方形';
                break;
            case 1:
                drawSquareWithGrid(ctx);
                formulaText.innerHTML = '步骤2：观察正方形的网格排列';
                break;
            case 2:
                drawSquareComplete(ctx);
                formulaText.innerHTML = '步骤3：面积 = 边长 × 边长 = 边长²';
                break;
            default:
                formulaAnimationData.isPlaying = false;
                return;
        }
    }

    formulaAnimationData.step++;

    formulaAnimationFrame = setTimeout(() => {
        animateFormula();
    }, 2000);
}

function drawRectangleBase(ctx) {
    // 画基本长方形
    ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
    ctx.fillRect(50, 50, 200, 120);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 200, 120);

    // 标注尺寸
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.fillText('长', 140, 40);
    ctx.fillText('宽', 30, 110);
}

function drawRectangleWithRows(ctx) {
    drawRectangleBase(ctx);

    // 画行线
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(50, 50 + i * 40);
        ctx.lineTo(250, 50 + i * 40);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    // 标注行数
    ctx.fillStyle = '#FF9800';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText('3行', 260, 110);
}

function drawRectangleWithCols(ctx) {
    drawRectangleWithRows(ctx);

    // 画列线
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(50 + i * 50, 50);
        ctx.lineTo(50 + i * 50, 170);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    // 标注列数
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText('4列', 140, 190);
}

function drawRectangleComplete(ctx) {
    drawRectangleWithCols(ctx);

    // 填充网格
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            ctx.fillStyle = colors[(row + col) % 4];
            ctx.fillRect(52 + col * 50, 52 + row * 40, 46, 36);
        }
    }

    // 显示最终公式
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Microsoft YaHei';
    ctx.fillText('面积 = 3 × 4 = 12 平方厘米', 80, 230);
}

function drawSquareBase(ctx) {
    // 画基本正方形
    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    ctx.fillRect(75, 50, 150, 150);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.strokeRect(75, 50, 150, 150);

    // 标注边长
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.fillText('边长', 140, 35);
}

function drawSquareWithGrid(ctx) {
    drawSquareBase(ctx);

    // 画网格线
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let i = 1; i < 5; i++) {
        // 横线
        ctx.beginPath();
        ctx.moveTo(75, 50 + i * 30);
        ctx.lineTo(225, 50 + i * 30);
        ctx.stroke();
        // 竖线
        ctx.beginPath();
        ctx.moveTo(75 + i * 30, 50);
        ctx.lineTo(75 + i * 30, 200);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

function drawSquareComplete(ctx) {
    drawSquareWithGrid(ctx);

    // 填充网格
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD'];
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            ctx.fillStyle = colors[(row + col) % 5];
            ctx.fillRect(77 + col * 30, 52 + row * 30, 26, 26);
        }
    }

    // 显示最终公式
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Microsoft YaHei';
    ctx.fillText('面积 = 5 × 5 = 25 平方厘米', 90, 230);
}

// 公顷可视化相关变量
let hectareVisualizationType = '';

// 公顷可视化演示
function showHectareScale(type) {
    const canvas = document.getElementById('hectareVisualization');
    const textElement = document.getElementById('visualizationText');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    hectareVisualizationType = type;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch(type) {
        case 'meter':
            drawHectareWithMeters(ctx, textElement);
            break;
        case 'comparison':
            drawHectareComparison(ctx, textElement);
            break;
        case 'real':
            drawHectareRealWorld(ctx, textElement);
            break;
    }
}

function drawHectareWithMeters(ctx, textElement) {
    // 绘制1公顷 = 100×100米的网格
    const hectareSize = 300; // 缩放后的尺寸
    const meterSize = 3; // 每个小格代表1米
    const startX = 50;
    const startY = 30;

    // 绘制标题
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText('1 公顷 = 100米 × 100米 = 10,000 平方米', 200, 20);

    // 绘制1公顷的大正方形
    ctx.strokeStyle = '#F44336';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, hectareSize, hectareSize);

    // 绘制10×10的10米×10米方块（每行10个，共100个）
    const blockSize = hectareSize / 10;
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const x = startX + col * blockSize;
            const y = startY + row * blockSize;

            // 交替颜色
            ctx.fillStyle = (row + col) % 2 === 0 ? 'rgba(33, 150, 243, 0.2)' : 'rgba(76, 175, 80, 0.2)';
            ctx.fillRect(x, y, blockSize, blockSize);

            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, blockSize, blockSize);
        }
    }

    // 添加标注
    ctx.fillStyle = '#F44336';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.fillText('100米', startX + hectareSize/2 - 20, startY + hectareSize + 20);

    // 垂直标注
    ctx.save();
    ctx.translate(startX - 30, startY + hectareSize/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('100米', -20, 0);
    ctx.restore();

    // 添加说明
    textElement.textContent = '每个大方块是10米×10米=100平方米，整个图形是100×100=10,000平方米=1公顷';
}

function drawHectareComparison(ctx, textElement) {
    // 绘制公顷与其他单位的对比
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText('公顷与其他面积单位的对比', 250, 20);

    // 公顷（大）
    drawComparisonSquare(ctx, 50, 50, 200, '1公顷', '#F44336', '10,000 m²');

    // 平方米（中等）
    drawComparisonSquare(ctx, 280, 50, 60, '1平方米', '#2196F3', '1 m²');

    // 平方分米（小）
    drawComparisonSquare(ctx, 380, 50, 20, '1平方分米', '#4CAF50', '0.01 m²');

    // 平方厘米（很小）
    drawComparisonSquare(ctx, 420, 50, 8, '1平方厘米', '#FF9800', '0.0001 m²');

    // 添加比例说明
    ctx.fillStyle = '#666';
    ctx.font = '12px Microsoft YaHei';
    ctx.fillText('注意：为了显示效果，这里没有按真实比例绘制', 150, 280);
    ctx.fillText('实际比例：1公顷 = 10,000平方米 = 1,000,000平方分米 = 100,000,000平方厘米', 100, 300);

    textElement.textContent = '公顷是测量大面积土地的单位，1公顷等于10,000平方米，相当于100万个平方分米！';
}

function drawComparisonSquare(ctx, x, y, size, label, color, area) {
    // 绘制方块
    ctx.fillStyle = color + '33';
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    // 添加标签
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + size/2, y + size + 15);
    ctx.fillText(area, x + size/2, y + size + 30);
    ctx.textAlign = 'left';
}

function drawHectareRealWorld(ctx, textElement) {
    // 绘制实际场景对比
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.fillText('1公顷在现实生活中的大小对比', 250, 20);

    // 绘制1公顷的边界
    ctx.strokeStyle = '#F44336';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 300, 150);

    // 添加标注
    ctx.fillStyle = '#F44336';
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.fillText('1公顷边界', 170, 40);

    // 在1公顷内绘制实际场景
    // 足球场（约0.7公顷）
    drawFootballField(ctx, 70, 70, 180, 80);

    // 篮球场（多个）
    for (let i = 0; i < 3; i++) {
        drawBasketballCourt(ctx, 270, 70 + i * 25, 25, 20);
    }

    // 房屋（多个）
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
            drawHouse(ctx, 70 + j * 30, 160 + i * 15, 25, 12);
        }
    }

    // 添加图例
    ctx.fillStyle = '#666';
    ctx.font = '12px Microsoft YaHei';
    ctx.fillText('图例：', 400, 80);

    // 足球场图例
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(400, 90, 20, 10);
    ctx.fillText('足球场 (约0.7公顷)', 425, 99);

    // 篮球场图例
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(400, 110, 15, 8);
    ctx.fillText('篮球场', 420, 117);

    // 房屋图例
    ctx.fillStyle = '#FF9800';
    ctx.fillRect(400, 130, 12, 6);
    ctx.fillText('房屋', 417, 136);

    textElement.textContent = '1公顷大约可以容纳：1个标准足球场 + 3个篮球场 + 8栋房屋，还有剩余空间！';
}

function drawFootballField(ctx, x, y, width, height) {
    // 绘制足球场
    ctx.fillStyle = '#4CAF5033';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // 中线
    ctx.beginPath();
    ctx.moveTo(x + width/2, y);
    ctx.lineTo(x + width/2, y + height);
    ctx.stroke();

    // 中圈
    ctx.beginPath();
    ctx.arc(x + width/2, y + height/2, 15, 0, Math.PI * 2);
    ctx.stroke();
}

function drawBasketballCourt(ctx, x, y, width, height) {
    // 绘制篮球场
    ctx.fillStyle = '#2196F333';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // 中线
    ctx.beginPath();
    ctx.moveTo(x + width/2, y);
    ctx.lineTo(x + width/2, y + height);
    ctx.stroke();
}

function drawHouse(ctx, x, y, width, height) {
    // 绘制房屋
    ctx.fillStyle = '#FF980033';
    ctx.fillRect(x, y + height/3, width, height*2/3);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y + height/3, width, height*2/3);

    // 屋顶
    ctx.beginPath();
    ctx.moveTo(x - 2, y + height/3);
    ctx.lineTo(x + width/2, y);
    ctx.lineTo(x + width + 2, y + height/3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// 公顷练习题功能
function checkHectareAnswer(button) {
    const options = button.parentElement.querySelectorAll('.option-btn');
    const solutionDiv = document.getElementById('hectareSolution');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'exercise-feedback';

    // 移除之前的反馈
    const existingFeedback = button.parentElement.querySelector('.exercise-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // 禁用所有选项
    options.forEach(btn => btn.disabled = true);

    // 检查答案 - 正确答案是"1 公顷"，即第一个选项（索引0）
    const selectedIndex = Array.from(options).indexOf(button);
    const correctIndex = 0; // 正确答案固定为第一个选项
    const correctAnswerText = options[correctIndex].textContent;

    console.log('Selected index:', selectedIndex, 'Correct index:', correctIndex); // 调试信息

    if (selectedIndex === correctIndex) {
        button.classList.add('correct');

        // 显示成功反馈
        feedbackDiv.className = 'exercise-feedback success';
        feedbackDiv.innerHTML = `🎉 回答正确！${correctAnswerText}是正确答案。`;

        // 显示解题步骤
        solutionDiv.style.display = 'block';
        playSound('success');
    } else {
        button.classList.add('incorrect');
        options[correctIndex].classList.add('correct');

        // 显示错误反馈
        feedbackDiv.className = 'exercise-feedback error';
        feedbackDiv.innerHTML = `😅 回答错误。正确答案是：<strong>${correctAnswerText}</strong>`;

        // 显示解题步骤
        solutionDiv.style.display = 'block';
        playSound('error');
    }

    // 添加反馈到页面
    button.parentElement.appendChild(feedbackDiv);

    // 滚动到解题步骤
    setTimeout(() => {
        solutionDiv.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 300);
}

// 重置公顷练习题
function resetHectareQuestion() {
    const questionContainer = document.querySelector('.practice-question');
    const options = questionContainer.querySelectorAll('.option-btn');
    const solutionDiv = document.getElementById('hectareSolution');
    const feedbackDiv = questionContainer.querySelector('.exercise-feedback');

    // 启用所有选项
    options.forEach(btn => {
        btn.disabled = false;
        btn.className = 'option-btn';
    });

    // 隐藏解题步骤和反馈
    if (solutionDiv) {
        solutionDiv.style.display = 'none';
    }

    if (feedbackDiv) {
        feedbackDiv.remove();
    }

    // 滚动到题目顶部
    questionContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// 公顷换算练习功能
function checkConversionExercises() {
    const exercise1 = document.getElementById('exercise1');
    const exercise2 = document.getElementById('exercise2');
    const feedback = document.getElementById('exerciseFeedback');

    const answer1 = parseInt(exercise1.value);
    const answer2 = parseInt(exercise2.value);

    let correctCount = 0;
    let totalQuestions = 2;

    // 检查第一题：3公顷 = 30,000平方米
    if (answer1 === 30000) {
        exercise1.style.borderColor = '#4CAF50';
        exercise1.style.backgroundColor = '#e8f5e8';
        correctCount++;
    } else {
        exercise1.style.borderColor = '#F44336';
        exercise1.style.backgroundColor = '#ffeaea';
    }

    // 检查第二题：5公顷 = 50,000平方米
    if (answer2 === 50000) {
        exercise2.style.borderColor = '#4CAF50';
        exercise2.style.backgroundColor = '#e8f5e8';
        correctCount++;
    } else {
        exercise2.style.borderColor = '#F44336';
        exercise2.style.backgroundColor = '#ffeaea';
    }

    // 显示反馈
    const percentage = (correctCount / totalQuestions) * 100;
    if (percentage === 100) {
        feedback.className = 'exercise-feedback success';
        feedback.innerHTML = '🎉 完全正确！你掌握了公顷换算！';
        playSound('success');
    } else if (percentage >= 50) {
        feedback.className = 'exercise-feedback error';
        feedback.innerHTML = `答对了${correctCount}/${totalQuestions}题。记住：1公顷 = 10,000平方米`;
        playSound('error');
    } else {
        feedback.className = 'exercise-feedback error';
        feedback.innerHTML = `需要继续练习。记住：1公顷 = 10,000平方米`;
        playSound('error');
    }
}

// 滚动动画处理
function handleScroll() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            section.classList.add('fade-in');
        }
    });
}

// 添加一些有趣的动画效果
function addAnimations() {
    // 为标题添加打字机效果
    const titles = document.querySelectorAll('h2, h3');
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        let index = 0;

        const typeWriter = () => {
            if (index < text.length) {
                title.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };

        // 当元素进入视口时开始打字机效果
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(title);
    });
}

// 初始化所有功能 - 已移至底部统一初始化

// 初始化动画画布
function initializeAnimationCanvases() {
    // 初始化面积概念动画画布
    const areaCanvas = document.getElementById('areaConceptAnimation');
    if (areaCanvas) {
        const ctx = areaCanvas.getContext('2d');
        // 绘制初始状态
        drawInitialAreaAnimation(ctx, areaCanvas.width, areaCanvas.height);
    }

    // 初始化公式动画画布
    const formulaCanvas = document.getElementById('formulaAnimation');
    if (formulaCanvas) {
        const ctx = formulaCanvas.getContext('2d');
        // 绘制初始状态
        drawInitialFormulaAnimation(ctx, formulaCanvas.width, formulaCanvas.height);
    }
}

// 绘制面积概念动画的初始状态
function drawInitialAreaAnimation(ctx, width, height) {
    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制网格背景
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
            const x = 50 + col * 45;
            const y = 50 + row * 45;
            ctx.strokeRect(x, y, 40, 40);
        }
    }

    // 绘制边框
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 270, 160);

    // 添加欢迎文字
    ctx.fillStyle = '#666';
    ctx.font = '16px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText('点击"开始演示"查看动画', width/2, height/2);
    ctx.textAlign = 'left';
}

// 绘制公式动画的初始状态
function drawInitialFormulaAnimation(ctx, width, height) {
    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制欢迎背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // 添加欢迎文字
    ctx.fillStyle = '#666';
    ctx.font = '16px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText('选择公式类型开始学习', width/2, height/2 - 20);
    ctx.font = '14px Microsoft YaHei';
    ctx.fillText('点击下方按钮查看推导过程', width/2, height/2 + 10);
    ctx.textAlign = 'left';
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowLeft':
            // 切换到上一个标签
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab && activeTab.previousElementSibling) {
                activeTab.previousElementSibling.click();
            }
            break;
        case 'ArrowRight':
            // 切换到下一个标签
            const currentTab = document.querySelector('.tab-btn.active');
            if (currentTab && currentTab.nextElementSibling) {
                currentTab.nextElementSibling.click();
            }
            break;
        case 'Enter':
            // 在输入框中按回车提交公顷练习答案
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.id === 'exercise1' || activeElement.id === 'exercise2')) {
                checkConversionExercises();
            }
            break;
    }
});

// 添加触摸支持（移动设备）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // 检测滑动手势
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        const currentTab = document.querySelector('.tab-btn.active');
        if (deltaX > 0 && currentTab && currentTab.previousElementSibling) {
            // 向右滑动，切换到上一个标签
            currentTab.previousElementSibling.click();
        } else if (deltaX < 0 && currentTab && currentTab.nextElementSibling) {
            // 向左滑动，切换到下一个标签
            currentTab.nextElementSibling.click();
        }
    }
});

// 性能优化：使用 requestAnimationFrame 进行动画
function animateValue(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = start + (end - start) * progress;
        element.textContent = Math.round(currentValue);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// 添加声音效果（可选）
function playSound(type) {
    // 创建音频上下文
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch(type) {
        case 'success':
            oscillator.frequency.value = 523.25; // C5
            gainNode.gain.value = 0.1;
            break;
        case 'error':
            oscillator.frequency.value = 261.63; // C4
            gainNode.gain.value = 0.1;
            break;
        case 'click':
            oscillator.frequency.value = 440; // A4
            gainNode.gain.value = 0.05;
            break;
    }

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}


// 统一的页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');

    // 基础初始化
    initializePage();
    setupEventListeners();
    drawAreaConcept();
    drawSquare();
    drawRectangle();
    drawComparisonDemo();
    drawComboDemo();

    // 动画相关初始化
    addAnimations();
    initializeAnimationCanvases();

    // 为按钮添加点击声音
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            playSound('click');
        });
    });

    console.log('页面初始化完成');
});