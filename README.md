**# d3-example（版本：６．１．１）**

## 前言：使用d3绘制的示例代码，如折线图、柱形图、面积图、饼图、其他定制化图表等。逐步更新中

###  1、目录结构

-lib --依赖文件

-utils.js --封装的公共方法函数

-commonDemo.html --通过公共方法创建的饼图、柱形图、折线图

-common.css --封装图表的公共样式维护

-README.md --项目相关介绍 

### 2、基础用法

`说明：`具体使用代码可以参考commonDemo.html，有已有示例的代码。需要引用utils.js、common.css使用公共的方法和公共样式。

1、基础折线图使用代码

``` javascript
// 折线图的基础配置
let lineOption = {
            xAxis:{
                show: true,
                type: 'category'
            },
            yAxis:{
                show: true,
                type: 'value'
            },
            height: 300,
            width: 500,
            margin:{
                top: 20,
                left: 40,
                right: 20,
                bottom: 20
            },
            data: [
                { name: '杭州', value: 30 },
                { name: '成都', value: 60 },
                { name: '天津', value: 70 },
                { name: '上海', value: 40 },
                { name: '北京', value: 88 },
                { name: '深圳', value: 100 }
            ]
        };

createBasicLine(lineOption);
```

2、基础柱形图使用代码

```javascript
// 常规柱形图，x轴是数据分类，y轴是数据具体值
let barOption = {
            xAxis:{
                show: true,
                type: 'category'
            },
            yAxis:{
                show: true,
                type: 'value'
            },
            height: 300,
            width: 500,
            margin:{
                top: 20,
                left: 40,
                right: 20,
                bottom: 20
            },
            data: [
                { name: '杭州', value: 30 },
                { name: '成都', value: 60 },
                { name: '天津', value: 70 },
                { name: '上海', value: 40 },
                { name: '北京', value: 88 },
                { name: '深圳', value: 100 }
            ]
        };

createBasicBar(barOption);
```

3、横向柱形图使用代码

``` javascript
// x轴显示，配置type为value，y轴设置type为category分类。隐藏x轴的显示，常规用于top10之类的图表显示
let barOption = {
            xAxis:{
                show: false,
                type: 'value'
            },
            yAxis:{
                show: true,
                type: 'category'
            },
            height: 300,
            width: 500,
            margin:{
                top: 20,
                left: 40,
                right: 20,
                bottom: 20
            },
            data: [
                { name: '杭州', value: 30 },
                { name: '成都', value: 60 },
                { name: '天津', value: 70 },
                { name: '上海', value: 40 },
                { name: '北京', value: 88 },
                { name: '深圳', value: 100 }
            ]
        };

createBasicBar(barOption);
```

4、基础饼图使用示例

```javascript
let pieOption = {
            height: 300,
            width: 400,
            outerRadius: 0.9,
            innerRadius:0.5,
            tooltipFormatter: (data)=>{
                return `${data.name}:${data.value}`;
            },
            legend:{
                show: true,
                position: 'left',
                width: 60
            },
            data: [
                { name: '杭州', value: 30 },
                { name: '成都', value: 60 },
                { name: '天津', value: 70 },
                { name: '上海', value: 40 },
                { name: '北京', value: 88 },
                { name: '深圳', value: 100 }
            ]
        };

createBasicPie(pieOption);
```

