

### Git的基本概念和作用

Git 是一个**分布式版本控制系统**，用于跟踪文件变化、协作开发和管理代码历史。

#### 与集中式版本控制（SVN）的区别

| 对比项 | Git | SVN |
|--------|-----|-----|
| 架构 | 分布式（每个开发者有完整仓库） | 集中式（依赖中央服务器） |
| 离线工作 | 支持（本地完整历史） | 不支持（需联网操作） |
| 分支 | 轻量级，创建/切换极快 | 较重，每次创建需拷贝目录 |
| 速度 | 快（本地操作） | 相对慢（依赖网络） |
| 数据完整性 | SHA-1 哈希校验 | 无 |

#### Git 的三个工作区域

```
工作区（Working Directory）   暂存区（Stage/Index）   本地仓库（Repository）
        |                           |                        |
   你编辑的文件            git add 后的文件快照          git commit 后的版本
```

```bash
# 工作区 -> 暂存区
git add <file>

# 暂存区 -> 本地仓库
git commit -m "message"

# 本地仓库 -> 远程仓库
git push origin <branch>
```

#### 四种文件状态

| 状态 | 说明 |
|------|------|
| Untracked | 未跟踪（新文件，Git 不认识） |
| Unmodified | 已提交，未修改 |
| Modified | 已修改，未暂存 |
| Staged | 已暂存，等待提交 |


### Git常用命令

#### 初始化与克隆

```bash
# 初始化仓库
git init

# 克隆远程仓库
git clone https://github.com/user/repo.git
git clone -b <branch> <url>          # 克隆指定分支
git clone --depth 1 <url>            # 浅克隆（只取最新一次提交，适合大仓库）
```

#### 暂存与提交

```bash
# 添加文件到暂存区
git add <file>                       # 添加指定文件
git add .                            # 添加所有变更
git add -p                           # 交互式选择部分变更

# 提交
git commit -m "feat: add login"      # 提交暂存区的变更
git commit -am "fix: bug"            # 跳过 add，直接提交已跟踪文件的变更（新文件不行）
git commit --amend                   # 修改最近一次提交（message 或补充文件）
git commit --amend --no-edit         # 补充文件但不修改 message
```

#### 查看状态与历史

```bash
git status                           # 查看工作区状态
git status -s                        # 精简格式

git log                              # 查看提交历史
git log --oneline                    # 单行格式
git log --oneline --graph            # 图形化分支
git log -n 5                         # 最近 5 条
git log --author="elk"               # 按作者过滤
git log --since="2024-01-01"         # 按时间过滤

git diff                             # 工作区 vs 暂存区
git diff --staged                    # 暂存区 vs 最新提交
git diff HEAD~3                      # 与前 3 次提交对比
git diff branch1..branch2            # 两个分支对比
```

#### 分支操作

```bash
git branch                           # 查看本地分支
git branch -a                        # 查看所有分支（含远程）
git branch <name>                    # 创建分支
git branch -d <name>                 # 删除分支（已合并）
git branch -D <name>                 # 强制删除分支
git branch -m <old> <new>            # 重命名分支

git checkout <branch>                # 切换分支
git checkout -b <branch>             # 创建并切换分支
git switch <branch>                  # 切换分支（推荐，Git 2.23+）
git switch -c <branch>               # 创建并切换（推荐）
```

#### 合并与变基

```bash
# merge：合并分支（保留提交历史）
git merge <branch>

# rebase：变基（将当前分支的提交"移植"到目标分支之后）
git rebase <branch>

# 合并冲突后
git add <file>
git merge --continue                 # 继续 merge
git rebase --continue                # 继续 rebase

# 中止合并
git merge --abort
git rebase --abort
```

#### 撤销与回退

```bash
# 撤销工作区修改（危险：丢弃未暂存的修改）
git checkout -- <file>               # 旧版
git restore <file>                   # 新版（推荐）

# 撤销暂存区的修改（unstage）
git reset HEAD <file>                # 旧版
git restore --staged <file>          # 新版（推荐）

# 回退提交
git reset --soft HEAD~1              # 回退提交，保留暂存区和工作区
git reset --mixed HEAD~1             # 回退提交和暂存区，保留工作区（默认）
git reset --hard HEAD~1              # 回退所有（危险：丢弃提交、暂存区、工作区）

# 创建一个新提交来撤销之前的提交（安全）
git revert <commit-hash>
```

#### 暂存工作区

```bash
git stash                            # 暂存当前工作区
git stash save "work in progress"    # 暂存并添加描述
git stash list                       # 查看暂存列表
git stash pop                        # 恢复最近一次暂存并删除
git stash apply                      # 恢复最近一次暂存但不删除
git stash drop stash@{0}             # 删除指定暂存
git stash clear                      # 清空所有暂存
```

#### Cherry-pick

```bash
# 将指定提交应用到当前分支
git cherry-pick <commit-hash>
git cherry-pick A..B                 # 将 A 到 B 的提交应用（不含 A）
git cherry-pick --no-commit <hash>   # 应用变更但不提交
```

#### 远程仓库

