#!/bin/bash

# Skill Sync Script
# 用于同步项目所需的Skills从目标GitHub仓库

set -e

echo "🔄 开始同步项目Skills..."

# 获取当前项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SYNC_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$(dirname "$(dirname "$SKILL_SYNC_DIR")")")"
TARGET_SKILLS_DIR="$PROJECT_ROOT/.trae/skills"

# 读取配置文件
echo "📖 读取项目配置..."
SECRET_FILE="$PROJECT_ROOT/secret.json"

if [ ! -f "$SECRET_FILE" ]; then
    echo "❌ 错误: 找不到secret.json文件"
    exit 1
fi

# 使用Python解析JSON获取配置
SYNC_REPO_PATH=$(python3 -c "
import json
with open('$SECRET_FILE', 'r') as f:
    config = json.load(f)
    print(config.get('syncRepoPath', ''))
")

PROJECT_TAGS=$(python3 -c "
import json
with open('$SECRET_FILE', 'r') as f:
    config = json.load(f)
    tags = config.get('projectTags', [])
    print(' '.join(tags))
")

if [ -z "$SYNC_REPO_PATH" ]; then
    echo "❌ 错误: secret.json中缺少syncRepoPath字段"
    exit 1
fi

if [ -z "$PROJECT_TAGS" ]; then
    echo "❌ 错误: secret.json中缺少projectTags字段"
    exit 1
fi

echo "📍 目标仓库: $SYNC_REPO_PATH"
echo "🏷️  项目标签: $PROJECT_TAGS"

# 读取目标项目的compare.json
COMPARE_FILE="$SYNC_REPO_PATH/compare.json"

if [ ! -f "$COMPARE_FILE" ]; then
    echo "❌ 错误: 目标项目中找不到compare.json文件"
    exit 1
fi

echo "📋 读取目标项目技能配置..."

# 使用Python处理技能匹配和复制
python3 << EOF
import json
import shutil
import os
from pathlib import Path

# 读取项目标签
project_tags = "$PROJECT_TAGS".split()
print(f"项目标签: {project_tags}")

# 读取目标项目配置
with open('$COMPARE_FILE', 'r') as f:
    target_config = json.load(f)

skills = target_config.get('skills', [])
synced_skills = []

# 筛选匹配的技能
for skill in skills:
    skill_tags = skill.get('tags', [])
    skill_name = skill.get('name')
    skill_url = skill.get('url')
    
    # 检查技能标签是否都在项目标签中
    if all(tag in project_tags for tag in skill_tags):
        print(f"✅ 匹配技能: {skill_name} (标签: {skill_tags})")
        
        # 构建源路径和目标路径
        source_path = os.path.join('$SYNC_REPO_PATH', skill_url)
        target_path = os.path.join('$TARGET_SKILLS_DIR', skill_name)
        
        # 确保目标目录存在
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        
        # 复制技能目录
        if os.path.exists(source_path):
            if os.path.exists(target_path):
                shutil.rmtree(target_path)
                print(f"🗑️  已删除旧版本: {target_path}")
            
            shutil.copytree(source_path, target_path)
            print(f"📦 已复制: {source_path} -> {target_path}")
            synced_skills.append(skill_name)
        else:
            print(f"⚠️  警告: 源路径不存在: {source_path}")
    else:
        print(f"⏭️  跳过技能: {skill_name} (标签不匹配)")

print(f"\n🎉 同步完成! 共同步了 {len(synced_skills)} 个技能:")
for skill in synced_skills:
    print(f"   - {skill}")

if not synced_skills:
    print("⚠️  没有匹配的技能需要同步")

EOF

echo "✨ Skills同步完成!"