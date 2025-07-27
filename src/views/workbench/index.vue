<template>
    <div class="workbench">
        <div class="welcome-container">
            <div class="welcome-content">
                <div class="welcome-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h1 class="welcome-title">欢迎进入 Zspace plus 管理后台</h1>
                <div class="welcome-subtitle">全球家居软装一站式服务平台</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="workbench">
// 简化的工作台页面，只显示欢迎消息
</script>

<style lang="scss" scoped>
.workbench {
    min-height: calc(100vh - 120px);
    background: linear-gradient(135deg, #2d5a4a 0%, #1a3d32 100%);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 20% 80%, rgba(45, 90, 74, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(45, 90, 74, 0.2) 0%, transparent 50%);
        animation: float 6s ease-in-out infinite;
    }
    
    .welcome-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 120px);
        position: relative;
        z-index: 1;
        
        .welcome-content {
            text-align: center;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 60px 80px;
            box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transform: translateY(0);
            transition: all 0.3s ease;
            
            &:hover {
                transform: translateY(-5px);
                box-shadow: 
                    0 35px 70px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.3);
            }
            
            .welcome-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 30px;
                background: linear-gradient(135deg, #2d5a4a 0%, #1a3d32 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(45, 90, 74, 0.3);
                animation: pulse 2s ease-in-out infinite;
                
                svg {
                    width: 40px;
                    height: 40px;
                    color: white;
                }
            }
            
            .welcome-title {
                font-size: 36px;
                font-weight: 700;
                color: #2d3748;
                margin: 0 0 16px 0;
                background: linear-gradient(135deg, #2d5a4a 0%, #1a3d32 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                letter-spacing: -0.5px;
                line-height: 1.2;
            }
            
            .welcome-subtitle {
                font-size: 18px;
                color: #718096;
                font-weight: 500;
                margin: 0;
                opacity: 0.8;
                letter-spacing: 0.5px;
            }
        }
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

// 响应式设计
@media (max-width: 768px) {
    .workbench {
        .welcome-container {
            padding: 20px;
            
            .welcome-content {
                padding: 40px 30px;
                
                .welcome-title {
                    font-size: 28px;
                }
                
                .welcome-subtitle {
                    font-size: 16px;
                }
                
                .welcome-icon {
                    width: 60px;
                    height: 60px;
                    margin-bottom: 20px;
                    
                    svg {
                        width: 30px;
                        height: 30px;
                    }
                }
            }
        }
    }
}
</style>