```bash
git remote                           # 查看远程仓库
git remote -v                        # 查看远程仓库详细地址
git remote add origin <url>          # 添加远程仓库
git remote remove origin             # 移除远程仓库

git fetch                            # 拉取远程更新（不合并）
git pull                             # 拉取并合并（= fetch + merge）
git pull --rebase                    # 拉取并变基（推荐，避免多余的合并提交）

git push                             # 推送到远程
git push -u origin <branch>          # 推送并设置上游分支
git push origin --delete <branch>    # 删除远程分支
```


### Git分支管理

#### Git Flow 模型

经典的分支管理策略，适合有明确发布周期的项目：

```
main (master)  ─────────────────────────────────────────
                    ↑                  ↑            ↑
develop         ─────────────────────────────────────────
                ↑       ↑        ↑
feature/*      ─┘       │        │
                        │        │
release/*      ─────────┘        │
                                 │
hotfix/*       ──────────────────┘
```

| 分支 | 用途 | 生命周期 |
|------|------|---------|
| `main` | 生产环境代码，仅接受 release 和 hotfix 合入 | 永久 |
| `develop` | 开发主线，feature 分支从此创建 | 永久 |
| `feature/*` | 功能开发，完成后合入 develop | 临时 |
| `release/*` | 发布准备，从 develop 创建，完成后合入 main 和 develop | 临时 |
| `hotfix/*` | 生产 Bug 修复，从 main 创建，完成后合入 main 和 develop | 临时 |

#### GitHub Flow 模型

更简洁，适合持续部署的项目：

```
main  ─────────────────────────────────────────
          ↑          ↑         ↑
feature  ─┘ (PR)     │ (PR)    │ (PR)
```

规则：
1. `main` 分支始终可部署
2. 从 `main` 创建功能分支
3. 定期推送功能分支到远程
4. 通过 Pull Request 请求合并
5. Code Review 通过后合入 `main`
6. 合入后立即部署

#### 分支命名规范

```bash
feature/user-login          # 功能分支
bugfix/fix-null-pointer      # Bug 修复
hotfix/urgent-crash          # 紧急修复
release/v2.1.0               # 发布分支
chore/update-deps            # 维护分支
```


### Git合并策略

#### merge vs rebase

```bash
# merge：保留完整的分支历史，产生一个合并提交
git checkout main
git merge feature
# 历史记录：会显示分支和合并的完整图景

# rebase：将 feature 分支的提交"移植"到 main 最新提交之后，呈线性历史
git checkout feature
git rebase main
git checkout main
git merge feature  # fast-forward
# 历史记录：线性的，像一条直线
```

| 对比项 | merge | rebase |
|--------|-------|--------|
| 历史 | 保留分支合并记录 | 线性，更清晰 |
| 提交 hash | 不变 | 会改变（重新生成） |
| 适用场景 | 公共分支合并 | 个人分支更新到最新 |
| 冲突处理 | 一次性解决 | 每个提交可能都要解决 |

**最佳实践：**
- 个人开发分支定期 `rebase main` 保持最新
- 合入公共分支时用 `merge` 或 **Squash Merge**
- 不要对已推送到远程的提交做 `rebase`（会改变 hash，影响他人）

#### Squash Merge

```bash
# 将 feature 分支的所有提交压缩为一个提交合入 main
git merge --squash feature
git commit -m "feat: add user login"
```

适合将多个小提交合并为一个有意义的提交，保持 main 分支历史整洁。


### Git远程仓库管理

```bash
# 添加多个远程仓库
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# 从上游同步更新
git fetch upstream
git merge upstream/main

# Fork 工作流
# 1. Fork 仓库到自己的 GitHub
# 2. Clone 自己的 Fork
# 3. 添加 upstream 指向原始仓库
# 4. 开发完成后 push 到自己的 Fork
# 5. 向原始仓库提 Pull Request
```


### Git冲突解决策略

#### 冲突产生的原因

当两个分支修改了**同一文件的同一区域**，Git 无法自动合并，产生冲突。

#### 冲突标记

```text
<<<<<<< HEAD
当前分支的内容（你本地的修改）
=======
被合并分支的内容（别人的修改）
>>>>>>> feature-branch
```

#### 解决步骤

```bash
# 1. 合并时发生冲突
git merge feature
# Auto-merging file.txt
# CONFLICT (content): Merge conflict in file.txt

# 2. 查看冲突文件
git status  # 显示 both modified 的文件

# 3. 手动编辑冲突文件，选择保留的内容，删除冲突标记

# 4. 标记冲突已解决
git add <file>

# 5. 完成合并
git commit  # 或 git merge --continue
```

#### 使用工具解决

```bash
# 使用 VS Code 等 IDE 内置的合并工具
# 或使用命令行工具
git mergetool
```

#### 预防冲突

- **频繁拉取最新代码**：`git pull --rebase` 保持本地与远程同步
- **小步提交**：减少单次改动范围
- **模块化分工**：避免多人同时修改同一文件
- **及时沟通**：修改公共文件前通知团队
- **使用 `.gitattributes`**：对特定文件指定合并策略（如锁定配置文件）
