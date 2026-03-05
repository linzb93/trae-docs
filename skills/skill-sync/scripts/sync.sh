#!/bin/bash

# Skill Sync 快捷使用脚本
# 用于快速同步项目所需的Skills

echo "🔄 正在启动Skills同步..."

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SYNC_DIR="$(dirname "$SCRIPT_DIR")"

# 检查skill-sync是否存在
if [ ! -d "$SKILL_SYNC_DIR" ]; then
    echo "❌ 错误: skill-sync目录不存在"
    exit 1
fi

# 运行同步脚本
if [ -f "$SKILL_SYNC_DIR/scripts/sync-skills.sh" ]; then
    bash "$SKILL_SYNC_DIR/scripts/sync-skills.sh"
else
    echo "❌ 错误: 找不到sync-skills.sh脚本"
    exit 1
fi