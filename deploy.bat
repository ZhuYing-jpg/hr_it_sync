@echo off
echo [1/4] 正在构建项目...
call npm run build

echo [2/4] 准备部署文件...
cd dist

echo [3/4] 提交更改到临时仓库...
git init
git add -A
git commit -m "自动部署到 GitHub Pages"

echo [4/4] 强制推送到 GitHub 的 gh-pages 分支...
git push -f https://github.com/ZhuYing-jpg/hr_it_sync.git master:gh-pages

cd ..
echo.
echo ✅ 部署完成！
echo 🌐 您的网站地址是：https://ZhuYing-jpg.github.io/hr_it_sync/
echo.
pause