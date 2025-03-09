// docs/javascripts/adModule.js
(async function initAdModule() {
    async function injectExternLink() {
        try {
            // 1. 获取广告数据
            const response = await fetch('https://ad-api.8aka.org/ads');
            const links = await response.json();

            // 2. 验证数据格式
            if (!Array.isArray(links) || links.length === 0) return;

            // 3. 创建广告容器
            const adContainer = document.createElement('div');
            adContainer.className = 'md-extern-container';

            // 4. 创建广告元素
            links.forEach(ad => {
                const link = document.createElement('a');
                link.href = ad.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = ad.name;
                link.className = 'md-extern-link';
                adContainer.appendChild(link);
            });

            // 5. 响应式插入逻辑
            const updateAdPosition = () => {
                // 移除旧广告位置
                const existingAd = document.querySelector('.md-extern-container');
                if (existingAd) existingAd.remove();

                // 桌面端插入位置（导航栏右侧）
                if (window.innerWidth >= 1220) { // MkDocs 的断点较大
                    const desktopTarget = document.querySelector('.md-header__title');
                    if (desktopTarget) {
                        desktopTarget.after(adContainer);
                    }
                }
                // 移动端插入位置（侧边栏底部）
                else {
                    const mobileTarget = document.querySelector('.md-nav--primary .md-nav__list');
                    if (mobileTarget) {
                        const spacer = document.createElement('div');
                        spacer.classList.add('md-mobile-ad-spacer');
                        mobileTarget.appendChild(spacer);
                        mobileTarget.appendChild(adContainer);
                    }
                }
            };

            // 初始插入
            updateAdPosition();

            // 监听窗口变化
            window.addEventListener('resize', updateAdPosition);

            // 6. 样式适配 Material 主题
            const style = document.createElement('style');
            style.textContent = `
                .md-extern-container {
                    display: flex;
                    gap: 0.8rem;
                    align-items: center;
                    margin-left: auto;
                    padding: 0 1rem;
                }
                
                .md-extern-link {
                    color: var(--md-primary-bg-color);
                    padding: 0.3rem 0.6rem;
                    border-radius: 0.25rem;
                    background-color: var(--md-primary-fg-color--transparent);
                    transition: opacity 0.2s;
                    font-size: 0.8rem;
                }
                
                .md-extern-link:hover {
                    opacity: 0.75;
                    text-decoration: none;
                    background-color: var(--md-primary-fg-color--light);
                }
                
                .md-mobile-ad-spacer {
                    flex: 1;
                }
                
                @media screen and (max-width: 1219px) {
                    .md-extern-container {
                        flex-direction: column;
                        width: 100%;
                        padding: 1rem;
                        background-color: var(--md-default-bg-color--light);
                    }
                }
            `;
            document.head.appendChild(style);

        } catch (error) {
            console.error('Failed to load ads:', error);
        }
    }

    // MkDocs 页面加载处理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectExternLink);
    } else {
        await injectExternLink();
    }
})();