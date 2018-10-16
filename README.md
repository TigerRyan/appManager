# xxb-manage

> 学训宝管理后台

## 分支管理细则

``` bash
# 迭代式开发或者修复bug，需在4.0.0分支上拉取个人开发分支
git checkout -b xg_0626 origin/4.0.0
git push origin xg_0626

# 自测无误后，将个人开发分支合并至dev，并通知项目负责人打包
上测试环境，此时该开发分支不要进行任何操作，如需修复其余bug，
必须按照步骤1重新拉取新的开发分支；

# 测试确认没问题后，将之前的开发分支合并至release分支

# 项目上线时，由主管将release分支合并至线上4.0.0分支
```

## 启动、打包步骤
``` bash
# 安装依赖库
yarn install

# 开发热加载启动  测试网址：localhost:8080
npm run dev

# 编译、压缩、打包
npm run build

# 代码检查
npm run lint
```
